(function() {
  // Handle request to retrieve full script content
  if (input && input.action === 'getScript') {
    var record = new GlideRecord(input.table);
    if (record.get(input.sys_id)) {
      var fieldToFetch = 'script';
      if (input.table === 'sys_ws_operation') fieldToFetch = 'operation_script';
      else if (input.table === 'sys_flow_context') fieldToFetch = 'flow';
      data.script = record.getValue(fieldToFetch);
    }
    return;
  }

  (function () {
    data.results = [];
    data.error = '';
    data.scriptIncludeName = '';

    // Validate Script Include sys_id input
    if (!input || !input.scriptIncludeSysId) {
      data.error = 'Script Include sys_id is required.';
      return;
    }

    // Retrieve the Script Include record
    var siGr = new GlideRecord('sys_script_include');
    if (!siGr.get(input.scriptIncludeSysId)) {
      data.error = 'Script Include not found.';
      return;
    }

    var scriptIncludeName = siGr.name.toString();
    var scriptIncludeBody = siGr.script.toString();
    data.scriptIncludeName = scriptIncludeName;

    var patternsToSearch = [];

    // Build patterns to match based on function name if provided
    if (input.functionName) {
      var fnName = input.functionName.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      var fnRegex = new RegExp("(?:^|\\n|\\r)\\s*(?:function\\s+" + fnName + "|" + fnName + "\\s*[:=]\\s*(?:\\n\\s*)?function|var\\s+" + fnName + "\\s*=\\s*function)\\s*\\(", 'gm');

      if (!fnRegex.test(scriptIncludeBody)) {
        data.error = 'Function "' + input.functionName + '" not found in Script Include.';
        return;
      }

      patternsToSearch.push(scriptIncludeName + '().' + input.functionName + '(');
      patternsToSearch.push('.' + input.functionName + '(');
      patternsToSearch.push("'" + input.functionName + "'");
      patternsToSearch.push(input.functionName);
    } else {
      patternsToSearch.push(scriptIncludeName);
    }

    // Define list of tables and fields to be scanned
    var tablesToCheck = [
      { table: 'sys_script', field: 'script', type: 'Business Rule' },
      { table: 'sys_script_include', field: 'script', type: 'Script Include' },
      { table: 'sys_script_client', field: 'script', type: 'Client Script' },
      { table: 'sys_ui_action', field: 'script', type: 'UI Action' },
      { table: 'sys_flow_context', field: 'flow', type: 'Flow Designer Flow' },
      { table: 'catalog_script_client', field: 'script', type: 'Catalog Client Script' },
      { table: 'sys_ws_operation', field: 'operation_script', type: 'Scripted REST API Operation' },
      { table: 'sysauto_script', field: 'script', type: 'Scheduled Script Execution' }
    ];

    // Search for pattern matches within the relevant tables and fields
    for (var i = 0; i < tablesToCheck.length; i++) {
      var info = tablesToCheck[i];
      var gr = new GlideRecord(info.table);

      if (info.table === 'sys_script_include' && !input.functionName) {
        gr.addQuery('sys_id', input.scriptIncludeSysId);
      } else {
        var orQuery = gr.addQuery(info.field, 'CONTAINS', patternsToSearch[0]);
        for (var j = 1; j < patternsToSearch.length; j++) {
          orQuery.addOrCondition(info.field, 'CONTAINS', patternsToSearch[j]);
        }
      }

      gr.query();
      while (gr.next()) {
        var script = gr.getValue(info.field);
        var matchLines = [];
        var matchRows = [];

        if (script) {
          var lines = script.split(/\r?\n/);
          lines.forEach(function (line, idx) {
            for (var p = 0; p < patternsToSearch.length; p++) {
              if (line.toLowerCase().indexOf(patternsToSearch[p].toLowerCase()) !== -1) {
                matchLines.push(line.trim());
                matchRows.push(idx + 1);
                break;
              }
            }
          });
        }

        var key = info.table + ':' + gr.sys_id;
        if (!data.results.some(function (r) { return r.table + ':' + r.sys_id === key; })) {
          data.results.push({
            type: info.type,
            table: info.table,
            name: gr.name ? gr.name.toString() : (gr.sys_name ? gr.sys_name.toString() : gr.getDisplayValue()),
            sys_id: gr.sys_id.toString(),
            url: '/nav_to.do?uri=' + info.table + '.do?sys_id=' + gr.sys_id,
            match: matchLines.join('\n'),
            matchRow: matchRows.join(', '),
            matchCount: matchLines.length
          });
        }
      }
    }
  })();
})();

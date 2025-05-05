(function () {
  var scriptIncludeSysId = 'bd2b0a72830d6210e1dca4d0deaad392'; // required
  var functionName = ''; // optional – leave '' to search by Script Include only

  var scriptIncludeName = '';
  var scriptIncludeBody = '';
  var results = [];

  // Step 1: Get Script Include record
  var siGr = new GlideRecord('sys_script_include');
  if (!siGr.get(scriptIncludeSysId)) {
    gs.error('Script Include not found: ' + scriptIncludeSysId);
    return;
  }

  scriptIncludeName = siGr.name.toString();
  scriptIncludeBody = siGr.script.toString();
  gs.info('Script Include found: ' + scriptIncludeName);

  var patternsToSearch = [];

  if (functionName) {
    var fnName = functionName.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var fnRegex = new RegExp("(?:^|\\n|\\r)\\s*(?:function\\s+" + fnName + "|" + fnName + "\\s*[:=]\\s*(?:\\n\\s*)?function|var\\s+" + fnName + "\\s*=\\s*function)\\s*\\(", 'gm');

    if (!fnRegex.test(scriptIncludeBody)) {
      gs.error('Function "' + functionName + '" NOT found in Script Include "' + scriptIncludeName + '"');
      return;
    }

    gs.info('Searching for usage of function "' + functionName + '" from Script Include "' + scriptIncludeName + '"');

    patternsToSearch.push(scriptIncludeName + '().' + functionName + '(');
    patternsToSearch.push('.' + functionName + '(');
    patternsToSearch.push("'" + functionName + "'");
    patternsToSearch.push(functionName);
  } else {
    gs.info('Searching by Script Include name only: ' + scriptIncludeName);
    patternsToSearch.push(scriptIncludeName);
  }

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

  for (var i = 0; i < tablesToCheck.length; i++) {
    var info = tablesToCheck[i];
    var gr = new GlideRecord(info.table);

    if (info.table === 'sys_script_include') {
      gr.addQuery('sys_id', scriptIncludeSysId); // Match exact sys_id only
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
      if (!results.some(function (r) { return r.key === key; })) {
        results.push({
          key: key,
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

  gs.info('--- Script Include Usage Report ---');
  gs.info('Matches found: ' + results.length);
  results.forEach(function (r) {
    gs.info('[' + r.type + '] ' + r.name + ' | ' + r.sys_id + ' | ' + r.url);
  });

})();

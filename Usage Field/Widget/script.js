(function() {

  // Handle full script view request first (called from client via .get())
  if (input && input.action === 'getScript') {
    var table = input.table;
    var sys_id = input.sys_id;

    // gs.info('[DEBUG] getScript called for table=' + table + ', sys_id=' + sys_id);

    var record = new GlideRecord(table);
    if (record.get(sys_id)) {
      var possibleFields = ['script', 'operation_script', 'flow', 'definition', 'xml'];
      for (var i = 0; i < possibleFields.length; i++) {
        var field = possibleFields[i];
        // gs.info('[DEBUG] Checking field=' + field + ', valid=' + record.isValidField(field));
        if (record.isValidField(field)) {
          var value = record.getValue(field);
          if (value) {
            data.script = value;
            // gs.info('[DEBUG] Found script in field=' + field);
            return;
          }
        }
      }
      data.script = '[Script field exists but is empty or unsupported]';
      gs.info('[DEBUG] No script content found in any expected field.');
    } else {
      data.script = '[Record not found]';
      gs.info('[DEBUG] Record not found.');
    }
    return;
  }

  // Default execution: find field usage
  data.results = [];
  data.error = '';
  data.fieldName = '';

  if (!input || !input.fieldSysId) {
    return;
  }

  var fieldSysId = input.fieldSysId;

  var dictGr = new GlideRecord('sys_dictionary');
  if (dictGr.get(fieldSysId)) {
    data.fieldName = dictGr.element.toString();
  } else {
    data.error = 'Field not found in sys_dictionary: ' + fieldSysId;
    return;
  }

  var tablesToCheck = [
    { table: 'sys_script', field: 'script', type: 'Business Rule' },
    { table: 'sys_script_include', field: 'script', type: 'Script Include' },
    { table: 'sys_script_client', field: 'script', type: 'Client Script' },
    { table: 'sys_ui_action', field: 'script', type: 'UI Action' },
    { table: 'sys_flow_context', field: 'flow', type: 'Flow Designer Flows' },
    { table: 'catalog_script_client', field: 'script', type: 'Catalog Client Script' },
    { table: 'sys_ws_operation', field: 'operation_script', type: 'Scripted REST API Operation Script' },
    { table: 'sysauto_script', field: 'script', type: 'Scheduled Script Execution' }
  ];

  for (var i = 0; i < tablesToCheck.length; i++) {
    var info = tablesToCheck[i];
    var gr = new GlideRecord(info.table);
    gr.addQuery(info.field, 'CONTAINS', data.fieldName);
    gr.query();

    while (gr.next()) {
      var script = gr.getValue(info.field);
      var matchLines = [];
      var matchRows = [];

      if (script) {
        var lines = script.split(/\r?\n/);
        lines.forEach(function(line, idx) {
          if (line.toLowerCase().indexOf(data.fieldName.toLowerCase()) !== -1) {
            matchLines.push(line.trim());
            matchRows.push(idx + 1);
          }
        });
      }

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

})();
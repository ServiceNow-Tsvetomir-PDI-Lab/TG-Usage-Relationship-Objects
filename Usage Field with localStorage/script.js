(function() {

  // If the client is requesting full script view, handle here first
  if (input && input.action === 'getScript') {
    var table = input.table;
    var sys_id = input.sys_id;

    var record = new GlideRecord(table);
    if (record.get(sys_id)) {
      var possibleFields = ['script', 'operation_script', 'flow', 'definition', 'xml'];
      for (var i = 0; i < possibleFields.length; i++) {
        var field = possibleFields[i];
        if (record.isValidField(field)) {
          var value = record.getValue(field);
          if (value) {
            data.script = value;
            return;
          }
        }
      }
      data.script = '[Script field exists but is empty or unsupported]';
    } else {
      data.script = '[Record not found]';
    }
    return;
  }

  // Default execution path - find references to a given field
  data.results = [];
  data.error = '';
  data.fieldName = '';

  // Validate input
  if (!input || !input.fieldSysId) {
    return;
  }

  var fieldSysId = input.fieldSysId;
  var dictGr = new GlideRecord('sys_dictionary');

  // Lookup field name by sys_id
  if (dictGr.get(fieldSysId)) {
    data.fieldName = dictGr.element.toString();
  } else {
    data.error = 'Field not found in sys_dictionary: ' + fieldSysId;
    return;
  }

  // Tables and fields to scan for usage
  var tablesToCheck = [
    { table: 'sys_script', field: 'script', type: 'Business Rule' },
    { table: 'sys_script_include', field: 'script', type: 'Script Include' },
    { table: 'sys_script_client', field: 'script', type: 'Client Script' },
    { table: 'sys_ui_action', field: 'script', type: 'UI Action' },
   // { table: 'sys_flow_context', field: 'flow', type: 'Flow Designer Flows' },
   // { table: 'catalog_script_client', field: 'script', type: 'Catalog Client Script' },
    { table: 'sys_ws_operation', field: 'operation_script', type: 'Scripted REST API Operation Script' },
    { table: 'sysauto_script', field: 'script', type: 'Scheduled Script Execution' }
  ];

  // Search each table for the field name
  for (var i = 0; i < tablesToCheck.length; i++) {
    var info = tablesToCheck[i];
    var gr = new GlideRecord(info.table);
    gr.addQuery(info.field, 'CONTAINS', data.fieldName);
    gr.query();

    while (gr.next()) {
      var script = gr.getValue(info.field);
      var matchLines = [];
      var matchRows = [];

      // Collect lines and line numbers that contain the field name
      if (script) {
        var lines = script.split(/\r?\n/);
        lines.forEach(function(line, idx) {
          if (line.toLowerCase().indexOf(data.fieldName.toLowerCase()) !== -1) {
            matchLines.push(line.trim());
            matchRows.push(idx + 1);
          }
        });
      }

      // Push results into the output array
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

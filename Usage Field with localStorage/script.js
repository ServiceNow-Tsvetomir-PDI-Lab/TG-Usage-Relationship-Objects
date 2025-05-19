(function () {
  // === Section: GET SCRIPT from Record ===
  // Handle request to retrieve script content from a specified record
  if (input && input.action === 'getScript') {
    var table = input.table;
    var sys_id = input.sys_id;
    var record = new GlideRecord(table);
    if (record.get(sys_id)) {
      var fieldsToTry = ['script', 'operation_script', 'flow', 'definition', 'xml'];
      for (var i = 0; i < fieldsToTry.length; i++) {
        var field = fieldsToTry[i];
        if (record.isValidField(field)) {
          var content = record.getValue(field);
          if (content) {
            data.script = content;
            return;
          }
        }
      }
      // If script fields exist but are empty or unsupported
      data.script = '[Script field exists but is empty or unsupported]';
    } else {
      // Record not found in the specified table
      data.script = '[Record not found]';
    }
    return;
  }

  // === Section: SAVE SCRIPT to Record ===
  // Handle request to save updated script content into a specified record
  if (input && input.action === 'saveScript') {
    var saveRec = new GlideRecord(input.table);
    if (saveRec.get(input.sys_id)) {
      var fieldName = input.field || 'script';
      if (saveRec.isValidField(fieldName)) {
        saveRec.setValue(fieldName, input.newScript || '');
        saveRec.update();
        data.status = 'success';
      } else {
        // Provided field name is invalid for the record
        data.status = 'invalid field';
      }
    } else {
      // Record to update was not found
      data.status = 'record not found';
    }
    return;
  }

  // === Section: Initialization and Input Validation ===
  // Initialize results and error data properties for the main processing flow
  data.results = [];
  data.error = '';
  data.fieldName = '';

  // Validate input to ensure a field sys_id is provided
  if (!input || !input.fieldSysId) {
    data.error = 'No sys_id provided.';
    return;
  }

  // Retrieve the dictionary entry for the specified field sys_id
  var dictGr = new GlideRecord('sys_dictionary');
  if (!dictGr.get(input.fieldSysId)) {
    data.error = 'Field not found in sys_dictionary';
    return;
  }

  var fieldName = dictGr.element + '';
  var fieldTable = dictGr.name + '';
  data.fieldName = fieldName;
  data.fieldTable = fieldTable;

  // gs.info('[TG Widget] Loaded sys_dictionary: field=' + dictGr.element + ', table=' + dictGr.name);

  // === Section: Tables to Scan Definition ===
  // Define tables and fields to scan for references to the field
  var tablesToScan = [
    { table: 'sys_script', field: 'script', type: 'Business Rule', tableField: 'collection' },
    { table: 'sys_script_include', field: 'script', type: 'Script Include', tableField: null },
    { table: 'sys_script_client', field: 'script', type: 'Client Script', tableField: 'table' },
    { table: 'sys_ui_action', field: 'script', type: 'UI Action', tableField: 'table' },
    { table: 'sys_flow_context', field: 'flow', type: 'Flow Designer Flow', tableField: null },
    { table: 'catalog_script_client', field: 'script', type: 'Catalog Client Script', tableField: null },
    { table: 'sys_ws_operation', field: 'operation_script', type: 'Scripted REST Operation', tableField: null },
    { table: 'sysauto_script', field: 'script', type: 'Scheduled Script Execution', tableField: null }
  ];

  // === Section: GlideRecord Pattern Detection ===
  // Regex pattern to detect GlideRecord variable declarations and their table names
  var grDeclarePattern = /var\s+(\w+)\s*=\s*new\s+[\w.]+\(["']([a-zA-Z0-9_]+)["']\)/g;

  // === Section: Scanning Each Script Table for References ===
  // Iterate through each table to scan for script references to the field
  for (var i = 0; i < tablesToScan.length; i++) {
    var t = tablesToScan[i];
    var gr = new GlideRecord(t.table);
    gr.query();

    // Process each record's script field to find references to the target field
    while (gr.next()) {
      var script = gr.getValue(t.field);
      if (!script) continue;

      var lines = script.split(/\r?\n/);
      var matchLines = [];
      var matchRows = [];
      var matchFound = false;
      var scriptTable = t.tableField && gr.isValidField(t.tableField) ? gr.getValue(t.tableField) : '';

      // --- Subsection: GlideRecord Declaration Mapping ---
      // Map variable names to table names based on GlideRecord declarations in the script
      var variables = {};
      var declareMatch;
      while ((declareMatch = grDeclarePattern.exec(script)) !== null) {
        var varName = declareMatch[1];
        var tableName = declareMatch[2];
        variables[varName] = tableName;
      }

      // --- Subsection: Script Line Analysis ---
      // Search each line for direct 'current.fieldName' or variable.fieldName references matching the target table
      for (var j = 0; j < lines.length; j++) {
        var line = lines[j];

        if (line.match(new RegExp('\\bcurrent\\.' + fieldName + '\\b')) && scriptTable === fieldTable) {
          matchLines.push(line.trim());
          matchRows.push(j + 1);
          matchFound = true;
        }

        for (var v in variables) {
          if (variables[v] === fieldTable && line.match(new RegExp('\\b' + v + '\\.' + fieldName + '\\b'))) {
            matchLines.push(line.trim());
            matchRows.push(j + 1);
            matchFound = true;
          }
        }
      }

      // --- Subsection: Result Push if Match Found ---
      // If any matches found, add detailed info to results array
      if (matchFound) {
        data.results.push({
          type: t.type,
          table: t.table,
          scriptTable: scriptTable || 'N/A',
          name: gr.name ? gr.name + '' : gr.getDisplayValue(),
          sys_id: gr.sys_id + '',
          url: '/nav_to.do?uri=' + t.table + '.do?sys_id=' + gr.sys_id,
          match: matchLines.join('\n'),
          matchRow: matchRows.join(', '),
          matchCount: matchLines.length
        });
      }
    }
  }

})();

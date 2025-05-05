(function () {
    // === Configuration ===
    var scriptIncludeSysId = ''; // Replace with your Script Include sys_id

    // === Internal variables ===
    var scriptIncludeName = '';
    var results = [];

    // Fetch Script Include Name ===
    var siGr = new GlideRecord('sys_script_include');
    if (siGr.get(scriptIncludeSysId)) {
        scriptIncludeName = siGr.name.toString();
        gs.info('Found Script Include: ' + scriptIncludeName);
    } else {
        gs.error('Script Include not found for sys_id: ' + scriptIncludeSysId);
        return;
    }

    // Tables to search ===
    var tablesToCheck = [
        { table: 'sys_script', field: 'script', type: 'Business Rule' },
        { table: 'sys_script_include', field: 'script', type: 'Script Include' },
        { table: 'sys_script_client', field: 'script', type: 'Client Script' },
        { table: 'sys_ui_action', field: 'script', type: 'UI Action' },
        { table: 'sys_flow_context', field: 'flow', type: 'Flow Designer Flows' },
        { table: 'catalog_script_client', field: 'script', type: 'Catalog Client Script' },
        { table: 'sys_ws_operation', field: 'operation_script', type: 'Scripted REST API Operation Script' },
        { table: 'sysauto_script', field: 'script', type: 'Scheduled Jobs (Scheduled Script Execution)' }
    ];

    // Search all defined tables
    for (var i = 0; i < tablesToCheck.length; i++) {
        var info = tablesToCheck[i];
        var gr = new GlideRecord(info.table);
        gr.addQuery(info.field, 'CONTAINS', scriptIncludeName);
        gr.query();

        while (gr.next()) {
            results.push({
                type: info.type,
                table: info.table,
                name: gr.name ? gr.name.toString() : (gr.sys_name ? gr.sys_name.toString() : gr.getDisplayValue()),
                sys_id: gr.sys_id.toString(),
                url: '/nav_to.do?uri=' + info.table + '.do?sys_id=' + gr.sys_id.toString()
            });
        }
    }

    // === Output
    gs.info('--- Script Include Usage Report ---');
    gs.info('Script Include name -  "' + scriptIncludeName + '" was found in ' + results.length + ' scripts:');

    for (var j = 0; j < results.length; j++) {
        var r = results[j];
        gs.info('[' + r.type + '] ' + r.name + ' | sys_id: ' + r.sys_id + ' | ' + r.url);
    }

})();
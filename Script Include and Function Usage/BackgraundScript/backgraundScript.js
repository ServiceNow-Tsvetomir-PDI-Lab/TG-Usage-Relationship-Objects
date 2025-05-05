(function() {
    // === Configuration ===
    var scriptIncludeSysId = ''; // <-- Put the sys_id of the Script Include

    // === Internal variables ===
    var scriptIncludeName = '';
    var results = [];

    // === Fetch Script Include Name ===
    var siGr = new GlideRecord('sys_script_include');
    if (siGr.get(scriptIncludeSysId)) {
        scriptIncludeName = siGr.name.toString();
        gs.info('Found Script Include Name: ' + scriptIncludeName);
    } else {
        gs.error('Could not find Script Include with sys_id: ' + scriptIncludeSysId);
        return;
    }

    // === Search Business Rules where script field contains the Script Include name ===
    var brGr = new GlideRecord('sys_script');
    brGr.addQuery('script', 'CONTAINS', scriptIncludeName);
    brGr.query();

    while (brGr.next()) {
        results.push({
            businessRuleName: brGr.name.toString(),
            sys_id: brGr.sys_id.toString(),
            link: '/nav_to.do?uri=sys_script.do?sys_id=' + brGr.sys_id
        });
    }

    // === Output Results ===
    gs.info('--- Script Include Usage in Business Rules (Simple Text Search) ---');
    gs.info('Found ' + results.length + ' Business Rules where "' + scriptIncludeName + '" is mentioned.');
    
    for (var i = 0; i < results.length; i++) {
        var r = results[i];
        gs.info('Business Rule: ' + r.businessRuleName + ' | sys_id: ' + r.sys_id + ' | Link: ' + r.link);
    }

})();

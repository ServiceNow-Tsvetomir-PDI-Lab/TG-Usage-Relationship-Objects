// Client Script
api.controller = function($scope) {
  var c = this;

  // Initialize model
  $scope.c.data = $scope.c.data || {};
  c.data.entries               = [];
  c.data.fieldSysId            = '';
  c.data.fieldFunctionName     = '';
  c.data.scriptIncludeSysId    = '';
  c.data.functionName          = '';

  // Unique localStorage key for this widget
  var STORAGE_KEY = 'tgUsageScriptIncludeAndFunction_history';

  // --- Local Storage Tracker ---
  c.saveInput = function() {
    if (!c.data.fieldSysId && !c.data.fieldFunctionName) return;
    var list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    list.unshift({
      fieldSysId:        c.data.fieldSysId,
      fieldFunctionName: c.data.fieldFunctionName,
      date:              new Date().toLocaleString()
    });
    if (list.length > 10) list = list.slice(0, 10);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    // clear tracker inputs (but keep the search inputs)
    c.data.fieldSysId = '';
    c.data.fieldFunctionName = '';
    c.loadValues();
  };

  c.loadValues = function() {
    c.data.entries = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  };

  c.deleteEntry = function(idx) {
    var list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    list.splice(idx, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    c.loadValues();
  };

  c.clearHistory = function() {
    localStorage.removeItem(STORAGE_KEY);
    c.data.entries = [];
  };

  // initialize tracker history
  c.loadValues();

  // --- View Mode Setup ---
  c.data.viewModeSwitch = true;
  c.data.viewMode       = 'group';
  c.toggleViewFromSwitch = function() {
    c.data.viewMode = c.data.viewModeSwitch ? 'group' : 'table';
  };

  // --- Grouping watch ---
  $scope.$watch('c.data.results', function(newVal) {
    c.groupedResults = {};
    (newVal||[]).forEach(function(r) {
      (c.groupedResults[r.type] = c.groupedResults[r.type]||[]).push(r);
    });
  });

  // --- Core Actions ---
  c.findUsage = function() {
    // first: copy the search inputs into tracker fields & save
    c.data.fieldSysId        = c.data.scriptIncludeSysId;
    c.data.fieldFunctionName = c.data.functionName;
    c.saveInput();

    // then: perform the actual findUsage call
    $scope.server.update({
      scriptIncludeSysId: c.data.scriptIncludeSysId,
      functionName:       c.data.functionName
    }).then(function(resp) {
      c.data.error               = resp.data.error || '';
      c.data.results             = resp.data.results || [];
      c.showClear                = c.data.results.length > 0;
      c.data.scriptIncludeName   = resp.data.scriptIncludeName;
    });
  };

  c.clearResults = function() {
    c.data.scriptIncludeSysId = '';
    c.data.functionName       = '';
    c.data.results            = [];
    c.data.error              = '';
    c.showClear               = false;
  };

  c.exportToCSV = function() {
    if (!c.data.results.length) return;
    var csv = 'data:text/csv;charset=utf-8,Type,Name,Table,sys_id,Count,Lines,Snippet,Link\n';
    c.data.results.forEach(function(r) {
      var line = [
        r.type, r.name, r.table, r.sys_id,
        r.matchCount, r.matchRow,
        '"' + r.match.replace(/\n/g, ' ') + '"',
        r.url
      ].join(',');
      csv += line + '\n';
    });
    var link = document.createElement('a');
    link.href = encodeURI(csv);
    link.download = 'usage_results.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  c.copyText = function(text) {
    navigator.clipboard.writeText(text);
  };

  c.viewScript = function(r) {
    $scope.server.get({
      action: 'getScript',
      table:  r.table,
      sys_id: r.sys_id
    }).then(function(resp) {
      c.fullScript = resp.data.script || 'Script not found.';
      $('#scriptModal').modal('show');
    });
  };
};

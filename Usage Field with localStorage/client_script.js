api.controller = function($scope) {
  // Initialize data
  $scope.c.data = $scope.c.data || {};
  $scope.c.data.entries = [];
  $scope.c.data.fieldSysId = '';
  $scope.c.data.inputValue = '';

  var STORAGE_KEY = 'simpleInputListTGUsageFinder';

  // Local Storage Tracker logic
  $scope.c.saveInput = function() {
    if (!$scope.c.data.inputValue) return;
    var list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    list.unshift({ value: $scope.c.data.inputValue, date: new Date().toLocaleString() });
    if (list.length > 10) list = list.slice(0, 10);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    $scope.c.data.inputValue = '';
    $scope.c.loadValues();
  };
  $scope.c.loadValues = function() {
    $scope.c.data.entries = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  };
  $scope.c.deleteEntry = function(idx) {
    var list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    list.splice(idx, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    $scope.c.loadValues();
  };
  $scope.c.clearHistory = function() {
    localStorage.removeItem(STORAGE_KEY);
    $scope.c.data.entries = [];
  };

  // Field Usage Finder logic with automation to tracker
  $scope.c.data.viewMode = 'group';
  $scope.c.data.viewModeSwitch = true;
  $scope.c.toggleViewFromSwitch = function() { $scope.c.data.viewMode = $scope.c.data.viewModeSwitch ? 'group' : 'table'; };
  $scope.c.copyText = function(text) { navigator.clipboard.writeText(text); };
  $scope.c.viewScript = function(row) {
    $scope.server.get({ action: 'getScript', table: row.table, sys_id: row.sys_id })
      .then(function(resp) { $scope.c.fullScript = resp.data.script || 'Script not found.'; $('#scriptModal').modal('show'); });
  };

  $scope.c.findUsage = function() {
    // Automatically track in Local Storage
    $scope.c.data.inputValue = $scope.c.data.fieldSysId;
    $scope.c.saveInput();
    // Then perform usage search
    $scope.server.update({ fieldSysId: $scope.c.data.fieldSysId })
      .then(function(resp) { $scope.c.showClear = resp.data && resp.data.results && resp.data.results.length; });
  };

  $scope.c.clearResults = function() {
    $scope.c.data.fieldSysId = '';
    $scope.c.data.fieldName = '';
    $scope.c.data.results = [];
    $scope.c.data.error = '';
  };

  // Grouping watch
  $scope.$watch('c.data.results', function(newVal) {
    $scope.c.groupedResults = {};
    (newVal||[]).forEach(function(r) { ($scope.c.groupedResults[r.type] = $scope.c.groupedResults[r.type]||[]).push(r); });
  });

  // Initialize history
  $scope.c.loadValues();
};

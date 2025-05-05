api.controller = function($scope) {
  var c = this;

  // Set default view mode to 'group' and bind the toggle switch
  $scope.c.data.viewModeSwitch = true;
  $scope.c.data.viewMode = 'group';

  // Toggles view mode based on switch state (Grouped/Table)
  $scope.c.toggleViewFromSwitch = function () {
    $scope.c.data.viewMode = $scope.c.data.viewModeSwitch ? 'group' : 'table';
  };

  // Watch for changes in the results and re-group them by type
  $scope.$watch('c.data.results', function(newVal) {
    $scope.c.groupedResults = {};
    (newVal || []).forEach(function(r) {
      if (!$scope.c.groupedResults[r.type]) $scope.c.groupedResults[r.type] = [];
      $scope.c.groupedResults[r.type].push(r);
    });
  });

  // Triggers a search for Script Include or function usage
  $scope.c.findUsage = function () {
    $scope.server.update({
      scriptIncludeSysId: $scope.c.data.scriptIncludeSysId,
      functionName: $scope.c.data.functionName
    }).then(function (response) {
      $scope.c.data.error = response.data.error || '';
      $scope.c.showClear = response.data.results && response.data.results.length > 0;
    });
  };

  // Exports current results as a CSV file
  $scope.c.exportToCSV = function() {
    if (!$scope.c.data.results || !$scope.c.data.results.length) return;

    var csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Type,Name,Table,sys_id,Match Count,Match Row,Match Line,Link\n';
    $scope.c.data.results.forEach(function(row) {
      var line = [row.type, row.name, row.table, row.sys_id, row.matchCount, row.matchRow, row.match.replace(/\n/g, ' '), row.url].join(',');
      csvContent += line + '\n';
    });

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'script_include_usage_results.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Clears all input and results
  $scope.c.clearResults = function() {
    $scope.c.data.scriptIncludeSysId = '';
    $scope.c.data.functionName = '';
    $scope.c.data.scriptIncludeName = '';
    $scope.c.data.results = [];
    $scope.c.data.error = '';
  };

  // Copies given text to clipboard
  $scope.c.copyText = function(text) {
    navigator.clipboard.writeText(text);
  };

  // Fetches full script content from the server and shows it in a modal
  $scope.c.viewScript = function(row) {
    console.log('ViewScript debug:', row.table, row.sys_id);
    $scope.server.get({
      action: 'getScript',
      table: row.table,
      sys_id: row.sys_id
    }).then(function(response) {
      console.log('Script Response:', response.data);
      $scope.c.fullScript = response.data.script || 'Script not found.';
      $('#scriptModal').modal('show');
    });
  };
};
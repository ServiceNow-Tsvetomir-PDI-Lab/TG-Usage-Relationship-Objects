api.controller = function($scope) {
	var c = this;
	
	$scope.c.data.viewModeSwitch = true; // default: Grouped View
	$scope.c.data.viewMode = 'group';
	$scope.c.toggleViewFromSwitch = function () {
  $scope.c.data.viewMode = $scope.c.data.viewModeSwitch ? 'group' : 'table';
};


  $scope.$watch('c.data.results', function(newVal) {
    $scope.c.groupedResults = {};
    (newVal || []).forEach(function(r) {
      if (!$scope.c.groupedResults[r.type]) $scope.c.groupedResults[r.type] = [];
      $scope.c.groupedResults[r.type].push(r);
    });
  });

	$scope.c.findUsage = function () {
  $scope.server.update({
    scriptIncludeSysId: $scope.c.data.scriptIncludeSysId,
    functionName: $scope.c.data.functionName
  }).then(function (response) {
    $scope.c.data.error = response.data.error || '';
    $scope.c.showClear = response.data.results && response.data.results.length > 0;
  });
};

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

  $scope.c.clearResults = function() {
    $scope.c.data.scriptIncludeSysId = '';
    $scope.c.data.functionName = '';
    $scope.c.data.scriptIncludeName = '';
    $scope.c.data.results = [];
    $scope.c.data.error = '';
  };

  $scope.c.copyText = function(text) {
    navigator.clipboard.writeText(text);
  };

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
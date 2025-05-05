api.controller = function($scope) {
  // Default view mode is 'grouped'
  $scope.c.data.viewMode = 'group';
  $scope.c.data.viewModeSwitch = true; // Used by toggle checkbox

  // Toggle view mode based on switch state
  $scope.c.toggleViewFromSwitch = function () {
    $scope.c.data.viewMode = $scope.c.data.viewModeSwitch ? 'group' : 'table';
  };

  // Copy provided text to clipboard (match line content)
  $scope.c.copyText = function(text) {
    navigator.clipboard.writeText(text);
  };

  // Server call to fetch the full script for a selected record
  $scope.c.viewScript = function(row) {
    $scope.server.get({
      action: 'getScript',
      table: row.table,
      sys_id: row.sys_id
    }).then(function(response) {
      $scope.c.fullScript = response.data.script || 'Script not found.';
      $('#scriptModal').modal('show'); // Show modal with script content
    });
  };

  // Trigger usage search based on input field sys_id
  $scope.c.findUsage = function() {
    $scope.server.update({
      fieldSysId: $scope.c.data.fieldSysId
    }).then(function(response) {
      $scope.c.showClear = response.data && response.data.results && response.data.results.length > 0;
    });
  };

  // Convert current results into CSV format and trigger download
  $scope.c.exportToCSV = function() {
    if (!$scope.c.data.results || !$scope.c.data.results.length) return;

    var csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Type,Name,Table,sys_id,Match Count,Match Row,Match Line,Link\n';

    $scope.c.data.results.forEach(function(row) {
      var line = [
        row.type,
        row.name,
        row.table,
        row.sys_id,
        row.matchCount,
        row.matchRow,
        row.match.replace(/\n/g, ' '),
        row.url
      ].join(',');

      csvContent += line + '\n';
    });

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'field_usage_results.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Clear all data and reset UI
  $scope.c.clearResults = function() {
    $scope.c.data.fieldSysId = '';
    $scope.c.data.fieldName = '';
    $scope.c.data.results = [];
    $scope.c.data.error = '';
    $scope.c.showClear = false;
  };

  // Automatically group results by type whenever data changes
  $scope.$watch('c.data.results', function(newVal) {
    $scope.c.groupedResults = {};
    (newVal || []).forEach(function(r) {
      if (!$scope.c.groupedResults[r.type]) $scope.c.groupedResults[r.type] = [];
      $scope.c.groupedResults[r.type].push(r);
    });
  });
};
api.controller = function ($scope) {
  // === Section: Initialization ===
  // Initialize the data model and field definitions used by the widget.
  // $scope.c.data: Main data container for widget state and UI bindings.
  $scope.c.data = $scope.c.data || {};
  $scope.c.data.entries = [];     // Local storage entries for recent sys_ids
  $scope.c.data.fieldSysId = '';  // sys_id of the field from sys_dictionary to search for
  $scope.c.data.inputValue = '';  // Input value for local storage tracking

  var STORAGE_KEY = 'simpleInputListTGUsageFinder'; // Key for localStorage

  // === Section: Local Storage Management ===
  // Functions to track recent field sys_ids using browser localStorage.
  // This allows users to quickly access previously searched field sys_ids.

  /**
   * Saves the current inputValue (sys_id) into localStorage.
   * Maintains only the 10 most recent entries to avoid storage bloat.
   * Resets inputValue and reloads the saved values for UI update.
   */
  $scope.c.saveInput = function () {
    if (!$scope.c.data.inputValue) return;
    var list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    list.unshift({ value: $scope.c.data.inputValue, date: new Date().toLocaleString() });
    if (list.length > 10) list = list.slice(0, 10); // Keep only the 10 most recent
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    $scope.c.data.inputValue = '';
    $scope.c.loadValues();
  };

  /**
   * Loads the saved sys_id entries from localStorage into the data model.
   * Used to populate the recent searches list on widget load or after changes.
   */
  $scope.c.loadValues = function () {
    $scope.c.data.entries = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  };

  /**
   * Deletes a single entry from the localStorage history by index.
   * Updates the stored list and refreshes the UI accordingly.
   * @param {number} idx - Index of the entry to remove.
   */
  $scope.c.deleteEntry = function (idx) {
    var list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    list.splice(idx, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    $scope.c.loadValues();
  };

  /**
   * Clears all entries from localStorage and resets the local entries list.
   * Provides a way for users to clear their recent search history.
   */
  $scope.c.clearHistory = function () {
    localStorage.removeItem(STORAGE_KEY);
    $scope.c.data.entries = [];
  };

  // === Section: Utility and View Toggles ===
  // Contains utility functions for UI interactions such as copy-to-clipboard,
  // toggling result views between grouped and table formats.

  // Default view mode for displaying results ("group" or "table").
  $scope.c.data.viewMode = 'group';
  $scope.c.data.viewModeSwitch = true; // Boolean for the grouped/table switch UI

  /**
   * Toggles between grouped and table view modes based on the switch state.
   * Updates the viewMode property accordingly to control UI rendering.
   */
  $scope.c.toggleViewFromSwitch = function () {
    $scope.c.data.viewMode = $scope.c.data.viewModeSwitch ? 'group' : 'table';
  };

  /**
   * Copies the provided text to the user's clipboard.
   * Simple utility to facilitate copying script or field data.
   * @param {string} text - Text content to copy.
   */
  $scope.c.copyText = function (text) {
    navigator.clipboard.writeText(text);
  };

  // === Section: Modal Dialog Logic ===
  // Handles opening, closing, and data loading for script display and editing modals.

  /**
   * Opens a modal to display the full script for a given result row (read-only).
   * Fetches script content from the server asynchronously.
   * @param {Object} row - The result row containing table and sys_id.
   */
  $scope.c.viewScript = function (row) {
    // Show loader while fetching script
    $scope.c.isLoading = true;
    $scope.server.get({
      action: 'getScript',
      table: row.table,
      sys_id: row.sys_id
    })
      .then(function (resp) {
        $scope.c.fullScript = resp.data.script || 'Script not found.';
        $('#scriptModal').modal('show');
      })
      .finally(function () {
        // Hide loader when done
        $scope.c.isLoading = false;
      });
  };

  /**
   * Closes the editable script modal.
   * Utility function to hide the modal dialog.
   */
  $scope.c.closeEditableModal = function () {
    var $modal = $('#scriptModalEditable');
    $modal.modal('hide');
  };

  /**
   * Opens a modal to edit the script for a given result row.
   * Fetches the current script content, sets editing context, and shows the modal.
   * @param {Object} row - The result row containing table and sys_id.
   */
  $scope.c.editScript = function (row) {
    // Show loader while fetching script
    $scope.c.isLoading = true;
    $scope.server.get({
      action: 'getScript',
      table: row.table,
      sys_id: row.sys_id
    })
      .then(function (resp) {
        $scope.c.fullScript = resp.data.script || '';
        $scope.c.editingRecord = {
          table: row.table,
          sys_id: row.sys_id,
          field: 'script' // default field to edit
        };
        $('#scriptModalEditable').modal('show');
      })
      .finally(function () {
        // Hide loader when done
        $scope.c.isLoading = false;
      });
  };

  /**
   * Saves the edited script content for the currently edited record.
   * Sends updated script to the server and closes the modal on success.
   */
  $scope.c.saveEditedScript = function () {
    if (!$scope.c.editingRecord || !$scope.c.editingRecord.sys_id) return;
    $scope.server.get({
      action: 'saveScript',
      table: $scope.c.editingRecord.table,
      sys_id: $scope.c.editingRecord.sys_id,
      field: $scope.c.editingRecord.field,
      newScript: $scope.c.fullScript
    }).then(function () {
      $('#scriptModalEditable').modal('hide');
    });
  };

  /**
   * Closes the editable script modal.
   */
  $scope.c.closeModalEditable = function () {
    $('#scriptModalEditable').modal('hide');
  };

  /**
   * Closes the full script display modal.
   */
  $scope.c.closeModalFullScript = function () {
    $('#scriptModal').modal('hide');
  };

  // === Section: Field Usage Logic ===
  // Main logic for finding and grouping field references across script records.
  // This is the core search functionality triggered by user input.

  /**
   * Initiates the search for field usage by sys_id.
   * Saves the search in localStorage for history tracking.
   * Shows a loader during the server call.
   */
  $scope.c.findUsage = function () {
    // Show loader to indicate processing
    $scope.c.isLoading = true;

    // Automatically track the searched sys_id in Local Storage
    $scope.c.data.inputValue = $scope.c.data.fieldSysId;
    $scope.c.saveInput();

    // Perform the usage search by calling the server script with the field sys_id
    $scope.server.update({
      fieldSysId: $scope.c.data.fieldSysId,
    })
      .then(function (resp) {
        // Show the 'Clear' button if there are results
        $scope.c.showClear = resp.data && resp.data.results && resp.data.results.length;
      })
      .finally(function () {
        // Hide loader when done
        $scope.c.isLoading = false;
      });
  };

  /**
   * Clears the current search results and input fields.
   * Resets error messages and clears UI state.
   */
  $scope.c.clearResults = function () {
    $scope.c.data.fieldSysId = '';
    $scope.c.data.fieldName = '';
    $scope.c.data.results = [];
    $scope.c.data.error = '';
  };

  /**
   * Refreshes the current search results without updating history.
   */
  $scope.refresh = function () {
    if (!$scope.c.data.fieldSysId) return;
    $scope.c.isLoading = true;
    $scope.server.update({
      fieldSysId: $scope.c.data.fieldSysId
    })
    .then(function (resp) {
      $scope.c.showClear = resp.data && resp.data.results && resp.data.results.length;
    })
    .finally(function () {
      $scope.c.isLoading = false;
    });
  };

  // === Section: Utility and View Toggles (continued) ===
  // Watches for changes to the results array and groups them by script type for the grouped view.

  /**
   * Watches the results array for changes.
   * Groups results by their 'type' property for easier display in grouped view mode.
   */
  $scope.$watch('c.data.results', function (newVal) {
    $scope.c.groupedResults = {};
    (newVal || []).forEach(function (r) {
      ($scope.c.groupedResults[r.type] = $scope.c.groupedResults[r.type] || []).push(r);
    });
  });

  // === Section: Initialization (continued) ===
  // Load localStorage history on widget load to populate recent searches.
  $scope.c.loadValues();
};
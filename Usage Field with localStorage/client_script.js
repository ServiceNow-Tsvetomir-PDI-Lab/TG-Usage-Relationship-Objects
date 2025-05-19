/**
 * TG Usage Field Finder - Client Script
 * -------------------------------------
 * This script powers the ServiceNow Widget that allows users to input a field sys_id and find
 * where that field is referenced across business rules, client scripts, UI actions, etc.
 * 
 * Features:
 * - Tracks recent searches using localStorage
 * - Displays usage in grouped/table view
 * - Allows script viewing and editing in modals
 * - Includes CSV export of results
 * - Provides UI feedback through success/error toasts
 */

// The server script is expected to return `fieldLabel` and `fieldTable` if includeMetadata = true

api.controller = function ($scope, $timeout) {

  // === Section: Initialization ===
  // Initialize the data model and field definitions used by the widget.
  // $scope.c.data: Main data container for widget state and UI bindings.
  $scope.c.data = $scope.c.data || {};
  $scope.c.data.entries = [];     // Local storage entries for recent sys_ids
  $scope.c.data.fieldSysId = '';  // sys_id of the field from sys_dictionary to search for
  $scope.c.data.inputValue = '';  // Input value for local storage tracking
  $scope.c.data.fieldName = '';   // Field name from sys_dictionary
  $scope.c.data.fieldTable = '';  // Table name from sys_dictionary

  var STORAGE_KEY = 'simpleInputListTGUsageFinder'; // Key for localStorage

  // Load field information from localStorage if available
  $scope.c.loadFieldInfo = function() {
    var list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (list.length > 0) {
      // Load all entries with their specific field information
      list.forEach(function(entry) {
        if (entry.value && (!entry.fieldName || !entry.fieldTable)) {
          // If entry doesn't have field info, fetch it from server
          $scope.server.get({
            action: 'getFieldMetadata',
            fieldSysId: entry.value
          }).then(function (searchResp) {
            if (searchResp && searchResp.data) {
              // Update the entry with field info
              entry.fieldName = searchResp.data.fieldName || 'N/A';
              entry.fieldTable = searchResp.data.fieldTable || 'N/A';
              
              // Update localStorage with the new information
              var updatedList = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
              var index = updatedList.findIndex(function(item) { return item.value === entry.value; });
              if (index !== -1) {
                updatedList[index] = entry;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
                $scope.c.loadValues(); // Reload the entries
              }
            }
          });
        }
      });
    }
  };

  // Call loadFieldInfo when widget initializes
  $scope.c.loadFieldInfo();

  // === Section: Local Storage Management ===
  // Functions to track recent field sys_ids using browser localStorage.
  // This allows users to quickly access previously searched field sys_ids.

  /**
   * Saves the current inputValue (sys_id) into localStorage.
   * Maintains only the 10 most recent entries to avoid storage bloat.
   * Resets inputValue and reloads the saved values for UI update.
   */
  $scope.c.saveInput = function () {
    if (!$scope.c.data.fieldSysId) return;

    // console.log('Searching for field with sys_id:', $scope.c.data.fieldSysId);
    // console.log('Field name:', $scope.c.data.fieldName);
    // console.log('Table name:', $scope.c.data.fieldTable);

    var list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    list.unshift({
      value: $scope.c.data.fieldSysId,
      date: new Date().toLocaleString(),
      fieldName: $scope.c.data.fieldName,
      fieldTable: $scope.c.data.fieldTable
    });
    if (list.length > 10) list = list.slice(0, 10); // Keep only the 10 most recent
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    $scope.c.data.inputValue = '';
    $scope.c.loadValues();

    // Log all entries in localStorage
    // console.log('All entries in localStorage:', JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
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
      $scope.c.showSuccess('Script saved successfully!');
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
  /**
   * === Section: Field Usage Logic ===
   * 
   * This section defines all logic related to executing and managing field usage searches.
   * It includes:
   * - `findUsage`: Executes the main server call to find field references across script records
   * - `clearResults`: Resets the current search result and form state
   * - `refresh`: Re-runs the last search without saving to history
   * - `exportToCSV`: Converts the current search results into a downloadable CSV format
   */

  $scope.c.findUsage = function () {
    if (!$scope.c.data.fieldSysId) {
      $scope.c.showError('Please enter a field sys_id');
      return;
    }

    // Show loader
    $scope.c.isLoading = true;

    // First, get field metadata
    $scope.server.get({
      action: 'getFieldMetadata',
      fieldSysId: $scope.c.data.fieldSysId
    }).then(function (searchResp) {
        if (searchResp && searchResp.data) {
          // Store search results
          $scope.c.data.results = searchResp.data.results || [];
          
          // Set the field name and table from the server response
          $scope.c.data.fieldName = searchResp.data.fieldName || 'N/A';
          $scope.c.data.fieldTable = searchResp.data.fieldTable || 'N/A';
          
          // console.log('Field name received from server:', $scope.c.data.fieldName);
          // console.log('Table name received from server:', $scope.c.data.fieldTable);

          $scope.c.saveInput();

          // Show success message if we have results
          if ($scope.c.data.results.length > 0) {
            $scope.c.showSuccess('Usage found successfully!');
            $scope.c.showClear = true;
          } else {
            $scope.c.showSuccess('No usage found for this field');
            $scope.c.showClear = false;
          }
        }
      })
      .catch(function (error) {
        console.error('[TG Widget] Error:', error);
        $scope.c.showError('Error finding usage: ' + error.message);
      })
      .finally(function () {
        $scope.c.isLoading = false;
      });
  };

  $scope.c.clearResults = function () {
    $scope.c.data.fieldSysId = '';
    $scope.c.data.fieldName = '';
    $scope.c.data.results = [];
    $scope.c.data.error = '';
    $scope.c.showSuccess('Results cleared');
  };

  $scope.refresh = function () {
    if (!$scope.c.data.fieldSysId) return;
    $scope.c.saveInput(); // Ensure sys_id is saved
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


  // === Section: Accordion Logic ===
  // Logic for toggling accordion sections in the UI.

  /**
   * Toggles the expanded/collapsed state of an accordion section.
   * @param {Event} event - The click event from the accordion header.
   */
  $scope.c.toggleAccordion = function (event) {
    var header = event.currentTarget;
    var content = header.nextElementSibling;
    var isExpanded = header.getAttribute('aria-expanded') === 'true';

    // Toggle current accordion
    header.setAttribute('aria-expanded', !isExpanded);
    content.classList.toggle('active');

    // Optional: Close other accordions
    var otherHeaders = document.querySelectorAll('.accordion-header[aria-expanded="true"]');
    otherHeaders.forEach(function (otherHeader) {
      if (otherHeader !== header) {
        otherHeader.setAttribute('aria-expanded', 'false');
        otherHeader.nextElementSibling.classList.remove('active');
      }
    });
  };


  // === Section: Success and Error Messages ===
  // Functions to show and automatically hide success and error messages.

  /**
   * Shows a success message for a short duration.
   * @param {string} message - The success message to display.
   */
  $scope.c.showSuccess = function (message) {
    $scope.c.successMessage = message;
    $timeout(function () {
      $scope.c.successMessage = '';
    }, 5000);
  };

  /**
   * Shows an error message for a short duration.
   * @param {string} message - The error message to display.
   */
  $scope.c.showError = function (message) {
    $scope.c.errorMessage = message;
    $timeout(function () {
      $scope.c.errorMessage = '';
    }, 5000);
  };


  // === Section: Field Usage Logic ===
  $scope.c.exportToCSV = function () {
    if (!$scope.c.data.results || !$scope.c.data.results.length) return;

    // Define the headers and the keys to extract from each row
    var headers = [
      'Type', 'Name', 'Table', 'Script Table', 'Match Count', 'Match Row', 'Match Line', 'Link'
    ];
    var keys = [
      'type', 'name', 'table', 'scriptTable', 'matchCount', 'matchRow', 'match', 'url'
    ];

    let csv = headers.join(',') + '\n';

    $scope.c.data.results.forEach(row => {
      var line = keys.map(key => {
        let value = row[key];
        if (typeof value === 'undefined' || value === null) value = '';
        // For match, replace newlines and escape quotes
        if (key === 'match') value = String(value).replace(/\n/g, ' ').replace(/"/g, '""');
        // Always wrap in quotes for CSV safety
        return '"' + value + '"';
      });
      csv += line.join(',') + '\n';
    });

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'field_usage_results.csv');
    link.click();
    $scope.c.showSuccess('CSV exported successfully!');
  };


};
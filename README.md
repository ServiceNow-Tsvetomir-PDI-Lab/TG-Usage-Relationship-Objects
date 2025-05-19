# TG Usage Relationship Objects

## 📁 Table of Contents

- [📖 Overview](#overview)
- [📁 Repository Structure](#repository-structure)
  - [1. Script Include and Function Usage](#script-include-and-function-usage)
  - [2. Usage Field](#usage-field)
  - [3. Usage Field with Local Storage](#usage-field-with-local-storage)
  - [4. Script Include & Function Usage with Local Storage](#script-include--function-usage-with-local-storage)
- [🛠️ Installation Instructions](#installation-instructions)
- [🚀 Usage Examples](#usage-examples)
- [📦 Releases](#releases)
- [🖼️ Screenshots](#screenshots)

---

<a id="overview"></a>
## 📖 Overview

**TG Usage Relationship Objects** is a comprehensive suite of four specialized ServiceNow developer tools designed to simplify code analysis and maintenance:

1. **Script Include and Function Usage** – Instantly discover every ServiceNow record or script that invokes a specific Script Include or method, helping you map code dependencies quickly.  
2. **Usage Field** – Identify all instances where a given dictionary field (`sys_id` from the `sys_dictionary` table) is referenced, offering insight into configuration and script usage across your instance.  
3. **Usage Field with Local Storage** – Extends the Usage Field widget by remembering your recent field lookups locally in the browser, so you can revisit past searches without losing context.  
4. **Script Include & Function Usage with Local Storage** – Combines the power of Script Include usage tracing with a built-in local history tracker, letting you switch between analysis and saved lookups seamlessly.

These tools empower both administrators and developers to:
- Perform fast impact and dependency analysis before making changes  
- Improve code quality and documentation by understanding script relationships  
- Ensure safe refactoring by uncovering hidden dependencies  
- Streamline troubleshooting by locating relevant script segments rapidly

Whether you’re cleaning up old business rules, auditing field usage, or validating a migration, this toolkit accelerates your workflow and reduces risk.

---

<a id="repository-structure"></a>
## 📁 Repository Structure

The project is organized into four top-level directories, one per widget plus shared background scripts for each:

<a id="script-include-and-function-usage"></a>
### 1. Script Include and Function Usage

```
Script Include and Function Usage/
├── BackgroundScript/
│   └── backgraundScriptWithFunctionSearch.js
├── Widget/
│   ├── template.html
│   ├── script.js
│   ├── client_script.js
│   └── css.scss
```

**Description:** This widget provides a clear interface to enter a Script Include `sys_id` and optional function name, then scans Business Rules, Client Scripts, UI Actions, and more. Results are grouped by record type or displayed in a sortable table. Full script lines are highlighted with match counts and easy copy/export options.

<a id="usage-field"></a>
### 2. Usage Field

```
Usage Field/
├── BackgroundScript/
│   └── backgraundScript.js
├── Widget/
│   ├── template.html
│   ├── script.js
│   ├── client_script.js
│   └── css.scss
```

**Description:** Focused on dictionary fields, this widget lets you paste a `sys_id` from `sys_dictionary` to locate every script or configuration element referencing that field. Ideal for impact analysis before deleting or modifying fields.

<a id="usage-field-with-local-storage"></a>
### 3. Usage Field with Local Storage

```
Usage Field with Local Storage/
├── Widget/
│   ├── template.html
│   ├── script.js
│   ├── client_script.js
│   └── css.scss
```

**Description:** Builds on the Usage Field widget with a **Local Storage Tracker**. Each time you perform a lookup, the `sys_id` and timestamp are saved in the browser up to a limit of 10 entries. Quickly re-run past searches or clear history without retyping.

<a id="script-include--function-usage-with-local-storage"></a>
### 4. Script Include & Function Usage with Local Storage

```
Script Include & Function Usage with Local Storage/
├── Widget/
│   ├── template.html
│   ├── script.js
│   ├── client_script.js
│   └── css.scss
```

**Description:** Integrates the Script Include & Function Usage analysis with a built-in local history panel. Save combinations of Script Include ID and method names automatically. Click a saved entry to populate the search form and rerun the analysis in one click.

---

<a id="installation-instructions"></a>
## 🛠️ Installation Instructions

1. **Clone or download** this repository to your local system.  
2. **Upload Background Scripts:** Navigate to **System Definition > Scripts - Background** in your ServiceNow instance and paste the contents of the respective `backgraundScript*.js` files. Run them once to index any server-side logic if necessary. 
3. **Create Widgets:** Open **Service Portal > Widgets**, create new widgets matching each directory name, and paste the `template.html`, `client_script.js`, `script.js`, and `css.scss` into the appropriate tabs.  
4. **Add to Page:** Use the Service Portal Page Designer to drag-and-drop the new widget(s) onto your desired page.

---

<a id="usage-examples"></a>
## 🚀 Usage Examples

### 🔍 Script Include + Function
1. Open the “Script Include and Function Usage” widget in your portal.  
2. Enter or paste the Script Include `sys_id`. Optionally enter a method name.  
3. Click **Find Usage**.  
4. View results grouped by record type, expand to see matching lines, or switch to Table View for sortable columns.  
5. Copy snippets or export all results to CSV for reporting.

### 📘 Usage Field
1. Open the “Usage Field” widget.  
2. Enter a dictionary field `sys_id` from **System Definition > Dictionary**.  
3. Click **Find Usage**.  
4. Review every script or UI element referencing that field.  
5. Use the **Clear** button to reset for a new lookup.

### 💾 Usage Field with Local Storage
1. Open the enhanced “Usage Field with Local Storage” widget.  
2. Perform your lookup as above.  
3. Notice the history panel appear below, listing previous `sys_id`s with timestamps.  
4. Click a history entry to reload that `sys_id` and rerun the search automatically.  
5. Delete entries individually or clear all history.

### 🗂 Script Include & Function with Local Storage
1. Open the combined widget.  
2. Enter the Script Include `sys_id` and optional Function Name.  
3. Click **Find Usage**.  
4. Observe that both inputs are saved in the history panel below.  
5. Click any past lookup to populate both fields and rerun analysis instantly.

---

<a id="releases"></a>
## 📦 Releases

### 🔖 Version 3.0.0 (Latest)
📁 View this release on GitHub: [v3.0.0](https://github.com/ServiceNow-Tsvetomir-PDI-Lab/TG-Usage-Relationship-Objects/releases/tag/tg-usage-field-finder%E2%80%93v3.0.0)  
- Redesigned visual layout for a better user experience
- Refactored recent search input with an inline Copy button
- Improved accordion-style panels with contextual icons and dynamic collapsing
- Reorganized results to appear as rows (cards)
- Updated local storage logic with better cleanup and formatting
- Clean separation of sections in CSS and HTML for better readability
- Bug fixes and performance enhancements

### 📌 Version 2.0.0
🔍 View release v2.0.0 on GitHub: [v2.0.0](https://github.com/ServiceNow-Tsvetomir-PDI-Lab/TG-Usage-Relationship-Objects/releases/tag/tg-usage-field-finder%E2%80%93v2.0.0)
- Initial public release of **Usage Field with Local Storage** widget
- Basic layout and functionality for sys_id search
- Local storage for tracking recent field lookups (up to 10)
- CSV export of field usage results
- Grouped and table view toggling

---

<a id="screenshots"></a>
## 🖼️ Screenshots

### v3.0.0

### Usage Field with localStorage [v3.0.0]
![localStorage View](https://github.com/ServiceNow-Tsvetomir-PDI-Lab/TG-Usage-Relationship-Objects/blob/main/Usage%20Field%20with%20localStorage/images/Version%203%20Usage%20Field.png)

### Usage Field with localStorage - Group View [v3.0.0]
![localStorage Group View](https://github.com/ServiceNow-Tsvetomir-PDI-Lab/TG-Usage-Relationship-Objects/blob/main/Usage%20Field%20with%20localStorage/images/Version%203%20Usage%20Field%20Group%20View.png)

### Usage Field with localStorage - Table View [v3.0.0]
![localStorage Table View](https://github.com/ServiceNow-Tsvetomir-PDI-Lab/TG-Usage-Relationship-Objects/blob/main/Usage%20Field%20with%20localStorage/images/Version%203%20Usage%20Field%20Table%20View.png)

### v1.0.0

### Script Include and Function Usage with localStorage  [v1.0.0]
![localStorage View](https://github.com/ServiceNow-Tsvetomir-PDI-Lab/TG-Usage-Relationship-Objects/blob/main/Images/Script%20Include%20and%20Function%20localStorage.png)

### Script Include and Function Usage with localStorage – Group View  [v1.0.0]
![Group View](https://github.com/ServiceNow-Tsvetomir-PDI-Lab/TG-Usage-Relationship-Objects/blob/main/Images/Script%20Include%20and%20Function%20localStorage%20Group.png)

### Script Include and Function Usage with localStorage – Table View  [v1.0.0]
![Table View](https://github.com/ServiceNow-Tsvetomir-PDI-Lab/TG-Usage-Relationship-Objects/blob/main/Images/Script%20Include%20and%20Function%20localStorage%20Table.png)

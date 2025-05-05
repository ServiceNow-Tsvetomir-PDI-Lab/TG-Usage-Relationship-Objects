# TG Usage Relationship Objects

## 📁 Table of Contents

## 📁 Table of Contents
- [📖 Overview](#overview)
- [📁 Repository Structure](#repository-structure)
  - [1. Script Include and Function Usage](#1-script-include-and-function-usage)
  - [2. Usage Field](#2-usage-field)
- [🛠️ Installation Instructions](#installation-instructions)
- [🚀 Usage Examples](#usage-examples)
- [🖼️ Screenshots](#screenshots)

---

## 📖 Overview

**TG Usage Relationship Objects** is a toolkit of three ServiceNow developer tools:

- **Script Include and Function Usage** – Identify where a Script Include or a specific function is used.
- **Usage Field** – Trace where a specific dictionary field (`sys_id`) appears in scripts and configuration.
- **Usage Field with Local Storage** – Enhanced version of the Usage Field tool that adds local tracking for recent field lookups.

These tools help you:

- Perform fast impact analysis
- Improve script maintenance and documentation
- Validate safe refactoring
- Streamline debugging across your ServiceNow instance

---

## 📁 Repository Structure

### 1. Script Include and Function Usage

```

Script Include and Function Usage/
├── BackgraundScript/
│   └── backgraundScriptWithFunctionSearch.js
├── Widget/
│   ├── template.html
│   ├── script.js
│   ├── client\_script.js
│   └── css.scss

```

#### ✅ Features

- Query by Script Include or a specific method
- Function detection using RegExp
- Scans:
  - Business Rules
  - Client Scripts
  - Script Includes
  - UI Actions
  - Scripted REST APIs
  - Flow Designer Flows
  - Scheduled Jobs
- Toggle between Grouped and Table views
- Full script preview modal
- Copy matched lines to clipboard
- Export results to CSV

---

### 2. Usage Field

```

Usage Field/
├── BackgraundScript/
│   └── backgraundScript.js
├── Widget/
│   ├── template.html
│   ├── script.js
│   ├── client\_script.js
│   └── css.scss

```

#### ✅ Features

- Accepts a `sys_id` from the `sys_dictionary` table
- Detects references in major scripting tables
- Grouped view and flat table view toggle
- Displays line number and matched lines
- Full script modal
- CSV export and inline copy support

---

### 3. Usage Field with Local Storage

[🔗 View Source Code ›](https://github.com/ServiceNow-Tsvetomir-PDI-Lab/TG-Usage-Relationship-Objects/tree/main/Usage%20Field%20with%20localStorage)

```

Usage Field with Local Storage/
├── BackgraundScript/
│   └── backgraundScript.js
├── Widget/
│   ├── template.html
│   ├── script.js
│   ├── client\_script.js
│   └── css.scss

```

#### ✅ Features

- All capabilities of the **Usage Field** widget
- **Local Storage Tracker**:
  - Automatically saves the last 10 `sys_id` lookups to local storage
  - Displays saved history with timestamp
  - One-click to re-populate a previous field
  - Clear history or delete individual entries
- History panel is hidden by default but included in the code for future enablement

---

## 🛠️ Installation Instructions

1. Upload widget files using the Service Portal Widget Editor
2. Add the widget to a Service Portal page

---

## 🚀 Usage Examples

### 🔍 Script Include + Function

- Enter the Script Include `sys_id`
- Optionally enter a specific function (e.g., `addPDFConversionNote`)
- Click **Find Usage** to locate where it's called in the system

### 📘 Usage Field

- Enter the `sys_id` of a field from the `sys_dictionary` table
- Review all script references where this field appears

### 💾 Usage Field with Local Storage

- Same as Usage Field, but each lookup is automatically stored in browser localStorage
- Recent lookups (max 10) are displayed with date and clickable links
- Track your analysis across sessions

---

## 🖼️ Screenshots

### Script Include and Function Usage – Group View  
![Group View](https://github.com/ServiceNow-Tsvetomir-PDI-Lab/TG-Usage-Relationship-Objects/raw/main/Images/Script%20Include%20and%20Function%20Usage%20Group%20Mode.png)

### Script Include and Function Usage – Table View  
![Table View](https://github.com/ServiceNow-Tsvetomir-PDI-Lab/TG-Usage-Relationship-Objects/raw/main/Images/Script%20Include%20and%20Function%20Usage%20Table%20Mode.png)

### Usage Field – Group View  
![Group View](https://github.com/ServiceNow-Tsvetomir-PDI-Lab/TG-Usage-Relationship-Objects/raw/main/Images/Usage%20Field%20Group%20Mode.png)

### Usage Field – Table View  
![Table View](https://github.com/ServiceNow-Tsvetomir-PDI-Lab/TG-Usage-Relationship-Objects/raw/main/Images/Usage%20Field%20Table%20Mode.png)

---


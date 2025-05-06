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
- [🖼️ Screenshots](#screenshots)

---

<a id="overview"></a>
## 📖 Overview

**TG Usage Relationship Objects** is a toolkit of four ServiceNow developer tools:

- **Script Include and Function Usage** – Identify where a Script Include or a specific function is used.  
- **Usage Field** – Trace where a specific dictionary field (`sys_id`) appears in scripts and configuration.  
- **Usage Field with Local Storage** – Enhanced version of the Usage Field tool that adds local tracking for recent field lookups.  
- **Script Include & Function Usage with Local Storage** – Combines Script Include usage search with a local-storage history tracker.

These tools help you:

- Perform fast impact analysis  
- Improve script maintenance and documentation  
- Validate safe refactoring  
- Streamline debugging across your ServiceNow instance  

---

<a id="repository-structure"></a>
## 📁 Repository Structure

<a id="script-include-and-function-usage"></a>
### 1. Script Include and Function Usage

```

Script Include and Function Usage/
├── BackgraundScript/
│   └── backgraundScriptWithFunctionSearch.js
├── Widget/
│   ├── template.html
│   ├── script.js
│   ├── client_script.js
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

<a id="usage-field"></a>
### 2. Usage Field

```

Usage Field/
├── BackgraundScript/
│   └── backgraundScript.js
├── Widget/
│   ├── template.html
│   ├── script.js
│   ├── client_script.js
│   └── css.scss

```

#### ✅ Features

- Accepts a `sys_id` from the `sys_dictionary` table  
- Detects references in major scripting tables  
- Toggle between Grouped and Table views  
- Displays line numbers and matched lines  
- Full script preview modal  
- Export results to CSV & copy to clipboard  

---

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

#### ✅ Features

- All capabilities of the **Usage Field** widget  
- **Local Storage Tracker**:
  - Automatically saves the last 10 `sys_id` lookups to browser localStorage  
  - Displays saved history with timestamps  
  - One-click re-population of a previous lookup  
  - Delete individual entries or clear entire history  

<https://github.com/ServiceNow-Tsvetomir-PDI-Lab/TG-Usage-Relationship-Objects/tree/main/Usage%20Field%20with%20localStorage>

---

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

#### ✅ Features

- All functionality of **Script Include and Function Usage**  
- **Local Storage Tracker**:
  - Saves last 10 lookups (Script Include ID + Function Name)  
  - Displays lookup history with timestamps  
  - One-click to refill both Script Include and Function inputs  
  - Delete individual entries or clear entire history  
- Seamless integration: clicking a history entry loads values into the search form  

[Script Include & Function Usage with Local Storage on GitHub](https://github.com/ServiceNow-Tsvetomir-PDI-Lab/TG-Usage-Relationship-Objects/tree/main/Script%20Include%20and%20Function%20Usage%20with%20localStorage)


---

<a id="installation-instructions"></a>
## 🛠️ Installation Instructions

1. Upload widget files using the Service Portal Widget Editor.  
2. Execute the corresponding Background Script under **System Definition > Scripts - Background**.  
3. Add the widget to a Service Portal page.  

---

<a id="usage-examples"></a>
## 🚀 Usage Examples

### 🔍 Script Include + Function

1. Enter the Script Include `sys_id`.  
2. Optionally specify a method (e.g., `addPDFConversionNote`).  
3. Click **Find Usage** to locate references.  

### 📘 Usage Field

1. Enter a field `sys_id` from the `sys_dictionary` table.  
2. Click **Find Usage** to see where it appears in scripts.  

### 💾 Usage Field with Local Storage

1. Same as **Usage Field**, but each lookup is saved automatically.  
2. Recent lookups (up to 10) are shown with date and time.  
3. Click a saved entry to re-run the lookup.  

### 🗂 Script Include & Function with Local Storage

1. Enter the Script Include `sys_id` and optional Function Name.  
2. Click **Find Usage**; the lookup is also saved.  
3. View or click history entries to reload form values.  

---

<a id="screenshots"></a>
## 🖼️ Screenshots

### Script Include and Function Usage – Group View  
![Group View](https://github.com/ServiceNow-Tsvetomir-PDI-Lab/TG-Usage-Relationship-Objects/raw/main/Images/Script%20Include%20and%20Function%20Usage%20Group%20Mode.png)

### Script Include and Function Usage – Table View  
![Table View](https://github.com/ServiceNow-Tsvetomir-PDI-Lab/TG-Usage-Relationship-Objects/raw/main/Images/Script%20Include%20and%20Function%20Usage%20Table%20Mode.png)

### Usage Field – Group View  
![Group View](https://github.com/ServiceNow-Tsvetomir-PDI-Lab/TG-Usage-Relationship-Objects/raw/main/Images/Usage%20Field%20Group%20Mode.png)

### Usage Field – Table View  
![Table View](https://github.com/ServiceNow-Tsvetomir-PDI-Lab/TG-Usage-Relationship-Objects/raw/main/Images/Usage%20Field%20Table%20Mode.png)
```

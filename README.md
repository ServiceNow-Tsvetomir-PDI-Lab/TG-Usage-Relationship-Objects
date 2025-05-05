# TG Usage Relationship Objects

## 📑 Table of Contents
- [Overview](#-overview)
- [Repository Structure](#-repository-structure)
  - [1. Script Include and Function Usage](#1-script-include-and-function-usage)
    - [Background Script](#background-script)
    - [Widget](#widget)
  - [2. Usage Field](#2-usage-field)
    - [Background Script](#background-script-1)
    - [Widget](#widget-1)
- [Installation Instructions](#-installation-instructions)
- [Usage Examples](#-usage-examples)
- [Screenshots](#-screenshots)

---

## 🧠 Overview

**TG Usage Relationship Objects** is a toolkit of two ServiceNow developer tools:

- **Script Include and Function Usage**: Track where Script Includes and their methods are used
- **Usage Field**: Detect field references across scripts using `sys_dictionary` field `sys_id`

These tools help:
- Perform fast impact analysis
- Improve script maintenance and documentation
- Validate refactor safety
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
│   ├── client_script.js
│   └── css.scss
```

#### ✅ Features
- Query by Script Include or specific function
- Smart function detection using RegExp
- Scans:
  - Business Rules
  - Client Scripts
  - Script Includes
  - UI Actions
  - Scripted REST APIs
  - Flow Designer Flows
  - Scheduled Jobs
- Grouped view vs tabular view (with toggle)
- Modal for full script
- Copy to clipboard
- CSV Export

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
- Input a field `sys_id` from `sys_dictionary`
- Detect script references in key system tables
- Matches grouped or tabular view (toggle)
- Highlights matching rows & lines
- Full script modal
- Export to CSV & copy

---

## 🛠️ Installation Instructions

1. Upload widget files via the Service Portal widget editor
2. Use background script under `System Definition > Scripts - Background`
3. Add widget to a Service Portal page

---

## 🚀 Usage Examples

### 🔍 Script Include + Function
- Provide a Script Include `sys_id`
- Optionally specify a method like `addPDFConversionNote`
- See where this function is called in code

### 📘 Field Usage
- Provide a field’s `sys_id` from `sys_dictionary`
- View where it appears in scripts or config

---

## 🖼️ Screenshots

### Script Include and Function Usage – Group View
![Group View](https://raw.githubusercontent.com/ServiceNow-Tsvetomir-PDI-Lab/TG-Usage-Relationship-Objects/main/Images/script_include_group_view.png)

### Script Include and Function Usage – Table View
![Table View](https://raw.githubusercontent.com/ServiceNow-Tsvetomir-PDI-Lab/TG-Usage-Relationship-Objects/main/Images/script_include_table_view.png)

### Usage Field – Group View
![Group View](https://raw.githubusercontent.com/ServiceNow-Tsvetomir-PDI-Lab/TG-Usage-Relationship-Objects/main/Images/usage_field_group_view.png)

### Usage Field – Table View
![Table View](https://raw.githubusercontent.com/ServiceNow-Tsvetomir-PDI-Lab/TG-Usage-Relationship-Objects/main/Images/usage_field_table_view.png)

---

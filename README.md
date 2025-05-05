# TG Usage Relationship Objects

## 📁 Table of Contents
- [Overview](#overview)
- [Repository Structure](#repository-structure)
  - [1. Script Include and Function Usage](#1-script-include-and-function-usage)
    - [Background Script](#background-script)
    - [Widget](#widget)
  - [2. Usage Field](#2-usage-field)
    - [Background Script](#background-script-1)
    - [Widget](#widget-1)
- [Installation Instructions](#installation-instructions)
- [Screenshots](#screenshots)
- [Usage Examples](#usage-examples)
- [Contributing](#contributing)
- [License](#license)

---

## 🧠 Overview

**TG Usage Relationship Objects** is a set of two professional-grade tools for ServiceNow developers:
- **Script Include and Function Usage** – tracks where specific Script Includes and functions are used
- **Usage Field** – detects where a given dictionary field is referenced in scripts and configuration

These tools are designed to support:
- Efficient debugging
- Safer refactoring
- Impact analysis
- Documentation of technical dependencies

---

## 📅 Repository Structure

### 1. Script Include and Function Usage

Finds references to a Script Include or a specific function inside it across the entire ServiceNow instance.

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
- Search by Script Include only or include specific function
- Verifies function existence using RegExp
- Scans:
  - Business Rules
  - Client Scripts
  - Script Includes
  - UI Actions
  - Scripted REST API Operations
  - Flow Designer Flows
  - Scheduled Scripts
- Toggle button to switch between **grouped view** and **tabular view**
- Full script modal
- Clipboard support
- CSV export

---

### 2. Usage Field

Finds where a given `sys_dictionary` field is referenced in your instance.

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
- Input: field `sys_id` from `sys_dictionary`
- Searches same tables as Script Include mode
- Shows matching rows, lines, and script excerpts
- View mode toggle: grouped / tabular
- Copy & export tools
- Modal viewer for full script

---

## 🛠️ Installation Instructions

1. Import the widget files into your ServiceNow instance
2. Paste the background script into `Background Scripts` for server-side scanning
3. Place the widget on a Service Portal page to use interactively

---

## 🚀 Usage Examples

### 1. Script Include + Function
- Enter the Script Include's `sys_id`
- Optionally specify a function name (e.g., `addPDFConversionNote`)
- Output will include all references across applicable objects

### 2. Field Usage
- Input the `sys_id` of a field from the `sys_dictionary`
- The tool will display every script where the field is mentioned

---

## 🖼️ Screenshots

### Script Include and Function Usage - Group View
![Group View](https://raw.githubusercontent.com/ServiceNow-Tsvetomir-PDI-Lab/TG-Usage-Relationship-Objects/main/Images/script_include_group_view.png)

### Script Include and Function Usage - Table View
![Table View](https://raw.githubusercontent.com/ServiceNow-Tsvetomir-PDI-Lab/TG-Usage-Relationship-Objects/main/Images/script_include_table_view.png)

### Usage Field - Group View
![Group View](https://raw.githubusercontent.com/ServiceNow-Tsvetomir-PDI-Lab/TG-Usage-Relationship-Objects/main/Images/usage_field_group_view.png)

### Usage Field - Table View
![Table View](https://raw.githubusercontent.com/ServiceNow-Tsvetomir-PDI-Lab/TG-Usage-Relationship-Objects/main/Images/usage_field_table_view.png)

---

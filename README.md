# TG Usage Relationship Objects

## 📑 Table of Contents
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

**TG Usage Relationship Objects** is a toolkit of two powerful ServiceNow developer utilities—**Script Include and Function Usage** and **Field Usage Finder**—which allow deep introspection into how backend code and fields are referenced throughout your instance.

These tools empower ServiceNow platform engineers, admins, and architects to:
- Trace where Script Includes and specific functions are invoked
- Detect impact of fields before deleting/refactoring them
- Visualize usage grouped by object type or as flat table
- Export findings or copy snippets with ease

---

## 📁 Repository Structure

### 1. Script Include and Function Usage

Identifies where a Script Include and (optionally) a function is referenced across your ServiceNow instance.

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
- Supports both Script Include only or Script Include + Function search
- Validates function existence via RegExp
- Checks all major scriptable components:
  - Business Rules
  - Client Scripts
  - Script Includes
  - UI Actions
  - Scripted REST APIs
  - Flow Designer Flows
  - Scheduled Scripts
- Supports grouped vs tabular result views
- Modal for full script view
- Copy-to-clipboard
- CSV Export

---

### 2. Usage Field

Finds usage of a given **field (element)** across all relevant backend scripts by passing the `sys_id` from `sys_dictionary`.

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
- Takes a field's sys_id as input
- Analyzes across same table types as above
- Returns line(s), row(s), and full match content
- View as grouped by type or in flat table
- Export results as CSV
- Full script modal viewer

---

## 🛠️ Installation Instructions

1. Navigate to either tool folder (e.g. `Script Include and Function Usage/Widget`) and:
   - Import widget files in your ServiceNow instance
   - Paste background script into `Background Scripts` module to use standalone
2. Add the widget to a page in your Service Portal

---

## 🚀 Usage Examples

### 1. Script Include and Function Search
- Provide a Script Include sys_id to get all usages
- Optionally, specify function name(addPDFConversionNote) to find direct invocations like `HRPDFUtils().addPDFConversionNote()`

### 2. Field Usage Analysis
- Paste sys_id from any field in `sys_dictionary`
- Get a full map of references to that field (e.g., `'leaverequest_start_date'`)

---

## 🖼️ Screenshots

### Script Include and Function Usage - Group View
![Group View](https://raw.githubusercontent.com/ServiceNow-Tsvetomir-PDI-Lab/TG-Usage-Relationship-Objects/main/images/script_include_group_view.png)

### Script Include and Function Usage - Table View
![Table View](https://raw.githubusercontent.com/ServiceNow-Tsvetomir-PDI-Lab/TG-Usage-Relationship-Objects/main/images/script_include_table_view.png)

### Usage Field - Group View
![Group View](https://raw.githubusercontent.com/ServiceNow-Tsvetomir-PDI-Lab/TG-Usage-Relationship-Objects/main/images/usage_field_group_view.png)

### Usage Field - Table View
![Table View](https://raw.githubusercontent.com/ServiceNow-Tsvetomir-PDI-Lab/TG-Usage-Relationship-Objects/main/images/usage_field_table_view.png)

---

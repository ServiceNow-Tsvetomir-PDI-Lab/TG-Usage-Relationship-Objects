# 🛠️ TG Usage Field Finder with LocalStorage Support

A custom ServiceNow Service Portal widget that allows users to **analyze field usage** across scripts and components by searching for a field's `sys_id` from the `sys_dictionary` table. This widget supports **Group** and **Table** views, local history tracking, full script viewing, and inline editing – all in a clean and interactive UI.

---

## 📚 Table of Contents

- [📦 Features](#-features)
- [📂 Project Structure](#-project-structure)
- [🧩 Files Included](#-files-included)
- [🚀 What's New in v3.0.0](#-whats-new-in-v300)
- [🚀 What's New in v2.0.0](#-whats-new-in-v200)
- [🛠️ How to Use](#️-how-to-use)
- [📌 Requirements](#-requirements)
- [🔖 Version History](#-version-history)
- [⚠️ Known Issues & Limitations](#-known-issues--limitations)
- [🧪 Test Use Cases](#-test-use-cases)
- [📦 Deployment & Installation](#-deployment--installation)
- [📸 Screenshots](#-screenshots)

---

## 📦 Features

### ✅ Field Usage Finder
- Search for field references using `sys_id` (from `sys_dictionary`)
- Matches shown in:
  - `Business Rules`
  - `Client Scripts`
  - `Script Includes`
  - `UI Actions`
  - `Scheduled Jobs`
  - `Scripted REST APIs`
- Grouped view (by type) or flat table view

### ✅ Local Storage Tracker (NEW in v2)
- Automatically saves last 10 `sys_id` searches
- Includes timestamps
- Re-select old searches with a single click
- Option to clear individual or all entries

### ✅ Full Script Modal View & Edit (NEW in v2)
- View entire script content in modal
- Edit and save script directly from widget
- Mobile-friendly and Bootstrap 3.3.6 compatible

### ✅ Smart Field Matching (Enhanced)
- Matches only when field belongs to correct parent table (`collection`, `table`, etc.)
- Skips false positives like "GlideCacheManager" or non-matching variables
- Regex-based parsing of local GlideRecord instances (e.g. `var gr = new GlideRecord('sys_user')`)

---

## 📂 Project Structure

```
Usage Field with localStorage/
├── client_script.js       # Frontend logic and modals
├── css.scss               # Custom styling for layout and modals
├── script.js              # Server-side field search logic
├── template.html          # AngularJS template for rendering UI
├── README.md              # Project documentation
├── CHANGELOG.md           # Version history and change log
└── RELEASE_NOTE.md        # GitHub Releases Summary
```

---

## 🧩 Files Included

| File              | Purpose                                 |
|-------------------|------------------------------------------|
| `client_script.js` | Handles all UI logic, state tracking, modals, and local storage |
| `template.html`    | Markup structure for search input, result rendering, and modals |
| `script.js`        | Server-side logic for parsing and returning matching scripts |
| `css.scss`         | Custom styling for loader, modals, lists, toggle, etc. |

---

## 🚀 What's New in v3.0.0

Version 3.0.0 introduces a refreshed design and improved user experience, including:

| Type     | Description |
|----------|-------------|
| ✅ Added | Accordion-style help panels ("What is this?", "How to use?", "Tips") |
| ✅ Added | Button inside input field to copy sys_id (improved UX) |
| ✅ Added | View panels layout adapted to better responsiveness and spacing |
| ✅ Added | Code refactor for better structure and section-based navigation |
| 🎨 Improved | Accordion icons and spacing for mobile and desktop consistency |
| 🧠 Improved | Visual spacing and input layout inspired by modern Next.js UI |
| 💡 Refactored | Fully Refactored Template, Client Script, and CSS for clarity and maintainability |
|  🛠️ **Bug Fixes | Fixed modal issues, field metadata logic, and localStorage integration | 

---

## 🚀 What's New in v2.0.0

| Type     | Description |
|----------|-------------|
| ✅ Added | Editable modal dialog with Save functionality |
| ✅ Added | Saved Search History using `localStorage` |
| ✅ Added | Field filtering per `collection`/`table` check |
| ✅ Fixed | False matches with `GlideCacheManager` and similar names |
| ✅ Fixed | Mobile iOS modal open/close issues |
| 🧠 Improved | Regex pattern for better variable detection |
| 🎨 Updated | Modernized UI layout and visual style |

---

## 🛠️ How to Use

1. Navigate to your Service Portal
2. Paste a field `sys_id` from `sys_dictionary`
3. Click **Find Usage**
4. View in Grouped or Table view
5. Click any result → View or Edit Script
6. Use Saved Entries below to recall recent sys_ids

---

## 📌 Requirements

- **ServiceNow**: Xanadu or later
- **Bootstrap**: 3.3.6 (Service Portal default)
- Access to `sys_script`, `sys_script_include`, `sys_ui_action`, etc.

---

## 🔖 Version History

### [v3.0.0](https://github.com/ServiceNow-Tsvetomir-PDI-Lab/TG-Usage-Relationship-Objects/releases/tag/tg-usage-field-finder%E2%80%93v3.0.0)
📁 View this release on GitHub: [v3.0.0](https://github.com/ServiceNow-Tsvetomir-PDI-Lab/TG-Usage-Relationship-Objects/releases/tag/tg-usage-field-finder%E2%80%93v3.0.0)
- UI redesign inspired by modern design systems (Next.js)
- Accordion-style contextual help
- Cleaner and responsive layout
- New Copy ID logic inside input
- Improved grouping of scripts and spacing
- Full code refactor with modular sections and comments

### [v2.0.0](https://github.com/ServiceNow-Tsvetomir-PDI-Lab/TG-Usage-Relationship-Objects/releases/tag/tg-usage-field-finder%E2%80%93v2.0.0)
🔍 View release v2.0.0 on GitHub: [v2.0.0](https://github.com/ServiceNow-Tsvetomir-PDI-Lab/TG-Usage-Relationship-Objects/releases/tag/tg-usage-field-finder%E2%80%93v2.0.0)
- LocalStorage integration
- Script editing modal
- Smart match validation
- Loader animation

### v1.0.0
- Basic usage search by field sys_id
- Group/Table view toggle
- Script viewer modal (read-only)

---

## ⚠️ Known Issues & Limitations

- 🔍 Currently supports exact field references; does not parse complex nested logic (e.g., indirect field mapping)
- ✏️ Script editing is only available for supported tables (e.g., Business Rules, UI Actions)
- 🧠 Regex-based parser has limits; edge cases in script patterns might escape detection
- 📱 On older iOS devices, modal focus behavior might occasionally lock

---

## 🧪 Test Use Cases

| Field Name        | Table           | sys_id (Example)                  |
|-------------------|------------------|-----------------------------------|
| manager           | sys_user         | abc123456789abcdef123456789abcde |
| short_description | incident/task    | def456789abcdef123456789abcde123 |
| leave_type        | leaverequest     | ghi789abcdef123456789abcde123456 |

*Use yours `sys_id` values for testing field usage mapping across business rules and scripts.*

---

## 📦 Deployment & Installation

1. Create a new widget in ServiceNow Service Portal
2. Replace the generated widget files with those from this repository:
   - `client_script.js` → Client Script
   - `template.html` → Template
   - `script.js` → Server Script
   - `css.scss` → CSS
3. Save and open the widget in your Service Portal page
4. Done ✅

---

## 📸 Screenshots

### v3.0.0

### Usage Field with localStorage [v3.0.0]
![localStorage View](https://github.com/ServiceNow-Tsvetomir-PDI-Lab/TG-Usage-Relationship-Objects/blob/main/Usage%20Field%20with%20localStorage/images/Version%203%20Usage%20Field.png)

### Usage Field with localStorage - Group View [v3.0.0]
![localStorage Group View](https://github.com/ServiceNow-Tsvetomir-PDI-Lab/TG-Usage-Relationship-Objects/blob/main/Usage%20Field%20with%20localStorage/images/Version%203%20Usage%20Field%20Group%20View.png)

### Usage Field with localStorage - Table View [v3.0.0]
![localStorage Table View](https://github.com/ServiceNow-Tsvetomir-PDI-Lab/TG-Usage-Relationship-Objects/blob/main/Usage%20Field%20with%20localStorage/images/Version%203%20Usage%20Field%20Table%20View.png)

### v2.0.0

### Usage Field with localStorage [v2.0.0]
![localStorage View](https://github.com/ServiceNow-Tsvetomir-PDI-Lab/TG-Usage-Relationship-Objects/blob/main/Usage%20Field%20with%20localStorage/images/New%20Version%20Usage%20Field.png)

### Usage Field with localStorage – Group View [v2.0.0]
![Group View](https://github.com/ServiceNow-Tsvetomir-PDI-Lab/TG-Usage-Relationship-Objects/blob/main/Usage%20Field%20with%20localStorage/images/New%20Version%20Usage%20Field%202.png)

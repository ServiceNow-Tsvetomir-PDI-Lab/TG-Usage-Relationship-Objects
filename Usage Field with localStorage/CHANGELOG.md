# 📦 CHANGELOG

All notable changes to the **Field Usage Finder Widget** will be documented in this file.

---

## [3.0.0] - 2025-05-19

### 🧩 Added
- 📋 Copy to Clipboard button embedded directly into the input field for better UX.
- 📊 Accordion-style panels with enhanced structure and new icons (What is this?, How to Use, Tips).
- 🔄 Button alignment: Export to CSV / Clear buttons repositioned before Refresh.
- 📜 Reorganized CSS and HTML codebase into clear, labeled sections and sub-sections for maintainability.
- 📦 Visual improvements for result panels: grouped view now displays in responsive column grid layout.
- 🧠 All scripts (Client + Server) refactored with extensive comments and section headers.
- 🧪 Field sys_id entries now display copy time and are managed through enhanced localStorage logic.

### 🛠️ Changed
- 📦 Fully refactored HTML with grouped sections and accordion panels
- 📋 Improved modal display and editing logic
- 🖼️ Improved UI layout with consistent spacing and modernized button styling.
- 🧱 Input field + Copy ID button now wrapped in a flex row to improve alignment.
- 🧪 Reworked localStorage logic to store only valid field data

### 🐛 Fixed
- ✅ Recent Searches now correctly track `sys_id` values and avoid duplicates.

---

## [2.0.0] - 2025-05-16
### Added
- 🔍 Introduced editable script modal to allow inline script editing from portal.
- 💾 Integrated localStorage tracker for recent `sys_id` field usage history.
- 📊 Added "Script Table" information in the results list.
- 🧠 Context-aware script analysis with GlideRecord variable inference.
- 🧪 Loader animation added for async operations to improve UX.
- 💅 Complete UI redesign inspired by Tailwind/NextJS layout.
- 📱 Improved mobile responsiveness and layout consistency.
- 🧩 Enhanced section structure with grouped and tabular results, modern modal styling, and interactive buttons.

### Changed
- 🔁 Refactored client script logic into modular sections with best practice comments.
- 🎨 Improved UI/UX styling with Bootstrap-compliant layout and toggles.
- 📋 Copied scripts and full results can be viewed/exported from modal/table layout.
- ♻️ Optimized server script for more accurate matching of field/table combinations.

### Fixed
- 🐞 Removed false-positive matches from unrelated GlideRecord tables.
- 🚫 Avoided matching on substrings (e.g., `manager` vs. `GlideCacheManager`).
- 📉 Prevented duplicate tracking in localStorage and added pruning of entries > 10.

---

## [1.0.0] - Initial Release
- ✅ First version of the widget with basic field usage tracking.
- 🔍 Basic search for `current.<field>` across static script fields.
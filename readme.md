Create a modern, professional **JSON Viewer / JSON Formatter web application** using:

* **Nuxt 4**
* **Vue 3**
* **TypeScript**
* **Composition API**
* **Pinia** for application state where needed
* **Tailwind CSS** for styling
* **VueUse** where useful
* Client-side JSON processing with no backend required for the core functionality

The application should feel like a polished developer tool similar to a modern JSONViewer / JSON Formatter, but with a cleaner and more premium UI.

## 1. Main Goal

Build a web application where users can:

* Paste JSON
* Type JSON directly
* Upload a `.json` file
* View JSON as an interactive tree
* Format / prettify JSON
* Minify JSON
* Validate JSON
* Search JSON
* Expand and collapse nodes
* Copy values
* Copy JSON paths
* View JSON in a large editor/viewer
* Switch between Tree View and Raw JSON View
* Change Dark / Light mode
* Download formatted JSON
* Clear JSON
* Drag and drop JSON files
* Handle very large JSON documents efficiently

The application must be **desktop-first** and optimized for large monitors.

---

# 2. Design Direction

Create a premium developer-tool interface inspired by modern tools such as:

* JSON viewers
* API clients
* VS Code
* GitHub
* modern developer dashboards

Do NOT simply copy an existing website.

Create an original UI with:

* Clean layout
* Large workspace
* Minimal unnecessary elements
* Excellent spacing
* Smooth animations
* Keyboard shortcuts
* Professional developer-tool typography
* Responsive behavior
* High readability

The JSON viewer should be the primary focus of the entire screen.

---

# 3. Large Screen / Desktop Layout

The application must prioritize large screens.

For desktop screens:

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Logo       JSON Viewer                     Search       Theme    Settings    │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ Toolbar                                                                      │
│ [Format] [Minify] [Validate] [Expand All] [Collapse All] [Copy] [Download]  │
│                                                                              │
├───────────────────────────────────────┬──────────────────────────────────────┤
│                                       │                                      │
│ JSON INPUT                            │ JSON VIEWER                          │
│                                       │                                      │
│ Monaco-like editor                    │ Interactive JSON Tree                │
│ or code editor                        │                                      │
│                                       │                                      │
│ {                                     │ ▼ user                              │
│   "name": "Panha",                    │   ├─ name: "Panha"                   │
│   "age": 25,                           │   ├─ age: 25                         │
│   "skills": [...]                     │   ├─ skills [3]                      │
│ }                                     │   │  ├─ "Flutter"                     │
│                                       │   │  ├─ "Vue"                         │
│                                       │   │  └─ "Nuxt"                        │
│                                       │                                      │
├───────────────────────────────────────┴──────────────────────────────────────┤
│ Status: Valid JSON    Objects: 12    Arrays: 5    Keys: 48    Size: 4.2 KB │
└──────────────────────────────────────────────────────────────────────────────┘
```

On very large screens, allow the workspace to use almost the entire viewport.

Avoid excessive max-width containers.

Use:

```css
width: 100%;
min-height: 100vh;
```

The JSON workspace should have approximately:

```text
Header: 64px
Toolbar: 52px
Main workspace: calc(100vh - header - toolbar)
Status bar: 32px
```

The main JSON workspace should be the dominant area.

---

# 4. Header

Create a clean application header.

Left side:

```text
[JSON icon] JSON Viewer
```

Center/right:

```text
Search
Keyboard Shortcuts
Theme
Settings
```

Header requirements:

* Sticky
* Slightly translucent
* Border bottom
* Dark/light adaptive
* Compact
* Professional
* No unnecessary navigation

Add a small version indicator if appropriate:

```text
v1.0
```

---

# 5. Theme System

Implement a complete **Dark / Light mode**.

Themes:

### Light

Background:

```text
#F8FAFC
```

Panels:

```text
#FFFFFF
```

Text:

```text
#0F172A
```

Borders:

```text
#E2E8F0
```

### Dark

Background:

```text
#0B0F14
```

Panels:

```text
#111820
```

Text:

```text
#E5E7EB
```

Borders:

```text
#26313D
```

The theme must affect:

* Header
* Toolbar
* JSON editor
* Tree viewer
* Search
* Dialogs
* Buttons
* Status bar
* Context menus
* Scrollbars
* Empty states

Persist the selected theme in:

```text
localStorage
```

Support:

```text
Light
Dark
System
```

Theme switch should have a smooth transition.

---

# 6. JSON Input Editor

Create a large JSON input/editor panel.

Features:

* Syntax highlighting
* Line numbers
* Auto indentation
* Bracket matching
* Current line highlight
* Horizontal scrolling
* Vertical scrolling
* Error indicators
* JSON syntax validation
* Paste support
* Select all
* Format on demand

Example:

```json
{
  "user": {
    "name": "Panha",
    "age": 25,
    "active": true,
    "skills": [
      "Flutter",
      "Vue",
      "Nuxt"
    ]
  }
}
```

Use a suitable editor library if necessary.

The editor must handle large JSON input.

---

# 7. JSON Tree Viewer

This is the most important component.

Create an interactive tree viewer.

Example:

```text
▼ user
   ├── name        "Panha"
   ├── age         25
   ├── active      true
   ├── address
   │   ├── city    "Phnom Penh"
   │   └── country "Cambodia"
   └── skills [3]
       ├── 0       "Flutter"
       ├── 1       "Vue"
       └── 2       "Nuxt"
```

Tree requirements:

* Expand/collapse
* Expand all
* Collapse all
* Expand one level
* Indentation guides
* Array indexes
* Object key names
* Value highlighting
* Different visual styles for:

  * String
  * Number
  * Boolean
  * Null
  * Object
  * Array

Example colors:

```text
String   → green
Number   → blue
Boolean  → orange
Null     → gray
Key      → primary text
```

But make the colors theme-aware and accessible.

---

# 8. Node Interaction

When the user clicks a node:

Show subtle selection highlighting.

Right-click a node to display a context menu:

```text
Copy Value
Copy JSON
Copy Path
Copy Key
Expand
Collapse
Expand Children
Collapse Children
```

For example:

```text
user.address.city
```

Copy path should produce:

```text
$.user.address.city
```

For arrays:

```text
$.users[0].name
```

---

# 9. Search

Add global JSON search.

Keyboard shortcut:

```text
Cmd/Ctrl + F
```

Search UI:

```text
┌─────────────────────────────────────────┐
│ 🔍 Search JSON...                 3/12 │
└─────────────────────────────────────────┘
```

Search should find:

* Keys
* Values
* Paths

Highlight matches inside the tree.

Buttons:

```text
Previous
Next
Close
```

Keyboard:

```text
Enter → next result
Shift + Enter → previous result
Esc → close search
```

---

# 10. Toolbar

Create a professional toolbar.

Buttons:

```text
Format
Minify
Validate
Expand All
Collapse All
Copy
Download
Clear
```

Format:

```text
JSON.stringify(data, null, 2)
```

Minify:

```text
JSON.stringify(data)
```

Validate:

Show:

```text
✓ Valid JSON
```

or:

```text
✕ Invalid JSON

Unexpected token at line 12, column 8
```

Clicking an error should navigate to the relevant location.

---

# 11. Drag & Drop

Allow users to drag `.json` files into the application.

Create a drag overlay:

```text
┌─────────────────────────────────────────────┐
│                                             │
│              Drop JSON File Here            │
│                                             │
│             JSON files only                 │
│                                             │
└─────────────────────────────────────────────┘
```

After dropping:

* Read the file
* Parse JSON
* Display it in the editor
* Display it in tree view
* Show file size
* Show validation state

Do everything client-side.

---

# 12. Upload Button

Toolbar:

```text
Open JSON
```

Allow:

```text
.json
```

Also support:

```text
application/json
```

If invalid:

```text
Unable to parse JSON file.
```

---

# 13. Download

Allow users to download JSON.

Options:

```text
Download JSON
Download Formatted JSON
```

Default filename:

```text
data.json
```

If the user opened:

```text
users.json
```

preserve the filename when possible.

---

# 14. View Modes

Provide a segmented control:

```text
Tree | Raw | Split
```

### Tree

Only tree viewer.

### Raw

Only JSON editor.

### Split

Show:

```text
Editor | Viewer
```

Allow resizing the split panel.

The divider should be draggable.

Minimum width:

```text
280px
```

---

# 15. Full Screen Mode

Add:

```text
⛶ Fullscreen
```

When activated:

* Hide normal navigation
* Expand JSON workspace
* Keep toolbar accessible
* Allow Esc to exit fullscreen

The JSON viewer should be able to use almost 100% of the screen.

---

# 16. Large JSON Support

This is very important.

Design the tree viewer so that it does not render thousands of nodes unnecessarily.

Use:

* Lazy rendering
* Lazy expansion
* Virtual scrolling where appropriate
* Computed state
* Efficient recursive components

Do not render the entire JSON tree at once if the JSON contains thousands of nodes.

Example:

```text
1,000,000 JSON nodes
```

The UI should remain responsive as much as reasonably possible.

---

# 17. JSON Statistics

Create a bottom status bar:

```text
Valid JSON
Objects: 24
Arrays: 12
Keys: 184
Values: 230
Characters: 8,921
Size: 8.7 KB
```

Update statistics whenever JSON changes.

---

# 18. Sample JSON

When the application opens for the first time, show a beautiful example JSON.

Example:

```json
{
  "application": {
    "name": "JSON Viewer",
    "version": "1.0.0",
    "environment": "production"
  },
  "user": {
    "id": 1001,
    "name": "Nheb Panha",
    "active": true,
    "skills": [
      "Flutter",
      "Vue",
      "Nuxt",
      "TypeScript"
    ]
  },
  "settings": {
    "theme": "dark",
    "notifications": true
  }
}
```

---

# 19. Keyboard Shortcuts

Implement:

```text
Cmd/Ctrl + Enter    Format JSON
Cmd/Ctrl + F        Search
Cmd/Ctrl + K        Command menu
Cmd/Ctrl + S        Download
Cmd/Ctrl + Shift + C Copy JSON
Esc                 Close dialogs/search
```

Create a keyboard shortcut modal.

Example:

```text
Keyboard Shortcuts

Format JSON          Cmd/Ctrl + Enter
Search               Cmd/Ctrl + F
Command Menu         Cmd/Ctrl + K
Download             Cmd/Ctrl + S
Copy                 Cmd/Ctrl + Shift + C
```

---

# 20. Command Palette

Add:

```text
Cmd/Ctrl + K
```

Open command palette:

```text
┌───────────────────────────────────────────────┐
│ 🔍 Type a command...                         │
├───────────────────────────────────────────────┤
│ Format JSON                                   │
│ Minify JSON                                   │
│ Validate JSON                                 │
│ Expand All                                    │
│ Collapse All                                  │
│ Copy JSON                                     │
│ Download JSON                                 │
│ Toggle Dark Mode                              │
│ Fullscreen                                    │
└───────────────────────────────────────────────┘
```

Commands should be keyboard navigable.

---

# 21. Empty State

When there is no JSON:

```text
                 { }

           JSON Viewer

     Paste or upload your JSON

     [Paste JSON] [Open File]

     Drop a .json file anywhere
```

Keep the empty state minimal and professional.

---

# 22. Error UI

Invalid JSON should not break the application.

Show an error panel:

```text
Invalid JSON

Unexpected token '}'
Line 12
Column 5

[Go to Error]
```

The application must gracefully handle:

* Empty input
* Invalid JSON
* Huge JSON
* Circular data where applicable
* Unexpected file types
* UTF-8 issues

---

# 23. Responsive Design

Desktop is the primary target.

Breakpoints:

```text
≥ 1440px  → Large desktop
≥ 1920px  → Wide desktop
≥ 2560px  → Ultra-wide
1024–1439 → Desktop/tablet
768–1023  → Tablet
< 768px   → Mobile
```

For large screens:

Use the extra space intelligently.

For example:

```text
1920px
├── 50% editor
└── 50% viewer
```

For ultra-wide:

```text
2560px
├── 45% editor
└── 55% viewer
```

Do not create huge empty margins.

---

# 24. Mobile

On mobile:

Use:

```text
Editor
Viewer
```

as switchable tabs instead of side-by-side panels.

Toolbar should become horizontally scrollable.

Tree viewer should remain usable.

---

# 25. Components

Organize the project cleanly.

Suggested structure:

```text
app/
├── app.vue
├── assets/
│   └── css/
│       └── main.css
│
├── components/
│   ├── app/
│   │   ├── AppHeader.vue
│   │   ├── AppToolbar.vue
│   │   ├── AppStatusBar.vue
│   │   └── ThemeToggle.vue
│   │
│   ├── editor/
│   │   ├── JsonEditor.vue
│   │   └── EditorToolbar.vue
│   │
│   ├── viewer/
│   │   ├── JsonViewer.vue
│   │   ├── JsonTree.vue
│   │   ├── JsonNode.vue
│   │   ├── JsonValue.vue
│   │   └── JsonNodeContextMenu.vue
│   │
│   ├── search/
│   │   └── JsonSearch.vue
│   │
│   ├── command/
│   │   └── CommandPalette.vue
│   │
│   └── dialogs/
│       ├── KeyboardShortcuts.vue
│       └── JsonErrorDialog.vue
│
├── composables/
│   ├── useJsonParser.ts
│   ├── useJsonFormatter.ts
│   ├── useJsonSearch.ts
│   ├── useJsonTree.ts
│   ├── useFileDrop.ts
│   ├── useKeyboardShortcuts.ts
│   └── useTheme.ts
│
├── stores/
│   └── jsonViewer.ts
│
├── types/
│   └── json.ts
│
├── utils/
│   ├── json.ts
│   ├── download.ts
│   └── statistics.ts
│
└── pages/
    └── index.vue
```

---

# 26. State Management

Create a Pinia store such as:

```text
useJsonViewerStore
```

State:

```ts
rawJson
parsedJson
viewMode
theme
searchQuery
selectedPath
expandedNodes
isFullscreen
fileName
isValid
error
statistics
```

Keep business logic outside Vue components whenever possible.

---

# 27. TypeScript

Use strict TypeScript.

Avoid:

```ts
any
```

unless absolutely necessary.

Create reusable types for:

```ts
JsonValue
JsonObject
JsonArray
JsonNode
JsonPath
JsonStatistics
JsonParseError
```

---

# 28. Nuxt Configuration

Use Nuxt 4 conventions.

Make sure the project works correctly with:

```text
npm install
npm run dev
npm run build
npm run preview
```

Use SSR-safe code.

Browser APIs such as:

```text
localStorage
FileReader
window
document
navigator.clipboard
```

must only execute on the client.

---

# 29. Performance

Optimize for:

* Large JSON
* Frequent edits
* Search
* Tree expansion
* Theme switching
* Resizing
* Scrolling

Avoid unnecessary Vue reactivity.

Use:

```ts
shallowRef
computed
watch
watchDebounced
markRaw
```

where appropriate.

Debounce expensive JSON parsing while typing.

---

# 30. Animations

Animations should be subtle.

Use:

* 150–250ms transitions
* Smooth tree expand/collapse
* Button hover
* Theme transition
* Dialog entrance
* Search appearance
* Context menu animation

Do not over-animate the JSON data itself.

The app should feel fast.

---

# 31. Accessibility

Support:

* Keyboard navigation
* Focus states
* ARIA labels
* Screen readers
* Good contrast
* Reduced motion preference

Every icon-only button must have a tooltip and accessible label.

---

# 32. Toast Notifications

Create small toast messages:

```text
✓ JSON copied
✓ JSON formatted
✓ File downloaded
✓ JSON validated
```

Error:

```text
✕ Unable to copy JSON
```

Toasts should disappear automatically.

---

# 33. Clipboard

Support:

```text
Copy JSON
Copy Value
Copy Key
Copy Path
```

Use:

```ts
navigator.clipboard.writeText()
```

with fallback handling.

---

# 34. Code Quality

Follow these principles:

* Clean Architecture where practical
* Reusable Vue components
* Composables for logic
* No giant `index.vue`
* Strong TypeScript
* No duplicated logic
* Clear naming
* Small components
* Maintainable folder structure
* Good comments only where necessary

---

# 35. Visual Details

The application should look premium.

Use:

* 8–12px border radius
* Thin borders
* Subtle shadows
* Smooth hover states
* Modern typography
* Monospace font for JSON
* Clear hierarchy

JSON text should use a developer-friendly font such as:

```text
JetBrains Mono
Fira Code
SF Mono
```

Use font fallback if external fonts are unavailable.

---

# 36. Scrollbars

Create modern thin scrollbars.

Desktop:

```text
6–8px
```

They should adapt to dark/light mode.

Do not make scrollbars visually distracting.

---

# 37. Final UI

The final application should feel like a real production developer tool rather than a demo.

Important priorities:

1. JSON viewer takes most of the screen
2. Large-screen experience
3. Dark/light theme
4. Excellent tree viewer
5. Fast interaction
6. Clean developer-focused UI
7. Keyboard shortcuts
8. Search
9. File upload/download
10. Large JSON performance

---

# 38. Deliverables

Generate the complete working project.

Include:

* All Vue components
* Nuxt configuration
* TypeScript types
* Pinia store
* Composables
* Utility functions
* Tailwind configuration if required
* Global CSS
* Responsive design
* Dark/light/system theme
* Sample JSON
* Error handling
* Keyboard shortcuts
* Command palette
* JSON tree
* Search
* File upload
* Drag & drop
* Download
* Copy functionality
* Fullscreen
* Statistics

Do not provide pseudo-code.

Generate production-ready code that can be copied directly into a Nuxt 4 project.

After implementation, verify that:

```bash
npm run dev
npm run build
```

work without TypeScript errors, Vue errors, or Nuxt build errors.

The final result should be a **full-screen, professional JSON Viewer optimized for large desktop and ultra-wide monitors**, with a polished dark/light theme and an interactive JSON tree as the main focus.

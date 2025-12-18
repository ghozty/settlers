# Setup Guide

## Prerequisites

### Required Software

1. **TSO Client**: The Settlers Online client application
   - Download from: [fedorovvl/tso_client](https://github.com/fedorovvl/tso_client)
   - Or use the official client with userscript support

2. **Text Editor**: Any code editor with JavaScript support
   - Recommended: Visual Studio Code, Cursor, or similar
   - Syntax highlighting for JavaScript
   - Markdown preview for documentation

3. **File System Access**: Ability to edit files in the userscripts directory

### Directory Structure

The TSO client expects userscripts in a specific location:

```
TSO Client Root/
├── userscripts/          # Your scripts go here
│   ├── YourScript.js
│   └── ...
├── Samples/             # Example scripts (reference)
└── ...
```

## Script File Requirements

### File Naming

- Use descriptive names: `AG_ExplorerManager.js`, `CURSOR_AutoFarms.js`
- Avoid spaces in filenames
- Use `.js` extension

### Script Structure

A basic script structure:

```javascript
// Script header with description
// TSO Client User Script - Your Script Name
// Description of what the script does

// Global variables
var SCRIPT_NAME = "Your Script";

// Menu integration
addToolsMenuItem(SCRIPT_NAME, YourMainFunction);

// Main function
function YourMainFunction() {
    // Check if on home zone
    if (!game.gi.isOnHomzone()) {
        game.showAlert("Please go to your home zone first.");
        return;
    }
    
    // Your script logic here
}
```

## Development Workflow

### 1. Create Script File

Create a new `.js` file in the `userscripts/` directory.

### 2. Reload Scripts

After making changes:
- Use the "Reload Scripts" menu option in the client
- Or restart the client application
- Scripts are loaded on client startup

### 3. Testing

- Test on your home zone first
- Use `game.showAlert()` for debugging
- Check News chat for script messages
- Use browser console if available (F12 in some clients)

### 4. Error Handling

Always wrap risky operations in try-catch:

```javascript
try {
    var zone = game.gi.mCurrentPlayerZone;
    // Your code
} catch (e) {
    game.showAlert("Error: " + e.message);
    console.error("Script error:", e);
}
```

## Common Setup Issues

### Script Not Loading

- Check file is in `userscripts/` directory
- Verify file has `.js` extension
- Check for syntax errors (use a linter)
- Review client console for errors

### Script Not Appearing in Menu

- Ensure `addToolsMenuItem()` is called
- Check function name matches menu handler
- Verify script loaded without errors

### Access Denied Errors

- Some methods are sealed and cannot be hooked
- Use direct method calls instead of trying to override
- Check error messages for specific restrictions

## Development Tools

### Recommended Extensions (VS Code/Cursor)

- JavaScript/TypeScript language support
- ESLint for code quality
- Markdown preview for documentation
- Git integration for version control

### Debugging

- Use `game.showAlert()` for simple messages
- Use `console.log()` for detailed logging
- Use News chat channel for persistent logs
- Use browser DevTools if available

## Next Steps

- [First Script Tutorial](first-script.md) - Create your first script
- [Common Patterns](common-patterns.md) - Learn essential patterns
- [API Reference](../api-reference/game-interface/game-gi.md) - Explore the API


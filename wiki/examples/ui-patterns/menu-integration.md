# Example: Menu Integration

Example of adding menu items to the Tools menu.

## Overview

This example demonstrates:
- Adding menu items
- Creating menu handlers
- Managing menu state

## Key Functions

### Adding Menu Item

```javascript
addToolsMenuItem("My Script", myScriptHandler);
```

### Menu Handler

```javascript
function myScriptHandler(event) {
    if (!game.gi.isOnHomzone()) {
        game.showAlert("Please go to your home zone first.");
        return;
    }
    
    // Your code here
}
```

## Related Documentation

- [Menu Integration](../../api-reference/ui-helpers/menu-integration.md) - Menu API


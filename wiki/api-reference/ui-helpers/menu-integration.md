# Menu Integration API

Complete reference for adding menu items to the Tools menu.

## Adding Menu Items

### Basic Usage

```javascript
addToolsMenuItem(name, fn, key, ctrl, shiftKey, altKey)
```

**Parameters**:
- `name` (string): Menu item label
- `fn` (function): Function to call when clicked
- `key` (int, optional): Keyboard key code
- `ctrl` (boolean, optional): Require Ctrl key
- `shiftKey` (boolean, optional): Require Shift key
- `altKey` (boolean, optional): Require Alt key

**Usage**:
```javascript
addToolsMenuItem("My Script", myScriptHandler);
```

**Example from Specialist_Tasks.js**:
```javascript
addToolsMenuItem("Specialists Tasks", SpecialistViewer_Open);
```

**Example from WarehouseViewer.user.js**:
```javascript
addToolsMenuItem("Depo ve Kaynaklar", WarehouseViewerHandler);
```

**Example from CURSOR_QuickTrader.js**:
```javascript
addToolsMenuItem(NAME, openModal);
```

## Menu Item Handler Pattern

### Basic Handler

```javascript
function myScriptHandler(event) {
    try {
        // Your code here
    } catch (e) {
        alert("Error: " + e.message);
    }
}
```

### Handler with Zone Check

```javascript
function myScriptHandler(event) {
    if (!game.gi.isOnHomzone()) {
        game.showAlert("Please go to your home zone first.");
        return;
    }
    
    // Your code here
}
```

### Handler with Modal Management

```javascript
function myScriptHandler(event) {
    // Close other modals
    $("div[role='dialog']:not(#myModal):visible").modal("hide");
    
    // Open your modal
    openMyModal();
}
```

## Implementation Details

### From Samples/0-common.js

```javascript
function addToolsMenuItem(name, fn, key, ctrl, shiftKey, altKey) {
    try {
        menu.addToolsItem(name, fn, key, ctrl, shiftKey, altKey);
    } catch (e) {
        alert(e);
    }
}
```

### From Samples/99-menu.js

```javascript
addToolsItem: function(name, fn, key, ctrl, shiftKey, altKey) {
    this.nativeMenu.getItemByName("Tools").submenu.addItem(this.createItem(name, fn));
    if (key) {
        this.addKeybBind(fn, key, ctrl, true, shiftKey, altKey);
    }
}
```

## Related Documentation

- [Modal Windows](modal-windows.md) - Creating modal windows
- [Chat Logging](chat-logging.md) - Logging to chat
- [Localization](localization.md) - Localizing text


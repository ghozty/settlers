# Chat Logging API

Complete reference for logging messages to the game chat.

## Alert Messages

### Using `game.showAlert()`

```javascript
game.showAlert(message)
```

**Description**: Shows an alert dialog to the user.

**Parameters**:
- `message` (string): Alert message text

**Usage**:
```javascript
game.showAlert("Please go to your home zone first.");
```

**Example from Specialist_Tasks.js**:
```javascript
if (!game.gi.isOnHomzone()) {
    game.showAlert("Please go to your home zone first.");
    return;
}
```

## Error Handling Pattern

### Using Alerts for Errors

```javascript
function safeOperation() {
    try {
        // Your code
    } catch (e) {
        game.showAlert("Error: " + e.message);
    }
}
```

**Example from CURSOR_QuickTrader.js**:
```javascript
if (!game || !game.gi || !game.gi.isOnHomzone()) {
    game.showAlert(getText('not_home'));
    return;
}
```

## Related Documentation

- [Modal Windows](modal-windows.md) - Creating modal windows
- [Menu Integration](menu-integration.md) - Adding menu items
- [Localization](localization.md) - Localizing text


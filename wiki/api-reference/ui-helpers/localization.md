# Localization API

Complete reference for localizing text in TSO client userscripts.

## Localization Method

### Using `loca.GetText()`

```javascript
loca.GetText(category, key)
```

**Parameters**:
- `category` (string): Localization category (e.g., "LAB", "RES")
- `key` (string): Localization key

**Returns**: Localized text string

**Usage**:
```javascript
var text = loca.GetText("LAB", "Close");
```

## Common Categories

### LAB Category

Used for UI labels and buttons:

```javascript
var closeText = loca.GetText("LAB", "Close");
var saveText = loca.GetText("LAB", "Save");
```

### RES Category

Used for resource names:

```javascript
var coinName = loca.GetText("RES", "Coin");
var ironOreName = loca.GetText("RES", "IronOre");
```

## Safe Localization Pattern

### With Fallback

```javascript
function getLocalizedText(category, key, fallback) {
    try {
        var text = loca.GetText(category, key);
        if (!text || text.indexOf("undefined") !== -1) {
            return fallback || key;
        }
        return text;
    } catch (e) {
        return fallback || key;
    }
}
```

**Example from WarehouseViewer.user.js**:
```javascript
var localName = resName;
try {
    localName = loca.GetText("RES", resName);
} catch (e) {}
if (!localName || localName.indexOf("undefined") !== -1) {
    localName = resName;
}
```

## Related Documentation

- [Modal Windows](modal-windows.md) - Creating modal windows
- [Menu Integration](menu-integration.md) - Adding menu items
- [Chat Logging](chat-logging.md) - Logging to chat
- [Resource Localization](../resources/resource-localization.md) - Resource localization


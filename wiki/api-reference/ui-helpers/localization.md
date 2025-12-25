# Localization API

Complete reference for localizing text in TSO client userscripts.

## Localization Method

### Using `loca.GetText()`

```javascript
loca.GetText(category, key)
```

**Parameters**:
- `category` (string): Localization category (e.g., "LAB", "RES", "BUF")
- `key` (string): Localization key

**Returns**: Localized text string

**Usage**:
```javascript
var text = loca.GetText("LAB", "Close");
```

## All Localization Categories

| Category | Description | Example Keys |
|----------|-------------|--------------|
| `RES` | Resource names | `Coin`, `IronOre`, `Fish`, `Wood` |
| `BUF` | Buff names | `ProductivityBuff`, `RecruitingBuff` |
| `BUFF` | Alternative buff names | Same as BUF |
| `ADV` | Adventure names | Adventure item names |
| `ITM` | Item names | General item names |
| `ITEM` | Alternative item names | Same as ITM |
| `LAB` | UI labels and buttons | `Close`, `Save`, `Cancel` |
| `TXT` | General text strings | Various UI text |
| `GUI` | GUI element text | Interface elements |
| `DEP` | Deposit names | Deposit type names |
| `BLD` | Building names | Building display names |

## Common Categories

### RES Category

Used for resource names:

```javascript
var coinName = loca.GetText("RES", "Coin");
var ironOreName = loca.GetText("RES", "IronOre");
var fishName = loca.GetText("RES", "Fish");
```

### BUF Category

Used for buff and booster names:

```javascript
var buffName = loca.GetText("BUF", "ProductivityBuff");
var boosterName = loca.GetText("BUF", "RecruitingBuff");
```

### ADV Category

Used for adventure names:

```javascript
var advName = loca.GetText("ADV", "Adventure_SomeName");
```

### LAB Category

Used for UI labels and buttons:

```javascript
var closeText = loca.GetText("LAB", "Close");
var saveText = loca.GetText("LAB", "Save");
```

### GUI Category

Used for GUI elements:

```javascript
var guiText = loca.GetText("GUI", "SomeGuiElement");
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

## Multi-Category Fallback Pattern

For items that may be localized in different categories (especially Star Menu items):

```javascript
function getLocalizedWithFallback(key) {
    var categories = ["RES", "BUF", "BUFF", "ADV", "ITM", "ITEM", "LAB", "TXT", "GUI", "DEP"];
    
    for (var i = 0; i < categories.length; i++) {
        try {
            var loc = loca.GetText(categories[i], key);
            if (loc && loc !== key && 
                loc.indexOf("undefined") === -1 && 
                loc.indexOf("{") === -1) {
                return loc;
            }
        } catch (e) { }
    }
    
    return key; // Return original key if no localization found
}
```

**When to use**: Star Menu items, buffs, and other items that may have localization in various categories.

## Checking for Invalid Localization

Localization may return invalid values. Always check for:

```javascript
function isValidLocalization(text, originalKey) {
    if (!text) return false;
    if (text === originalKey) return false;
    if (text.indexOf("undefined") !== -1) return false;
    if (text.indexOf("{") !== -1) return false; // Placeholder not resolved
    return true;
}
```

## Related Documentation

- [Modal Windows](modal-windows.md) - Creating modal windows
- [Menu Integration](menu-integration.md) - Adding menu items
- [Chat Logging](chat-logging.md) - Logging to chat
- [Resource Localization](../resources/resource-localization.md) - Resource localization
- [Star Menu Items](../items/star-menu-items.md) - Star Menu item localization


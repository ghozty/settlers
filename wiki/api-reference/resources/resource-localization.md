# Resource Localization Reference

Complete reference for localizing resource names.

## Localization Method

Resources are localized using the `loca.GetText()` function:

```javascript
var resourceName = loca.GetText("RES", codeName);
```

**Parameters**:
- Category: `"RES"` (for resources)
- Key: Resource code name (e.g., `"Coin"`, `"IronOre"`)

## Usage Pattern

```javascript
function getLocalizedResourceName(codeName) {
    try {
        var localName = loca.GetText("RES", codeName);
        if (!localName || localName.indexOf("undefined") !== -1) {
            return codeName; // Fallback to code name
        }
        return localName;
    } catch (e) {
        return codeName; // Fallback on error
    }
}
```

**Example from WarehouseViewer.user.js**:
```javascript
var localName = resName;
try { 
    localName = loca.GetText("RES", resName); 
} catch(e){}
if (!localName || localName.indexOf("undefined") !== -1) {
    localName = resName;
}
```

## Star Menu Resource Localization

For resources in Star Menu (Add Resource / Fill Deposit items), extract the resource name from `toString()` first:

```javascript
function getStarMenuResourceName(item) {
    // Extract resource name from toString() XML
    var itemStr = item.toString();
    var match = itemStr.match(/resourceName='([^']+)'/);
    
    if (match && match[1]) {
        var resourceName = match[1];
        // Now localize it
        try {
            var localName = loca.GetText("RES", resourceName);
            if (localName && localName.indexOf("undefined") === -1) {
                return localName;
            }
        } catch (e) { }
        return resourceName;
    }
    return null;
}
```

## Common Resource Localization Keys

All resources use the pattern: `RES.{CodeName}`

Examples:
- `RES.Coin` → "Coins" (or localized equivalent)
- `RES.IronOre` → "Iron Ore" (or localized equivalent)
- `RES.Bread` → "Bread" (or localized equivalent)
- `RES.Fish` → "Fish" (or localized equivalent)

## Error Handling

### Fallback Pattern

```javascript
function safeGetLocalizedResource(codeName) {
    try {
        var localName = loca.GetText("RES", codeName);
        
        // Check for undefined or invalid
        if (!localName || localName.indexOf("undefined") !== -1) {
            return codeName; // Fallback to code name
        }
        
        return localName;
    } catch (e) {
        return codeName; // Fallback on error
    }
}
```

## Related Documentation

- [Resource List](resource-list.md) - Complete resource code names
- [Resource Access](resource-access.md) - Resource retrieval methods
- [Resource Categories](resource-categories.md) - Resource categorization
- [Localization](../ui-helpers/localization.md) - General localization utilities
- [Star Menu Items](../items/star-menu-items.md) - Star Menu item API


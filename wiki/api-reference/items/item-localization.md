# Item Localization Reference

Complete reference for localizing tradable item names.

## Localization Method

Items are localized using the `loca.GetText()` function:

```javascript
var itemName = loca.GetText("RES", codeName);
```

**Parameters**:
- Category: `"RES"` (for resources/items)
- Key: Item code name (e.g., `"Coin"`, `"IronOre"`)

## Multiple Category Fallback

For Star Menu items and buffs, try multiple categories:

```javascript
function getLocalizedItemName(codeName) {
    var categories = ["RES", "BUF", "BUFF", "ADV", "ITM", "ITEM", "LAB", "TXT", "GUI"];
    
    for (var i = 0; i < categories.length; i++) {
        try {
            var localName = loca.GetText(categories[i], codeName);
            if (localName && localName !== codeName && 
                localName.indexOf("undefined") === -1 &&
                localName.indexOf("{") === -1) {
                return localName;
            }
        } catch (e) { }
    }
    
    return codeName; // Fallback to code name
}
```

## Usage Pattern

```javascript
function getLocalizedItemName(codeName) {
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

## Item Display Names

Items have both code names and display names:

| Code Name | Display Name | Localization Key |
|-----------|--------------|------------------|
| `Coin` | Coins | `RES.Coin` |
| `IronOre` | Iron Ore | `RES.IronOre` |
| `Gold` | Gold | `RES.Gold` |
| `Bread` | Bread | `RES.Bread` |

## Error Handling

### Fallback Pattern

```javascript
function safeGetLocalizedItem(codeName) {
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

## Star Menu Item Localization

For Star Menu items (buffs, deposits, resources), use the `toString()` method to extract resource names:

```javascript
function getStarMenuItemName(item) {
    var def = item.GetBuffDefinition();
    var codeName = def.GetName_string();
    
    // For Add Resource / Fill Deposit items
    if (codeName.toLowerCase().indexOf("addresource") !== -1 ||
        codeName.toLowerCase().indexOf("filldeposit") !== -1) {
        
        // Extract resource name from toString()
        var itemStr = item.toString();
        var match = itemStr.match(/resourceName='([^']+)'/);
        
        if (match && match[1]) {
            var resourceName = match[1];
            var localName = loca.GetText("RES", resourceName);
            return (localName && localName.indexOf("undefined") === -1) ? localName : resourceName;
        }
    }
    
    // For other items, try multiple categories
    return getLocalizedItemName(codeName);
}
```

## Related Documentation

- [Tradable Items](tradable-items.md) - Complete tradable items list
- [Item Categories](item-categories.md) - Item categorization
- [Item Prices](item-prices.md) - Market price reference
- [Localization](../ui-helpers/localization.md) - General localization utilities
- [Star Menu Items](star-menu-items.md) - Star Menu item API


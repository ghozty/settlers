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

## Related Documentation

- [Tradable Items](tradable-items.md) - Complete tradable items list
- [Item Categories](item-categories.md) - Item categorization
- [Item Prices](item-prices.md) - Market price reference
- [Localization](../ui-helpers/localization.md) - General localization utilities


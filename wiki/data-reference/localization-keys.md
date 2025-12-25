# Localization Keys Reference

Complete reference of localization categories and common keys.

## Localization Method

```javascript
loca.GetText(category, key)
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

## LAB Category

UI labels and buttons:

| Key | Description |
|-----|-------------|
| `Close` | Close button text |
| `Save` | Save button text |
| `Cancel` | Cancel button text |
| `ToggleOptionsPanel` | Options panel title |

## RES Category

Resource names (see [Resource List](../api-reference/resources/resource-list.md) for complete list):

| Key | Description |
|-----|-------------|
| `Coin` | Coins (Star Menu) |
| `Money` | Coins (Warehouse) |
| `IronOre` | Iron Ore |
| `Gold` | Gold |
| `Fish` | Fish |
| `Wood` | Pinewood |

## BUF / BUFF Category

Buff and booster names:

| Key | Description |
|-----|-------------|
| `ProductivityBuff` | Productivity buff |
| `RecruitingBuff` | Recruiting buff |
| `ProvisionerBuff` | Provisioner buff |
| `BookbinderBuff` | Bookbinder buff |
| `AreaBuff` | Area buff |
| `MultiplierBuff` | Multiplier buff |

## ADV Category

Adventure names:

| Key Pattern | Description |
|-------------|-------------|
| `Adventure_*` | Adventure item names |

## Usage Patterns

### Single Category Lookup

```javascript
var closeText = loca.GetText("LAB", "Close");
var coinName = loca.GetText("RES", "Coin");
var buffName = loca.GetText("BUF", "ProductivityBuff");
```

### Multi-Category Fallback

For items that may be in different categories:

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
    
    return key;
}
```

## Related Documentation

- [Localization API](../api-reference/ui-helpers/localization.md) - Complete localization reference
- [Resource Localization](../api-reference/resources/resource-localization.md) - Resource localization
- [Item Localization](../api-reference/items/item-localization.md) - Item localization
- [Star Menu Items](../api-reference/items/star-menu-items.md) - Star Menu item localization

# Item Categories Reference

Complete categorization of tradable items by their function and purpose.

## Category System

Tradable items are categorized by their primary function in the game. This categorization helps organize item lists and filter items by type.

## Advanced Resources (23 items)

High-value resources and processed materials.

**Examples**: Coin, Gold, Iron, Steel, Intermediate Paper, Longbows, Steel Swords

## Basic Resources (6 items)

Basic raw materials and low-value items.

**Examples**: Fish, Guild Coins, Map Fragment, Pinewood, Pinewood Planks, Stones

## Military (20 items)

Items used for military operations and advanced construction.

**Examples**: Advanced Paper, Advanced Tools, Cannons, Carriages, Crossbows, Gunpowder, Titanium

## Other (2 items)

Special collectible items.

**Examples**: Adamantium Ore, Banner

## Processed Resources (13 items)

Basic processed materials and food items.

**Examples**: Bows, Bread, Brew, Bronze, Coal, Flour, Tools, Water, Wheat

## Special (12 items)

Special high-value items and rare materials.

**Examples**: Arquebuse, Battle Horse, Mahogany Planks, Platinum, Mortar, Wagon, Wool

## Categorization Pattern

### From CURSOR_QuickTrader.js

```javascript
var CATEGORY_MAP = {
    "Coin": "Advanced Resources",
    "Gold": "Advanced Resources",
    "GoldOre": "Advanced Resources",
    "RealWood": "Advanced Resources",
    "RealPlank": "Advanced Resources",
    "Horse": "Advanced Resources",
    "IntermediatePaper": "Advanced Resources",
    "Iron": "Advanced Resources",
    "IronOre": "Advanced Resources",
    "IronSword": "Advanced Resources",
    "Longbow": "Advanced Resources",
    "Marble": "Advanced Resources",
    "Meat": "Advanced Resources",
    "Letter": "Advanced Resources",
    "Sausage": "Advanced Resources",
    "Steel": "Advanced Resources",
    "SteelSword": "Advanced Resources",
    "Fish": "Basic Resources",
    "GuildCoins": "Basic Resources",
    "MapPart": "Basic Resources",
    "Wood": "Basic Resources",
    "Plank": "Basic Resources",
    "Stone": "Basic Resources",
    "AdvancedPaper": "Military",
    "AdvancedTools": "Military",
    // ... etc
};
```

### Filter Items by Category

```javascript
function getItemsByCategory(category) {
    var filtered = [];
    
    for (var codeName in CATEGORY_MAP) {
        if (CATEGORY_MAP[codeName] === category) {
            filtered.push(codeName);
        }
    }
    
    return filtered;
}

// Usage
var advancedResources = getItemsByCategory("Advanced Resources");
```

## Related Documentation

- [Tradable Items](tradable-items.md) - Complete tradable items list
- [Item Prices](item-prices.md) - Market price reference
- [Item Localization](item-localization.md) - Item name localization


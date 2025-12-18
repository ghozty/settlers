# Resource Categories Reference

Complete categorization of all resources by their function and purpose.

## Category System

Resources are categorized by their primary function in the game. This categorization helps organize resource lists and filter resources by type.

## Building Materials

Resources used for building construction and upgrades.

| Code Name | Description |
|-----------|-------------|
| `AdvancedTools` | Advanced tools |
| `Money` | Coins |
| `StarCoins` | Tokens |
| `GuildCoins` | Guild coins |
| `ExoticWoodPlank` | Exotic wood plank |
| `Granite` | Granite |
| `Grout` | Grout |
| `HardWoodPlank` | Hard wood plank |
| `MahoganyPlank` | Mahogany plank |
| `Marble` | Marble |
| `Oil` | Oil |
| `Plank` | Pinewood plank |
| `Stone` | Stone |
| `Tools` | Basic tools |
| `RealWood` | Real wood |
| `RealPlank` | Real plank |
| `RealStone` | Real stone |

## Food

Resources consumed by population.

| Code Name | Description |
|-----------|-------------|
| `Bread` | Bread |
| `Brew` | Brew/Beer |
| `Fish` | Fish |
| `Sausage` | Sausage |
| `Meat` | Meat |

## Resources (Ores & Raw Materials)

Raw materials and ores extracted from deposits.

| Code Name | Description |
|-----------|-------------|
| `Bronze` | Bronze (processed) |
| `BronzeOre` | Bronze ore (raw) |
| `Carriage` | Carriage |
| `Coal` | Coal |
| `ExoticWood` | Exotic wood |
| `Flour` | Flour |
| `Gold` | Gold (processed) |
| `GoldOre` | Gold ore (raw) |
| `Gunpowder` | Gunpowder |
| `HardWood` | Hard wood |
| `Iron` | Iron (processed) |
| `IronOre` | Iron ore (raw) |
| `MagicBean` | Magic bean |
| `MagicBeanStalk` | Magic bean stalk |
| `MahoganyWood` | Mahogany wood |
| `Oilseed` | Oilseed |
| `Wood` | Pinewood |
| `Platinum` | Platinum (processed) |
| `PlatinumOre` | Platinum ore (raw) |
| `SaddleCloth` | Saddle cloth |
| `Salpeter` | Saltpeter |
| `Steel` | Steel (processed) |
| `Titanium` | Titanium (processed) |
| `TitaniumOre` | Titanium ore (raw) |
| `Wagon` | Wagon |
| `Water` | Water |
| `Corn` | Corn/Wheat |
| `Wheel` | Wheel |
| `Wool` | Wool |
| `WoolenCloth` | Woolen cloth |
| `Pumpkin` | Pumpkin (event) |

## Science

Resources used for science and research.

| Code Name | Description |
|-----------|-------------|
| `AdvancedPaper` | Advanced paper |
| `BookFitting` | Book fitting |
| `IntermediatePaper` | Intermediate paper |
| `Nib` | Nib |
| `Printingpressletter` | Printing press letter |
| `Paper` | Simple paper |
| `BookManuscript` | Book manuscript |
| `BookTome` | Book tome |
| `BookCodex` | Book codex |
| `SimplePaper` | Simple paper |

## Weapons

Resources used for military equipment.

| Code Name | Description |
|-----------|-------------|
| `Archebuse` | Archebuse |
| `Bow_2` | Attack bow |
| `Pike` | Attack pike |
| `Saber` | Attack saber |
| `BattleHorse` | Battle horse |
| `Bow` | Bow |
| `BronzeSword` | Bronze sword |
| `Cannon` | Cannon |
| `Crossbow` | Crossbow |
| `DamasceneSword` | Damascene sword |
| `Crossbow_2` | Heavy crossbow |
| `Lance` | Heavy lance |
| `Mace` | Heavy mace |
| `Horse` | Horse |
| `IronSword` | Iron sword |
| `Longbow` | Longbow |
| `Mortar` | Mortar |
| `PlatinumSword` | Platinum sword |
| `SteelSword` | Steel sword |

## Categorization Patterns

### From WarehouseViewer.user.js

```javascript
var RESOURCE_DB = {
    // Building Materials
    "AdvancedTools": "Building Materials",
    "Money": "Building Materials",
    "StarCoins": "Building Materials",
    "GuildCoins": "Building Materials",
    "ExoticWoodPlank": "Building Materials",
    "Granite": "Building Materials",
    "Grout": "Building Materials",
    "HardWoodPlank": "Building Materials",
    "MahoganyPlank": "Building Materials",
    "Marble": "Building Materials",
    "Oil": "Building Materials",
    "Plank": "Building Materials",
    "Stone": "Building Materials",
    "Tools": "Building Materials",
    "RealWood": "Building Materials",
    "RealPlank": "Building Materials",
    "RealStone": "Building Materials",
    
    // Food
    "Bread": "Food",
    "Brew": "Food",
    "Fish": "Food",
    "Sausage": "Food",
    "Meat": "Food",
    
    // Resource
    "Bronze": "Resource",
    "BronzeOre": "Resource",
    "Carriage": "Resource",
    "Coal": "Resource",
    // ... etc
};
```

### Filter Resources by Category

```javascript
function getResourcesByCategory(category) {
    var filtered = [];
    var playerID = game.gi.mCurrentPlayer.GetPlayerId();
    var zone = game.gi.mCurrentPlayerZone;
    var resourcesObj = zone.GetResourcesForPlayerID(playerID);
    
    for (var resName in RESOURCE_DB) {
        if (RESOURCE_DB[resName] === category) {
            var resData = resourcesObj.GetPlayerResource(resName);
            if (resData && typeof resData.amount !== 'undefined' && resData.amount > 0) {
                filtered.push({
                    name: resName,
                    amount: resData.amount
                });
            }
        }
    }
    
    return filtered;
}
```

## Related Documentation

- [Resource List](resource-list.md) - Complete resource code names
- [Resource Access](resource-access.md) - Resource retrieval methods
- [Resource Localization](resource-localization.md) - Localization keys


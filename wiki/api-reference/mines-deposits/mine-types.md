# Mine Types Reference

Complete reference of mine types, their resources, and building mappings.

## Real Mine Types

Real mines are resource extraction buildings (excludes farms and wells).

| Mine Type | Resource | Building Name | Building ID |
|-----------|----------|--------------|-------------|
| Iron Mine | Iron Ore | `IronMine` | 50 |
| Coal Mine | Coal | `CoalMine` | 37 |
| Bronze Mine | Bronze Ore | `BronzeMine` | 36 |
| Gold Mine | Gold Ore | `GoldMine` | 46 |
| Titanium Mine | Titanium Ore | `TitaniumMine` | 69 |
| Salpeter Mine | Saltpeter | `SalpeterMine` | 63 |

## Quarry Types

Quarries extract stone materials (no building constructed, just extraction):

| Quarry Type | Resource | Building Name | Building ID |
|-------------|----------|--------------|-------------|
| Marble Quarry | Marble | - | - |
| Stone Quarry | Stone | - | - |
| Granite Quarry | Granite | - | - |

## Excluded Types

The following are **NOT** considered real mines:

| Type | Resource | Reason |
|------|----------|--------|
| Farm | Corn | Food production, not mining |
| Well | Water | Water extraction, not mining |

## Mine Type Constants

### From Specialist_Tasks.js

```javascript
// Real mine type names (excludes Corn and Water)
var REAL_MINE_TYPES = [
    "IronOre", "Coal", "BronzeOre", "GoldOre", 
    "TitaniumOre", "Salpeter", "Marble", "Stone", "Granite"
];

var ALL_MINE_TYPES = [
    "IronOre", "Coal", "BronzeOre", "GoldOre", 
    "TitaniumOre", "Salpeter", "Marble", "Stone", "Granite"
];
```

## Usage Examples

### Filter Real Mines

```javascript
function getRealMines() {
    var realMines = [];
    var zone = game.gi.mCurrentPlayerZone;
    var deposits = zone.mStreetDataMap.mDepositContainer;
    
    var REAL_MINE_TYPES = [
        "IronOre", "Coal", "BronzeOre", "GoldOre", 
        "TitaniumOre", "Salpeter", "Marble", "Stone", "Granite"
    ];
    
    deposits.forEach(function(deposit) {
        try {
            var depositName = deposit.GetName_string();
            
            // Filter: Only real mines (exclude Corn, Water)
            if (REAL_MINE_TYPES.indexOf(depositName) >= 0) {
                realMines.push({
                    name: depositName,
                    grid: deposit.GetGrid(),
                    amount: deposit.GetAmount()
                });
            }
        } catch (e) { }
    });
    
    return realMines;
}
```

## Related Documentation

- [Deposit Types](deposit-types.md) - Deposit type definitions
- [Depleted States](depleted-states.md) - Depleted mine detection
- [Mine Building Mapping](mine-building-mapping.md) - Mine to building mapping


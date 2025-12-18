# Depleted States Reference

Complete reference for detecting and handling depleted deposits.

## Depleted Deposit Detection

### Using `IsADepletedDeposit()`

```javascript
if (zone.mStreetDataMap.IsADepletedDeposit(building)) {
    // Building is a depleted deposit
}
```

**Signature**: `IsADepletedDeposit(building: cBuilding): Boolean`

**Returns**:
- `true`: Building is a depleted deposit
- `false`: Building is not depleted or not a deposit

### Using Building Name Pattern

All depleted deposits follow the pattern: `MineDepletedDeposit[ResourceType]`

```javascript
var name = building.GetBuildingName_string();
if (name.indexOf("MineDepletedDeposit") === 0) {
    // Building is a depleted deposit
    var resourceType = name.replace("MineDepletedDeposit", "");
    // Example: "MineDepletedDepositIronOre" → "IronOre"
}
```

## Depleted Deposit Names

| Depleted Name | Original Resource | Rebuild To | Building ID |
|---------------|-------------------|------------|-------------|
| `MineDepletedDepositCorn` | Corn (Farm) | Farmfield | 43 |
| `MineDepletedDepositWater` | Water (Well) | Well | 72 |
| `MineDepletedDepositBronzeOre` | Bronze Ore | BronzeMine | 36 |
| `MineDepletedDepositCoal` | Coal | CoalMine | 37 |
| `MineDepletedDepositGoldOre` | Gold Ore | GoldMine | 46 |
| `MineDepletedDepositIronOre` | Iron Ore | IronMine | 50 |
| `MineDepletedDepositTitaniumOre` | Titanium Ore | TitaniumMine | 69 |
| `MineDepletedDepositSalpeter` | Saltpeter | SalpeterMine | 63 |
| `MineDepletedDepositMarble` | Marble | - | - |
| `MineDepletedDepositStone` | Stone | - | - |

## Resource Type Extraction

### Extract Resource Type from Name

```javascript
function extractResourceType(buildingName) {
    if (buildingName.indexOf("MineDepletedDeposit") === 0) {
        return buildingName.replace("MineDepletedDeposit", "");
    }
    return buildingName;
}

// Usage
var name = "MineDepletedDepositIronOre";
var resourceType = extractResourceType(name); // "IronOre"
```

**Example from Specialist_Tasks.js**:
```javascript
function _extractResourceType(buildingName) {
    if (buildingName.indexOf("MineDepletedDeposit") === 0) {
        return buildingName.replace("MineDepletedDeposit", "");
    }
    return buildingName;
}
```

## Finding Depleted Deposits

### Pattern: Find All Depleted Deposits

```javascript
function findDepletedDeposits() {
    var depleted = [];
    var zone = game.gi.mCurrentPlayerZone;
    var buildings = zone.mStreetDataMap.mBuildingContainer;
    
    buildings.forEach(function(building) {
        try {
            if (zone.mStreetDataMap.IsADepletedDeposit(building)) {
                var buildingName = building.GetBuildingName_string();
                var grid = building.GetGrid();
                var resourceType = _extractResourceType(buildingName);
                
                depleted.push({
                    buildingName: buildingName,
                    resourceType: resourceType,
                    grid: grid,
                    building: building
                });
            }
        } catch (e) { }
    });
    
    return depleted;
}
```

### Pattern: Categorize Depleted Deposits

```javascript
function categorizeDepletedDeposits() {
    var categories = {
        farms: [],
        wells: [],
        mines: []
    };
    
    var zone = game.gi.mCurrentPlayerZone;
    var buildings = zone.mStreetDataMap.mBuildingContainer;
    
    buildings.forEach(function(building) {
        try {
            if (zone.mStreetDataMap.IsADepletedDeposit(building)) {
                var name = building.GetBuildingName_string();
                
                if (name === "MineDepletedDepositCorn") {
                    categories.farms.push(building);
                } else if (name === "MineDepletedDepositWater") {
                    categories.wells.push(building);
                } else if (name.indexOf("MineDepletedDeposit") === 0) {
                    categories.mines.push(building);
                }
            }
        } catch (e) { }
    });
    
    return categories;
}
```

## Rebuilding Depleted Deposits

### Rebuild Pattern

```javascript
function rebuildDepletedDeposit(building) {
    var name = building.GetBuildingName_string();
    var grid = building.GetGrid();
    var buildID = 0;
    
    // Map depleted name to building ID
    if (name === "MineDepletedDepositCorn") {
        buildID = 43; // Farmfield
    } else if (name === "MineDepletedDepositWater") {
        buildID = 72; // Well
    } else if (name === "MineDepletedDepositIronOre") {
        buildID = 50; // IronMine
    } else if (name === "MineDepletedDepositBronzeOre") {
        buildID = 36; // BronzeMine
    } else if (name === "MineDepletedDepositGoldOre") {
        buildID = 46; // GoldMine
    } else if (name === "MineDepletedDepositCoal") {
        buildID = 37; // CoalMine
    } else if (name === "MineDepletedDepositTitaniumOre") {
        buildID = 69; // TitaniumMine
    } else if (name === "MineDepletedDepositSalpeter") {
        buildID = 63; // SalpeterMine
    }
    
    if (buildID > 0) {
        game.gi.SendServerAction(50, buildID, grid, 0, null);
    }
}
```

## Related Documentation

- [Mine Types](mine-types.md) - Mine type definitions
- [Deposit Types](deposit-types.md) - Deposit type definitions
- [Mine Building Mapping](mine-building-mapping.md) - Mine to building mapping


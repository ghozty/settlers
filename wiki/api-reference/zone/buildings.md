# Zone Buildings API

The Buildings container provides access to all buildings on the current zone. Buildings can be production buildings, mines, residences, decorations, or depleted deposits.

## Access Path

```javascript
var zone = game.gi.mCurrentPlayerZone;
var buildings = zone.mStreetDataMap.mBuildingContainer;
// OR
var buildings = zone.mStreetDataMap.GetBuildings_vector();
```

Both methods return the same buildings, but `GetBuildings_vector()` returns a Vector object.

## Container Properties

### `mBuildingContainer`

**Type**: `Vector<cBuilding>`  
**Description**: Direct access to building container (vector-like object).

**Usage**:
```javascript
var buildings = zone.mStreetDataMap.mBuildingContainer;

buildings.forEach(function(building) {
    // Process building
});
```

**Note**: This is a vector-like object that supports `forEach()` iteration.

## Iteration Patterns

### Basic Iteration

```javascript
var zone = game.gi.mCurrentPlayerZone;
var buildings = zone.mStreetDataMap.mBuildingContainer;

buildings.forEach(function(building) {
    try {
        var name = building.GetBuildingName_string();
        var grid = building.GetGrid();
        // Process building
    } catch (e) {
        // Skip problematic buildings
    }
});
```

### Filtering Buildings

```javascript
function findBuildingsByType(buildingName) {
    var found = [];
    var zone = game.gi.mCurrentPlayerZone;
    var buildings = zone.mStreetDataMap.mBuildingContainer;
    
    buildings.forEach(function(building) {
        try {
            if (building.GetBuildingName_string() === buildingName) {
                found.push(building);
            }
        } catch (e) { }
    });
    
    return found;
}

// Usage
var bookbinders = findBuildingsByType("Bookbinder");
var farms = findBuildingsByType("Farmfield");
```

### Finding Depleted Deposits

```javascript
function findDepletedDeposits() {
    var depleted = [];
    var zone = game.gi.mCurrentPlayerZone;
    var buildings = zone.mStreetDataMap.mBuildingContainer;
    
    buildings.forEach(function(building) {
        try {
            if (zone.mStreetDataMap.IsADepletedDeposit(building)) {
                depleted.push({
                    building: building,
                    name: building.GetBuildingName_string(),
                    grid: building.GetGrid()
                });
            }
        } catch (e) { }
    });
    
    return depleted;
}
```

## Building Access Methods

### `GetBuildingFromGridPosition(grid)`

**Signature**: `GetBuildingFromGridPosition(grid: int): cBuilding | null`

**Description**: Gets the building at a specific grid position.

**Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `grid` | `int` | Grid position on the map |

**Returns**:
- `cBuilding`: Building at position
- `null`: No building at position

**Usage**:
```javascript
var building = zone.GetBuildingFromGridPosition(grid);

if (building) {
    var name = building.GetBuildingName_string();
    // Building exists
} else {
    // No building at this position
}
```

**Performance**: Fast - uses internal map structure for O(1) lookup.

### `GetBuildingByGridPos(grid)`

**Signature**: `GetBuildingByGridPos(grid: int): cBuilding | null`

**Description**: Alternative method to get building at grid position (via mStreetDataMap).

**Usage**:
```javascript
var building = zone.mStreetDataMap.GetBuildingByGridPos(grid);
```

**Note**: Equivalent to `zone.GetBuildingFromGridPosition(grid)`.

## Depleted Deposit Detection

### `IsADepletedDeposit(building)`

**Signature**: `IsADepletedDeposit(building: cBuilding): Boolean`

**Description**: Checks if a building is a depleted deposit (ruin).

**Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `building` | `cBuilding` | Building to check |

**Returns**:
- `true`: Building is a depleted deposit
- `false`: Building is not depleted or not a deposit

**Usage**:
```javascript
buildings.forEach(function(building) {
    if (zone.mStreetDataMap.IsADepletedDeposit(building)) {
        var name = building.GetBuildingName_string();
        // Name format: "MineDepletedDeposit[ResourceType]"
        // Examples:
        // - "MineDepletedDepositCorn" (depleted farm)
        // - "MineDepletedDepositWater" (dried-up well)
        // - "MineDepletedDepositIronOre" (depleted iron mine)
    }
});
```

**Depleted Deposit Name Patterns**:

All depleted deposits follow the pattern: `MineDepletedDeposit[ResourceType]`

**Common Depleted Deposit Names**:

| Name | Resource Type | Rebuild To |
|------|---------------|------------|
| `MineDepletedDepositCorn` | Corn (Farm) | Farmfield (43) |
| `MineDepletedDepositWater` | Water (Well) | Well (72) |
| `MineDepletedDepositIronOre` | Iron Ore | IronMine (50) |
| `MineDepletedDepositBronzeOre` | Bronze Ore | BronzeMine (36) |
| `MineDepletedDepositGoldOre` | Gold Ore | GoldMine (46) |
| `MineDepletedDepositCoal` | Coal | CoalMine (37) |
| `MineDepletedDepositStone` | Stone | - (Quarry) |
| `MineDepletedDepositMarble` | Marble | - (Quarry) |

**Example from CURSOR_AutoFarms.js**:
```javascript
buildings.forEach(function (bld) {
    try {
        var name = bld.GetBuildingName_string();
        var grid = bld.GetGrid();
        var buildID = 0;
        var typeName = "";

        if (name === AUTO_REBUILD_CFG.FARM_RUIN_NAME) {
            // "MineDepletedDepositCorn"
            buildID = AUTO_REBUILD_CFG.FARM_BUILD_ID; // 43
            typeName = "Farm";
        } else if (name === AUTO_REBUILD_CFG.WELL_RUIN_NAME) {
            // "MineDepletedDepositWater"
            buildID = AUTO_REBUILD_CFG.WELL_BUILD_ID; // 72
            typeName = "Well";
        }

        if (buildID > 0) {
            buildList.push({ id: buildID, grid: grid, name: typeName });
        }
    } catch (innerErr) { }
});
```

**Example from Specialist_Tasks.js**:
```javascript
buildings.forEach(function (building) {
    try {
        if (zone.mStreetDataMap.IsADepletedDeposit(building)) {
            var buildingName = building.GetBuildingName_string();
            var grid = building.GetGrid();
            var resourceType = _extractResourceType(buildingName);
            
            // Extract resource type from name
            // "MineDepletedDepositIronOre" -> "IronOre"
            
            if (!data.depletedMines[resourceType]) {
                data.depletedMines[resourceType] = [];
            }
            data.depletedMines[resourceType].push({
                buildingName: buildingName, 
                grid: grid
            });
        }
    } catch (e) { }
});
```

## Common Patterns

### Pattern: Count Buildings by Type

```javascript
function countBuildingsByType(buildingName) {
    var count = 0;
    var zone = game.gi.mCurrentPlayerZone;
    var buildings = zone.mStreetDataMap.mBuildingContainer;
    
    buildings.forEach(function(building) {
        try {
            if (building.GetBuildingName_string() === buildingName) {
                count++;
            }
        } catch (e) { }
    });
    
    return count;
}
```

### Pattern: Find All Depleted Deposits

```javascript
function getAllDepletedDeposits() {
    var depleted = {
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
                    depleted.farms.push(building);
                } else if (name === "MineDepletedDepositWater") {
                    depleted.wells.push(building);
                } else if (name.indexOf("MineDepletedDeposit") === 0) {
                    depleted.mines.push(building);
                }
            }
        } catch (e) { }
    });
    
    return depleted;
}
```

### Pattern: Check Building at Position

```javascript
function checkBuildingAtGrid(grid) {
    var zone = game.gi.mCurrentPlayerZone;
    var building = zone.GetBuildingFromGridPosition(grid);
    
    if (building) {
        return {
            exists: true,
            name: building.GetBuildingName_string(),
            level: building.GetLevel(),
            isDepleted: zone.mStreetDataMap.IsADepletedDeposit(building)
        };
    }
    
    return { exists: false };
}
```

## Performance Notes

- `mBuildingContainer.forEach()` is efficient - direct iteration
- `GetBuildingFromGridPosition()` is O(1) - uses internal map
- `IsADepletedDeposit()` is fast - boolean check
- Building iteration is typically fast even with many buildings
- Always use try-catch when iterating - some buildings may be invalid

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Cannot read property 'mBuildingContainer'` | Zone not loaded | Check zone exists |
| `building.GetBuildingName_string is not a function` | Invalid building object | Use try-catch in iteration |
| `IsADepletedDeposit is not a function` | mStreetDataMap invalid | Verify zone structure |

### Error Handling Pattern

```javascript
function safeIterateBuildings(callback) {
    try {
        if (!game.gi || !game.gi.mCurrentPlayerZone) {
            throw new Error("Zone not available");
        }
        
        var zone = game.gi.mCurrentPlayerZone;
        var buildings = zone.mStreetDataMap.mBuildingContainer;
        
        buildings.forEach(function(building) {
            try {
                callback(building);
            } catch (buildingErr) {
                // Skip problematic building, continue with others
                console.warn("Skipped building:", buildingErr);
            }
        });
    } catch (e) {
        game.showAlert("Building iteration error: " + e.message);
    }
}
```

## Related Documentation

- [Building Methods](../buildings/building-methods.md) - cBuilding class methods
- [Building IDs](../buildings/building-ids.md) - Building type IDs
- [Depleted States](../mines-deposits/depleted-states.md) - Depleted deposit detection
- [Zone Overview](zone-overview.md) - Zone object structure

## Examples from Active Scripts

### CURSOR_AutoFarms.js - Scan for Depleted Farms/Wells

```javascript
var zone = swmmo.application.mGameInterface.mCurrentPlayerZone;
var buildings = zone.mStreetDataMap.mBuildingContainer;
var buildList = [];

buildings.forEach(function (bld) {
    try {
        var name = bld.GetBuildingName_string();
        var grid = bld.GetGrid();
        var buildID = 0;
        var typeName = "";

        if (name === AUTO_REBUILD_CFG.FARM_RUIN_NAME) {
            buildID = AUTO_REBUILD_CFG.FARM_BUILD_ID;
            typeName = "Farm";
        } else if (name === AUTO_REBUILD_CFG.WELL_RUIN_NAME) {
            buildID = AUTO_REBUILD_CFG.WELL_BUILD_ID;
            typeName = "Well";
        }

        if (buildID > 0) {
            buildList.push({ id: buildID, grid: grid, name: typeName });
        }
    } catch (innerErr) { }
});
```

### Specialist_Tasks.js - Collect Depleted Mines

```javascript
var buildings = zone.mStreetDataMap.mBuildingContainer;

buildings.forEach(function (building) {
    try {
        if (zone.mStreetDataMap.IsADepletedDeposit(building)) {
            var buildingName = building.GetBuildingName_string();
            var grid = building.GetGrid();
            var resourceType = _extractResourceType(buildingName);
            
            if (!data.depletedMines[resourceType]) {
                data.depletedMines[resourceType] = [];
            }
            data.depletedMines[resourceType].push({
                buildingName: buildingName, 
                grid: grid
            });
        }
    } catch (e) { }
});
```

### CURSOR_AutoFarms.js - Find Bookbinder

```javascript
function _checkBinder(zone, buildings) {
    var binderBuilding = null;
    
    buildings.forEach(function (bld) {
        if (bld.GetBuildingName_string() === "Bookbinder") {
            binderBuilding = bld;
        }
    });
    
    if (!binderBuilding) {
        return; // No Bookbinder on this zone
    }
    
    // Process Bookbinder
    var queue = zone.GetProductionQueue(2);
    // ... production checking
}
```


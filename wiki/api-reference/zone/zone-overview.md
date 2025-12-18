# Zone API Overview

The Zone object (`cZone`) represents a game zone (island) and provides access to all entities within it: buildings, deposits, specialists, resources, and production queues.

## Access Path

```javascript
var zone = game.gi.mCurrentPlayerZone;
// OR
var zone = swmmo.application.mGameInterface.mCurrentPlayerZone;
```

## Zone Object Structure

```
cZone
├── mStreetDataMap (cStreetDataMap)
│   ├── mBuildingContainer (Vector<cBuilding>)
│   ├── mDepositContainer (Map)
│   ├── GetBuildings_vector()
│   ├── GetBuildingByGridPos(grid)
│   └── IsADepletedDeposit(building)
├── GetSpecialists_vector()
├── GetProductionQueue(type)
├── GetBuildingFromGridPosition(grid)
├── GetResourcesForPlayerID(playerID)
├── ScrollToGrid(grid)
└── GetZoneID() (if available)
```

## Core Properties

### `mStreetDataMap`

**Type**: `cStreetDataMap`  
**Description**: Container for all map entities (buildings, deposits).

**Access**:
```javascript
var streetDataMap = zone.mStreetDataMap;
```

**Sub-properties**:
- `mBuildingContainer`: Vector of all buildings
- `mDepositContainer`: Map of all deposits

**Related**: See [Buildings](buildings.md) and [Deposits](deposits.md) for detailed documentation.

## Core Methods

### `GetSpecialists_vector()`

**Signature**: `GetSpecialists_vector(): Vector<cSpecialist>`

**Description**: Gets all specialists (Explorers, Geologists, Generals, Marshals) in the zone.

**Returns**: Vector of `cSpecialist` objects

**Usage**:
```javascript
var specialists = zone.GetSpecialists_vector();

specialists.forEach(function(specialist) {
    // Filter by player
    if (specialist.getPlayerID() === -1) return;
    
    // Filter by type
    var baseType = specialist.GetBaseType();
    // 1 = Explorer, 2 = Geologist, 3 = General, 4 = Marshal
    
    // Process specialist
});
```

**Example from Specialist_Tasks.js**:
```javascript
var zone = swmmo.application.mGameInterface.mCurrentPlayerZone;
var specialists = zone.GetSpecialists_vector();

specialists.forEach(function (specialist) {
    try {
        var baseType = specialist.GetBaseType();
        var task = specialist.GetTask();
        var playerID = specialist.getPlayerID();
        
        if (playerID === -1) return; // Skip non-player specialists
        
        var isIdle = (task === null);
        // ... process specialist
    } catch (e) { }
});
```

**Performance**: Fast - cached vector, safe to call frequently.

**Related**: See [Specialists](specialists.md) for detailed specialist methods.

### `GetProductionQueue(type)`

**Signature**: `GetProductionQueue(type: int): cTimedProductionQueue | null`

**Description**: Gets a production queue by type.

**Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `type` | `int` | Production queue type (0 = Default, 2 = Science, etc.) |

**Returns**:
- `cTimedProductionQueue`: Production queue object
- `null`: Queue not found or doesn't exist

**Production Queue Types**:

| Type ID | Queue Name | Buildings |
|---------|------------|-----------|
| 0 | Default | Various production buildings |
| 1 | - | Reserved/Unused |
| 2 | Science | Bookbinder, AdventureBookbinder |
| 3+ | Other | Culture buildings, etc. |

**Usage**:
```javascript
// Get Science production queue (Bookbinder)
var queue = zone.GetProductionQueue(2);

if (queue) {
    var productions = queue.mTimedProductions_vector;
    if (productions && productions.length > 0) {
        var item = productions[0];
        // Check production status
    }
}
```

**Example from CURSOR_AutoFarms.js**:
```javascript
function _checkBinder(zone, buildings) {
    // Get Production Queue (Type 2 for Bookbinder/Science)
    var queue = zone.GetProductionQueue(AUTO_REBUILD_CFG.BINDER_PRODUCTION_TYPE);
    
    if (!queue) {
        _logRebuild("Binder: Queue not found.");
        return;
    }
    
    var hasProduction = queue.mTimedProductions_vector && 
                       queue.mTimedProductions_vector.length > 0;
    
    if (hasProduction) {
        var item = queue.mTimedProductions_vector[0];
        // Check if complete
        var isComplete = item.GetProducedItems() >= item.GetAmount();
        
        if (isComplete) {
            // Collect production
            queue.finishProduction(null, null);
        }
    }
}
```

**Related**: See [Production Queues](production-queues.md) for detailed queue methods.

### `GetBuildingFromGridPosition(grid)`

**Signature**: `GetBuildingFromGridPosition(grid: int): cBuilding | null`

**Description**: Gets the building at a specific grid position.

**Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `grid` | `int` | Grid position on the map |

**Returns**:
- `cBuilding`: Building object at position
- `null`: No building at position

**Usage**:
```javascript
var building = zone.GetBuildingFromGridPosition(grid);

if (building) {
    var name = building.GetBuildingName_string();
    var level = building.GetLevel();
    // Process building
} else {
    // No building at this position
}
```

**Example from Specialist_Tasks.js**:
```javascript
deposits.forEach(function(deposit) {
    var grid = deposit.GetGrid();
    var building = zone.GetBuildingFromGridPosition(grid);
    
    if (building !== null) {
        // Deposit has a building (active mine)
        data.activeMines[depositName].push({
            grid: grid, 
            amount: amount, 
            building: building
        });
    } else {
        // Deposit found but no building (available deposit)
        data.availableDeposits[depositName].push({
            grid: grid, 
            amount: amount
        });
    }
});
```

**Performance**: Fast lookup - uses internal map structure.

### `GetResourcesForPlayerID(playerID)`

**Signature**: `GetResourcesForPlayerID(playerID: int): cResources`

**Description**: Gets the resource container for a specific player.

**Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `playerID` | `int` | Player ID |

**Returns**: `cResources` object containing player's resources

**Usage**:
```javascript
var playerID = game.gi.mCurrentPlayer.GetPlayerId();
var resourcesObj = zone.GetResourcesForPlayerID(playerID);
var coinData = resourcesObj.GetPlayerResource("Coin");

if (coinData && typeof coinData.amount !== 'undefined') {
    var coinBalance = coinData.amount;
}
```

**Example from WarehouseViewer.user.js**:
```javascript
var playerID = swmmo.application.mGameInterface.mCurrentPlayer.GetPlayerId();
var resourcesObj = swmmo.application.mGameInterface.mCurrentPlayerZone.GetResourcesForPlayerID(playerID);

for (var resName in RESOURCE_DB) {
    var resData = resourcesObj.GetPlayerResource(resName);
    if (resData && typeof resData.amount !== 'undefined' && resData.amount > 0) {
        // Resource found with amount > 0
    }
}
```

**Example from CURSOR_QuickTrader.js**:
```javascript
function getPlayerStock(codeName) {
    try {
        if (!game || !game.gi || !game.gi.mCurrentPlayer) return 0;
        var playerID = game.gi.mCurrentPlayer.GetPlayerId();
        var resourcesObj = game.gi.mCurrentPlayerZone.GetResourcesForPlayerID(playerID);
        var resData = resourcesObj.GetPlayerResource(codeName);
        
        if (resData && typeof resData.amount !== 'undefined') {
            return resData.amount;
        }
        return 0;
    } catch (e) {
        return 0;
    }
}
```

**Related**: See [Resource Access](../resources/resource-access.md) for detailed resource methods.

### `ScrollToGrid(grid)`

**Signature**: `ScrollToGrid(grid: int): void`

**Description**: Scrolls the map view to the specified grid position.

**Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `grid` | `int` | Grid position to scroll to |

**Usage**:
```javascript
var building = zone.GetBuildingFromGridPosition(grid);
if (building) {
    zone.ScrollToGrid(grid);
    // Map view scrolls to building
}
```

**Notes**:
- Smoothly animates map scroll
- Useful for highlighting specific locations
- May trigger UI updates

## mStreetDataMap Methods

### `GetBuildings_vector()`

**Signature**: `GetBuildings_vector(): Vector<cBuilding>`

**Description**: Gets all buildings as a vector (alternative to `mBuildingContainer`).

**Returns**: Vector of `cBuilding` objects

**Usage**:
```javascript
var buildings = zone.mStreetDataMap.GetBuildings_vector();

buildings.forEach(function(building) {
    var name = building.GetBuildingName_string();
    // Process building
});
```

**Note**: This is equivalent to `zone.mStreetDataMap.mBuildingContainer` but returns a vector.

### `GetBuildingByGridPos(grid)`

**Signature**: `GetBuildingByGridPos(grid: int): cBuilding | null`

**Description**: Gets building at grid position (alternative to `GetBuildingFromGridPosition`).

**Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `grid` | `int` | Grid position |

**Returns**:
- `cBuilding`: Building at position
- `null`: No building at position

**Usage**:
```javascript
var building = zone.mStreetDataMap.GetBuildingByGridPos(grid);
```

**Note**: This is equivalent to `zone.GetBuildingFromGridPosition(grid)`.

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
        // Process depleted deposit
        // Name format: "MineDepletedDeposit[ResourceType]"
    }
});
```

**Example from CURSOR_AutoFarms.js**:
```javascript
buildings.forEach(function (bld) {
    try {
        var name = bld.GetBuildingName_string();
        
        if (name === AUTO_REBUILD_CFG.FARM_RUIN_NAME) {
            // Depleted farm found
            buildList.push({ id: AUTO_REBUILD_CFG.FARM_BUILD_ID, grid: bld.GetGrid(), name: "Farm" });
        } else if (name === AUTO_REBUILD_CFG.WELL_RUIN_NAME) {
            // Depleted well found
            buildList.push({ id: AUTO_REBUILD_CFG.WELL_BUILD_ID, grid: bld.GetGrid(), name: "Well" });
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

**Depleted Deposit Name Patterns**:
- `MineDepletedDepositCorn` - Depleted farm
- `MineDepletedDepositWater` - Dried-up well
- `MineDepletedDepositIronOre` - Depleted iron mine
- `MineDepletedDepositBronzeOre` - Depleted bronze mine
- etc.

**Related**: See [Depleted States](../mines-deposits/depleted-states.md) for complete list.

## Common Patterns

### Pattern: Iterate All Buildings

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

### Pattern: Find Specific Building Type

```javascript
function findBuildingsByName(buildingName) {
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
var bookbinders = findBuildingsByName("Bookbinder");
```

### Pattern: Get Player Resources

```javascript
function getPlayerResource(resourceName) {
    try {
        var playerID = game.gi.mCurrentPlayer.GetPlayerId();
        var zone = game.gi.mCurrentPlayerZone;
        var resourcesObj = zone.GetResourcesForPlayerID(playerID);
        var resData = resourcesObj.GetPlayerResource(resourceName);
        
        if (resData && typeof resData.amount !== 'undefined') {
            return resData.amount;
        }
        return 0;
    } catch (e) {
        return 0;
    }
}
```

### Pattern: Check Production Queue

```javascript
function checkProductionQueue(queueType) {
    try {
        var zone = game.gi.mCurrentPlayerZone;
        var queue = zone.GetProductionQueue(queueType);
        
        if (!queue) return null;
        
        var productions = queue.mTimedProductions_vector;
        if (!productions || productions.length === 0) {
            return null; // No production
        }
        
        return productions[0]; // First production item
    } catch (e) {
        return null;
    }
}
```

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Cannot read property 'mStreetDataMap'` | Zone not loaded | Check `isOnHomzone()` or wait for zone load |
| `GetSpecialists_vector is not a function` | Zone object invalid | Verify zone object exists |
| `GetProductionQueue returned null` | Queue type doesn't exist | Check queue type (0, 2, etc.) |

### Error Handling Pattern

```javascript
function safeZoneOperation() {
    try {
        if (!game.gi || !game.gi.mCurrentPlayerZone) {
            throw new Error("Zone not available");
        }
        
        var zone = game.gi.mCurrentPlayerZone;
        
        // Safe to use zone
        var specialists = zone.GetSpecialists_vector();
        // ... operations
        
    } catch (e) {
        game.showAlert("Zone error: " + e.message);
        console.error("Zone operation error:", e);
    }
}
```

## Performance Notes

- `GetSpecialists_vector()` is fast - cached vector
- `GetBuildingFromGridPosition()` is fast - uses internal map
- `GetResourcesForPlayerID()` is fast - cached resource object
- `mBuildingContainer.forEach()` is efficient - direct iteration
- `IsADepletedDeposit()` is fast - boolean check

## Related Documentation

- [Buildings](buildings.md) - Building container and methods
- [Deposits](deposits.md) - Deposit container and methods
- [Specialists](specialists.md) - Specialist container methods
- [Production Queues](production-queues.md) - Production queue access
- [Resource Access](../resources/resource-access.md) - Resource retrieval

## Examples from Active Scripts

### Specialist_Tasks.js - Collect All Data

```javascript
var zone = swmmo.application.mGameInterface.mCurrentPlayerZone;
var specialists = zone.GetSpecialists_vector();
var buildings = zone.mStreetDataMap.mBuildingContainer;
var deposits = zone.mStreetDataMap.mDepositContainer;

// Process specialists
specialists.forEach(function (specialist) {
    // ... specialist processing
});

// Process buildings
buildings.forEach(function (building) {
    if (zone.mStreetDataMap.IsADepletedDeposit(building)) {
        // ... depleted deposit processing
    }
});

// Process deposits
deposits.forEach(function(deposit) {
    var building = zone.GetBuildingFromGridPosition(deposit.GetGrid());
    // ... deposit processing
});
```

### CURSOR_AutoFarms.js - Check Production

```javascript
var zone = swmmo.application.mGameInterface.mCurrentPlayerZone;
var queue = zone.GetProductionQueue(AUTO_REBUILD_CFG.BINDER_PRODUCTION_TYPE);

if (queue) {
    var hasProduction = queue.mTimedProductions_vector && 
                       queue.mTimedProductions_vector.length > 0;
    // ... production checking
}
```


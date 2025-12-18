# Building Methods API (`cBuilding`)

The `cBuilding` class represents a building on the game map. It provides methods to identify, inspect, and interact with buildings.

## Access Path

```javascript
// From zone
var building = zone.GetBuildingFromGridPosition(grid);
// OR
var building = zone.mStreetDataMap.GetBuildingByGridPos(grid);

// From iteration
buildings.forEach(function(building) {
    // Process building
});
```

## Identification Methods

### `GetBuildingName_string()`

**Signature**: `GetBuildingName_string(): string`

**Description**: Gets the building type name.

**Returns**: Building name string (e.g., "Bookbinder", "Farmfield", "IronMine")

**Usage**:
```javascript
var name = building.GetBuildingName_string();
// Examples: "Bookbinder", "Farmfield", "IronMine", "MineDepletedDepositIronOre"
```

**Common Building Names**:
- Production: `"Bookbinder"`, `"Bakery"`, `"Brewery"`, `"Butcher"`
- Mines: `"IronMine"`, `"BronzeMine"`, `"GoldMine"`, `"CoalMine"`
- Farms: `"Farmfield"`, `"Farm"`
- Wells: `"Well"`
- Depleted: `"MineDepletedDepositCorn"`, `"MineDepletedDepositIronOre"`, etc.

**Example from CURSOR_AutoFarms.js**:
```javascript
buildings.forEach(function (bld) {
    var name = bld.GetBuildingName_string();
    if (name === AUTO_REBUILD_CFG.FARM_RUIN_NAME) {
        // "MineDepletedDepositCorn"
    }
});
```

### `GetGrid()`

**Signature**: `GetGrid(): int`

**Description**: Gets the grid position of the building on the map.

**Returns**: Grid position (int)

**Usage**:
```javascript
var grid = building.GetGrid();
// Use with SendServerAction for upgrades
game.gi.SendServerAction(60, 0, grid, 0, null);
```

**Example from CURSOR_AutoFarms.js**:
```javascript
var grid = depletedFarm.GetGrid();
game.gi.SendServerAction(50, 43, grid, 0, null); // Build Farmfield
```

### `GetLevel()`

**Signature**: `GetLevel(): int`

**Description**: Gets the building level.

**Returns**: Building level (int, typically 1-5)

**Usage**:
```javascript
var level = building.GetLevel();
if (level < 5) {
    // Can upgrade
}
```

### `GetUIUpgradeLevel()`

**Signature**: `GetUIUpgradeLevel(): int`

**Description**: Gets the UI display level (may differ from actual level during upgrades).

**Returns**: UI level (int)

**Usage**:
```javascript
var uiLevel = building.GetUIUpgradeLevel();
```

### `GetUniqueId()`

**Signature**: `GetUniqueId(): dUniqueID`

**Description**: Gets the building's unique identifier.

**Returns**: `dUniqueID` object

**Usage**:
```javascript
var uniqueID = building.GetUniqueId();
// uniqueID.uniqueID1 and uniqueID.uniqueID2
```

## State Check Methods

### `IsBuildingActive()`

**Signature**: `IsBuildingActive(): Boolean`

**Description**: Checks if the building is active (not destroyed, not under construction).

**Returns**:
- `true`: Building is active
- `false`: Building is inactive (destroyed, under construction, etc.)

**Usage**:
```javascript
if (building.IsBuildingActive()) {
    // Building is operational
}
```

### `IsProductionActive()`

**Signature**: `IsProductionActive(): Boolean`

**Description**: Checks if production is currently running in the building.

**Returns**:
- `true`: Production is active
- `false`: No production running

**Usage**:
```javascript
if (building.IsProductionActive()) {
    // Building is producing
}
```

**Note**: This checks if production is running, not if production is complete.

### `IsUpgradeInProgress()`

**Signature**: `IsUpgradeInProgress(): Boolean`

**Description**: Checks if the building is currently being upgraded.

**Returns**:
- `true`: Upgrade in progress
- `false`: Not upgrading

**Usage**:
```javascript
if (building.IsUpgradeInProgress()) {
    var remainingTime = building.GetUpgradeDuration() - 
                       (game.gi.GetClientTime() - building.GetUpgradeStartTime());
    // Calculate remaining upgrade time
}
```

**Example**:
```javascript
function canUpgradeBuilding(building) {
    if (!building.IsBuildingActive()) return false;
    if (building.IsUpgradeInProgress()) return false;
    if (!building.IsUpgradeAllowed(true)) return false;
    return true;
}
```

### `IsUpgradeAllowed(checkResources)`

**Signature**: `IsUpgradeAllowed(checkResources: Boolean): Boolean`

**Description**: Checks if the building can be upgraded.

**Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `checkResources` | `Boolean` | Whether to check if player has required resources |

**Returns**:
- `true`: Upgrade is allowed
- `false`: Upgrade not allowed (max level, insufficient resources, etc.)

**Usage**:
```javascript
if (building.IsUpgradeAllowed(true)) {
    // Can upgrade - has resources
    game.gi.SendServerAction(60, 0, building.GetGrid(), 0, null);
}
```

**Example**:
```javascript
function upgradeBuilding(building) {
    if (!building.IsUpgradeAllowed(true)) {
        game.showAlert("Upgrade not allowed");
        return false;
    }
    
    if (building.IsUpgradeInProgress()) {
        game.showAlert("Already upgrading");
        return false;
    }
    
    game.gi.SendServerAction(60, 0, building.GetGrid(), 0, null);
    return true;
}
```

### `IsBuildingInProduction()`

**Signature**: `IsBuildingInProduction(): Boolean`

**Description**: Checks if the building is in production state.

**Returns**:
- `true`: Building is producing
- `false`: Not producing

**Usage**:
```javascript
if (building.IsBuildingInProduction()) {
    // Building is producing
}
```

**Note**: Similar to `IsProductionActive()`, but may have different internal logic.

### `isGarrison()`

**Signature**: `isGarrison(): Boolean`

**Description**: Checks if the building is a garrison (military building).

**Returns**:
- `true`: Building is a garrison
- `false`: Not a garrison

**Usage**:
```javascript
if (building.isGarrison()) {
    // Military building
}
```

### `IsDecoration()`

**Signature**: `IsDecoration(): Boolean`

**Description**: Checks if the building is a decoration (non-functional).

**Returns**:
- `true`: Building is a decoration
- `false`: Functional building

**Usage**:
```javascript
if (building.IsDecoration()) {
    // Decoration - skip in production checks
    return;
}
```

## Building Properties

### `waitForPickup`

**Type**: `Boolean`  
**Description**: **NOT RELIABLE!** Indicates if production is waiting for pickup.

**Warning**: This property can be `true` even during production. Do not rely on it for detecting complete production.

**Incorrect Usage**:
```javascript
// DON'T DO THIS
if (building.waitForPickup) {
    // This may be true even during production!
    collectProduction();
}
```

**Correct Method**: Use production queue methods instead:
```javascript
// CORRECT: Check production queue
var queue = zone.GetProductionQueue(2);
if (queue) {
    var item = queue.mTimedProductions_vector[0];
    var isComplete = item.GetProducedItems() >= item.GetAmount();
    if (isComplete) {
        queue.finishProduction(null, null);
    }
}
```

### `showWaitForPickupIcon`

**Type**: `Boolean`  
**Description**: Whether the pickup icon is shown in the UI.

**Usage**:
```javascript
if (building.showWaitForPickupIcon) {
    // UI shows pickup icon (but still not reliable!)
}
```

### `productionType`

**Type**: `int`  
**Description**: Production queue type for this building.

**Values**:
- `0`: Default production
- `2`: Science production (Bookbinder)
- `3+`: Other production types

**Usage**:
```javascript
var queueType = building.productionType;
var queue = zone.GetProductionQueue(queueType);
```

### `productionQueue`

**Type**: `cTimedProductionQueue`  
**Description**: Direct reference to the building's production queue.

**Usage**:
```javascript
var queue = building.productionQueue;
if (queue) {
    var productions = queue.mTimedProductions_vector;
}
```

**Note**: May be `null` if building doesn't have a production queue.

### `productionBuff`

**Type**: `BuffAppliance`  
**Description**: Active buff on the building (if any).

**Usage**:
```javascript
if (building.productionBuff) {
    // Building has an active buff
}
```

## Upgrade-Related Methods

### `GetUpgradeStartTime()`

**Signature**: `GetUpgradeStartTime(): Number`

**Description**: Gets the timestamp when the upgrade started.

**Returns**: Timestamp in milliseconds (Number)

**Usage**:
```javascript
var startTime = building.GetUpgradeStartTime();
var currentTime = game.gi.GetClientTime();
var elapsed = currentTime - startTime;
var remaining = building.GetUpgradeDuration() - elapsed;
```

### `GetUpgradeDuration()`

**Signature**: `GetUpgradeDuration(): int`

**Description**: Gets the total upgrade duration in milliseconds.

**Returns**: Duration in milliseconds (int)

**Usage**:
```javascript
var totalDuration = building.GetUpgradeDuration();
var remaining = totalDuration - (game.gi.GetClientTime() - building.GetUpgradeStartTime());
```

### `GetUpgradeCosts_vector()`

**Signature**: `GetUpgradeCosts_vector(): Vector`

**Description**: Gets the list of upgrade costs (resources required).

**Returns**: Vector of cost objects

**Usage**:
```javascript
var costs = building.GetUpgradeCosts_vector();
costs.forEach(function(cost) {
    var resourceName = cost.name_string;
    var amount = cost.amount;
    // Check if player has enough resources
});
```

### `GetRemainingConstructionDuration()`

**Signature**: `GetRemainingConstructionDuration(): int`

**Description**: Gets the remaining construction time in milliseconds.

**Returns**: Remaining time in milliseconds (int)

**Usage**:
```javascript
var remaining = building.GetRemainingConstructionDuration();
if (remaining > 0) {
    // Building is still under construction
}
```

## Production-Related Methods

### `CalculateWays()`

**Signature**: `CalculateWays(): Number`

**Description**: Calculates the production cycle time.

**Returns**: Cycle time in milliseconds (Number)

**Usage**:
```javascript
var cycleTime = building.CalculateWays();
```

### `GetResourceInputFactor()`

**Signature**: `GetResourceInputFactor(): int`

**Description**: Gets the resource input multiplier.

**Returns**: Input factor (int)

**Usage**:
```javascript
var inputFactor = building.GetResourceInputFactor();
```

### `GetResourceOutputFactor()`

**Signature**: `GetResourceOutputFactor(): int`

**Description**: Gets the resource output multiplier.

**Returns**: Output factor (int)

**Usage**:
```javascript
var outputFactor = building.GetResourceOutputFactor();
```

### `getRemainingCooldown()`

**Signature**: `getRemainingCooldown(): Number`

**Description**: Gets the remaining cooldown time in milliseconds.

**Returns**: Remaining cooldown in milliseconds (Number)

**Usage**:
```javascript
var cooldown = building.getRemainingCooldown();
if (cooldown > 0) {
    // Building is on cooldown
}
```

## Common Patterns

### Pattern: Check Building State

```javascript
function checkBuildingState(building) {
    return {
        name: building.GetBuildingName_string(),
        grid: building.GetGrid(),
        level: building.GetLevel(),
        isActive: building.IsBuildingActive(),
        isProducing: building.IsProductionActive(),
        isUpgrading: building.IsUpgradeInProgress(),
        canUpgrade: building.IsUpgradeAllowed(true)
    };
}
```

### Pattern: Find Buildings by Name

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

### Pattern: Check if Building is Ready

```javascript
function isBuildingReady(building) {
    try {
        // Check if building is active
        if (!building.IsBuildingActive()) return false;
        
        // Check if upgrading
        if (building.IsUpgradeInProgress()) return false;
        
        // Check if production is active (optional)
        // if (building.IsProductionActive()) return false;
        
        return true;
    } catch (e) {
        return false;
    }
}
```

### Pattern: Get Building Production Status

```javascript
function getBuildingProductionStatus(building) {
    try {
        if (!building.IsBuildingActive()) {
            return { active: false };
        }
        
        var queueType = building.productionType;
        if (!queueType) {
            return { active: true, hasProduction: false };
        }
        
        var zone = game.gi.mCurrentPlayerZone;
        var queue = zone.GetProductionQueue(queueType);
        
        if (!queue) {
            return { active: true, hasProduction: false };
        }
        
        var productions = queue.mTimedProductions_vector;
        if (!productions || productions.length === 0) {
            return { active: true, hasProduction: false };
        }
        
        var item = productions[0];
        var isComplete = item.GetProducedItems() >= item.GetAmount();
        
        return {
            active: true,
            hasProduction: true,
            isComplete: isComplete,
            progress: Math.round((item.GetCollectedTime() / item.GetProductionTime()) * 100)
        };
    } catch (e) {
        return { error: e.message };
    }
}
```

## Important Notes

### Detecting Complete Production

**DO NOT** use `waitForPickup` - it's unreliable!

**CORRECT Method**:
```javascript
// Use production queue
var queue = zone.GetProductionQueue(2);
if (queue) {
    var item = queue.mTimedProductions_vector[0];
    var isComplete = item.GetProducedItems() >= item.GetAmount();
    if (isComplete) {
        queue.finishProduction(null, null);
    }
}
```

### Building Name Patterns

**Depleted Deposits**: All follow pattern `MineDepletedDeposit[ResourceType]`
- `MineDepletedDepositCorn` - Depleted farm
- `MineDepletedDepositWater` - Dried-up well
- `MineDepletedDepositIronOre` - Depleted iron mine
- etc.

**Active Mines**: Use resource name + "Mine"
- `IronMine` - Active iron mine
- `BronzeMine` - Active bronze mine
- `GoldMine` - Active gold mine
- etc.

## Performance Notes

- Building methods are fast - cached properties
- `GetBuildingName_string()` is fast - string property
- `IsBuildingActive()` is fast - boolean check
- Iteration over buildings is efficient
- Always use try-catch when iterating

## Error Handling

### Error Handling Pattern

```javascript
function safeBuildingOperation(building, callback) {
    try {
        if (!building) {
            throw new Error("Building is null");
        }
        
        // Validate building
        if (!building.IsBuildingActive) {
            throw new Error("Building methods not available");
        }
        
        callback(building);
    } catch (e) {
        game.showAlert("Building operation error: " + e.message);
        console.error("Building error:", e);
    }
}
```

## Related Documentation

- [Building IDs](building-ids.md) - Complete building ID reference
- [Building Names](building-names.md) - Building name strings
- [Building Categories](building-categories.md) - Building categorization
- [Zone Buildings](../zone/buildings.md) - Building container access
- [Production Queues](../zone/production-queues.md) - Production queue methods

## Examples from Active Scripts

### CURSOR_AutoFarms.js - Find and Process Buildings

```javascript
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

### CURSOR_AutoFarms.js - Check Bookbinder

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
    
    // Check production
    var queue = zone.GetProductionQueue(2);
    // ... production checking
}
```

### Specialist_Tasks.js - Check Depleted Deposits

```javascript
buildings.forEach(function (building) {
    try {
        if (zone.mStreetDataMap.IsADepletedDeposit(building)) {
            var buildingName = building.GetBuildingName_string();
            var grid = building.GetGrid();
            // Process depleted deposit
        }
    } catch (e) { }
});
```


# Zone Deposits API

The Deposits container provides access to all resource deposits on the current zone. Deposits represent available resources that can be mined or extracted.

## Access Path

```javascript
var zone = game.gi.mCurrentPlayerZone;
var deposits = zone.mStreetDataMap.mDepositContainer;
```

## Container Properties

### `mDepositContainer`

**Type**: `Map`  
**Description**: Map container of all deposits on the zone.

**Structure**: The container is a map-like object that can be iterated.

## Deposit Object Structure

A deposit object (`cDeposit`) contains:

- `GetName_string()`: Resource type name (e.g., "IronOre", "Coal")
- `GetGrid()`: Grid position of the deposit
- `GetAmount()`: Remaining resource amount

## Iteration Patterns

### Basic Iteration

```javascript
var zone = game.gi.mCurrentPlayerZone;
var deposits = zone.mStreetDataMap.mDepositContainer;

deposits.forEach(function(deposit) {
    try {
        var depositName = deposit.GetName_string();
        var grid = deposit.GetGrid();
        var amount = deposit.GetAmount();
        
        // Process deposit
    } catch (e) {
        // Skip problematic deposits
    }
});
```

**Note**: `mDepositContainer` is a map-like object that supports `forEach()` iteration.

## Deposit Methods

### `GetName_string()`

**Signature**: `GetName_string(): string`

**Description**: Gets the resource type name of the deposit.

**Returns**: Resource code name (e.g., "IronOre", "Coal", "BronzeOre", "GoldOre")

**Usage**:
```javascript
var depositName = deposit.GetName_string();
// Examples: "IronOre", "Coal", "BronzeOre", "GoldOre", "TitaniumOre", 
//          "Salpeter", "Marble", "Stone", "Granite"
```

**Common Deposit Names**:

| Deposit Name | Resource Type | Notes |
|--------------|---------------|-------|
| `IronOre` | Iron Ore | Mineable |
| `Coal` | Coal | Mineable |
| `BronzeOre` | Bronze Ore | Mineable |
| `GoldOre` | Gold Ore | Mineable |
| `TitaniumOre` | Titanium Ore | Mineable |
| `Salpeter` | Saltpeter | Mineable |
| `Marble` | Marble | Quarry |
| `Stone` | Stone | Quarry |
| `Granite` | Granite | Quarry |

**Note**: Deposits use resource code names, not building names.

### `GetGrid()`

**Signature**: `GetGrid(): int`

**Description**: Gets the grid position of the deposit.

**Returns**: Grid position (int)

**Usage**:
```javascript
var grid = deposit.GetGrid();
var building = zone.GetBuildingFromGridPosition(grid);

if (building) {
    // Deposit has a building (active mine)
} else {
    // Deposit found but no building (available deposit)
}
```

### `GetAmount()`

**Signature**: `GetAmount(): int`

**Description**: Gets the remaining resource amount in the deposit.

**Returns**: Resource amount (int)

**Usage**:
```javascript
var amount = deposit.GetAmount();
// Amount represents remaining resources
```

**Notes**:
- Amount decreases as resources are extracted
- Amount of 0 or very low may indicate near-depletion
- Exact depletion detection requires checking building state

## Common Patterns

### Pattern: Categorize Deposits

```javascript
function categorizeDeposits() {
    var data = {
        activeMines: {},      // Deposits with buildings
        availableDeposits: {} // Deposits without buildings
    };
    
    var zone = game.gi.mCurrentPlayerZone;
    var deposits = zone.mStreetDataMap.mDepositContainer;
    
    deposits.forEach(function(deposit) {
        try {
            var depositName = deposit.GetName_string();
            var grid = deposit.GetGrid();
            var amount = deposit.GetAmount();
            var building = zone.GetBuildingFromGridPosition(grid);
            
            if (building !== null) {
                // Deposit has a building (active mine)
                if (!data.activeMines[depositName]) {
                    data.activeMines[depositName] = [];
                }
                data.activeMines[depositName].push({
                    grid: grid,
                    amount: amount,
                    building: building
                });
            } else {
                // Deposit found but no building (available deposit)
                if (!data.availableDeposits[depositName]) {
                    data.availableDeposits[depositName] = [];
                }
                data.availableDeposits[depositName].push({
                    grid: grid,
                    amount: amount
                });
            }
        } catch (e) { }
    });
    
    return data;
}
```

**Example from Specialist_Tasks.js**:
```javascript
deposits.forEach(function(deposit) {
    try {
        var depositName = deposit.GetName_string();
        if (ALL_MINE_TYPES.indexOf(depositName) === -1) return;
        
        var grid = deposit.GetGrid();
        var amount = deposit.GetAmount();
        var building = zone.GetBuildingFromGridPosition(grid);
        
        if (building !== null) {
            // Active mine
            if (!data.activeMines[depositName]) {
                data.activeMines[depositName] = [];
            }
            data.activeMines[depositName].push({
                grid: grid, 
                amount: amount, 
                building: building
            });
        } else {
            // Available deposit (not yet built)
            if (!data.availableDeposits[depositName]) {
                data.availableDeposits[depositName] = [];
            }
            data.availableDeposits[depositName].push({
                grid: grid, 
                amount: amount
            });
        }
    } catch (e) { }
});
```

### Pattern: Filter Real Mines

```javascript
// Real mine types (excludes Corn and Water)
var REAL_MINE_TYPES = [
    "IronOre", "Coal", "BronzeOre", "GoldOre", 
    "TitaniumOre", "Salpeter", "Marble", "Stone", "Granite"
];

function getRealMineDeposits() {
    var realMines = [];
    var zone = game.gi.mCurrentPlayerZone;
    var deposits = zone.mStreetDataMap.mDepositContainer;
    
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

### Pattern: Count Deposits by Type

```javascript
function countDepositsByType() {
    var counts = {};
    var zone = game.gi.mCurrentPlayerZone;
    var deposits = zone.mStreetDataMap.mDepositContainer;
    
    deposits.forEach(function(deposit) {
        try {
            var depositName = deposit.GetName_string();
            counts[depositName] = (counts[depositName] || 0) + 1;
        } catch (e) { }
    });
    
    return counts;
}
```

## Deposit vs Building Relationship

### Active Mine

An active mine is a deposit that has a building constructed on it:

```javascript
var building = zone.GetBuildingFromGridPosition(deposit.GetGrid());
if (building !== null) {
    // Active mine - building is extracting resources
    var buildingName = building.GetBuildingName_string();
    // Examples: "IronMine", "BronzeMine", "GoldMine"
}
```

### Available Deposit

An available deposit is found but has no building:

```javascript
var building = zone.GetBuildingFromGridPosition(deposit.GetGrid());
if (building === null) {
    // Available deposit - can be built upon
    // Geologist found this deposit but no mine built yet
}
```

### Depleted Deposit

A depleted deposit is detected via building name, not deposit container:

```javascript
// Depleted deposits appear as buildings with names like:
// "MineDepletedDepositIronOre"
// Use IsADepletedDeposit() to detect
if (zone.mStreetDataMap.IsADepletedDeposit(building)) {
    // Building is a depleted deposit ruin
}
```

## Real Mine Types

The following are considered "real mines" (excludes farms and wells):

| Deposit Name | Resource | Building Name | Building ID |
|--------------|----------|--------------|-------------|
| `IronOre` | Iron Ore | IronMine | 50 |
| `Coal` | Coal | CoalMine | 37 |
| `BronzeOre` | Bronze Ore | BronzeMine | 36 |
| `GoldOre` | Gold Ore | GoldMine | 46 |
| `TitaniumOre` | Titanium Ore | TitaniumMine | 69 |
| `Salpeter` | Saltpeter | SalpeterMine | 63 |
| `Marble` | Marble | - | - (Quarry) |
| `Stone` | Stone | - | - (Quarry) |
| `Granite` | Granite | - | - (Quarry) |

**Excluded Types**:
- `Corn` - Farm resource (not a mine)
- `Water` - Well resource (not a mine)

## Performance Notes

- `mDepositContainer.forEach()` is efficient
- Deposit iteration is typically fast
- `GetBuildingFromGridPosition()` lookup is O(1)
- Always use try-catch when iterating

## Error Handling

### Error Handling Pattern

```javascript
function safeIterateDeposits(callback) {
    try {
        if (!game.gi || !game.gi.mCurrentPlayerZone) {
            throw new Error("Zone not available");
        }
        
        var zone = game.gi.mCurrentPlayerZone;
        var deposits = zone.mStreetDataMap.mDepositContainer;
        
        deposits.forEach(function(deposit) {
            try {
                callback(deposit);
            } catch (depositErr) {
                // Skip problematic deposit
                console.warn("Skipped deposit:", depositErr);
            }
        });
    } catch (e) {
        game.showAlert("Deposit iteration error: " + e.message);
    }
}
```

## Related Documentation

- [Zone Overview](zone-overview.md) - Zone object structure
- [Mine Types](../mines-deposits/mine-types.md) - Mine type definitions
- [Deposit Types](../mines-deposits/deposit-types.md) - Deposit type definitions
- [Depleted States](../mines-deposits/depleted-states.md) - Depleted deposit detection
- [Building Methods](../buildings/building-methods.md) - Building object methods

## Examples from Active Scripts

### Specialist_Tasks.js - Categorize Deposits

```javascript
deposits.forEach(function(deposit) {
    try {
        var depositName = deposit.GetName_string();
        if (ALL_MINE_TYPES.indexOf(depositName) === -1) return;
        
        var grid = deposit.GetGrid();
        var amount = deposit.GetAmount();
        var building = zone.GetBuildingFromGridPosition(grid);
        
        if (building !== null) {
            // Active mine
            if (!data.activeMines[depositName]) {
                data.activeMines[depositName] = [];
            }
            data.activeMines[depositName].push({
                grid: grid, 
                amount: amount, 
                building: building
            });
        } else {
            // Available deposit
            if (!data.availableDeposits[depositName]) {
                data.availableDeposits[depositName] = [];
            }
            data.availableDeposits[depositName].push({
                grid: grid, 
                amount: amount
            });
        }
    } catch (e) { }
});
```


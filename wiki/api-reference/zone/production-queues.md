# Production Queues API

Production queues manage timed production in buildings like Bookbinder, AdventureBookbinder, and other production buildings.

## Access Path

```javascript
var zone = game.gi.mCurrentPlayerZone;
var queue = zone.GetProductionQueue(queueType);
```

## Method

### `GetProductionQueue(type)`

**Signature**: `GetProductionQueue(type: int): cTimedProductionQueue | null`

**Description**: Gets a production queue by type.

**Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `type` | `int` | Production queue type identifier |

**Returns**:
- `cTimedProductionQueue`: Production queue object
- `null`: Queue not found or doesn't exist for this zone

## Production Queue Types

| Type ID | Queue Name | Buildings | Description |
|---------|------------|-----------|-------------|
| 0 | Default | Various | Standard production buildings |
| 1 | - | - | Reserved/Unused |
| 2 | Science | Bookbinder, AdventureBookbinder | Science production (Manuscript, etc.) |
| 3+ | Other | Culture buildings | Other specialized production types |

## Production Queue Object (`cTimedProductionQueue`)

### Properties

#### `mTimedProductions_vector`

**Type**: `Vector<TimedProduction>`  
**Description**: List of production items in the queue.

**Usage**:
```javascript
var queue = zone.GetProductionQueue(2);
if (queue) {
    var productions = queue.mTimedProductions_vector;
    
    if (productions && productions.length > 0) {
        var item = productions[0]; // First production item
        // Process production
    } else {
        // Queue is empty
    }
}
```

#### `productionBuilding`

**Type**: `cBuilding`  
**Description**: The building associated with this production queue.

**Usage**:
```javascript
var building = queue.productionBuilding;
var buildingName = building.GetBuildingName_string();
```

### Methods

#### `finishProduction(null, null)`

**Signature**: `finishProduction(param1: null, param2: null): void`

**Description**: **COLLECTS** finished production from the queue.

**Parameters**: Both parameters must be `null`

**Usage**:
```javascript
var queue = zone.GetProductionQueue(2);
if (queue) {
    var productions = queue.mTimedProductions_vector;
    if (productions && productions.length > 0) {
        var item = productions[0];
        
        // Check if complete
        var isComplete = item.GetProducedItems() >= item.GetAmount();
        
        if (isComplete) {
            // Collect production
            queue.finishProduction(null, null);
        }
    }
}
```

**Important Notes**:
- This method **collects** the production (picks it up)
- Only works if production is complete
- Both parameters must be `null`
- After collection, production item is removed from queue

**Example from CURSOR_AutoFarms.js**:
```javascript
if (isComplete) {
    // Production is complete - collect it!
    _logRebuild("Binder: " + productName + " complete. Collecting...");
    
    try {
        queue.finishProduction(null, null);
        _logRebuild("Binder: " + productName + " collected!");
        
        // After collecting, start new production
        setTimeout(function() {
            _startBinderProduction(binderBuilding);
        }, 1000);
    } catch (collectErr) {
        _logRebuild("Binder: Collection error: " + collectErr.message);
    }
}
```

## Production Item Object (`TimedProduction`)

### Methods

#### `GetAmount()`

**Signature**: `GetAmount(): int`

**Description**: Gets the total number of items to produce.

**Returns**: Total amount (int)

**Usage**:
```javascript
var totalAmount = item.GetAmount();
```

#### `GetProducedItems()`

**Signature**: `GetProducedItems(): int`

**Description**: Gets the number of items already produced.

**Returns**: Produced amount (int)

**Usage**:
```javascript
var produced = item.GetProducedItems();
var total = item.GetAmount();
var progress = produced / total;
```

#### `GetProductionTime()`

**Signature**: `GetProductionTime(): Number`

**Description**: Gets the total production time in milliseconds.

**Returns**: Total time in milliseconds (Number)

**Usage**:
```javascript
var totalTime = item.GetProductionTime();
```

#### `GetCollectedTime()`

**Signature**: `GetCollectedTime(): Number`

**Description**: Gets the time elapsed (collected) in milliseconds.

**Returns**: Elapsed time in milliseconds (Number)

**Usage**:
```javascript
var elapsedTime = item.GetCollectedTime();
var remainingTime = item.GetProductionTime() - elapsedTime;
```

#### `GetProductionOrder()`

**Signature**: `GetProductionOrder(): ProductionOrder`

**Description**: Gets the production order object.

**Returns**: `ProductionOrder` object

**Usage**:
```javascript
var order = item.GetProductionOrder();
if (order) {
    var vo = order.GetProductionVO ? order.GetProductionVO() : null;
    if (vo && vo.type_string) {
        var productName = vo.type_string;
        // Example: "Manuscript"
    }
}
```

## Calculated Values

### Check if Production is Complete

```javascript
// Method 1: Check produced items
var isComplete = item.GetProducedItems() >= item.GetAmount();

// Method 2: Check remaining time
var remainingTime = item.GetProductionTime() - item.GetCollectedTime();
var isComplete = remainingTime <= 0;

// Recommended: Use Method 1 (more reliable)
```

### Calculate Progress Percentage

```javascript
var totalTime = item.GetProductionTime();
var elapsedTime = item.GetCollectedTime();
var progress = Math.round((elapsedTime / totalTime) * 100);
// Returns: 0-100
```

### Calculate Remaining Time

```javascript
var totalTime = item.GetProductionTime();
var elapsedTime = item.GetCollectedTime();
var remainingTime = totalTime - elapsedTime;

// Format for display
var timeText = loca.FormatDuration(remainingTime, 1);
// Example: "2h 30m"
```

## Common Patterns

### Pattern: Check Production Status

```javascript
function checkProductionStatus(queueType) {
    try {
        var zone = game.gi.mCurrentPlayerZone;
        var queue = zone.GetProductionQueue(queueType);
        
        if (!queue) {
            return { exists: false };
        }
        
        var productions = queue.mTimedProductions_vector;
        if (!productions || productions.length === 0) {
            return { exists: true, hasProduction: false };
        }
        
        var item = productions[0];
        var isComplete = item.GetProducedItems() >= item.GetAmount();
        var progress = Math.round((item.GetCollectedTime() / item.GetProductionTime()) * 100);
        
        // Get product name
        var productName = "Unknown";
        try {
            var order = item.GetProductionOrder();
            if (order) {
                var vo = order.GetProductionVO ? order.GetProductionVO() : null;
                if (vo && vo.type_string) {
                    productName = vo.type_string;
                }
            }
        } catch (e) { }
        
        return {
            exists: true,
            hasProduction: true,
            isComplete: isComplete,
            progress: progress,
            productName: productName,
            produced: item.GetProducedItems(),
            total: item.GetAmount()
        };
    } catch (e) {
        return { error: e.message };
    }
}
```

### Pattern: Auto-Collect Production

```javascript
function autoCollectProduction(queueType) {
    try {
        var zone = game.gi.mCurrentPlayerZone;
        var queue = zone.GetProductionQueue(queueType);
        
        if (!queue) return false;
        
        var productions = queue.mTimedProductions_vector;
        if (!productions || productions.length === 0) {
            return false; // No production
        }
        
        var item = productions[0];
        
        // Check if complete
        var isComplete = item.GetProducedItems() >= item.GetAmount();
        
        if (isComplete) {
            // Collect production
            queue.finishProduction(null, null);
            return true;
        }
        
        return false; // Not complete yet
    } catch (e) {
        game.showAlert("Collection error: " + e.message);
        return false;
    }
}
```

### Pattern: Check and Start Production

```javascript
function checkAndStartProduction(building, queueType, productName) {
    try {
        var zone = game.gi.mCurrentPlayerZone;
        var queue = zone.GetProductionQueue(queueType);
        
        if (!queue) {
            // Queue doesn't exist - start production
            startProduction(building, queueType, productName);
            return;
        }
        
        var productions = queue.mTimedProductions_vector;
        if (!productions || productions.length === 0) {
            // No production - start new
            startProduction(building, queueType, productName);
            return;
        }
        
        var item = productions[0];
        var isComplete = item.GetProducedItems() >= item.GetAmount();
        
        if (isComplete) {
            // Collect and start new
            queue.finishProduction(null, null);
            setTimeout(function() {
                startProduction(building, queueType, productName);
            }, 1000);
        } else {
            // Production in progress
            var progress = Math.round((item.GetCollectedTime() / item.GetProductionTime()) * 100);
            console.log("Production " + progress + "% complete");
        }
    } catch (e) {
        game.showAlert("Production check error: " + e.message);
    }
}
```

## Important Notes

### Detecting Complete Production

**DO NOT** rely on building properties like `waitForPickup` - they're unreliable!

**CORRECT Method**:
```javascript
// Check if produced items >= amount
var isComplete = item.GetProducedItems() >= item.GetAmount();

// OR check remaining time
var remainingTime = item.GetProductionTime() - item.GetCollectedTime();
var isComplete = remainingTime <= 0;
```

### Collecting Production

```javascript
// Correct way to collect
queue.finishProduction(null, null);

// Both parameters MUST be null
// This collects the finished production
```

### Production Queue Types

- Type 2 (Science) is used for Bookbinder and AdventureBookbinder
- Other types may exist for culture buildings and special production
- Always check if queue exists before accessing

## Performance Notes

- `GetProductionQueue()` is fast - cached reference
- Production item access is fast
- `finishProduction()` triggers server action - has network overhead
- Check production status before collecting to avoid errors

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `GetProductionQueue returned null` | Queue type doesn't exist | Check queue type (0, 2, etc.) |
| `Cannot read property 'mTimedProductions_vector'` | Queue invalid | Check queue exists before accessing |
| `finishProduction failed` | Production not complete | Check `GetProducedItems() >= GetAmount()` |

### Error Handling Pattern

```javascript
function safeCheckProduction(queueType) {
    try {
        var zone = game.gi.mCurrentPlayerZone;
        if (!zone) {
            throw new Error("Zone not available");
        }
        
        var queue = zone.GetProductionQueue(queueType);
        if (!queue) {
            return { exists: false };
        }
        
        var productions = queue.mTimedProductions_vector;
        if (!productions || productions.length === 0) {
            return { exists: true, hasProduction: false };
        }
        
        // Safe to access production item
        var item = productions[0];
        return {
            exists: true,
            hasProduction: true,
            isComplete: item.GetProducedItems() >= item.GetAmount()
        };
    } catch (e) {
        return { error: e.message };
    }
}
```

## Related Documentation

- [Zone Overview](zone-overview.md) - Zone object structure
- [Building Methods](../buildings/building-methods.md) - Building production properties
- [Client Messages](../game-interface/client-messages.md) - Starting production (Message 91)

## Examples from Active Scripts

### CURSOR_AutoFarms.js - Complete Production Check

```javascript
function _checkBinder(zone, buildings) {
    try {
        var binderBuilding = null;
        
        // Find Bookbinder building
        buildings.forEach(function (bld) {
            if (bld.GetBuildingName_string() === "Bookbinder") {
                binderBuilding = bld;
            }
        });
        
        if (!binderBuilding) {
            return; // No Bookbinder on this zone
        }
        
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
            
            // Check if production is complete
            var isComplete = false;
            var productName = AUTO_REBUILD_CFG.BINDER_PRODUCT;
            
            try {
                var producedItems = item.GetProducedItems();
                var totalAmount = item.GetAmount();
                
                if (producedItems >= totalAmount) {
                    isComplete = true;
                }
            } catch (e) { }
            
            // Secondary check: remaining time
            if (!isComplete) {
                try {
                    var productionTime = item.GetProductionTime();
                    var collectedTime = item.GetCollectedTime();
                    if (productionTime - collectedTime <= 0) {
                        isComplete = true;
                    }
                } catch (e) { }
            }
            
            // Get product name from order
            try {
                var order = item.GetProductionOrder();
                if (order) {
                    var vo = order.GetProductionVO ? order.GetProductionVO() : null;
                    if (vo && vo.type_string) {
                        productName = vo.type_string;
                    }
                }
            } catch (e) { }
            
            if (isComplete) {
                // Production is complete - collect it!
                _logRebuild("Binder: " + productName + " complete. Collecting...");
                
                try {
                    queue.finishProduction(null, null);
                    _logRebuild("Binder: " + productName + " collected!");
                    
                    // After collecting, start new production
                    setTimeout(function() {
                        _startBinderProduction(binderBuilding);
                    }, 1000);
                } catch (collectErr) {
                    _logRebuild("Binder: Collection error: " + collectErr.message);
                }
            } else {
                // Production in progress
                try {
                    var productionTime = item.GetProductionTime();
                    var collectedTime = item.GetCollectedTime();
                    var progress = Math.round((collectedTime / productionTime) * 100);
                    _logRebuild("Binder: Producing " + productName + " (" + progress + "%)");
                } catch (e) {
                    _logRebuild("Binder: Production in progress.");
                }
            }
        } else {
            // No production - start new one
            _logRebuild("Binder: Idle. Starting " + AUTO_REBUILD_CFG.BINDER_PRODUCT + "...");
            _startBinderProduction(binderBuilding);
        }
    } catch (e) {
        _logRebuild("Binder Check Error: " + e.message);
    }
}
```


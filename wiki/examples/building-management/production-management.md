# Example: Production Management Patterns

Complete patterns for managing building production from `CURSOR_AutoFarms.js`.

## Overview

This example demonstrates various patterns for:
- Checking production status
- Starting production
- Collecting finished production
- Managing production queues

## Key Patterns

### Pattern: Check Production Status

```javascript
function checkProductionStatus(building, queueType) {
    try {
        var zone = game.gi.mCurrentPlayerZone;
        var queue = zone.GetProductionQueue(queueType);
        
        if (!queue) {
            return { hasQueue: false, hasProduction: false };
        }
        
        var productions = queue.mTimedProductions_vector;
        if (!productions || productions.length === 0) {
            return { hasQueue: true, hasProduction: false };
        }
        
        var item = productions[0];
        var isComplete = item.GetProducedItems() >= item.GetAmount();
        
        return {
            hasQueue: true,
            hasProduction: true,
            isComplete: isComplete,
            produced: item.GetProducedItems(),
            total: item.GetAmount()
        };
    } catch (e) {
        return { error: e.message };
    }
}
```

### Pattern: Collect Finished Production

```javascript
function collectProduction(building, queueType) {
    try {
        var zone = game.gi.mCurrentPlayerZone;
        var queue = zone.GetProductionQueue(queueType);
        
        if (!queue) {
            return false;
        }
        
        var productions = queue.mTimedProductions_vector;
        if (!productions || productions.length === 0) {
            return false;
        }
        
        var item = productions[0];
        var isComplete = item.GetProducedItems() >= item.GetAmount();
        
        if (isComplete) {
            queue.finishProduction(null, null);
            return true;
        }
        
        return false;
    } catch (e) {
        game.showAlert("Collection error: " + e.message);
        return false;
    }
}
```

### Pattern: Start Production

```javascript
function startProduction(building, queueType, productName, amount) {
    try {
        var dTimedProductionVO = swmmo.getDefinitionByName("Communication.VO::dTimedProductionVO");
        var vo = new dTimedProductionVO();
        vo.productionType = queueType;
        vo.type_string = productName;
        vo.amount = amount || 1;
        vo.stacks = 1;
        vo.buildingGrid = building.GetGrid();
        
        game.gi.mClientMessages.SendMessagetoServer(91, game.gi.mCurrentViewedZoneID, vo);
        return true;
    } catch (e) {
        game.showAlert("Production start error: " + e.message);
        return false;
    }
}
```

### Pattern: Complete Production Management Cycle

```javascript
function manageProduction(building, queueType, productName) {
    try {
        var zone = game.gi.mCurrentPlayerZone;
        var queue = zone.GetProductionQueue(queueType);
        
        if (!queue) {
            // No queue - start production
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
            // Collect finished production
            queue.finishProduction(null, null);
            
            // Start new production after delay
            setTimeout(function() {
                startProduction(building, queueType, productName);
            }, 1000);
        } else {
            // Production in progress
            var progress = Math.round((item.GetCollectedTime() / item.GetProductionTime()) * 100);
            console.log("Production " + progress + "% complete");
        }
    } catch (e) {
        game.showAlert("Production management error: " + e.message);
    }
}
```

## Example from CURSOR_AutoFarms.js

### Bookbinder Production Management

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
            return;
        }
        
        // Get Production Queue (Type 2 for Bookbinder/Science)
        var queue = zone.GetProductionQueue(2);
        
        if (!queue) {
            return;
        }
        
        var hasProduction = queue.mTimedProductions_vector && queue.mTimedProductions_vector.length > 0;
        
        if (hasProduction) {
            var item = queue.mTimedProductions_vector[0];
            var productName = item.GetProductName_string();
            var isComplete = item.GetProducedItems() >= item.GetAmount();
            
            if (isComplete) {
                // Production complete - collect it
                queue.finishProduction(null, null);
                
                // Start new production after delay
                setTimeout(function() {
                    _startBinderProduction(binderBuilding);
                }, 1000);
            }
        } else {
            // No production - start new
            _startBinderProduction(binderBuilding);
        }
    } catch (e) {
        console.error("Binder check error: " + e.message);
    }
}
```

## Important Notes

### DO NOT Use `waitForPickup`

The `building.waitForPickup` property is **unreliable** and should not be used:

```javascript
// DON'T DO THIS
if (building.waitForPickup) {
    collectProduction();
}
```

### Correct Method

Always use production queue methods:

```javascript
// CORRECT: Check production queue
var queue = zone.GetProductionQueue(queueType);
if (queue) {
    var item = queue.mTimedProductions_vector[0];
    var isComplete = item.GetProducedItems() >= item.GetAmount();
    if (isComplete) {
        queue.finishProduction(null, null);
    }
}
```

## Related Documentation

- [Production Queues](../../api-reference/zone/production-queues.md) - Production queue API
- [Client Messages](../../api-reference/game-interface/client-messages.md) - SendMessagetoServer
- [Building Properties](../../api-reference/buildings/building-properties.md) - Building properties


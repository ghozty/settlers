# Error Handling Patterns

Best practices for error handling in TSO client scripts.

## Basic Pattern

```javascript
function safeOperation() {
    try {
        // Primary operation
        var result = riskyOperation();
        return result;
    } catch (e) {
        // Log error
        console.error("Operation failed:", e);
        
        // User notification
        game.showAlert("Error: " + e.message);
        
        // Return safe default
        return null;
    }
}
```

## Zone Access Pattern

```javascript
function safeZoneOperation() {
    try {
        if (!game || !game.gi) {
            throw new Error("Game interface not available");
        }
        
        if (!game.gi.mCurrentPlayerZone) {
            throw new Error("Zone not available");
        }
        
        var zone = game.gi.mCurrentPlayerZone;
        // Safe to use zone
        // ... operations
        
    } catch (e) {
        game.showAlert("Error: " + e.message);
        console.error("Zone operation error:", e);
    }
}
```

## Iteration Error Handling

```javascript
items.forEach(function(item) {
    try {
        // Process item
    } catch (itemErr) {
        // Skip problematic item, continue with others
        console.warn("Skipped item:", itemErr);
    }
});
```

## Building Iteration Pattern

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
                console.warn("Skipped building:", buildingErr);
            }
        });
    } catch (e) {
        game.showAlert("Building iteration error: " + e.message);
    }
}
```

## Specialist Iteration Pattern

```javascript
function safeIterateSpecialists(callback) {
    try {
        if (!game.gi || !game.gi.mCurrentPlayerZone) {
            throw new Error("Zone not available");
        }
        
        var zone = game.gi.mCurrentPlayerZone;
        var specialists = zone.GetSpecialists_vector();
        
        specialists.forEach(function(specialist) {
            try {
                // Filter by player first
                if (specialist.getPlayerID() === -1) return;
                
                callback(specialist);
            } catch (specErr) {
                console.warn("Skipped specialist:", specErr);
            }
        });
    } catch (e) {
        game.showAlert("Specialist iteration error: " + e.message);
    }
}
```

## Server Action Pattern

```javascript
function safeSendAction(actionID, buildingID, grid, rotation, data) {
    try {
        // Validate prerequisites
        if (!game.gi.isOnHomzone()) {
            throw new Error("Must be on home zone");
        }
        
        // Validate grid
        if (!grid || grid <= 0) {
            throw new Error("Invalid grid position");
        }
        
        // Send action
        game.gi.SendServerAction(actionID, buildingID, grid, rotation, data);
        return true;
    } catch (e) {
        game.showAlert("Action error: " + e.message);
        console.error("SendServerAction error:", e);
        return false;
    }
}
```

## Related Documentation

- [Common Errors](../troubleshooting/common-errors.md) - Error codes and solutions
- [Async Operations](async-operations.md) - Async error handling


# Common Coding Patterns

This document covers essential patterns used throughout TSO client scripts.

## Pattern 1: Menu Integration

### Basic Pattern

```javascript
var SCRIPT_NAME = "My Script";

addToolsMenuItem(SCRIPT_NAME, MainFunction);

function MainFunction() {
    // Script logic
}
```

### With Error Handling

```javascript
function MainFunction() {
    try {
        if (!game.gi.isOnHomzone()) {
            game.showAlert("Please go to your home zone first.");
            return;
        }
        // Script logic
    } catch (e) {
        game.showAlert("Error: " + e.message);
    }
}
```

## Pattern 2: Zone Access

### Getting Current Zone

```javascript
var zone = game.gi.mCurrentPlayerZone;
```

### Checking Home Zone

```javascript
if (!game.gi.isOnHomzone()) {
    game.showAlert("This script requires home zone.");
    return;
}
```

## Pattern 3: Iterating Buildings

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
var targetBuildings = [];

buildings.forEach(function(building) {
    try {
        var name = building.GetBuildingName_string();
        if (name === "Bookbinder") {
            targetBuildings.push(building);
        }
    } catch (e) { }
});
```

## Pattern 4: Iterating Specialists

### Basic Pattern

```javascript
var zone = game.gi.mCurrentPlayerZone;
var specialists = zone.GetSpecialists_vector();

specialists.forEach(function(specialist) {
    try {
        // Filter by player
        if (specialist.getPlayerID() === -1) return;
        
        // Filter by type
        var baseType = specialist.GetBaseType();
        if (baseType !== 1) return; // Only explorers
        
        // Check if idle
        var task = specialist.GetTask();
        var isIdle = (task === null);
        
        // Process specialist
    } catch (e) { }
});
```

### Collecting Idle Specialists

```javascript
function getIdleExplorers() {
    var idleExplorers = [];
    var zone = game.gi.mCurrentPlayerZone;
    var specialists = zone.GetSpecialists_vector();
    
    specialists.forEach(function(specialist) {
        try {
            if (specialist.getPlayerID() === -1) return;
            if (specialist.GetBaseType() !== 1) return; // Explorer
            
            var task = specialist.GetTask();
            if (task === null) {
                idleExplorers.push(specialist);
            }
        } catch (e) { }
    });
    
    return idleExplorers;
}
```

## Pattern 5: Modal Window Creation

### Basic Modal

```javascript
function ShowModal() {
    if ($('#myModal').length === 0) {
        createModalWindow('myModal', 'Modal Title');
        $('#myModal .modal-dialog').css({
            'width': '600px',
            'max-width': '95%'
        });
    }
    
    var html = '<div style="padding: 20px;">';
    html += '<p>Content here</p>';
    html += '</div>';
    
    $('#myModalData').html(html);
    $('#myModal:not(:visible)').modal({ backdrop: "static" });
}
```

### Using Modal Class

```javascript
var modal = new Modal("myModal", "Modal Title", false);
modal.create();
modal.Body().html('<p>Content</p>');
modal.show();
```

## Pattern 6: Resource Access

### Getting Player Resources

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

// Usage
var coinBalance = getPlayerResource('Coin');
```

## Pattern 7: Sending Server Actions

### Building Construction

```javascript
function buildBuilding(buildingID, grid) {
    try {
        game.gi.SendServerAction(50, buildingID, grid, 0, null);
    } catch (e) {
        game.showAlert("Build error: " + e.message);
    }
}

// Usage
var grid = depletedFarm.GetGrid();
buildBuilding(43, grid); // Build Farmfield
```

### Sending Specialist to Task

```javascript
function sendExplorerToTask(explorer, taskType, subTaskID) {
    try {
        var specTask = game.def("Communication.VO::dStartSpecialistTaskVO", true);
        specTask.subTaskID = subTaskID;
        specTask.paramString = "";
        specTask.uniqueID = explorer.GetUniqueID();
        
        game.gi.SendServerAction(95, taskType, 0, 0, specTask);
    } catch (e) {
        game.showAlert("Error sending task: " + e.message);
    }
}
```

## Pattern 8: Settings Persistence

### Saving Settings

```javascript
var mySettings = {
    option1: true,
    option2: "value",
    option3: 100
};

function saveSettings() {
    try {
        var dataToSave = {};
        dataToSave["MyScript"] = mySettings;
        settings.store(dataToSave);
    } catch (e) {
        game.showAlert("Error saving settings: " + e.message);
    }
}
```

### Loading Settings

```javascript
function loadSettings() {
    try {
        var saved = settings.read("MyScript");
        if (saved) {
            // Merge with defaults
            for (var key in saved) {
                if (mySettings.hasOwnProperty(key)) {
                    mySettings[key] = saved[key];
                }
            }
        }
    } catch (e) {
        // Use defaults
    }
}
```

## Pattern 9: Timed Operations

### Using TimedQueue

```javascript
function sendMultipleActions(actions) {
    var queue = new TimedQueue(1000); // 1 second delay
    
    actions.forEach(function(action) {
        queue.add(function() {
            // Perform action
            game.gi.SendServerAction(action.id, action.buildingID, action.grid, 0, null);
        });
    });
    
    queue.run();
}
```

### Using setTimeout

```javascript
function delayedAction(callback, delay) {
    setTimeout(function() {
        callback();
    }, delay);
}
```

## Pattern 10: Chat Logging

### Logging to News Channel

```javascript
function logToChat(message) {
    try {
        globalFlash.gui.mChatPanel.PutMessageToChannelWithoutServer(
            "news",
            new window.runtime.Date(),
            "ScriptName",
            message,
            false,
            false
        );
    } catch (e) {
        // Silent fail
    }
}
```

## Pattern 11: Localization

### Getting Localized Text

```javascript
// Resource name
var resourceName = loca.GetText("RES", "Coin");

// Building name
var buildingName = loca.GetText("BUI", "Bookbinder");

// Label text
var labelText = loca.GetText("LAB", "FindTreasureShort");

// Formatting duration
var duration = loca.FormatDuration(remainingTime, 1);
```

## Pattern 12: Error Handling

### Comprehensive Error Handling

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

### Iteration Error Handling

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

## Pattern 13: State Management

### Global State (Survives Reload)

```javascript
// Initialize global state
if (typeof window.MyScript_TimerID === 'undefined') {
    window.MyScript_TimerID = null;
    window.MyScript_IsRunning = false;
}

// Use global state
function startScript() {
    if (window.MyScript_IsRunning) return;
    window.MyScript_IsRunning = true;
    // Start logic
}

function stopScript() {
    if (window.MyScript_TimerID) {
        clearTimeout(window.MyScript_TimerID);
        window.MyScript_TimerID = null;
    }
    window.MyScript_IsRunning = false;
}
```

## Pattern 14: Production Queue Access

### Checking Production

```javascript
function checkProduction(building, queueType) {
    try {
        var zone = game.gi.mCurrentPlayerZone;
        var queue = zone.GetProductionQueue(queueType);
        
        if (!queue) return null;
        
        var productions = queue.mTimedProductions_vector;
        if (!productions || productions.length === 0) {
            return null; // No production
        }
        
        var item = productions[0];
        var isComplete = item.GetProducedItems() >= item.GetAmount();
        
        return {
            item: item,
            isComplete: isComplete,
            progress: Math.round((item.GetCollectedTime() / item.GetProductionTime()) * 100)
        };
    } catch (e) {
        return null;
    }
}
```

## Pattern 15: Building State Checks

### Checking Building State

```javascript
function isBuildingReady(building) {
    try {
        // Check if building is active
        if (!building.IsBuildingActive()) return false;
        
        // Check if upgrading
        if (building.IsUpgradeInProgress()) return false;
        
        // Check if production is active
        if (building.IsProductionActive()) return false;
        
        return true;
    } catch (e) {
        return false;
    }
}
```

## Best Practices

1. **Always check home zone** before operations
2. **Use try-catch** for all risky operations
3. **Filter by player ID** when iterating specialists/buildings
4. **Use global state** for timers and running flags
5. **Validate data** before using it
6. **Provide user feedback** for errors and operations
7. **Use descriptive variable names**
8. **Comment complex logic**
9. **Handle edge cases** (null, undefined, empty arrays)
10. **Test thoroughly** before deploying

## Related Documentation

- [API Reference](../api-reference/game-interface/game-gi.md)
- [Error Handling](../patterns-best-practices/error-handling.md)
- [State Management](../patterns-best-practices/state-management.md)


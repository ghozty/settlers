# Server Actions API (`SendServerAction`)

The `SendServerAction` method is the primary way to send game actions to the server. It's used for building construction, upgrades, specialist tasks, and other game operations.

## Method Signature

```javascript
game.gi.SendServerAction(actionID, buildingID, grid, rotation, data)
```

**Full Signature**: `SendServerAction(actionID: int, buildingID: int, grid: int, rotation: int, data: Object): dServerAction`

## Parameters

| Parameter | Type | Description | Required | Notes |
|-----------|------|-------------|----------|-------|
| `actionID` | `int` | Action type identifier | Yes | See [Action IDs](#action-ids) |
| `buildingID` | `int` | Building type ID | Yes | 0 for non-build actions |
| `grid` | `int` | Grid position on map | Yes | Building location |
| `rotation` | `int` | Building rotation | Yes | Usually 0 |
| `data` | `Object` | Additional data object | Yes | Usually null, or VO for specialist tasks |

## Return Value

Returns a `dServerAction` object (typically not used by scripts).

## Important Notes

### Sealed Method

This method is **sealed/final** and cannot be:
- Hooked or intercepted
- Overridden or modified
- Monitored via proxy

**Error #1037**: "Cannot Assign to Method" will occur if you try to hook it.

### Server Validation

The server validates all actions:
- Invalid actions fail silently or show error messages
- Prerequisites must be met (resources, zone, building state)
- Rate limiting may apply for rapid actions

### Action Queueing

Actions are queued server-side:
- Multiple rapid actions may be rejected
- Use delays between actions (see [Timing Patterns](#timing-patterns))
- Check prerequisites before sending

## Action IDs

### Action ID 50: Build

**Description**: Construct a new building at the specified grid position.

**Parameters**:
- `actionID`: `50`
- `buildingID`: Building type ID (see [Building IDs](../buildings/building-ids.md))
- `grid`: Grid position where to build
- `rotation`: `0` (usually)
- `data`: `null`

**Usage**:
```javascript
// Build Farmfield (ID: 43)
var grid = depletedFarm.GetGrid();
game.gi.SendServerAction(50, 43, grid, 0, null);

// Build Well (ID: 72)
var grid = depletedWell.GetGrid();
game.gi.SendServerAction(50, 72, grid, 0, null);
```

**Prerequisites**:
- Must be on home zone
- Build queue must have free slots
- Required resources must be available
- Grid position must be valid and empty

**Example from CURSOR_AutoFarms.js**:
```javascript
function _processBuildList(list) {
    list.forEach(function(item) {
        // item.id = building ID
        // item.grid = grid position
        game.gi.SendServerAction(50, item.id, item.grid, 0, null);
    });
}
```

### Action ID 60: Upgrade

**Description**: Upgrade an existing building.

**Parameters**:
- `actionID`: `60`
- `buildingID`: `0` (not used for upgrades)
- `grid`: Grid position of building to upgrade
- `rotation`: `0`
- `data`: `null`

**Usage**:
```javascript
var building = zone.GetBuildingFromGridPosition(grid);
if (building.IsUpgradeAllowed(true)) {
    game.gi.SendServerAction(60, 0, building.GetGrid(), 0, null);
}
```

**Prerequisites**:
- Building must exist at grid position
- Building must be upgradeable
- Required resources must be available
- Building must not be currently upgrading

**Validation Pattern**:
```javascript
function upgradeBuilding(building) {
    try {
        // Check if upgrade is allowed
        if (!building.IsUpgradeAllowed(true)) {
            game.showAlert("Upgrade not allowed");
            return false;
        }
        
        // Check if already upgrading
        if (building.IsUpgradeInProgress()) {
            game.showAlert("Already upgrading");
            return false;
        }
        
        // Send upgrade action
        game.gi.SendServerAction(60, 0, building.GetGrid(), 0, null);
        return true;
    } catch (e) {
        game.showAlert("Upgrade error: " + e.message);
        return false;
    }
}
```

### Action ID 95: Specialist Task

**Description**: Send a specialist (Explorer, Geologist) on a task.

**Parameters**:
- `actionID`: `95`
- `buildingID`: Task type (1 = Treasure, 2 = Adventure, 0 = Geologist search)
- `grid`: `0` (not used)
- `rotation`: `0` (not used)
- `data`: `dStartSpecialistTaskVO` object

**dStartSpecialistTaskVO Properties**:

| Property | Type | Description |
|----------|------|-------------|
| `subTaskID` | `int` | Subtask identifier (see [Task Definitions](../specialists/explorers/explorer-tasks.md)) |
| `paramString` | `string` | Parameter string (usually empty "") |
| `uniqueID` | `dUniqueID` | Specialist's unique identifier |

**Usage - Explorer Task**:
```javascript
// From Specialist_Tasks.js
function _sendExplorerToTask(uniqueId, task) {
    try {
        var specTask = game.def("Communication.VO::dStartSpecialistTaskVO", true);
        var uniqueIdArr = uniqueId.split("_");
        var taskArr = task.split(","); // Format: "1,0" = taskType,subTaskID
        
        specTask.subTaskID = taskArr[1];        // Subtask ID
        specTask.paramString = "";              // Empty string
        specTask.uniqueID = game.def("Communication.VO::dUniqueID").Create(
            uniqueIdArr[0], 
            uniqueIdArr[1]
        );
        
        game.gi.SendServerAction(95, taskArr[0], 0, 0, specTask);
        // taskArr[0] = Task type (1 = Treasure, 2 = Adventure)
    } catch (e) {
        console.error("Error sending task: " + e.message);
    }
}
```

**Task Type Values**:

| Task Type | Description | Subtask IDs |
|-----------|-------------|-------------|
| `1` | Treasure Search | 0-6 (see [Explorer Tasks](../specialists/explorers/explorer-tasks.md)) |
| `2` | Adventure Zone | 0-3 (see [Explorer Tasks](../specialists/explorers/explorer-tasks.md)) |
| `0` | Geologist Search | 0-8 (see [Geologist Tasks](../specialists/geologists/geologist-tasks.md)) |

**Usage - Geologist Task**:
```javascript
// From AG_ExplorerManager.js
function sendGeologistTask(geologist, resourceDef) {
    try {
        var specTask = game.def("Communication.VO::dStartSpecialistTaskVO", true);
        specTask.subTaskID = resourceDef.subTask;  // 0-8
        specTask.paramString = "";
        specTask.uniqueID = geologist.GetUniqueID();
        
        game.gi.SendServerAction(95, resourceDef.taskType, 0, 0, specTask);
        // resourceDef.taskType = 0 (Geologist)
    } catch (e) {
        console.error("Error: " + e.message);
    }
}
```

**Creating dUniqueID**:
```javascript
// Method 1: From specialist object
var uniqueID = specialist.GetUniqueID();

// Method 2: From string (format: "uniqueID1_uniqueID2")
var uniqueIdArr = uniqueId.split("_");
var uniqueID = game.def("Communication.VO::dUniqueID").Create(
    parseInt(uniqueIdArr[0]),
    parseInt(uniqueIdArr[1])
);
```

## Timing Patterns

### Using Delays Between Actions

When sending multiple actions, use delays to avoid rate limiting:

```javascript
// Pattern 1: Using TimedQueue
var queue = new TimedQueue(1000); // 1 second delay

actions.forEach(function(action) {
    queue.add(function() {
        game.gi.SendServerAction(50, action.buildingID, action.grid, 0, null);
    });
});

queue.run();
```

### Pattern 2: Using setTimeout

```javascript
function sendActionsWithDelay(actions, index) {
    if (index >= actions.length) return;
    
    var action = actions[index];
    game.gi.SendServerAction(50, action.buildingID, action.grid, 0, null);
    
    setTimeout(function() {
        sendActionsWithDelay(actions, index + 1);
    }, 1000); // 1 second delay
}

sendActionsWithDelay(actions, 0);
```

### Pattern 3: Random Delays

```javascript
// From CURSOR_AutoFarms.js
function _processBuildList(list) {
    if (list.length === 0) return;
    
    var item = list.shift();
    var delay = Math.floor(Math.random() * (15000 - 5000 + 1) + 5000); // 5-15 seconds
    
    setTimeout(function() {
        game.gi.SendServerAction(50, item.id, item.grid, 0, null);
        _processBuildList(list);
    }, delay);
}
```

## Error Handling

### Common Errors

| Error Code | Meaning | Common Cause | Solution |
|------------|---------|--------------|----------|
| `#1034` | Type Coercion Failed | Wrong parameter type | Verify parameter types |
| `#1037` | Cannot Assign to Method | Trying to hook sealed method | Use direct calls only |
| `#1063` | Argument Count Mismatch | Wrong number of parameters | Verify method signature |
| Silent failure | Server rejected action | Invalid prerequisites | Check resources, zone, state |

### Error Handling Pattern

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

## Performance Notes

- **Network Overhead**: Each action requires server round-trip
- **Rate Limiting**: Server may reject rapid actions
- **Validation**: Server validates all actions (resources, prerequisites)
- **Queueing**: Actions are queued server-side
- **Best Practice**: Use delays between multiple actions (1-2 seconds minimum)

## Related Documentation

- [Action IDs Reference](../actions-messages/action-ids.md) - Complete action ID list
- [Building IDs](../buildings/building-ids.md) - Building type IDs
- [Explorer Tasks](../specialists/explorers/explorer-tasks.md) - Explorer task definitions
- [Geologist Tasks](../specialists/geologists/geologist-tasks.md) - Geologist task definitions
- [VO Definitions](../actions-messages/vo-definitions.md) - Value Object reference

## Examples from Active Scripts

### CURSOR_AutoFarms.js - Build Farm/Well

```javascript
function _processBuildList(list) {
    if (list.length === 0) return;
    
    var item = list.shift();
    var delay = Math.floor(Math.random() * (15000 - 5000 + 1) + 5000);
    
    setTimeout(function() {
        if (!_arRunning) return;
        
        try {
            game.gi.SendServerAction(50, item.id, item.grid, 0, null);
            _logRebuild("Build Command Sent for " + item.name + " at " + item.grid);
        } catch (e) {
            _logRebuild("Error sending build: " + e.message);
        }
        
        _processBuildList(list);
    }, delay);
}
```

### Specialist_Tasks.js - Send Explorer to Task

```javascript
function _sendExplorerToTask(uniqueId, task) {
    try {
        var specTask = game.def("Communication.VO::dStartSpecialistTaskVO", true);
        var uniqueIdArr = uniqueId.split("_");
        var taskArr = task.split(",");
        
        specTask.subTaskID = taskArr[1];
        specTask.paramString = "";
        specTask.uniqueID = game.def("Communication.VO::dUniqueID").Create(
            uniqueIdArr[0], 
            uniqueIdArr[1]
        );
        
        game.gi.SendServerAction(95, taskArr[0], 0, 0, specTask);
        
        console.log("[SpecialistTasks] Sent explorer " + uniqueId + " to task " + task);
    } catch (e) {
        console.error("[SpecialistTasks] Error: " + e.message);
    }
}
```

### AG_ExplorerManager.js - Send Explorer Task

```javascript
sendExplorerTask: function (explorer) {
    try {
        var taskDef = AG_TASK_DEFINITIONS.explorer[this.config.explorerTaskCategory][this.config.explorerTaskId];
        
        var specTask = game.def("Communication.VO::dStartSpecialistTaskVO", true);
        specTask.subTaskID = taskDef.subTask;
        specTask.paramString = "";
        specTask.uniqueID = explorer.GetUniqueID();
        
        game.gi.SendServerAction(95, taskDef.taskType, 0, 0, specTask);
        this.log("Sent: " + explorer.getName(false) + " -> " + taskDef.name);
    } catch (ex) {
        this.log("ERROR sending explorer: " + ex);
    }
}
```


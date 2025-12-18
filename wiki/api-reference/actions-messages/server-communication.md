# Server Communication Patterns

Best practices and patterns for communicating with the game server.

## Communication Methods

### SendServerAction

Used for simple actions with basic parameters:

```javascript
game.gi.SendServerAction(actionID, buildingID, grid, rotation, data)
```

**Use Cases**:
- Building construction (Action 50)
- Building upgrades (Action 60)
- Specialist tasks (Action 95)

### SendMessagetoServer

Used for complex actions requiring Value Objects:

```javascript
game.gi.mClientMessages.SendMessagetoServer(messageID, zoneID, data)
```

**Use Cases**:
- Starting production (Message 91)
- Creating trade offers (Message 1049)

## Communication Patterns

### Pattern: Build Building

```javascript
function buildBuilding(buildingID, grid) {
    try {
        if (!game.gi.isOnHomzone()) {
            throw new Error("Must be on home zone");
        }
        
        game.gi.SendServerAction(50, buildingID, grid, 0, null);
        return true;
    } catch (e) {
        game.showAlert("Build error: " + e.message);
        return false;
    }
}
```

### Pattern: Start Production

```javascript
function startProduction(building, productName, amount) {
    try {
        var dTimedProductionVO = swmmo.getDefinitionByName("Communication.VO::dTimedProductionVO");
        var vo = new dTimedProductionVO();
        vo.productionType = 2;
        vo.type_string = productName;
        vo.amount = amount;
        vo.stacks = 1;
        vo.buildingGrid = building.GetGrid();
        
        game.gi.mClientMessages.SendMessagetoServer(91, game.gi.mCurrentViewedZoneID, vo);
        return true;
    } catch (e) {
        game.showAlert("Production error: " + e.message);
        return false;
    }
}
```

### Pattern: Send Specialist Task

```javascript
function sendSpecialistTask(specialist, taskType, subTaskID) {
    try {
        var specTask = game.def("Communication.VO::dStartSpecialistTaskVO", true);
        specTask.subTaskID = subTaskID;
        specTask.paramString = "";
        specTask.uniqueID = specialist.GetUniqueID();
        
        game.gi.SendServerAction(95, taskType, 0, 0, specTask);
        return true;
    } catch (e) {
        game.showAlert("Task error: " + e.message);
        return false;
    }
}
```

## Timing Patterns

### Using Delays

```javascript
function sendActionsWithDelay(actions, index) {
    if (index >= actions.length) return;
    
    var action = actions[index];
    game.gi.SendServerAction(50, action.buildingID, action.grid, 0, null);
    
    setTimeout(function() {
        sendActionsWithDelay(actions, index + 1);
    }, 1000); // 1 second delay
}
```

### Using TimedQueue

```javascript
var queue = new TimedQueue(1000); // 1 second delay

actions.forEach(function(action) {
    queue.add(function() {
        game.gi.SendServerAction(50, action.buildingID, action.grid, 0, null);
    });
});

queue.run();
```

## Error Handling

### Comprehensive Error Handling

```javascript
function safeSendAction(actionID, buildingID, grid, rotation, data) {
    try {
        if (!game.gi.isOnHomzone()) {
            throw new Error("Must be on home zone");
        }
        
        if (!grid || grid <= 0) {
            throw new Error("Invalid grid position");
        }
        
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

- [Action IDs](action-ids.md) - SendServerAction IDs
- [Message IDs](message-ids.md) - SendMessagetoServer IDs
- [VO Definitions](vo-definitions.md) - Value Object definitions


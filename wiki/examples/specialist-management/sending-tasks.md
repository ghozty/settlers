# Example: Task Assignment Patterns

Complete patterns for assigning tasks to specialists (explorers and geologists).

## Overview

This example demonstrates various patterns for:
- Collecting idle specialists
- Creating task selection interfaces
- Sending specialists to tasks
- Calculating task durations
- Handling task requirements

## Key Patterns

### Pattern: Collecting Idle Specialists

```javascript
function getIdleSpecialists(baseType) {
    var idle = [];
    var zone = game.gi.mCurrentPlayerZone;
    var specialists = zone.GetSpecialists_vector();
    
    specialists.forEach(function(specialist) {
        try {
            if (specialist.getPlayerID() === -1) return;
            if (specialist.GetBaseType() !== baseType) return;
            
            var task = specialist.GetTask();
            if (task === null) {
                idle.push({
                    specialist: specialist,
                    uniqueID: specialist.GetUniqueID(),
                    name: specialist.getName(false)
                });
            }
        } catch (e) { }
    });
    
    return idle;
}
```

### Pattern: Sending Explorer to Task

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

### Pattern: Sending Geologist to Task

```javascript
function sendGeologistToTask(geologist, subTaskID) {
    try {
        var specTask = game.def("Communication.VO::dStartSpecialistTaskVO", true);
        specTask.subTaskID = subTaskID;
        specTask.paramString = "";
        specTask.uniqueID = geologist.GetUniqueID();
        
        game.gi.SendServerAction(95, 0, 0, 0, specTask); // Task type 0 = Geologist
    } catch (e) {
        game.showAlert("Error sending task: " + e.message);
    }
}
```

### Pattern: Batch Task Assignment

```javascript
function sendAllSpecialistsToTask(specialists, taskType, subTaskID) {
    var queue = new TimedQueue(1000); // 1 second delay
    
    specialists.forEach(function(specialist) {
        queue.add(function() {
            sendExplorerToTask(specialist, taskType, subTaskID);
        });
    });
    
    queue.run();
}
```

### Pattern: Task Requirement Checking

```javascript
function canPerformTask(specialist, taskType, subTaskID) {
    var playerLevel = game.player.GetPlayerLevel();
    
    // Check level requirements
    if (taskType === 1) { // Explorer treasure
        if (subTaskID === 0 && playerLevel < 8) return false;
        if (subTaskID === 1 && playerLevel < 20) return false;
        // ... etc
    }
    
    // Check skill requirements
    if (taskType === 1 && subTaskID === 4) { // Artifact Search
        if (!hasArtifactSearchSkill(specialist)) return false;
    }
    
    return true;
}
```

## Related Documentation

- [Explorer Methods](../../api-reference/specialists/explorers/explorer-methods.md) - Explorer API
- [Explorer Tasks](../../api-reference/specialists/explorers/explorer-tasks.md) - Task definitions
- [Server Actions](../../api-reference/game-interface/server-actions.md) - SendServerAction


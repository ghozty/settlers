# General Methods API

Generals (BaseType: 3) lead armies in combat. They are used for military operations and adventure zones.

## Base Type

```javascript
var baseType = specialist.GetBaseType();
// baseType === 3 for Generals
```

## Common Methods

All methods from [Specialist Overview](../specialist-overview.md) apply.

## General Characteristics

### Task Information

Generals have different task types than Explorers/Geologists:

```javascript
var task = general.GetTask();
if (task) {
    // Get task type
    var taskVO = task.CreateTaskVOFromSpecialistTask();
    var taskType = taskVO.type;
    
    // Get localized task name
    var taskName = loca.GetText("LAB", "SpecialistTask" + taskType);
}
```

**Example from 4-specduty.js**:
```javascript
var task = loca.GetText("LAB", "SpecialistTask" + dutySPECIALIST_TASK_TYPE.toString(item.GetTask().CreateTaskVOFromSpecialistTask().type));
```

## Common Patterns

### Pattern: Get Idle Generals

```javascript
function getIdleGenerals() {
    var idle = [];
    var zone = game.gi.mCurrentPlayerZone;
    var specialists = zone.GetSpecialists_vector();
    
    specialists.forEach(function(specialist) {
        try {
            if (specialist.getPlayerID() === -1) return;
            if (specialist.GetBaseType() !== 3) return; // General
            
            var task = specialist.GetTask();
            if (task === null) {
                idle.push(specialist);
            }
        } catch (e) { }
    });
    
    return idle;
}
```

### Pattern: Get Working Generals

```javascript
function getWorkingGenerals() {
    var working = [];
    var zone = game.gi.mCurrentPlayerZone;
    var specialists = zone.GetSpecialists_vector();
    
    specialists.forEach(function(specialist) {
        try {
            if (specialist.getPlayerID() === -1) return;
            if (specialist.GetBaseType() !== 3) return; // General
            
            var task = specialist.GetTask();
            if (task !== null) {
                var remainingTime = task.GetRemainingTime();
                working.push({
                    general: specialist,
                    task: task,
                    remainingTime: remainingTime
                });
            }
        } catch (e) { }
    });
    
    return working;
}
```

## Related Documentation

- [General Skills](general-skills.md) - Combat skills reference
- [General Types](general-types.md) - General type definitions
- [Specialist Overview](../specialist-overview.md) - Base specialist methods


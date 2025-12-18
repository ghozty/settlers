# Marshal Methods API

Marshals (BaseType: 4) are advanced military commanders. They provide enhanced military capabilities compared to generals.

## Base Type

```javascript
var baseType = specialist.GetBaseType();
// baseType === 4 for Marshals
```

## Common Methods

All methods from [Specialist Overview](../specialist-overview.md) apply.

## Marshal Characteristics

### Task Information

Marshals have similar task types to Generals:

```javascript
var task = marshal.GetTask();
if (task) {
    // Get task type
    var taskVO = task.CreateTaskVOFromSpecialistTask();
    var taskType = taskVO.type;
    
    // Get localized task name
    var taskName = loca.GetText("LAB", "SpecialistTask" + taskType);
}
```

## Common Patterns

### Pattern: Get Idle Marshals

```javascript
function getIdleMarshals() {
    var idle = [];
    var zone = game.gi.mCurrentPlayerZone;
    var specialists = zone.GetSpecialists_vector();
    
    specialists.forEach(function(specialist) {
        try {
            if (specialist.getPlayerID() === -1) return;
            if (specialist.GetBaseType() !== 4) return; // Marshal
            
            var task = specialist.GetTask();
            if (task === null) {
                idle.push(specialist);
            }
        } catch (e) { }
    });
    
    return idle;
}
```

## Related Documentation

- [Marshal Skills](marshal-skills.md) - Marshal skills reference
- [Marshal Types](marshal-types.md) - Marshal type definitions
- [Specialist Overview](../specialist-overview.md) - Base specialist methods


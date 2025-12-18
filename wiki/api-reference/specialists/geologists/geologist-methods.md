# Geologist Methods API

Geologists (BaseType: 2) search for resource deposits. They can find various resource types including ores, stone, marble, and other materials.

## Base Type

```javascript
var baseType = specialist.GetBaseType();
// baseType === 2 for Geologists
```

## Common Methods

All methods from [Specialist Overview](../specialist-overview.md) apply.

## Task Assignment

### Sending Geologist to Task

```javascript
function sendGeologistToTask(geologist, subTaskID) {
    try {
        var specTask = game.def("Communication.VO::dStartSpecialistTaskVO", true);
        specTask.subTaskID = subTaskID;
        specTask.paramString = "";
        specTask.uniqueID = geologist.GetUniqueID();
        
        game.gi.SendServerAction(95, 0, 0, 0, specTask);
        // Task type 0 = Geologist search
    } catch (e) {
        game.showAlert("Error sending task: " + e.message);
    }
}
```

**Task Type**: `0` (Geologist)

**Subtask IDs**: 0-8 (see [Geologist Tasks](geologist-tasks.md))

**Usage**:
```javascript
// Send geologist to find Iron Ore (subTaskID: 3)
sendGeologistToTask(geologist, 3);
```

## Task Duration Calculation

### Calculate Task Duration

```javascript
function getGeologistTaskDuration(geologist, subTaskID) {
    try {
        // Get task definition (taskType = 0 for Geologist)
        var task = swmmo.getDefinitionByName("global").specialistTaskDefinitions_vector[0];
        var subTask = task.subtasks_vector[subTaskID];
        var baseDuration = subTask.duration;
        
        // Apply skill bonuses
        var calculatedTime = baseDuration;
        geologist.getSkillTree().getItems_vector().concat(geologist.skills.getItems_vector()).forEach(function(skill) {
            var vectorIndex = skill.getLevel() - 1;
            if (vectorIndex === -1) return;
            
            skill.getDefinition().level_vector[vectorIndex].forEach(function(skillDef) {
                var taskName = task.taskName_string;
                var subTaskName = subTask.taskType_string;
                
                // Check if skill applies to this task type
                if (((skillDef.type_string.length === 0) || 
                     (skillDef.type_string == taskName + subTaskName)) && 
                    (skillDef.modifier_string.toLowerCase() === "searchtime")) {
                    calculatedTime = (skillDef.value != 0) ? 
                        skillDef.value : 
                        ((calculatedTime * skillDef.multiplier) + skillDef.adder);
                }
            });
        });
        
        // Apply time bonus
        calculatedTime = (calculatedTime / geologist.GetSpecialistDescription().GetTimeBonus()) * 100;
        
        return loca.FormatDuration(calculatedTime, 1);
    } catch (e) {
        return "Error";
    }
}
```

## Common Patterns

### Pattern: Get Idle Geologists

```javascript
function getIdleGeologists() {
    var idle = [];
    var zone = game.gi.mCurrentPlayerZone;
    var specialists = zone.GetSpecialists_vector();
    
    specialists.forEach(function(specialist) {
        try {
            if (specialist.getPlayerID() === -1) return;
            if (specialist.GetBaseType() !== 2) return; // Geologist
            
            var task = specialist.GetTask();
            if (task === null) {
                idle.push(specialist);
            }
        } catch (e) { }
    });
    
    return idle;
}
```

### Pattern: Check Resource Requirements

```javascript
function canFindResource(geologist, subTaskID) {
    var playerLevel = game.player.GetPlayerLevel();
    var levelRequirements = [0, 9, 19, 20, 23, 24, 60, 61, 62];
    
    if (subTaskID >= 0 && subTaskID < levelRequirements.length) {
        return playerLevel >= levelRequirements[subTaskID];
    }
    
    return false;
}
```

## Related Documentation

- [Geologist Tasks](geologist-tasks.md) - Complete task definitions
- [Geologist Skills](geologist-skills.md) - Skill tree reference
- [Geologist Types](geologist-types.md) - Geologist type definitions
- [Specialist Overview](../specialist-overview.md) - Base specialist methods


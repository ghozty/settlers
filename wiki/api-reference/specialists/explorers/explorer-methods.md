# Explorer Methods API

Explorers (BaseType: 1) search for treasures and adventure zones. They can perform treasure searches, adventure zone searches, and special tasks like Artifact Search.

## Base Type

```javascript
var baseType = specialist.GetBaseType();
// baseType === 1 for Explorers
```

## Common Methods

All methods from [Specialist Overview](../specialist-overview.md) apply.

## Task Assignment

### Sending Explorer to Task

```javascript
function sendExplorerToTask(explorer, taskType, subTaskID) {
    try {
        var specTask = game.def("Communication.VO::dStartSpecialistTaskVO", true);
        specTask.subTaskID = subTaskID;
        specTask.paramString = "";
        specTask.uniqueID = explorer.GetUniqueID();
        
        game.gi.SendServerAction(95, taskType, 0, 0, specTask);
        // taskType: 1 = Treasure, 2 = Adventure
    } catch (e) {
        game.showAlert("Error sending task: " + e.message);
    }
}
```

**Task Types**:
- `1`: Treasure Search
- `2`: Adventure Zone Search

**Related**: See [Explorer Tasks](explorer-tasks.md) for complete task definitions.

## Skill Checking

### Check for Artifact Search Skill

```javascript
function hasArtifactSearchSkill(explorer) {
    try {
        var hasSkill = false;
        explorer.getSkillTree().getItems_vector().forEach(function(skill) {
            if (skill.getId() === 39 && skill.getLevel() > 0) {
                hasSkill = true; // Artifact Search skill
            }
        });
        return hasSkill;
    } catch (e) {
        return false;
    }
}
```

### Check for Bean a Collada Skill

```javascript
function hasBeanAColladaSkill(explorer) {
    try {
        var hasSkill = false;
        explorer.getSkillTree().getItems_vector().forEach(function(skill) {
            if (skill.getId() === 40 && skill.getLevel() > 0) {
                hasSkill = true; // Bean a Collada skill
            }
        });
        return hasSkill;
    } catch (e) {
        return false;
    }
}
```

**Example from Specialist_Tasks.js**:
```javascript
if (baseType === 1) {
    var hasArtSkill = false;
    var hasBeanSkill = false;
    
    try {
        specialist.getSkillTree().getItems_vector().forEach(function(skill) {
            if (skill.getId() === 39 && skill.getLevel() > 0) {
                hasArtSkill = true; // Artifact Search
            }
            if (skill.getId() === 40 && skill.getLevel() > 0) {
                hasBeanSkill = true; // Bean a Collada
            }
        });
    } catch (e) { }
}
```

## Task Duration Calculation

### Calculate Task Duration

```javascript
function getExplorerTaskDuration(explorer, taskType, subTaskID) {
    try {
        // Get task definition
        var task = swmmo.getDefinitionByName("global").specialistTaskDefinitions_vector[taskType];
        var subTask = task.subtasks_vector[subTaskID];
        var baseDuration = subTask.duration;
        
        // Apply skill bonuses
        var calculatedTime = baseDuration;
        explorer.getSkillTree().getItems_vector().concat(explorer.skills.getItems_vector()).forEach(function(skill) {
            var vectorIndex = skill.getLevel() - 1;
            if (vectorIndex === -1) return;
            
            skill.getDefinition().level_vector[vectorIndex].forEach(function(skillDef) {
                var taskName = task.taskName_string;
                var subTaskName = subTask.taskType_string;
                
                // Check if skill applies to this task
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
        calculatedTime = (calculatedTime / explorer.GetSpecialistDescription().GetTimeBonus()) * 100;
        
        return calculatedTime;
    } catch (e) {
        return 0;
    }
}
```

**Example from Specialist_Tasks.js**:
```javascript
function getExplorerTaskDuration(explorer, taskValue) {
    try {
        var taskArr = taskValue.split(",");
        var taskType = parseInt(taskArr[0]);
        var subTaskID = parseInt(taskArr[1]);
        
        var task = swmmo.getDefinitionByName("global").specialistTaskDefinitions_vector[taskType];
        var subTask = task.subtasks_vector[subTaskID];
        var baseDuration = subTask.duration;
        
        var calculatedTime = baseDuration;
        explorer.getSkillTree().getItems_vector().concat(explorer.skills.getItems_vector()).forEach(function(skill) {
            var vectorIndex = skill.getLevel() - 1;
            if (vectorIndex === -1) return;
            
            skill.getDefinition().level_vector[vectorIndex].forEach(function(skillDef) {
                var taskName = task.taskName_string;
                var subTaskName = subTask.taskType_string;
                
                if (((skillDef.type_string.length === 0) || 
                     (skillDef.type_string == taskName + subTaskName)) && 
                    (skillDef.modifier_string.toLowerCase() === "searchtime")) {
                    calculatedTime = (skillDef.value != 0) ? 
                        skillDef.value : 
                        ((calculatedTime * skillDef.multiplier) + skillDef.adder);
                }
            });
        });
        
        calculatedTime = (calculatedTime / explorer.GetSpecialistDescription().GetTimeBonus()) * 100;
        
        return loca.FormatDuration(calculatedTime, 1);
    } catch (e) {
        return "Error";
    }
}
```

## Common Patterns

### Pattern: Get Idle Explorers

```javascript
function getIdleExplorers() {
    var idle = [];
    var zone = game.gi.mCurrentPlayerZone;
    var specialists = zone.GetSpecialists_vector();
    
    specialists.forEach(function(specialist) {
        try {
            if (specialist.getPlayerID() === -1) return;
            if (specialist.GetBaseType() !== 1) return; // Explorer
            
            var task = specialist.GetTask();
            if (task === null) {
                idle.push(specialist);
            }
        } catch (e) { }
    });
    
    return idle;
}
```

### Pattern: Check Explorer Skills

```javascript
function checkExplorerSkills(explorer) {
    var skills = {
        artifactSearch: false,
        beanACollada: false
    };
    
    try {
        explorer.getSkillTree().getItems_vector().forEach(function(skill) {
            if (skill.getId() === 39 && skill.getLevel() > 0) {
                skills.artifactSearch = true;
            }
            if (skill.getId() === 40 && skill.getLevel() > 0) {
                skills.beanACollada = true;
            }
        });
    } catch (e) { }
    
    return skills;
}
```

## Related Documentation

- [Explorer Tasks](explorer-tasks.md) - Complete task definitions
- [Explorer Skills](explorer-skills.md) - Skill tree reference
- [Explorer Types](explorer-types.md) - Explorer type definitions
- [Specialist Overview](../specialist-overview.md) - Base specialist methods


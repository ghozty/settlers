# Explorer Skills Reference

Complete reference of explorer skills, their IDs, effects, and usage.

## Skill Tree Access

```javascript
var skillTree = explorer.getSkillTree();
var skills = skillTree.getItems_vector();

skills.forEach(function(skill) {
    var skillId = skill.getId();
    var skillLevel = skill.getLevel();
    // Process skill
});
```

## Special Skills

### Skill ID 39: Artifact Search

**Description**: Allows explorer to perform Artifact Search task.

**Task**: Artifact Search (Task Type: 1, Subtask ID: 4)

**Checking**:
```javascript
function hasArtifactSearchSkill(explorer) {
    try {
        var hasSkill = false;
        explorer.getSkillTree().getItems_vector().forEach(function(skill) {
            if (skill.getId() === 39 && skill.getLevel() > 0) {
                hasSkill = true;
            }
        });
        return hasSkill;
    } catch (e) {
        return false;
    }
}
```

**Usage**:
```javascript
if (hasArtifactSearchSkill(explorer)) {
    // Can perform Artifact Search
    sendExplorerToTask(explorer, 1, 4);
}
```

### Skill ID 40: Bean a Collada

**Description**: Allows explorer to perform Bean a Collada task.

**Task**: Bean a Collada (Task Type: 1, Subtask ID: 5)

**Checking**:
```javascript
function hasBeanAColladaSkill(explorer) {
    try {
        var hasSkill = false;
        explorer.getSkillTree().getItems_vector().forEach(function(skill) {
            if (skill.getId() === 40 && skill.getLevel() > 0) {
                hasSkill = true;
            }
        });
        return hasSkill;
    } catch (e) {
        return false;
    }
}
```

**Usage**:
```javascript
if (hasBeanAColladaSkill(explorer)) {
    // Can perform Bean a Collada
    sendExplorerToTask(explorer, 1, 5);
}
```

## Skill Bonuses

### Search Time Modifiers

Skills can modify task duration through `searchtime` modifier:

```javascript
function applySkillBonuses(explorer, baseDuration, taskName, subTaskName) {
    var calculatedTime = baseDuration;
    
    explorer.getSkillTree().getItems_vector().concat(explorer.skills.getItems_vector()).forEach(function(skill) {
        var vectorIndex = skill.getLevel() - 1;
        if (vectorIndex === -1) return;
        
        skill.getDefinition().level_vector[vectorIndex].forEach(function(skillDef) {
            // Check if skill applies to this task type
            if (((skillDef.type_string.length === 0) || 
                 (skillDef.type_string == taskName + subTaskName)) && 
                (skillDef.modifier_string.toLowerCase() === "searchtime")) {
                
                if (skillDef.value !== 0) {
                    calculatedTime = skillDef.value;
                } else {
                    calculatedTime = (calculatedTime * skillDef.multiplier) + skillDef.adder;
                }
            }
        });
    });
    
    return calculatedTime;
}
```

**Skill Definition Properties**:
- `type_string`: Task type filter (empty = applies to all, or specific task name)
- `modifier_string`: Modifier type (e.g., "searchtime")
- `value`: Direct value override (if not 0)
- `multiplier`: Multiplier for calculation
- `adder`: Additive value

## Complete Skill Check Pattern

```javascript
function checkExplorerSkills(explorer) {
    var skills = {
        artifactSearch: false,
        beanACollada: false,
        allSkills: []
    };
    
    try {
        explorer.getSkillTree().getItems_vector().forEach(function(skill) {
            var skillId = skill.getId();
            var skillLevel = skill.getLevel();
            
            if (skillId === 39 && skillLevel > 0) {
                skills.artifactSearch = true;
            }
            if (skillId === 40 && skillLevel > 0) {
                skills.beanACollada = true;
            }
            
            skills.allSkills.push({
                id: skillId,
                level: skillLevel
            });
        });
    } catch (e) { }
    
    return skills;
}
```

## Time Bonus

Specialists have a time bonus that affects all task durations:

```javascript
var timeBonus = explorer.GetSpecialistDescription().GetTimeBonus();
var adjustedTime = (baseTime / timeBonus) * 100;
```

## Related Documentation

- [Explorer Methods](explorer-methods.md) - Explorer API methods
- [Explorer Tasks](explorer-tasks.md) - Task definitions
- [Explorer Types](explorer-types.md) - Explorer type definitions


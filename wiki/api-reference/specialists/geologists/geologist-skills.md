# Geologist Skills Reference

Complete reference of geologist skills, their IDs, effects, and usage.

## Skill Tree Access

```javascript
var skillTree = geologist.getSkillTree();
var skills = skillTree.getItems_vector();

skills.forEach(function(skill) {
    var skillId = skill.getId();
    var skillLevel = skill.getLevel();
    // Process skill
});
```

## Skill Bonuses

### Search Time Modifiers

Skills can modify task duration through `searchtime` modifier:

```javascript
function applySkillBonuses(geologist, baseDuration, taskName, subTaskName) {
    var calculatedTime = baseDuration;
    
    geologist.getSkillTree().getItems_vector().concat(geologist.skills.getItems_vector()).forEach(function(skill) {
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

## Time Bonus

Geologists have a time bonus that affects all task durations:

```javascript
var timeBonus = geologist.GetSpecialistDescription().GetTimeBonus();
var adjustedTime = (baseTime / timeBonus) * 100;
```

## Complete Skill Check Pattern

```javascript
function checkGeologistSkills(geologist) {
    var skills = {
        allSkills: []
    };
    
    try {
        geologist.getSkillTree().getItems_vector().forEach(function(skill) {
            var skillId = skill.getId();
            var skillLevel = skill.getLevel();
            
            skills.allSkills.push({
                id: skillId,
                level: skillLevel
            });
        });
    } catch (e) { }
    
    return skills;
}
```

## Related Documentation

- [Geologist Methods](geologist-methods.md) - Geologist API methods
- [Geologist Tasks](geologist-tasks.md) - Task definitions
- [Geologist Types](geologist-types.md) - Geologist type definitions


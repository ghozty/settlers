# General Skills Reference

Complete reference of general skills, their IDs, effects, and usage.

## Skill Tree Access

```javascript
var skillTree = general.getSkillTree();
var skills = skillTree.getItems_vector();

skills.forEach(function(skill) {
    var skillId = skill.getId();
    var skillLevel = skill.getLevel();
    // Process skill
});
```

## Combat Skills

Generals have combat-related skills that affect military operations:

- Army leadership
- Combat bonuses
- Unit effectiveness
- Adventure zone performance

## Skill Bonuses

Skills can modify various combat parameters:

```javascript
function checkGeneralSkills(general) {
    var skills = {
        allSkills: []
    };
    
    try {
        general.getSkillTree().getItems_vector().forEach(function(skill) {
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

## Time Bonus

Generals have a time bonus that may affect task durations:

```javascript
var timeBonus = general.GetSpecialistDescription().GetTimeBonus();
```

## Related Documentation

- [General Methods](general-methods.md) - General API methods
- [General Types](general-types.md) - General type definitions
- [Specialist Overview](../specialist-overview.md) - Base specialist methods


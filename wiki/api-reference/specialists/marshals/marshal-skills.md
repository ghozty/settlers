# Marshal Skills Reference

Complete reference of marshal skills, their IDs, effects, and usage.

## Skill Tree Access

```javascript
var skillTree = marshal.getSkillTree();
var skills = skillTree.getItems_vector();

skills.forEach(function(skill) {
    var skillId = skill.getId();
    var skillLevel = skill.getLevel();
    // Process skill
});
```

## Advanced Combat Skills

Marshals have advanced combat-related skills that provide superior military capabilities:

- Enhanced army leadership
- Superior combat bonuses
- Advanced unit effectiveness
- Enhanced adventure zone performance

## Skill Bonuses

Skills can modify various combat parameters:

```javascript
function checkMarshalSkills(marshal) {
    var skills = {
        allSkills: []
    };
    
    try {
        marshal.getSkillTree().getItems_vector().forEach(function(skill) {
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

Marshals have a time bonus that may affect task durations:

```javascript
var timeBonus = marshal.GetSpecialistDescription().GetTimeBonus();
```

## Related Documentation

- [Marshal Methods](marshal-methods.md) - Marshal API methods
- [Marshal Types](marshal-types.md) - Marshal type definitions
- [Specialist Overview](../specialist-overview.md) - Base specialist methods


# General Types Reference

Complete reference of general types and their characteristics.

## General Base Type

All generals have BaseType: `3`

```javascript
var baseType = specialist.GetBaseType();
// baseType === 3 for Generals
```

## General Type ID

Each general has a specific type ID (different from base type):

```javascript
var typeID = general.GetType();
// Different general variants have different type IDs
```

## Getting General Types

### From Specialist Definition

```javascript
function getGeneralTypes() {
    var spec = game.def("Specialists::cSpecialist");
    var result = {};
    
    for (var i = 0; i < 100; i++) {
        var def = spec.GetSpecialistDescriptionForType(i);
        if (def != null && def.getBaseType() == 3) {
            result[i] = def.getName_string();
        }
    }
    
    return result;
}
```

## Common General Names

General names are retrieved via:
```javascript
var name = general.getName(false);
```

**Common General Names** (examples):
- `"General"` - Basic general
- Other variants as defined by the game

## General Characteristics

### Time Bonus

Each general type has a time bonus that may affect task durations:

```javascript
var timeBonus = general.GetSpecialistDescription().GetTimeBonus();
```

### Skills

Different general types may have different skill trees or starting skills. Check skills via:

```javascript
var skillTree = general.getSkillTree();
var skills = skillTree.getItems_vector();
```

## Usage Examples

### Filter Generals by Type

```javascript
function getGeneralsByType(typeID) {
    var filtered = [];
    var zone = game.gi.mCurrentPlayerZone;
    var specialists = zone.GetSpecialists_vector();
    
    specialists.forEach(function(specialist) {
        try {
            if (specialist.getPlayerID() === -1) return;
            if (specialist.GetBaseType() !== 3) return; // General
            
            if (specialist.GetType() === typeID) {
                filtered.push(specialist);
            }
        } catch (e) { }
    });
    
    return filtered;
}
```

## Related Documentation

- [General Methods](general-methods.md) - General API methods
- [General Skills](general-skills.md) - Combat skills reference
- [Specialist Overview](../specialist-overview.md) - Base specialist methods


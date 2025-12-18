# Geologist Types Reference

Complete reference of geologist types and their characteristics.

## Geologist Base Type

All geologists have BaseType: `2`

```javascript
var baseType = specialist.GetBaseType();
// baseType === 2 for Geologists
```

## Geologist Type ID

Each geologist has a specific type ID (different from base type):

```javascript
var typeID = geologist.GetType();
// Different geologist variants have different type IDs
```

## Getting Geologist Types

### From Specialist Definition

```javascript
function getGeologistTypes() {
    var spec = game.def("Specialists::cSpecialist");
    var result = {};
    
    for (var i = 0; i < 100; i++) {
        var def = spec.GetSpecialistDescriptionForType(i);
        if (def != null && def.getBaseType() == 2) {
            result[i] = def.getName_string();
        }
    }
    
    return result;
}
```

**Example from 4-specialists.js**:
```javascript
function specGetTypesForType() {
    var spec = game.def("Specialists::cSpecialist");
    var result = {};
    for (i = 0; i < 100; i++) {
        var def = spec.GetSpecialistDescriptionForType(i);
        if (def != null && def.getBaseType() == specType) {
            result[i] = def.getName_string();
        }
    }
    return result;
}
```

## Common Geologist Names

Geologist names are retrieved via:
```javascript
var name = geologist.getName(false);
```

**Common Geologist Names** (examples):
- `"Geologist"` - Basic geologist
- `"Merry Geologist"` - Merry variant
- Other variants as defined by the game

## Geologist Characteristics

### Time Bonus

Each geologist type has a time bonus that affects task duration:

```javascript
var timeBonus = geologist.GetSpecialistDescription().GetTimeBonus();
var adjustedTime = (baseTime / timeBonus) * 100;
```

### Skills

Different geologist types may have different skill trees or starting skills. Check skills via:

```javascript
var skillTree = geologist.getSkillTree();
var skills = skillTree.getItems_vector();
```

## Type-Specific Task Configuration

Geologist types can have default task configurations:

```javascript
// From 4-specialists.js pattern
var geoDefTaskByType = {
    // typeID: defaultTaskValue
    // Example: 5: "0,3" (Iron Ore search for type 5)
};
```

## Usage Examples

### Filter Geologists by Type

```javascript
function getGeologistsByType(typeID) {
    var filtered = [];
    var zone = game.gi.mCurrentPlayerZone;
    var specialists = zone.GetSpecialists_vector();
    
    specialists.forEach(function(specialist) {
        try {
            if (specialist.getPlayerID() === -1) return;
            if (specialist.GetBaseType() !== 2) return; // Geologist
            
            if (specialist.GetType() === typeID) {
                filtered.push(specialist);
            }
        } catch (e) { }
    });
    
    return filtered;
}
```

### Get All Geologist Types

```javascript
function getAllGeologistTypes() {
    var types = {};
    var zone = game.gi.mCurrentPlayerZone;
    var specialists = zone.GetSpecialists_vector();
    
    specialists.forEach(function(specialist) {
        try {
            if (specialist.getPlayerID() === -1) return;
            if (specialist.GetBaseType() !== 2) return; // Geologist
            
            var typeID = specialist.GetType();
            var name = specialist.getName(false);
            
            if (!types[typeID]) {
                types[typeID] = name;
            }
        } catch (e) { }
    });
    
    return types;
}
```

## Related Documentation

- [Geologist Methods](geologist-methods.md) - Geologist API methods
- [Geologist Tasks](geologist-tasks.md) - Task definitions
- [Geologist Skills](geologist-skills.md) - Skill tree reference
- [Specialist Overview](../specialist-overview.md) - Base specialist methods


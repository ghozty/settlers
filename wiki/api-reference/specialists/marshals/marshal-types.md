# Marshal Types Reference

Complete reference of marshal types and their characteristics.

## Marshal Base Type

All marshals have BaseType: `4`

```javascript
var baseType = specialist.GetBaseType();
// baseType === 4 for Marshals
```

## Marshal Type ID

Each marshal has a specific type ID (different from base type):

```javascript
var typeID = marshal.GetType();
// Different marshal variants have different type IDs
```

## Getting Marshal Types

### From Specialist Definition

```javascript
function getMarshalTypes() {
    var spec = game.def("Specialists::cSpecialist");
    var result = {};
    
    for (var i = 0; i < 100; i++) {
        var def = spec.GetSpecialistDescriptionForType(i);
        if (def != null && def.getBaseType() == 4) {
            result[i] = def.getName_string();
        }
    }
    
    return result;
}
```

## Common Marshal Names

Marshal names are retrieved via:
```javascript
var name = marshal.getName(false);
```

**Common Marshal Names** (examples):
- `"Marshal"` - Basic marshal
- Other variants as defined by the game

## Marshal Characteristics

### Time Bonus

Each marshal type has a time bonus that may affect task durations:

```javascript
var timeBonus = marshal.GetSpecialistDescription().GetTimeBonus();
```

### Skills

Different marshal types may have different skill trees or starting skills. Check skills via:

```javascript
var skillTree = marshal.getSkillTree();
var skills = skillTree.getItems_vector();
```

## Usage Examples

### Filter Marshals by Type

```javascript
function getMarshalsByType(typeID) {
    var filtered = [];
    var zone = game.gi.mCurrentPlayerZone;
    var specialists = zone.GetSpecialists_vector();
    
    specialists.forEach(function(specialist) {
        try {
            if (specialist.getPlayerID() === -1) return;
            if (specialist.GetBaseType() !== 4) return; // Marshal
            
            if (specialist.GetType() === typeID) {
                filtered.push(specialist);
            }
        } catch (e) { }
    });
    
    return filtered;
}
```

## Related Documentation

- [Marshal Methods](marshal-methods.md) - Marshal API methods
- [Marshal Skills](marshal-skills.md) - Marshal skills reference
- [Specialist Overview](../specialist-overview.md) - Base specialist methods


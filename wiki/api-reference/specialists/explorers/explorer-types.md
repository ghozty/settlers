# Explorer Types Reference

Complete reference of explorer types and their characteristics.

## Explorer Base Type

All explorers have BaseType: `1`

```javascript
var baseType = specialist.GetBaseType();
// baseType === 1 for Explorers
```

## Explorer Type ID

Each explorer has a specific type ID (different from base type):

```javascript
var typeID = explorer.GetType();
// Different explorer variants have different type IDs
```

## Getting Explorer Types

### From Specialist Definition

```javascript
function getExplorerTypes() {
    var spec = game.def("Specialists::cSpecialist");
    var result = {};
    
    for (var i = 0; i < 100; i++) {
        var def = spec.GetSpecialistDescriptionForType(i);
        if (def != null && def.getBaseType() == 1) {
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

## Common Explorer Names

Explorer names are retrieved via:
```javascript
var name = explorer.getName(false);
```

**Common Explorer Names** (examples):
- `"Explorer"` - Basic explorer
- `"Ghost Explorer"` - Ghost variant
- `"Blacktree Explorer"` - Blacktree variant
- `"Intrepid Explorer"` - Intrepid variant
- Other variants as defined by the game

## Explorer Characteristics

### Time Bonus

Each explorer type has a time bonus that affects task duration:

```javascript
var timeBonus = explorer.GetSpecialistDescription().GetTimeBonus();
var adjustedTime = (baseTime / timeBonus) * 100;
```

### Skills

Different explorer types may have different skill trees or starting skills. Check skills via:

```javascript
var skillTree = explorer.getSkillTree();
var skills = skillTree.getItems_vector();
```

## Type-Specific Task Configuration

Explorer types can have default task configurations:

```javascript
// From 4-specialists.js pattern
var explDefTaskByType = {
    // typeID: defaultTaskValue
    // Example: 5: "1,0" (Short Treasure for type 5)
};
```

## Usage Examples

### Filter Explorers by Type

```javascript
function getExplorersByType(typeID) {
    var filtered = [];
    var zone = game.gi.mCurrentPlayerZone;
    var specialists = zone.GetSpecialists_vector();
    
    specialists.forEach(function(specialist) {
        try {
            if (specialist.getPlayerID() === -1) return;
            if (specialist.GetBaseType() !== 1) return; // Explorer
            
            if (specialist.GetType() === typeID) {
                filtered.push(specialist);
            }
        } catch (e) { }
    });
    
    return filtered;
}
```

### Get All Explorer Types

```javascript
function getAllExplorerTypes() {
    var types = {};
    var zone = game.gi.mCurrentPlayerZone;
    var specialists = zone.GetSpecialists_vector();
    
    specialists.forEach(function(specialist) {
        try {
            if (specialist.getPlayerID() === -1) return;
            if (specialist.GetBaseType() !== 1) return; // Explorer
            
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

- [Explorer Methods](explorer-methods.md) - Explorer API methods
- [Explorer Tasks](explorer-tasks.md) - Task definitions
- [Explorer Skills](explorer-skills.md) - Skill tree reference
- [Specialist Overview](../specialist-overview.md) - Base specialist methods


# Complete Specialist Types Reference

Complete reference of all specialist types and their characteristics.

## Specialist Base Types

| Base Type | Specialist Type | Description |
|-----------|----------------|-------------|
| 1 | Explorer | Searches for treasures and adventure zones |
| 2 | Geologist | Searches for resource deposits |
| 3 | General | Leads armies in combat |
| 4 | Marshal | Advanced military commander |

## Getting Specialist Types

### From Specialist Definition

```javascript
function getAllSpecialistTypes() {
    var spec = game.def("Specialists::cSpecialist");
    var result = {};
    
    for (var i = 0; i < 100; i++) {
        var def = spec.GetSpecialistDescriptionForType(i);
        if (def != null) {
            var baseType = def.getBaseType();
            var typeName = def.getName_string();
            
            if (!result[baseType]) {
                result[baseType] = [];
            }
            
            result[baseType].push({
                typeID: i,
                name: typeName
            });
        }
    }
    
    return result;
}
```

## Explorer Types

BaseType: 1

Common names:
- Explorer
- Ghost Explorer
- Blacktree Explorer
- Intrepid Explorer

## Geologist Types

BaseType: 2

Common names:
- Geologist
- Merry Geologist

## General Types

BaseType: 3

Common names:
- General

## Marshal Types

BaseType: 4

Common names:
- Marshal

## Related Documentation

- [Explorer Types](../api-reference/specialists/explorers/explorer-types.md) - Explorer type definitions
- [Geologist Types](../api-reference/specialists/geologists/geologist-types.md) - Geologist type definitions
- [General Types](../api-reference/specialists/generals/general-types.md) - General type definitions
- [Marshal Types](../api-reference/specialists/marshals/marshal-types.md) - Marshal type definitions


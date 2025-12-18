# Example: Geologist Management

Example of managing geologists and their tasks.

## Overview

This example demonstrates how to:
- Collect idle geologists
- Display geologist information
- Send geologists to resource searches

## Key Functions

### Collecting Geologists

```javascript
function getIdleGeologists() {
    var idle = [];
    var zone = game.gi.mCurrentPlayerZone;
    var specialists = zone.GetSpecialists_vector();
    
    specialists.forEach(function(specialist) {
        try {
            if (specialist.getPlayerID() === -1) return;
            if (specialist.GetBaseType() !== 2) return; // Geologist
            
            var task = specialist.GetTask();
            if (task === null) {
                idle.push({
                    specialist: specialist,
                    uniqueID: specialist.GetUniqueID(),
                    name: specialist.getName(false)
                });
            }
        } catch (e) { }
    });
    
    return idle;
}
```

## Related Documentation

- [Geologist Methods](../../api-reference/specialists/geologists/geologist-methods.md) - Geologist API
- [Geologist Tasks](../../api-reference/specialists/geologists/geologist-tasks.md) - Task definitions


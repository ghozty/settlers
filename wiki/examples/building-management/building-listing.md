# Example: Building Listing

Example of listing and categorizing buildings.

## Overview

This example demonstrates:
- Iterating buildings
- Categorizing buildings
- Filtering by type

## Key Functions

### Listing Buildings

```javascript
function listBuildings() {
    var buildings = [];
    var zone = game.gi.mCurrentPlayerZone;
    var buildingContainer = zone.mStreetDataMap.mBuildingContainer;
    
    buildingContainer.forEach(function(building) {
        try {
            buildings.push({
                name: building.GetBuildingName_string(),
                grid: building.GetGrid(),
                level: building.GetLevel()
            });
        } catch (e) { }
    });
    
    return buildings;
}
```

## Related Documentation

- [Building Methods](../../api-reference/buildings/building-methods.md) - Building API
- [Building Categories](../../api-reference/buildings/building-categories.md) - Building categories


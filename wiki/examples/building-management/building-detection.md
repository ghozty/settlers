# Example: Building Detection Patterns

Complete patterns for detecting and scanning buildings on the map.

## Overview

This example demonstrates various patterns for:
- Iterating through buildings
- Filtering buildings by type
- Detecting building states
- Finding specific building types

## Key Patterns

### Basic Building Iteration

```javascript
function scanBuildings() {
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

### Filtering by Building Name

```javascript
function findBuildingsByName(buildingName) {
    var found = [];
    var zone = game.gi.mCurrentPlayerZone;
    var buildings = zone.mStreetDataMap.mBuildingContainer;
    
    buildings.forEach(function(building) {
        try {
            if (building.GetBuildingName_string() === buildingName) {
                found.push(building);
            }
        } catch (e) { }
    });
    
    return found;
}
```

### Detecting Depleted Deposits

```javascript
function findDepletedDeposits() {
    var depleted = [];
    var zone = game.gi.mCurrentPlayerZone;
    var buildings = zone.mStreetDataMap.mBuildingContainer;
    
    buildings.forEach(function(building) {
        try {
            if (zone.mStreetDataMap.IsADepletedDeposit(building)) {
                depleted.push({
                    building: building,
                    name: building.GetBuildingName_string(),
                    grid: building.GetGrid()
                });
            }
        } catch (e) { }
    });
    
    return depleted;
}
```

### Filtering by Category

```javascript
function getBuildingsByCategory(category) {
    var filtered = [];
    var zone = game.gi.mCurrentPlayerZone;
    var buildings = zone.mStreetDataMap.mBuildingContainer;
    
    buildings.forEach(function(building) {
        try {
            var name = building.GetBuildingName_string();
            var cat = categorizeBuilding(building);
            if (cat === category) {
                filtered.push(building);
            }
        } catch (e) { }
    });
    
    return filtered;
}
```

## Related Documentation

- [Building Methods](../../api-reference/buildings/building-methods.md) - Building API
- [Zone Buildings](../../api-reference/zone/buildings.md) - Building container access
- [Depleted States](../../api-reference/mines-deposits/depleted-states.md) - Depleted detection


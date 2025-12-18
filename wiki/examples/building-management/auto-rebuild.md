# Example: Auto Rebuild Farms & Wells

Complete example from `CURSOR_AutoFarms.js` for automatically rebuilding depleted farms and wells.

## Overview

This example demonstrates:
- Detecting depleted deposits
- Rebuilding buildings
- Randomized intervals
- Bookbinder management

## Key Functions

### Finding Depleted Deposits

```javascript
function findDepletedDeposits() {
    var depleted = [];
    var zone = game.gi.mCurrentPlayerZone;
    var buildings = zone.mStreetDataMap.mBuildingContainer;
    
    buildings.forEach(function(building) {
        try {
            var name = building.GetBuildingName_string();
            if (name === AUTO_REBUILD_CFG.FARM_RUIN_NAME) {
                depleted.push({
                    type: "farm",
                    building: building,
                    grid: building.GetGrid()
                });
            } else if (name === AUTO_REBUILD_CFG.WELL_RUIN_NAME) {
                depleted.push({
                    type: "well",
                    building: building,
                    grid: building.GetGrid()
                });
            }
        } catch (e) { }
    });
    
    return depleted;
}
```

### Rebuilding

```javascript
function rebuildDepleted(building, buildID) {
    var grid = building.GetGrid();
    game.gi.SendServerAction(50, buildID, grid, 0, null);
}
```

## Related Documentation

- [Building Methods](../../api-reference/buildings/building-methods.md) - Building API
- [Depleted States](../../api-reference/mines-deposits/depleted-states.md) - Depleted detection


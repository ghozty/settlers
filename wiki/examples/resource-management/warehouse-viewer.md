# Example: Warehouse Viewer Analysis

Complete analysis of `WarehouseViewer.user.js` - A resource viewing and management tool.

## Overview

`WarehouseViewer.user.js` provides a comprehensive interface for viewing player resources, categorized by type, with sorting and filtering capabilities.

## Architecture

### Main Components

1. **Resource Database** (`RESOURCE_DB`)
   - Categorizes all resources by type
   - Maps resource code names to categories
   - Supports Building Materials, Food, Resource, Science, Weapons

2. **Data Collection** (`_getResourceList`)
   - Retrieves player resources
   - Applies localization
   - Filters resources with amount > 0
   - Categorizes resources

3. **UI Rendering** (`_renderWarehouseTable`)
   - Displays resources in a table
   - Supports sorting by name, category, amount
   - Provides search/filter functionality

## Key Patterns

### Resource Retrieval Pattern

```javascript
function getResourceList() {
    var resourceList = [];
    var playerID = game.gi.mCurrentPlayer.GetPlayerId();
    var zone = game.gi.mCurrentPlayerZone;
    var resourcesObj = zone.GetResourcesForPlayerID(playerID);
    
    for (var resName in RESOURCE_DB) {
        try {
            var resData = resourcesObj.GetPlayerResource(resName);
            if (resData && typeof resData.amount !== 'undefined' && resData.amount > 0) {
                var localName = loca.GetText("RES", resName);
                var cat = RESOURCE_DB[resName];
                
                resourceList.push({
                    'name_key': resName,
                    'localizedName': localName,
                    'category': cat,
                    'amount': resData.amount
                });
            }
        } catch (err) { continue; }
    }
    
    return resourceList;
}
```

### Sorting Pattern

```javascript
function sortResourceList(resourceList, sortKey, sortDir) {
    resourceList.sort(function (a, b) {
        var valA = a[sortKey];
        var valB = b[sortKey];
        
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        
        if (valA < valB) return -1 * sortDir;
        if (valA > valB) return 1 * sortDir;
        return 0;
    });
}
```

## Features

- **Complete Resource List**: Shows all player resources
- **Categorization**: Groups resources by type
- **Localization**: Displays localized resource names
- **Sorting**: Sort by name, category, or amount
- **Search/Filter**: Filter resources by name or category
- **Amount Display**: Shows resource quantities

## Related Documentation

- [Resource Access](../../api-reference/resources/resource-access.md) - Resource API
- [Resource Categories](../../api-reference/resources/resource-categories.md) - Resource categories
- [Resource Localization](../../api-reference/resources/resource-localization.md) - Localization


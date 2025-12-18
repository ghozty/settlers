# Example: Resource Filtering Patterns

Complete patterns for filtering and categorizing resources.

## Overview

This example demonstrates various patterns for:
- Filtering resources by category
- Searching resources by name
- Grouping resources
- Applying multiple filters

## Key Patterns

### Filter by Category

```javascript
function getResourcesByCategory(category) {
    var filtered = [];
    var playerID = game.gi.mCurrentPlayer.GetPlayerId();
    var zone = game.gi.mCurrentPlayerZone;
    var resourcesObj = zone.GetResourcesForPlayerID(playerID);
    
    for (var resName in RESOURCE_DB) {
        if (RESOURCE_DB[resName] === category) {
            var resData = resourcesObj.GetPlayerResource(resName);
            if (resData && typeof resData.amount !== 'undefined' && resData.amount > 0) {
                filtered.push({
                    name: resName,
                    amount: resData.amount
                });
            }
        }
    }
    
    return filtered;
}
```

### Search by Name

```javascript
function searchResources(searchString) {
    var results = [];
    var playerID = game.gi.mCurrentPlayer.GetPlayerId();
    var zone = game.gi.mCurrentPlayerZone;
    var resourcesObj = zone.GetResourcesForPlayerID(playerID);
    
    for (var resName in RESOURCE_DB) {
        try {
            var localName = loca.GetText("RES", resName);
            var searchText = (localName + " " + resName).toUpperCase();
            
            if (searchText.indexOf(searchString.toUpperCase()) >= 0) {
                var resData = resourcesObj.GetPlayerResource(resName);
                if (resData && typeof resData.amount !== 'undefined' && resData.amount > 0) {
                    results.push({
                        name: resName,
                        localizedName: localName,
                        amount: resData.amount
                    });
                }
            }
        } catch (e) { }
    }
    
    return results;
}
```

### Multiple Filters

```javascript
function filterResources(category, minAmount, searchString) {
    var filtered = [];
    var playerID = game.gi.mCurrentPlayer.GetPlayerId();
    var zone = game.gi.mCurrentPlayerZone;
    var resourcesObj = zone.GetResourcesForPlayerID(playerID);
    
    for (var resName in RESOURCE_DB) {
        try {
            // Category filter
            if (category && RESOURCE_DB[resName] !== category) continue;
            
            // Amount filter
            var resData = resourcesObj.GetPlayerResource(resName);
            if (!resData || typeof resData.amount === 'undefined' || resData.amount < minAmount) continue;
            
            // Search filter
            if (searchString) {
                var localName = loca.GetText("RES", resName);
                var searchText = (localName + " " + resName).toUpperCase();
                if (searchText.indexOf(searchString.toUpperCase()) < 0) continue;
            }
            
            filtered.push({
                name: resName,
                localizedName: loca.GetText("RES", resName),
                category: RESOURCE_DB[resName],
                amount: resData.amount
            });
        } catch (e) { }
    }
    
    return filtered;
}
```

## Related Documentation

- [Resource Categories](../../api-reference/resources/resource-categories.md) - Resource categories
- [Resource Access](../../api-reference/resources/resource-access.md) - Resource API


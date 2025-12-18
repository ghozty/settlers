# Example: Resource Access Patterns

Complete patterns for accessing and retrieving player resources.

## Overview

This example demonstrates various patterns for:
- Getting player resources
- Checking resource availability
- Retrieving resource amounts
- Handling resource access errors

## Key Patterns

### Basic Resource Access

```javascript
function getPlayerResource(resourceName) {
    try {
        var playerID = game.gi.mCurrentPlayer.GetPlayerId();
        var zone = game.gi.mCurrentPlayerZone;
        var resourcesObj = zone.GetResourcesForPlayerID(playerID);
        var resData = resourcesObj.GetPlayerResource(resourceName);
        
        if (resData && typeof resData.amount !== 'undefined') {
            return resData.amount;
        }
        return 0;
    } catch (e) {
        return 0;
    }
}
```

### Safe Resource Access

```javascript
function safeGetResource(resourceName) {
    try {
        if (!game || !game.gi || !game.gi.mCurrentPlayer) {
            throw new Error("Player not available");
        }
        
        if (!game.gi.mCurrentPlayerZone) {
            throw new Error("Zone not available");
        }
        
        var playerID = game.gi.mCurrentPlayer.GetPlayerId();
        var zone = game.gi.mCurrentPlayerZone;
        var resourcesObj = zone.GetResourcesForPlayerID(playerID);
        
        if (!resourcesObj) {
            throw new Error("Resources object not available");
        }
        
        var resData = resourcesObj.GetPlayerResource(resourceName);
        if (resData && typeof resData.amount !== 'undefined') {
            return resData.amount;
        }
        
        return 0;
    } catch (e) {
        console.error("Resource access error:", e);
        return 0;
    }
}
```

### Getting All Resources

```javascript
function getAllPlayerResources() {
    var resources = {};
    try {
        var playerID = game.gi.mCurrentPlayer.GetPlayerId();
        var zone = game.gi.mCurrentPlayerZone;
        var resourcesObj = zone.GetResourcesForPlayerID(playerID);
        
        var knownResources = ["Coin", "IronOre", "Coal", "Wood", "Stone"];
        
        knownResources.forEach(function(resName) {
            var resData = resourcesObj.GetPlayerResource(resName);
            if (resData && typeof resData.amount !== 'undefined' && resData.amount > 0) {
                resources[resName] = resData.amount;
            }
        });
    } catch (e) {
        console.error("Error getting resources:", e);
    }
    
    return resources;
}
```

## Related Documentation

- [Resource Access](../../api-reference/resources/resource-access.md) - Resource API
- [Resource List](../../api-reference/resources/resource-list.md) - Resource code names


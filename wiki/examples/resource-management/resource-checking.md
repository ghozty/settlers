# Example: Resource Checking

Example of checking resource availability.

## Overview

This example demonstrates:
- Checking if player has resources
- Getting resource amounts
- Validating resource availability

## Key Functions

### Checking Resources

```javascript
function hasResource(resourceName, minAmount) {
    try {
        var playerID = game.gi.mCurrentPlayer.GetPlayerId();
        var zone = game.gi.mCurrentPlayerZone;
        var resourcesObj = zone.GetResourcesForPlayerID(playerID);
        var resData = resourcesObj.GetPlayerResource(resourceName);
        
        if (resData && typeof resData.amount !== 'undefined') {
            return resData.amount >= (minAmount || 0);
        }
        return false;
    } catch (e) {
        return false;
    }
}
```

## Related Documentation

- [Resource Access](../../api-reference/resources/resource-access.md) - Resource API


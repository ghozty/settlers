# Example: Resource Viewer

Complete example from `WarehouseViewer.user.js` for viewing player resources.

## Overview

This example demonstrates:
- Getting player resources
- Categorizing resources
- Displaying in a table
- Sorting and filtering

## Key Functions

### Getting Resources

```javascript
function _getResourceList() {
    var resourceList = [];
    try {
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
    } catch (e) {
        alert("Liste Hatasi: " + e.message);
    }
    return resourceList;
}
```

## Related Documentation

- [Resource Access](../../api-reference/resources/resource-access.md) - Resource API
- [Resource Categories](../../api-reference/resources/resource-categories.md) - Resource categories


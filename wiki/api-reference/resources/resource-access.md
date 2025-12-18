# Resource Access API

Complete reference for accessing player resources in the game.

## Access Path

```javascript
var playerID = game.gi.mCurrentPlayer.GetPlayerId();
var zone = game.gi.mCurrentPlayerZone;
var resourcesObj = zone.GetResourcesForPlayerID(playerID);
```

## Core Method

### `GetResourcesForPlayerID(playerID)`

**Signature**: `GetResourcesForPlayerID(playerID: int): cResources`

**Description**: Gets the resource container for a specific player.

**Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `playerID` | `int` | Player ID |

**Returns**: `cResources` object containing player's resources

**Usage**:
```javascript
var playerID = game.gi.mCurrentPlayer.GetPlayerId();
var resourcesObj = zone.GetResourcesForPlayerID(playerID);
```

## Resource Retrieval

### `GetPlayerResource(resourceName)`

**Signature**: `GetPlayerResource(resourceName: string): dResourceData | null`

**Description**: Gets resource data for a specific resource.

**Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `resourceName` | `string` | Resource code name (e.g., "Coin", "IronOre") |

**Returns**:
- `dResourceData`: Resource data object with `amount` property
- `null`: Resource not found or doesn't exist

**Usage**:
```javascript
var coinData = resourcesObj.GetPlayerResource("Coin");
if (coinData && typeof coinData.amount !== 'undefined') {
    var coinBalance = coinData.amount;
}
```

**Resource Data Properties**:
- `amount`: Current resource amount (int)
- `producedAmount`: Produced amount (usually same as amount)

## Common Patterns

### Pattern: Get Resource Amount

```javascript
function getPlayerResource(resourceName) {
    try {
        if (!game || !game.gi || !game.gi.mCurrentPlayer) return 0;
        
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

// Usage
var coinBalance = getPlayerResource("Coin");
var ironOre = getPlayerResource("IronOre");
```

**Example from CURSOR_QuickTrader.js**:
```javascript
function getPlayerStock(codeName) {
    try {
        if (!game || !game.gi || !game.gi.mCurrentPlayer) return 0;
        var playerID = game.gi.mCurrentPlayer.GetPlayerId();
        var resourcesObj = game.gi.mCurrentPlayerZone.GetResourcesForPlayerID(playerID);
        var resData = resourcesObj.GetPlayerResource(codeName);
        
        if (resData && typeof resData.amount !== 'undefined') {
            return resData.amount;
        }
        return 0;
    } catch (e) {
        return 0;
    }
}
```

### Pattern: Get All Resources

```javascript
function getAllPlayerResources() {
    var resources = {};
    try {
        var playerID = game.gi.mCurrentPlayer.GetPlayerId();
        var zone = game.gi.mCurrentPlayerZone;
        var resourcesObj = zone.GetResourcesForPlayerID(playerID);
        
        // Iterate through known resources
        var knownResources = ["Coin", "IronOre", "Coal", "Wood", "Stone", /* ... */];
        
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

**Example from WarehouseViewer.user.js**:
```javascript
function _getResourceList() {
    var resourceList = [];
    try {
        var playerID = swmmo.application.mGameInterface.mCurrentPlayer.GetPlayerId();
        var resourcesObj = swmmo.application.mGameInterface.mCurrentPlayerZone.GetResourcesForPlayerID(playerID);
        
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

### Pattern: Check Resource Availability

```javascript
function hasResource(resourceName, minAmount) {
    var amount = getPlayerResource(resourceName);
    return amount >= (minAmount || 0);
}

// Usage
if (hasResource("Coin", 1000)) {
    // Player has at least 1000 coins
}
```

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Cannot read property 'GetPlayerId'` | Player object not available | Check `game.gi.mCurrentPlayer` exists |
| `GetResourcesForPlayerID returned null` | Zone not loaded | Check zone exists before accessing |
| `GetPlayerResource returned null` | Resource doesn't exist | Resource may not be in player's inventory |

### Error Handling Pattern

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

## Performance Notes

- `GetResourcesForPlayerID()` is fast - cached resource object
- `GetPlayerResource()` is fast - direct lookup
- Resource access is efficient even with many resources
- Always check if resource data exists before accessing `amount`

## Related Documentation

- [Resource List](resource-list.md) - Complete resource code names
- [Resource Categories](resource-categories.md) - Resource categorization
- [Resource Localization](resource-localization.md) - Localization keys
- [Zone Overview](../zone/zone-overview.md) - Zone object structure

## Examples from Active Scripts

### WarehouseViewer.user.js - Get Resource List

```javascript
var playerID = swmmo.application.mGameInterface.mCurrentPlayer.GetPlayerId();
var resourcesObj = swmmo.application.mGameInterface.mCurrentPlayerZone.GetResourcesForPlayerID(playerID);

for (var resName in RESOURCE_DB) {
    var resData = resourcesObj.GetPlayerResource(resName);
    if (resData && typeof resData.amount !== 'undefined' && resData.amount > 0) {
        // Resource found with amount > 0
    }
}
```

### CURSOR_QuickTrader.js - Get Player Stock

```javascript
function getPlayerStock(codeName) {
    try {
        if (!game || !game.gi || !game.gi.mCurrentPlayer) return 0;
        var playerID = game.gi.mCurrentPlayer.GetPlayerId();
        var resourcesObj = game.gi.mCurrentPlayerZone.GetResourcesForPlayerID(playerID);
        var resData = resourcesObj.GetPlayerResource(codeName);
        
        if (resData && typeof resData.amount !== 'undefined') {
            return resData.amount;
        }
        return 0;
    } catch (e) {
        return 0;
    }
}
```


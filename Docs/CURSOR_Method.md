# TSO Client - Methods Reference

This document contains useful methods discovered through script analysis and debugging.

---

## Game Interface Methods

### game.gi (swmmo.application.mGameInterface)

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `isOnHomzone()` | - | Boolean | Check if player is on their home zone |
| `SelectBuilding(building)` | building: cBuilding | void | Select a building and open its panel |
| `UnselectBuilding()` | - | void | Deselect current building |
| `GetSelectedBuilding()` | - | cBuilding | Get currently selected building |
| `SendServerAction(id, bldID, grid, rot, data)` | int, int, int, int, Object | dServerAction | Send an action to the server |
| `GetClientTime()` | - | Number | Get current client time |

### game.gi.mClientMessages

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `SendMessagetoServer(id, zoneID, data)` | int, int, Object | - | Send a message to the server |

---

## Zone Methods

### swmmo.application.mGameInterface.mCurrentPlayerZone

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `GetProductionQueue(type)` | int (queue type) | cTimedProductionQueue | Get production queue by type |
| `ScrollToGrid(grid)` | int | void | Scroll map to grid position |
| `GetBuildingFromGridPosition(grid)` | int | cBuilding | Get building at grid position |

### zone.mStreetDataMap

| Property/Method | Type | Description |
|-----------------|------|-------------|
| `mBuildingContainer` | Vector | Container of all buildings |
| `mDepositContainer` | Map | Container of all deposits |
| `GetBuildings_vector()` | Vector | Get all buildings as vector |
| `GetBuildingByGridPos(grid)` | cBuilding | Get building at position |
| `IsADepletedDeposit(building)` | Boolean | Check if building is depleted |

---

## Building Methods (cBuilding)

### Identification

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `GetBuildingName_string()` | - | String | Get building type name |
| `GetGrid()` | - | int | Get grid position |
| `GetLevel()` | - | int | Get building level |
| `GetUIUpgradeLevel()` | - | int | Get UI display level |
| `GetUniqueId()` | - | dUniqueID | Get unique identifier |

### State Checks

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `IsProductionActive()` | - | Boolean | Check if production is running |
| `IsBuildingActive()` | - | Boolean | Check if building is active |
| `IsUpgradeInProgress()` | - | Boolean | Check if upgrading |
| `IsUpgradeAllowed(checkResources)` | Boolean | Boolean | Check if upgrade is allowed |
| `IsBuildingInProduction()` | - | Boolean | Check production state |
| `isGarrison()` | - | Boolean | Check if it's a garrison |
| `IsDecoration()` | - | Boolean | Check if it's a decoration |

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `waitForPickup` | Boolean | **NOT RELIABLE!** Can be true even during production |
| `showWaitForPickupIcon` | Boolean | Whether pickup icon is shown |
| `productionType` | int | Production queue type |
| `productionQueue` | cTimedProductionQueue | The production queue |
| `productionBuff` | BuffAppliance | Active buff on building |

### Upgrade Related

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `GetUpgradeStartTime()` | - | Number | When upgrade started |
| `GetUpgradeDuration()` | - | int | Upgrade duration in ms |
| `GetUpgradeCosts_vector()` | - | Vector | List of upgrade costs |
| `GetRemainingConstructionDuration()` | - | int | Remaining build time |

### Production Related

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `CalculateWays()` | - | Number | Calculate production cycle time |
| `GetResourceInputFactor()` | - | int | Resource input multiplier |
| `GetResourceOutputFactor()` | - | int | Resource output multiplier |
| `getRemainingCooldown()` | - | Number | Get remaining cooldown |

---

## Production Queue Methods (cTimedProductionQueue)

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `mTimedProductions_vector` | Vector | List of production items |
| `productionBuilding` | cBuilding | The building for this queue |

### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `finishProduction(null, null)` | null, null | undefined | **COLLECT finished production** |

---

## Production Item Methods (TimedProduction)

### Status Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `GetAmount()` | - | int | Total items to produce |
| `GetProducedItems()` | - | int | Items already produced |
| `GetProductionTime()` | - | Number | Total production time (ms) |
| `GetCollectedTime()` | - | Number | Time elapsed (ms) |
| `GetProductionOrder()` | - | ProductionOrder | Get the production order |

### Calculated Values

```javascript
// Calculate remaining time
var remainingTime = item.GetProductionTime() - item.GetCollectedTime();

// Calculate progress percentage
var progress = Math.round((item.GetCollectedTime() / item.GetProductionTime()) * 100);

// Check if complete
var isComplete = item.GetProducedItems() >= item.GetAmount();
// OR
var isComplete = remainingTime <= 0;
```

---

## Production Order Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `GetProductionVO()` | - | dTimedProductionVO | Get the production VO |

### dTimedProductionVO Properties

| Property | Type | Description |
|----------|------|-------------|
| `type_string` | String | Product name (e.g., "Manuscript") |
| `amount` | int | Amount to produce |
| `productionType` | int | Queue type |
| `buildingGrid` | int | Building grid position |
| `stacks` | int | Stack count |

---

## Build Queue Methods

### game.gi.mHomePlayer.mBuildQueue

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `GetQueue_vector()` | - | Vector | Get build queue items |
| `GetTotalAvailableSlots()` | - | int | Get max queue slots |

### Calculate Free Slots

```javascript
var queueVector = game.gi.mHomePlayer.mBuildQueue.GetQueue_vector();
var maxSlots = game.gi.mHomePlayer.mBuildQueue.GetTotalAvailableSlots();
var currentQueueSize = queueVector ? queueVector.length : 0;
var freeSlots = maxSlots - currentQueueSize;
```

---

## Chat/Logging Methods

### globalFlash.gui.mChatPanel

| Method | Parameters | Description |
|--------|------------|-------------|
| `PutMessageToChannelWithoutServer(channel, date, sender, msg, bool1, bool2)` | string, Date, string, string, bool, bool | Send message to chat |

### Example

```javascript
globalFlash.gui.mChatPanel.PutMessageToChannelWithoutServer(
    "news",                        // Channel name
    new window.runtime.Date(),     // Timestamp
    "ScriptName",                  // Sender name
    "Message text",                // Message
    false,                         // Unknown
    false                          // Unknown
);
```

---

## Localization Methods

### loca

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `GetText(category, key)` | string, string | String | Get localized text |
| `FormatDuration(ms, format)` | Number, int | String | Format duration |

### Example

```javascript
var buildingName = loca.GetText("BUI", "Bookbinder");
var resourceName = loca.GetText("RES", "Manuscript");
var duration = loca.FormatDuration(remainingTime, 1);
```

---

## Utility Methods

### swmmo.getDefinitionByName(className)

Get a class definition by its fully qualified name.

```javascript
var dTimedProductionVO = swmmo.getDefinitionByName("Communication.VO::dTimedProductionVO");
var describeType = swmmo.getDefinitionByName("flash.utils.describeType");
```

### Common Class Names

| Class Name | Description |
|------------|-------------|
| `Communication.VO::dTimedProductionVO` | Production order VO |
| `flash.utils.describeType` | Reflection utility |
| `flash.events::MouseEvent` | Mouse event class |
| `flash.events::KeyboardEvent` | Keyboard event class |
| `Enums::TIMED_PRODUCTION_TYPE` | Production type enum |

---

## Important Notes

### Detecting Complete Production

**DO NOT** rely on `waitForPickup` flag - it's unreliable!

**CORRECT Method:**
```javascript
// Check if produced items >= amount
var isComplete = item.GetProducedItems() >= item.GetAmount();

// OR check remaining time
var remainingTime = item.GetProductionTime() - item.GetCollectedTime();
var isComplete = remainingTime <= 0;
```

### Collecting Production

```javascript
var queue = zone.GetProductionQueue(2); // 2 = Science/Bookbinder
queue.finishProduction(null, null);     // Collect!
```

### Iterating Buildings

```javascript
var buildings = zone.mStreetDataMap.mBuildingContainer;
buildings.forEach(function(bld) {
    var name = bld.GetBuildingName_string();
    var grid = bld.GetGrid();
    // ... do something
});
```








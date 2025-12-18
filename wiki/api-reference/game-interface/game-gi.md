# Game Interface API (`game.gi`)

The `game.gi` object is the main entry point to the TSO game API. It provides access to zone information, player data, building selection, and server communication.

## Access Path

```javascript
var gameInterface = game.gi;
// OR
var gameInterface = swmmo.application.mGameInterface;
```

Both paths reference the same object. `game.gi` is a convenience alias.

## Core Properties

### `mCurrentPlayerZone`

**Type**: `cZone`  
**Description**: The current zone (island) the player is viewing.

```javascript
var zone = game.gi.mCurrentPlayerZone;
```

**Access Pattern**: Always check if zone exists before accessing:
```javascript
if (!game.gi.mCurrentPlayerZone) {
    game.showAlert("Zone not available");
    return;
}
```

**Related**: See [Zone API](../zone/zone-overview.md) for zone methods.

### `mCurrentViewedZoneID`

**Type**: `int`  
**Description**: The ID of the currently viewed zone.

```javascript
var zoneID = game.gi.mCurrentViewedZoneID;
```

**Usage**: Used when sending messages to server that require zone ID:
```javascript
game.gi.mClientMessages.SendMessagetoServer(91, game.gi.mCurrentViewedZoneID, vo);
```

### `mHomePlayer`

**Type**: `cPlayer`  
**Description**: The player's home zone player object. Contains build queue, trade data, etc.

```javascript
var homePlayer = game.gi.mHomePlayer;
var buildQueue = homePlayer.mBuildQueue;
var tradeData = homePlayer.mTradeData;
```

**Key Sub-properties**:
- `mBuildQueue`: Build queue management (see [Build Queue Methods](#build-queue-methods))
- `mTradeData`: Trade/market data access

### `mCurrentPlayer`

**Type**: `cPlayer`  
**Description**: The current player object for the viewed zone.

```javascript
var player = game.gi.mCurrentPlayer;
var playerID = player.GetPlayerId();
var playerLevel = player.GetPlayerLevel();
```

**Common Methods**:
- `GetPlayerId()`: Returns player ID (int)
- `GetPlayerLevel()`: Returns player level (int)
- `mIsAdventureZone`: Boolean indicating if current zone is an adventure zone

### `mClientMessages`

**Type**: `cClientMessages`  
**Description**: Object for sending messages to the server.

```javascript
var clientMessages = game.gi.mClientMessages;
```

**Key Method**: `SendMessagetoServer(messageID, zoneID, data)`

**Related**: See [Client Messages API](client-messages.md) for detailed documentation.

## Core Methods

### `isOnHomzone()`

**Signature**: `isOnHomzone(): Boolean`

**Description**: Checks if the player is currently on their home zone.

**Returns**: 
- `true`: Player is on home zone
- `false`: Player is on a different zone (colony, adventure, etc.)

**Usage**:
```javascript
if (!game.gi.isOnHomzone()) {
    game.showAlert("Please go to your home zone first.");
    return;
}
```

**Important Notes**:
- Many operations require home zone (building construction, specialist management)
- Always check this before operations that modify the zone
- Some read-only operations work on any zone

**Example from AG_ExplorerManager.js**:
```javascript
function ShowSettings() {
    if (!game.gi.isOnHomzone()) {
        game.showAlert("Please go to your home zone first.");
        return;
    }
    // ... settings UI
}
```

### `SendServerAction(actionID, buildingID, grid, rotation, data)`

**Signature**: `SendServerAction(actionID: int, buildingID: int, grid: int, rotation: int, data: Object): dServerAction`

**Description**: Sends a server action to perform game operations (build, upgrade, etc.).

**Parameters**:

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `actionID` | `int` | Action type identifier (see [Action IDs](server-actions.md)) | Yes |
| `buildingID` | `int` | Building type ID (for build actions) or `0` | Yes |
| `grid` | `int` | Grid position on the map | Yes |
| `rotation` | `int` | Building rotation (usually `0`) | Yes |
| `data` | `Object` | Additional data object (usually `null`) | Yes |

**Returns**: `dServerAction` object (typically not used)

**Common Action IDs**:

| Action ID | Action | Usage |
|-----------|--------|-------|
| 50 | Build | Construct a new building |
| 60 | Upgrade | Upgrade an existing building |
| 95 | Specialist Task | Send specialist on a task |

**Example - Build Farmfield**:
```javascript
// From CURSOR_AutoFarms.js
var grid = depletedFarm.GetGrid();
game.gi.SendServerAction(50, 43, grid, 0, null);
// Action 50 = Build
// Building ID 43 = Farmfield
// grid = location
// 0 = rotation
// null = no additional data
```

**Example - Upgrade Building**:
```javascript
var building = zone.GetBuildingFromGridPosition(grid);
if (building.IsUpgradeAllowed(true)) {
    game.gi.SendServerAction(60, 0, building.GetGrid(), 0, null);
    // Action 60 = Upgrade
    // buildingID = 0 (not used for upgrades)
    // grid = building location
}
```

**Example - Send Explorer to Task**:
```javascript
// From Specialist_Tasks.js
var specTask = game.def("Communication.VO::dStartSpecialistTaskVO", true);
specTask.subTaskID = taskArr[1];
specTask.paramString = "";
specTask.uniqueID = explorer.GetUniqueID();

game.gi.SendServerAction(95, taskArr[0], 0, 0, specTask);
// Action 95 = Specialist Task
// taskArr[0] = task type (1 = Treasure, 2 = Adventure)
// specTask = task data object
```

**Important Notes**:
- This method is **sealed** - cannot be hooked or intercepted (Error #1037)
- Server validates all actions - invalid actions will fail silently or show error
- Actions are queued server-side - multiple rapid actions may be rejected
- Always validate prerequisites (resources, zone, building state) before sending

**Related**: See [Server Actions API](server-actions.md) for complete action ID reference.

### `SelectBuilding(building)`

**Signature**: `SelectBuilding(building: cBuilding): void`

**Description**: Selects a building and opens its info panel.

**Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `building` | `cBuilding` | The building object to select |

**Usage**:
```javascript
var building = zone.GetBuildingFromGridPosition(grid);
game.gi.SelectBuilding(building);
// Building info panel opens
```

**Notes**:
- Opens the building's UI panel
- Can be used to inspect building state
- May trigger UI updates

### `UnselectBuilding()`

**Signature**: `UnselectBuilding(): void`

**Description**: Deselects the currently selected building and closes its panel.

**Usage**:
```javascript
game.gi.UnselectBuilding();
// Closes building panel
```

### `GetSelectedBuilding()`

**Signature**: `GetSelectedBuilding(): cBuilding | null`

**Description**: Gets the currently selected building object.

**Returns**:
- `cBuilding`: Currently selected building
- `null`: No building selected

**Usage**:
```javascript
var selected = game.gi.GetSelectedBuilding();
if (selected) {
    var name = selected.GetBuildingName_string();
    game.showAlert("Selected: " + name);
}
```

### `GetClientTime()`

**Signature**: `GetClientTime(): Number`

**Description**: Gets the current client time in milliseconds.

**Returns**: Timestamp in milliseconds (since epoch or game start)

**Usage**:
```javascript
var currentTime = game.gi.GetClientTime();
```

**Notes**:
- May be relative to game start, not absolute time
- Use for timing calculations and delays
- Compare with server time for synchronization if needed

## Build Queue Methods

### `mHomePlayer.mBuildQueue`

Access to the build queue for the home zone.

#### `GetQueue_vector()`

**Signature**: `GetQueue_vector(): Vector`

**Description**: Gets the current build queue as a vector.

**Returns**: Vector of build queue items

**Usage**:
```javascript
// From CURSOR_AutoFarms.js
var queueVector = game.gi.mHomePlayer.mBuildQueue.GetQueue_vector();
var currentQueueSize = queueVector ? queueVector.length : 0;
```

#### `GetTotalAvailableSlots()`

**Signature**: `GetTotalAvailableSlots(): int`

**Description**: Gets the maximum number of build queue slots available.

**Returns**: Maximum queue size (typically 4-6 depending on upgrades)

**Usage**:
```javascript
var maxSlots = game.gi.mHomePlayer.mBuildQueue.GetTotalAvailableSlots();
var freeSlots = maxSlots - currentQueueSize;
```

**Complete Example - Check Build Queue**:
```javascript
// From CURSOR_AutoFarms.js
var queueVector = game.gi.mHomePlayer.mBuildQueue.GetQueue_vector();
var maxSlots = game.gi.mHomePlayer.mBuildQueue.GetTotalAvailableSlots();
var currentQueueSize = queueVector ? queueVector.length : 0;
var freeSlots = maxSlots - currentQueueSize;

if (freeSlots <= 0) {
    game.showAlert("Build queue is full!");
    return;
}
```

## Trade Data Methods

### `mHomePlayer.mTradeData`

Access to trade/market functionality.

#### `getNextFreeSlotForType(slotType)`

**Signature**: `getNextFreeSlotForType(slotType: int): int`

**Description**: Gets the next available market slot position for a given slot type.

**Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `slotType` | `int` | Slot type (0 = Free, 2 = Paid) |

**Returns**: Slot position (0-based index) or -1 if no slot available

**Usage**:
```javascript
// From CURSOR_QuickTrader.js
var freeSlotPos = game.gi.mHomePlayer.mTradeData.getNextFreeSlotForType(0);
var paidSlotPos = game.gi.mHomePlayer.mTradeData.getNextFreeSlotForType(2);

if (freeSlotPos === 0) {
    // Free slot available at position 0
    tradeOffer.slotType = 0;
    tradeOffer.slotPos = freeSlotPos;
} else {
    // Use paid slot
    tradeOffer.slotType = 2;
    tradeOffer.slotPos = paidSlotPos;
}
```

**Slot Types**:
- `0`: Free market slot
- `2`: Paid market slot (requires coins)

## Player Methods

### `mCurrentPlayer.GetPlayerId()`

**Signature**: `GetPlayerId(): int`

**Description**: Gets the current player's ID.

**Returns**: Player ID (int)

**Usage**:
```javascript
var playerID = game.gi.mCurrentPlayer.GetPlayerId();
var resourcesObj = zone.GetResourcesForPlayerID(playerID);
```

### `mCurrentPlayer.GetPlayerLevel()`

**Signature**: `GetPlayerLevel(): int`

**Description**: Gets the current player's level.

**Returns**: Player level (int, typically 1-80+)

**Usage**:
```javascript
var playerLevel = game.gi.mCurrentPlayer.GetPlayerLevel();
// Used for task requirements
if (playerLevel >= 20) {
    // Can do medium treasure
}
```

**Example from Specialist_Tasks.js**:
```javascript
var playerLevel = game.player.GetPlayerLevel();
// Check task requirements
if (playerLevel >= task.req[2]) {
    // Can perform task
}
```

### `mCurrentPlayer.mIsAdventureZone`

**Type**: `Boolean`  
**Description**: Indicates if the current zone is an adventure zone.

**Usage**:
```javascript
if (game.gi.mCurrentPlayer.mIsAdventureZone) {
    // On adventure zone - some operations may be restricted
}
```

## Common Patterns

### Pattern: Check Home Zone Before Operations

```javascript
function performOperation() {
    if (!game.gi.isOnHomzone()) {
        game.showAlert("This operation requires home zone.");
        return;
    }
    // Safe to proceed
}
```

### Pattern: Get Current Zone Safely

```javascript
function getCurrentZone() {
    if (!game.gi || !game.gi.mCurrentPlayerZone) {
        game.showAlert("Zone not available");
        return null;
    }
    return game.gi.mCurrentPlayerZone;
}
```

### Pattern: Send Action with Validation

```javascript
function safeBuild(buildingID, grid) {
    try {
        if (!game.gi.isOnHomzone()) {
            game.showAlert("Must be on home zone");
            return false;
        }
        
        // Check build queue
        var queueVector = game.gi.mHomePlayer.mBuildQueue.GetQueue_vector();
        var maxSlots = game.gi.mHomePlayer.mBuildQueue.GetTotalAvailableSlots();
        if (queueVector && queueVector.length >= maxSlots) {
            game.showAlert("Build queue is full");
            return false;
        }
        
        // Send build action
        game.gi.SendServerAction(50, buildingID, grid, 0, null);
        return true;
    } catch (e) {
        game.showAlert("Build error: " + e.message);
        return false;
    }
}
```

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Cannot read property 'mCurrentPlayerZone'` | Zone not loaded | Check `isOnHomzone()` or wait for zone load |
| `#1037 Cannot Assign to Method` | Trying to hook sealed method | Use direct method calls, don't try to override |
| `#1034 Type Coercion Failed` | Wrong parameter type | Check parameter types match expected |
| `#1063 Argument Count Mismatch` | Wrong number of parameters | Verify method signature |

### Error Handling Pattern

```javascript
function safeOperation() {
    try {
        if (!game || !game.gi) {
            throw new Error("Game interface not available");
        }
        
        if (!game.gi.mCurrentPlayerZone) {
            throw new Error("Zone not available");
        }
        
        // Safe to use game.gi
        var zone = game.gi.mCurrentPlayerZone;
        // ... operations
        
    } catch (e) {
        game.showAlert("Error: " + e.message);
        console.error("Game interface error:", e);
    }
}
```

## Performance Notes

- `isOnHomzone()` is a fast boolean check - safe to call frequently
- `mCurrentPlayerZone` access is fast - cached reference
- `SendServerAction()` has network overhead - batch operations when possible
- `GetQueue_vector()` is fast - safe to call in loops
- Avoid calling `GetClientTime()` in tight loops - cache if needed

## Related Documentation

- [Client Messages API](client-messages.md) - `mClientMessages` methods
- [Server Actions API](server-actions.md) - Complete action ID reference
- [Zone API](../zone/zone-overview.md) - Zone object methods
- [Building API](../buildings/building-methods.md) - Building methods
- [Common Patterns](../../getting-started/common-patterns.md) - Usage patterns

## Examples from Active Scripts

### AG_ExplorerManager.js

```javascript
// Zone access
if (!game || !game.gi || !game.gi.mCurrentPlayerZone) {
    this.log("ERROR: Game zone not available!");
    return;
}

var zone = game.gi.mCurrentPlayerZone;
var specialists = zone.GetSpecialists_vector();
```

### CURSOR_AutoFarms.js

```javascript
// Build queue check
var queueVector = game.gi.mHomePlayer.mBuildQueue.GetQueue_vector();
var maxSlots = game.gi.mHomePlayer.mBuildQueue.GetTotalAvailableSlots();
var currentQueueSize = queueVector ? queueVector.length : 0;
var freeSlots = maxSlots - currentQueueSize;

if (freeSlots <= 0) {
    _logRebuild("Queue is full. Skipping build.");
    return;
}

// Send build action
game.gi.SendServerAction(50, item.id, item.grid, 0, null);
```

### Specialist_Tasks.js

```javascript
// Home zone check
if (!game.gi.isOnHomzone()) {
    game.showAlert("Please go to your home zone first.");
    return;
}

// Player level access
var playerLevel = game.player.GetPlayerLevel();
```

### CURSOR_QuickTrader.js

```javascript
// Trade slot access
var freeSlotPos = game.gi.mHomePlayer.mTradeData.getNextFreeSlotForType(0);
var paidSlotPos = game.gi.mHomePlayer.mTradeData.getNextFreeSlotForType(2);
```


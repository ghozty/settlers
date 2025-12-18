# Client Messages API (`game.gi.mClientMessages`)

The `mClientMessages` object provides methods for sending messages to the game server. Unlike `SendServerAction`, these messages use Value Objects (VOs) for complex data structures.

## Access Path

```javascript
var clientMessages = game.gi.mClientMessages;
// OR
var clientMessages = swmmo.application.mGameInterface.mClientMessages;
```

## Core Method

### `SendMessagetoServer(messageID, zoneID, data)`

**Signature**: `SendMessagetoServer(messageID: int, zoneID: int, data: Object): void`

**Description**: Sends a message to the server with a Value Object (VO) payload.

**Parameters**:

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `messageID` | `int` | Message type identifier (see [Message IDs](#message-ids)) | Yes |
| `zoneID` | `int` | Zone ID where the action applies | Yes |
| `data` | `Object` | Value Object containing message data | Yes |

**Returns**: `void`

**Important Notes**:
- This method is **sealed** - cannot be hooked or intercepted (Error #1037)
- Server validates all messages - invalid messages will fail silently
- Messages are queued server-side - rapid messages may be rejected
- Always use proper Value Object types for the `data` parameter

**Getting Zone ID**:
```javascript
var zoneID = game.gi.mCurrentViewedZoneID;
// OR
var zoneID = game.gi.mCurrentPlayerZone.GetZoneID(); // If available
```

## Message IDs

### Message ID 91: Start Timed Production

**Description**: Starts a timed production in buildings like Bookbinder, AdventureBookbinder.

**Data Type**: `dTimedProductionVO`

**Usage**:
```javascript
// From CURSOR_AutoFarms.js
var dTimedProductionVO = swmmo.getDefinitionByName("Communication.VO::dTimedProductionVO");
var vo = new dTimedProductionVO();
vo.productionType = 2;        // Production queue type (2 = Science/Bookbinder)
vo.type_string = "Manuscript"; // Product name
vo.amount = 1;                // Amount to produce
vo.stacks = 1;                // Stack count
vo.buildingGrid = binderBuilding.GetGrid(); // Building location

game.gi.mClientMessages.SendMessagetoServer(91, game.gi.mCurrentViewedZoneID, vo);
```

**dTimedProductionVO Properties**:

| Property | Type | Description | Required |
|----------|------|-------------|----------|
| `productionType` | `int` | Production queue type (2 = Science) | Yes |
| `type_string` | `string` | Product name (e.g., "Manuscript") | Yes |
| `amount` | `int` | Number of items to produce | Yes |
| `stacks` | `int` | Number of stacks | Yes |
| `buildingGrid` | `int` | Grid position of the building | Yes |

**Production Queue Types**:

| Type ID | Queue Name | Buildings |
|---------|------------|-----------|
| 0 | Default | Various production buildings |
| 1 | - | Reserved/Unused |
| 2 | Science | Bookbinder, AdventureBookbinder |
| 3+ | Other | Culture buildings, etc. |

**Common Products for Type 2 (Science)**:
- `"Manuscript"`: Basic science product
- Other science products as defined by the game

**Complete Example - Start Manuscript Production**:
```javascript
function startManuscriptProduction(binderBuilding) {
    try {
        // Get VO definition
        var dTimedProductionVO = swmmo.getDefinitionByName("Communication.VO::dTimedProductionVO");
        
        // Create VO instance
        var vo = new dTimedProductionVO();
        
        // Set properties
        vo.productionType = 2;              // Science queue
        vo.type_string = "Manuscript";      // Product name
        vo.amount = 1;                      // Produce 1 item
        vo.stacks = 1;                      // 1 stack
        vo.buildingGrid = binderBuilding.GetGrid(); // Building location
        
        // Send message
        game.gi.mClientMessages.SendMessagetoServer(
            91,                              // Message ID: Start Timed Production
            game.gi.mCurrentViewedZoneID,    // Zone ID
            vo                              // Value Object
        );
        
        return true;
    } catch (e) {
        game.showAlert("Error starting production: " + e.message);
        return false;
    }
}
```

### Message ID 1049: Create Trade Offer

**Description**: Creates a trade offer on the market.

**Data Type**: `dTradeOfferVO`

**Usage**:
```javascript
// From CURSOR_QuickTrader.js
var tradeOffer = new (game.def("Communication.VO::dTradeOfferVO"));
tradeOffer.offerRes = offerRes;      // Resource being offered
tradeOffer.costsRes = costRes;       // Resource being requested
tradeOffer.receipientId = 0;         // 0 = Market trade
tradeOffer.lots = 4;                 // Number of market slots
tradeOffer.slotType = 0;              // 0 = Free, 2 = Paid
tradeOffer.slotPos = slotPosition;    // Slot position

game.gi.mClientMessages.SendMessagetoServer(1049, game.gi.mCurrentViewedZoneID, tradeOffer);
```

**dTradeOfferVO Properties**:

| Property | Type | Description | Required |
|----------|------|-------------|----------|
| `offerRes` | `dResourceVO` | Resource being offered | Yes |
| `costsRes` | `dResourceVO` | Resource being requested | Yes |
| `receipientId` | `int` | Recipient ID (0 = Market) | Yes |
| `lots` | `int` | Number of market slots (1-4) | Yes |
| `slotType` | `int` | Slot type (0 = Free, 2 = Paid) | Yes |
| `slotPos` | `int` | Slot position (from getNextFreeSlotForType) | Yes |

**dResourceVO Properties**:

| Property | Type | Description |
|----------|------|-------------|
| `amount` | `int` | Resource amount |
| `producedAmount` | `int` | Produced amount (usually same as amount) |
| `name_string` | `string` | Resource code name (e.g., "Coin", "IronOre") |

**Complete Example - Create Trade Offer**:
```javascript
function createTradeOffer(offerResource, offerAmount, costResource, costAmount, slots) {
    try {
        // Create resource VOs
        var offerRes = new (game.def("Communication.VO::dResourceVO"));
        offerRes.amount = offerRes.producedAmount = offerAmount;
        offerRes.name_string = offerResource;
        
        var costRes = new (game.def("Communication.VO::dResourceVO"));
        costRes.amount = costRes.producedAmount = costAmount;
        costRes.name_string = costResource;
        
        // Create trade offer VO
        var tradeOffer = new (game.def("Communication.VO::dTradeOfferVO"));
        tradeOffer.offerRes = offerRes;
        tradeOffer.costsRes = costRes;
        tradeOffer.receipientId = 0; // Market
        
        // Get available slot
        var freeSlotPos = game.gi.mHomePlayer.mTradeData.getNextFreeSlotForType(0);
        var paidSlotPos = game.gi.mHomePlayer.mTradeData.getNextFreeSlotForType(2);
        
        if (freeSlotPos === 0) {
            tradeOffer.slotType = 0;
            tradeOffer.slotPos = freeSlotPos;
        } else {
            tradeOffer.slotType = 2;
            tradeOffer.slotPos = paidSlotPos;
        }
        
        tradeOffer.lots = slots || 4;
        
        // Send trade offer
        game.gi.mClientMessages.SendMessagetoServer(
            1049,
            game.gi.mCurrentViewedZoneID,
            tradeOffer
        );
        
        return true;
    } catch (e) {
        game.showAlert("Trade error: " + e.message);
        return false;
    }
}
```

## Value Object Creation Pattern

### Getting VO Definition

```javascript
// Method 1: Using swmmo.getDefinitionByName
var dTimedProductionVO = swmmo.getDefinitionByName("Communication.VO::dTimedProductionVO");

// Method 2: Using game.def (if available)
var dTradeOfferVO = game.def("Communication.VO::dTradeOfferVO", true);
```

### Creating VO Instance

```javascript
// Method 1: Using new with definition
var vo = new dTimedProductionVO();

// Method 2: Using game.def with new
var vo = new (game.def("Communication.VO::dTradeOfferVO"));
```

### Common VO Class Names

| Class Name | Description | Usage |
|------------|-------------|-------|
| `Communication.VO::dTimedProductionVO` | Timed production order | Message 91 |
| `Communication.VO::dTradeOfferVO` | Trade offer | Message 1049 |
| `Communication.VO::dResourceVO` | Resource data | Trade offers, resource operations |
| `Communication.VO::dStartSpecialistTaskVO` | Specialist task | Server Action 95 |
| `Communication.VO::dUniqueID` | Unique identifier | Specialist IDs, building IDs |

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `#1037 Cannot Assign to Method` | Trying to hook sealed method | Use direct method calls |
| `#1034 Type Coercion Failed` | Wrong VO type or property | Verify VO class name and properties |
| `Cannot read property of undefined` | VO not created properly | Check VO creation pattern |
| Invalid message ID | Unknown message ID | Use documented message IDs only |

### Error Handling Pattern

```javascript
function safeSendMessage(messageID, zoneID, vo) {
    try {
        if (!vo) {
            throw new Error("Value Object is null");
        }
        
        if (!game.gi || !game.gi.mClientMessages) {
            throw new Error("Client messages not available");
        }
        
        game.gi.mClientMessages.SendMessagetoServer(messageID, zoneID, vo);
        return true;
    } catch (e) {
        game.showAlert("Message send error: " + e.message);
        console.error("SendMessagetoServer error:", e);
        return false;
    }
}
```

## Performance Notes

- Message sending has network overhead - batch when possible
- VO creation is fast - can be done on-demand
- Server validates messages - invalid messages fail silently
- Use appropriate delays between messages to avoid rate limiting

## Related Documentation

- [Server Actions API](server-actions.md) - `SendServerAction` reference
- [VO Definitions](../actions-messages/vo-definitions.md) - Complete VO reference
- [Message IDs](../actions-messages/message-ids.md) - All message IDs
- [Server Communication](../actions-messages/server-communication.md) - Communication patterns

## Examples from Active Scripts

### CURSOR_AutoFarms.js - Start Production

```javascript
function _startBinderProduction(binderBuilding) {
    try {
        var dTimedProductionVO = swmmo.getDefinitionByName("Communication.VO::dTimedProductionVO");
        var vo = new dTimedProductionVO();
        vo.productionType = AUTO_REBUILD_CFG.BINDER_PRODUCTION_TYPE; // 2
        vo.type_string = AUTO_REBUILD_CFG.BINDER_PRODUCT; // "Manuscript"
        vo.amount = 1;
        vo.stacks = 1;
        vo.buildingGrid = binderBuilding.GetGrid();

        game.gi.mClientMessages.SendMessagetoServer(91, game.gi.mCurrentViewedZoneID, vo);
        _logRebuild("Binder: " + AUTO_REBUILD_CFG.BINDER_PRODUCT + " production started.");
        
    } catch (prodErr) {
        _logRebuild("Binder: Start production error: " + prodErr.message);
    }
}
```

### CURSOR_QuickTrader.js - Create Trade

```javascript
function executeTrade(codeName, coinsAmount, itemsAmount) {
    try {
        var offerRes = new (game.def("Communication.VO::dResourceVO"));
        var costRes = new (game.def("Communication.VO::dResourceVO"));
        
        if (currentMode === 'buy') {
            // BUY: Offer Coins, Want Items
            offerRes.amount = offerRes.producedAmount = coinsAmount;
            offerRes.name_string = 'Coin';
            
            costRes.amount = costRes.producedAmount = itemsAmount;
            costRes.name_string = codeName;
        } else {
            // SELL: Offer Items, Want Coins
            offerRes.amount = offerRes.producedAmount = itemsAmount;
            offerRes.name_string = codeName;
            
            costRes.amount = costRes.producedAmount = coinsAmount;
            costRes.name_string = 'Coin';
        }
        
        var tradeOffer = new (game.def("Communication.VO::dTradeOfferVO"));
        tradeOffer.offerRes = offerRes;
        tradeOffer.costsRes = costRes;
        tradeOffer.receipientId = 0; // Market trade
        tradeOffer.lots = currentMode === 'buy' ? CONFIG.BUY_Slots : CONFIG.SELL_Slots;
        
        // Get slot
        var freeSlotPos = game.gi.mHomePlayer.mTradeData.getNextFreeSlotForType(0);
        var paidSlotPos = game.gi.mHomePlayer.mTradeData.getNextFreeSlotForType(2);
        
        if (freeSlotPos === 0) {
            tradeOffer.slotType = 0;
            tradeOffer.slotPos = freeSlotPos;
        } else {
            tradeOffer.slotType = 2;
            tradeOffer.slotPos = paidSlotPos;
        }
        
        game.gi.mClientMessages.SendMessagetoServer(1049, game.gi.mCurrentViewedZoneID, tradeOffer);
        
        game.showAlert("Trade created successfully");
    } catch (e) {
        game.showAlert('Trade Error: ' + e.message);
    }
}
```


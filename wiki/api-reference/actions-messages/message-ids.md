# Message IDs Reference

Complete reference of all `SendMessagetoServer` message IDs.

## Method Signature

```javascript
game.gi.mClientMessages.SendMessagetoServer(messageID, zoneID, data)
```

## Confirmed Message IDs

| Message ID | Message Name | Description | Data Type | Example |
|------------|--------------|-------------|-----------|---------|
| 91 | StartTimedProduction | Start a timed production (e.g., Bookbinder) | dTimedProductionVO | See below |
| 1049 | CreateTradeOffer | Create a trade offer on the market | dTradeOfferVO | See below |

## Message ID 91: Start Timed Production

**Description**: Starts a timed production in buildings like Bookbinder, AdventureBookbinder.

**Data Type**: `dTimedProductionVO`

**Usage**:
```javascript
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

| Property | Type | Description |
|----------|------|-------------|
| `productionType` | `int` | Queue type (2 = Science) |
| `type_string` | `string` | Product name (e.g., "Manuscript") |
| `amount` | `int` | Number of items to produce |
| `stacks` | `int` | Number of stacks |
| `buildingGrid` | `int` | Grid position of the building |

## Message ID 1049: Create Trade Offer

**Description**: Creates a trade offer on the market.

**Data Type**: `dTradeOfferVO`

**Usage**:
```javascript
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

| Property | Type | Description |
|----------|------|-------------|
| `offerRes` | `dResourceVO` | Resource being offered |
| `costsRes` | `dResourceVO` | Resource being requested |
| `receipientId` | `int` | Recipient ID (0 = Market) |
| `lots` | `int` | Number of market slots (1-4) |
| `slotType` | `int` | Slot type (0 = Free, 2 = Paid) |
| `slotPos` | `int` | Slot position (from getNextFreeSlotForType) |

## Important Notes

### Sealed Methods

The game client uses sealed/final methods that cannot be hooked or overwritten:
- `game.gi.mClientMessages.SendMessagetoServer` - Cannot be intercepted (Error #1037)

## Related Documentation

- [Client Messages](../game-interface/client-messages.md) - SendMessagetoServer API
- [Action IDs](action-ids.md) - SendServerAction IDs
- [VO Definitions](vo-definitions.md) - Value Object definitions


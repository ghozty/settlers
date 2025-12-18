# Value Object (VO) Definitions Reference

Complete reference of all Value Objects used with server communication.

## VO Creation

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

## Common VO Classes

### dTimedProductionVO

**Class Name**: `Communication.VO::dTimedProductionVO`

**Usage**: Message ID 91 (Start Timed Production)

**Properties**:

| Property | Type | Description |
|----------|------|-------------|
| `productionType` | `int` | Production queue type (2 = Science) |
| `type_string` | `string` | Product name (e.g., "Manuscript") |
| `amount` | `int` | Number of items to produce |
| `stacks` | `int` | Number of stacks |
| `buildingGrid` | `int` | Grid position of the building |

**Example**:
```javascript
var vo = swmmo.getDefinitionByName("Communication.VO::dTimedProductionVO");
var productionVO = new vo();
productionVO.productionType = 2;
productionVO.type_string = "Manuscript";
productionVO.amount = 1;
productionVO.stacks = 1;
productionVO.buildingGrid = building.GetGrid();
```

### dTradeOfferVO

**Class Name**: `Communication.VO::dTradeOfferVO`

**Usage**: Message ID 1049 (Create Trade Offer)

**Properties**:

| Property | Type | Description |
|----------|------|-------------|
| `offerRes` | `dResourceVO` | Resource being offered |
| `costsRes` | `dResourceVO` | Resource being requested |
| `receipientId` | `int` | Recipient ID (0 = Market) |
| `lots` | `int` | Number of market slots (1-4) |
| `slotType` | `int` | Slot type (0 = Free, 2 = Paid) |
| `slotPos` | `int` | Slot position |

**Example**:
```javascript
var tradeOffer = new (game.def("Communication.VO::dTradeOfferVO"));
tradeOffer.offerRes = offerRes;
tradeOffer.costsRes = costRes;
tradeOffer.receipientId = 0;
tradeOffer.lots = 4;
tradeOffer.slotType = 0;
tradeOffer.slotPos = slotPosition;
```

### dResourceVO

**Class Name**: `Communication.VO::dResourceVO`

**Usage**: Trade offers, resource operations

**Properties**:

| Property | Type | Description |
|----------|------|-------------|
| `amount` | `int` | Resource amount |
| `producedAmount` | `int` | Produced amount (usually same as amount) |
| `name_string` | `string` | Resource code name (e.g., "Coin", "IronOre") |

**Example**:
```javascript
var offerRes = new (game.def("Communication.VO::dResourceVO"));
offerRes.amount = offerRes.producedAmount = 1000;
offerRes.name_string = "Coin";
```

### dStartSpecialistTaskVO

**Class Name**: `Communication.VO::dStartSpecialistTaskVO`

**Usage**: Server Action 95 (Specialist Task)

**Properties**:

| Property | Type | Description |
|----------|------|-------------|
| `subTaskID` | `int` | Subtask identifier |
| `paramString` | `string` | Parameter string (usually empty "") |
| `uniqueID` | `dUniqueID` | Specialist's unique identifier |

**Example**:
```javascript
var specTask = game.def("Communication.VO::dStartSpecialistTaskVO", true);
specTask.subTaskID = subTaskID;
specTask.paramString = "";
specTask.uniqueID = specialist.GetUniqueID();
```

### dUniqueID

**Class Name**: `Communication.VO::dUniqueID`

**Usage**: Specialist IDs, building IDs

**Properties**:
- `uniqueID1`: First part of unique ID (int)
- `uniqueID2`: Second part of unique ID (int)

**Creation**:
```javascript
// Method 1: From specialist object
var uniqueID = specialist.GetUniqueID();

// Method 2: From string (format: "uniqueID1_uniqueID2")
var uniqueIdArr = uniqueId.split("_");
var uniqueID = game.def("Communication.VO::dUniqueID").Create(
    parseInt(uniqueIdArr[0]),
    parseInt(uniqueIdArr[1])
);
```

## Related Documentation

- [Action IDs](action-ids.md) - SendServerAction IDs
- [Message IDs](message-ids.md) - SendMessagetoServer IDs
- [Server Communication](server-communication.md) - Communication patterns


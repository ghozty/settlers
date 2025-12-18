# TSO Client - Action IDs and Message IDs

This document contains the Action IDs used with `SendServerAction()` and Message IDs used with `SendMessagetoServer()`.

---

## SendServerAction IDs

Used with: `game.gi.SendServerAction(actionID, buildingID, grid, rotation, data)`

| Action ID | Action Name | Description | Parameters | Example Usage |
|-----------|-------------|-------------|------------|---------------|
| 50 | Build | Construct a new building | buildingID: Building type, grid: Location | `game.gi.SendServerAction(50, 43, grid, 0, null)` - Build Farmfield |
| 60 | Upgrade | Upgrade an existing building | grid: Building location | `game.gi.SendServerAction(60, 0, building.GetGrid(), 0, null)` |

### SendServerAction Function Signature

```javascript
game.gi.SendServerAction(actionID, buildingID, grid, rotation, data)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| actionID | int | The action type (see table above) |
| buildingID | int | Building type ID (for build actions) or 0 |
| grid | int | Grid position on the map |
| rotation | int | Building rotation (usually 0) |
| data | Object | Additional data (usually null) |

---

## SendMessagetoServer IDs

Used with: `game.gi.mClientMessages.SendMessagetoServer(messageID, zoneID, data)`

| Message ID | Message Name | Description | Data Type | Example Usage |
|------------|--------------|-------------|-----------|---------------|
| 91 | StartTimedProduction | Start a timed production (e.g., Bookbinder) | dTimedProductionVO | See below |

### Message ID 91 - Start Timed Production

Used to start production in buildings like Bookbinder.

```javascript
var dTimedProductionVO = swmmo.getDefinitionByName("Communication.VO::dTimedProductionVO");
var vo = new dTimedProductionVO();
vo.productionType = 2;        // Production queue type (2 = Science/Bookbinder)
vo.type_string = "Manuscript"; // Product name
vo.amount = 1;                // Amount to produce
vo.stacks = 1;                // Stack count
vo.buildingGrid = building.GetGrid(); // Building location

game.gi.mClientMessages.SendMessagetoServer(91, game.gi.mCurrentViewedZoneID, vo);
```

### dTimedProductionVO Properties

| Property | Type | Description |
|----------|------|-------------|
| productionType | int | Queue type (2 = Science) |
| type_string | string | Product name (e.g., "Manuscript") |
| amount | int | Number of items to produce |
| stacks | int | Number of stacks |
| buildingGrid | int | Grid position of the building |

---

## Production Queue Types

| Type ID | Queue Name | Buildings |
|---------|------------|-----------|
| 0 | Default | Various |
| 1 | - | - |
| 2 | Science | Bookbinder, AdventureBookbinder |
| 3+ | Other | Culture buildings, etc. |

---

## Discovered But Untested Action IDs

These IDs were observed or tested but their exact function is not confirmed:

| Action ID | Possible Function | Notes |
|-----------|-------------------|-------|
| 52-55 | Unknown | Tested, didn't work for collection |
| 80-82 | Unknown | Tested, didn't work for collection |
| 90 | Unknown | Tested |
| 92-93 | Unknown | Tested |

---

## Notes

### Sealed Methods (Error #1037)

The game client uses sealed/final methods that cannot be hooked or overwritten:
- `game.gi.SendServerAction` - Cannot be intercepted
- `game.gi.mClientMessages.SendMessagetoServer` - Cannot be intercepted

This prevents creating sniffers to capture action IDs automatically.

### Error Codes

| Error Code | Meaning | Common Cause |
|------------|---------|--------------|
| #1034 | Type Coercion Failed | Wrong parameter type |
| #1037 | Cannot Assign to Method | Trying to hook sealed method |
| #1063 | Argument Count Mismatch | Wrong number of parameters |

---

## Usage Examples

### Build a Farmfield

```javascript
var grid = depletedFarm.GetGrid();
game.gi.SendServerAction(50, 43, grid, 0, null);
```

### Build a Well

```javascript
var grid = depletedWell.GetGrid();
game.gi.SendServerAction(50, 72, grid, 0, null);
```

### Upgrade a Mine

```javascript
var building = game.zone.GetBuildingFromGridPosition(grid);
if (building.IsUpgradeAllowed(true)) {
    game.gi.SendServerAction(60, 0, building.GetGrid(), 0, null);
}
```

### Start Manuscript Production

```javascript
var dTimedProductionVO = swmmo.getDefinitionByName("Communication.VO::dTimedProductionVO");
var vo = new dTimedProductionVO();
vo.productionType = 2;
vo.type_string = "Manuscript";
vo.amount = 1;
vo.stacks = 1;
vo.buildingGrid = binderBuilding.GetGrid();

game.gi.mClientMessages.SendMessagetoServer(91, game.gi.mCurrentViewedZoneID, vo);
```






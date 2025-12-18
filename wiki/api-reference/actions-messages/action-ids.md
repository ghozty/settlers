# Action IDs Reference

Complete reference of all `SendServerAction` action IDs.

## Method Signature

```javascript
game.gi.SendServerAction(actionID, buildingID, grid, rotation, data)
```

## Confirmed Action IDs

| Action ID | Action Name | Description | Parameters | Example |
|-----------|-------------|-------------|------------|---------|
| 50 | Build | Construct a new building | buildingID: Building type, grid: Location | `game.gi.SendServerAction(50, 43, grid, 0, null)` |
| 60 | Upgrade | Upgrade an existing building | grid: Building location | `game.gi.SendServerAction(60, 0, building.GetGrid(), 0, null)` |
| 95 | Specialist Task | Send specialist on a task | taskType: Task type, data: dStartSpecialistTaskVO | `game.gi.SendServerAction(95, taskType, 0, 0, specTask)` |

## Action ID 50: Build

**Description**: Construct a new building at the specified grid position.

**Parameters**:
- `actionID`: `50`
- `buildingID`: Building type ID (see [Building IDs](../buildings/building-ids.md))
- `grid`: Grid position where to build
- `rotation`: `0` (usually)
- `data`: `null`

**Usage**:
```javascript
// Build Farmfield (ID: 43)
var grid = depletedFarm.GetGrid();
game.gi.SendServerAction(50, 43, grid, 0, null);
```

## Action ID 60: Upgrade

**Description**: Upgrade an existing building.

**Parameters**:
- `actionID`: `60`
- `buildingID`: `0` (not used for upgrades)
- `grid`: Grid position of building to upgrade
- `rotation`: `0`
- `data`: `null`

**Usage**:
```javascript
var building = zone.GetBuildingFromGridPosition(grid);
if (building.IsUpgradeAllowed(true)) {
    game.gi.SendServerAction(60, 0, building.GetGrid(), 0, null);
}
```

## Action ID 95: Specialist Task

**Description**: Send a specialist (Explorer, Geologist) on a task.

**Parameters**:
- `actionID`: `95`
- `buildingID`: Task type (1 = Treasure, 2 = Adventure, 0 = Geologist search)
- `grid`: `0` (not used)
- `rotation`: `0` (not used)
- `data`: `dStartSpecialistTaskVO` object

**Usage**:
```javascript
var specTask = game.def("Communication.VO::dStartSpecialistTaskVO", true);
specTask.subTaskID = subTaskID;
specTask.paramString = "";
specTask.uniqueID = specialist.GetUniqueID();

game.gi.SendServerAction(95, taskType, 0, 0, specTask);
```

## Discovered But Untested Action IDs

These IDs were observed or tested but their exact function is not confirmed:

| Action ID | Possible Function | Notes |
|-----------|-------------------|-------|
| 52-55 | Unknown | Tested, didn't work for collection |
| 80-82 | Unknown | Tested, didn't work for collection |
| 90 | Unknown | Tested |
| 92-93 | Unknown | Tested |

## Important Notes

### Sealed Methods

The game client uses sealed/final methods that cannot be hooked or overwritten:
- `game.gi.SendServerAction` - Cannot be intercepted (Error #1037)

This prevents creating sniffers to capture action IDs automatically.

## Related Documentation

- [Server Actions](../game-interface/server-actions.md) - SendServerAction API
- [Message IDs](message-ids.md) - SendMessagetoServer IDs
- [VO Definitions](vo-definitions.md) - Value Object definitions


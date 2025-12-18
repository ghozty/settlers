# Geologist Tasks Reference

Complete reference of geologist tasks, their IDs, requirements, and usage.

## Task Type

Geologists use task type `0` for all resource searches.

## Resource Search Tasks (Task Type: 0)

| Subtask ID | Resource Name | Localization Key | Required Level |
|------------|---------------|------------------|----------------|
| `0` | Stone | `FindDepositStone` | 0 (No level requirement) |
| `1` | Bronze Ore | `FindDepositBronzeOre` | 9 |
| `2` | Marble | `FindDepositMarble` | 19 |
| `3` | Iron Ore | `FindDepositIronOre` | 20 |
| `4` | Gold Ore | `FindDepositGoldOre` | 23 |
| `5` | Coal | `FindDepositCoal` | 24 |
| `6` | Granite | `FindDepositGranite` | 60 |
| `7` | Titanium Ore | `FindDepositAlloyOre` | 61 |
| `8` | Saltpeter | `FindDepositSalpeter` | 62 |

**Task Format**: `"0,{subTaskID}"` (e.g., `"0,3"` for Iron Ore)

**Usage**:
```javascript
// Send geologist to find Iron Ore
sendGeologistToTask(geologist, 0, 3);
```

## Task Requirements

### Level Requirements

| Resource | Required Level |
|----------|----------------|
| Stone | 0 (No requirement) |
| Bronze Ore | 9 |
| Marble | 19 |
| Iron Ore | 20 |
| Gold Ore | 23 |
| Coal | 24 |
| Granite | 60 |
| Titanium Ore | 61 |
| Saltpeter | 62 |

**Checking Requirements**:
```javascript
function canFindResource(geologist, subTaskID) {
    var playerLevel = game.player.GetPlayerLevel();
    var levelRequirements = [0, 9, 19, 20, 23, 24, 60, 61, 62];
    
    if (subTaskID >= 0 && subTaskID < levelRequirements.length) {
        return playerLevel >= levelRequirements[subTaskID];
    }
    
    return false;
}
```

## Task Definitions from Samples

### From 4-specialists.js

```javascript
var geoDropSpec = [
    { 'val': '0', 'text': loca.GetText("LAB", "Cancel"), 'req': 0 },
    { 'val': '0,0', 'text': loca.GetText("TOT", "FindDepositStone"), 'req': 0 },
    { 'val': '0,1', 'text': loca.GetText("TOT", "FindDepositBronzeOre"), 'req': 9 },
    { 'val': '0,2', 'text': loca.GetText("TOT", "FindDepositMarble"), 'req': 19 },
    { 'val': '0,3', 'text': loca.GetText("TOT", "FindDepositIronOre"), 'req': 20 },
    { 'val': '0,4', 'text': loca.GetText("TOT", "FindDepositGoldOre"), 'req': 23 },
    { 'val': '0,5', 'text': loca.GetText("TOT", "FindDepositCoal"), 'req': 24 },
    { 'val': '0,6', 'text': loca.GetText("TOT", "FindDepositGranite"), 'req': 60 },
    { 'val': '0,7', 'text': loca.GetText("TOT", "FindDepositAlloyOre"), 'req': 61 },
    { 'val': '0,8', 'text': loca.GetText("TOT", "FindDepositSalpeter"), 'req': 62 }
];
```

## Sending Tasks

### Complete Example

```javascript
function sendGeologistToTask(geologist, subTaskID) {
    try {
        // Validate requirements
        if (!canFindResource(geologist, subTaskID)) {
            game.showAlert("Level requirement not met");
            return false;
        }
        
        // Create task VO
        var specTask = game.def("Communication.VO::dStartSpecialistTaskVO", true);
        specTask.subTaskID = subTaskID;
        specTask.paramString = "";
        specTask.uniqueID = geologist.GetUniqueID();
        
        // Send task (taskType = 0 for Geologist)
        game.gi.SendServerAction(95, 0, 0, 0, specTask);
        return true;
    } catch (e) {
        game.showAlert("Error: " + e.message);
        return false;
    }
}
```

## Resource Mapping

Geologist tasks map to resource deposits:

| Subtask ID | Resource Code | Deposit Name | Building Name (when built) |
|------------|---------------|--------------|----------------------------|
| 0 | Stone | Stone | - (Quarry) |
| 1 | BronzeOre | BronzeOre | BronzeMine |
| 2 | Marble | Marble | - (Quarry) |
| 3 | IronOre | IronOre | IronMine |
| 4 | GoldOre | GoldOre | GoldMine |
| 5 | Coal | Coal | CoalMine |
| 6 | Granite | Granite | - (Quarry) |
| 7 | TitaniumOre | TitaniumOre | TitaniumMine |
| 8 | Salpeter | Salpeter | SalpeterMine |

## Related Documentation

- [Geologist Methods](geologist-methods.md) - Geologist API methods
- [Server Actions](../../game-interface/server-actions.md) - SendServerAction reference
- [Deposit Types](../../mines-deposits/deposit-types.md) - Deposit information


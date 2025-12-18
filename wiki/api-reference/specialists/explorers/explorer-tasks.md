# Explorer Tasks Reference

Complete reference of explorer tasks, their IDs, requirements, and usage.

## Task Types

Explorers can perform two main task types:

| Task Type | Description | Subtask IDs |
|-----------|-------------|-------------|
| `1` | Treasure Search | 0-6 |
| `2` | Adventure Zone | 0-3 |

## Treasure Search Tasks (Task Type: 1)

| Subtask ID | Task Name | Localization Key | Requirements | Notes |
|------------|-----------|------------------|--------------|-------|
| `0` | Short Treasure | `FindTreasureShort` | Level 8 | Basic treasure search |
| `1` | Medium Treasure | `FindTreasureMedium` | Level 20 | - |
| `2` | Long Treasure | `FindTreasureLong` | Level 32 | - |
| `3` | Very Long Treasure | `FindTreasureEvenLonger` | Level 40 | - |
| `4` | Artifact Search | `FindTreasureTravellingErudite` | Artifact Search Skill | Requires skill ID 39 |
| `5` | Bean a Collada | `FindTreasureBeanACollada` | Bean a Collada Skill | Requires skill ID 40 |
| `6` | Prolonged Treasure | `FindTreasureLongest` | Level 54 | - |

**Task Format**: `"1,{subTaskID}"` (e.g., `"1,0"` for Short Treasure)

**Usage**:
```javascript
// Send explorer to Short Treasure
sendExplorerToTask(explorer, 1, 0);

// Send explorer to Artifact Search (requires skill)
if (hasArtifactSearchSkill(explorer)) {
    sendExplorerToTask(explorer, 1, 4);
}
```

## Adventure Zone Tasks (Task Type: 2)

| Subtask ID | Task Name | Localization Key | Requirements |
|------------|-----------|------------------|--------------|
| `0` | Short Adventure | `FindAdventureZoneShort` | Level 26 |
| `1` | Medium Adventure | `FindAdventureZoneMedium` | Level 36 |
| `2` | Long Adventure | `FindAdventureZoneLong` | Level 42 |
| `3` | Very Long Adventure | `FindAdventureZoneVeryLong` | Level 56 |

**Task Format**: `"2,{subTaskID}"` (e.g., `"2,0"` for Short Adventure)

**Usage**:
```javascript
// Send explorer to Short Adventure
sendExplorerToTask(explorer, 2, 0);
```

## Task Requirements

### Level Requirements

| Task | Required Level |
|------|----------------|
| Short Treasure | 8 |
| Medium Treasure | 20 |
| Long Treasure | 32 |
| Very Long Treasure | 40 |
| Prolonged Treasure | 54 |
| Short Adventure | 26 |
| Medium Adventure | 36 |
| Long Adventure | 42 |
| Very Long Adventure | 56 |

### Skill Requirements

| Task | Required Skill | Skill ID |
|------|----------------|----------|
| Artifact Search | Artifact Search | 39 |
| Bean a Collada | Bean a Collada | 40 |

**Checking Skills**:
```javascript
function canPerformTask(explorer, taskType, subTaskID) {
    var playerLevel = game.player.GetPlayerLevel();
    
    // Check level requirements
    if (taskType === 1) {
        if (subTaskID === 0 && playerLevel < 8) return false;
        if (subTaskID === 1 && playerLevel < 20) return false;
        if (subTaskID === 2 && playerLevel < 32) return false;
        if (subTaskID === 3 && playerLevel < 40) return false;
        if (subTaskID === 6 && playerLevel < 54) return false;
        
        // Check skill requirements
        if (subTaskID === 4) {
            if (!hasArtifactSearchSkill(explorer)) return false;
        }
        if (subTaskID === 5) {
            if (!hasBeanAColladaSkill(explorer)) return false;
        }
    } else if (taskType === 2) {
        if (subTaskID === 0 && playerLevel < 26) return false;
        if (subTaskID === 1 && playerLevel < 36) return false;
        if (subTaskID === 2 && playerLevel < 42) return false;
        if (subTaskID === 3 && playerLevel < 56) return false;
    }
    
    return true;
}
```

## Task Definitions from Samples

### From 4-specialists.js

```javascript
var explorerDropSpec = [
    { 'label': loca.GetText("LAB", "FindTreasure"), 'data': [
        { 'val': '1,0', 'text': loca.GetText("LAB", "FindTreasureShort"), 'req': [0,0,8] },
        { 'val': '1,1', 'text': loca.GetText("LAB", "FindTreasureMedium"), 'req': [0,0,20] },
        { 'val': '1,2', 'text': loca.GetText("LAB", "FindTreasureLong"), 'req': [0,0,32] },
        { 'val': '1,3', 'text': loca.GetText("LAB", "FindTreasureEvenLonger"), 'req': [0,0,40] },
        { 'val': '1,6', 'text': loca.GetText("LAB", "FindTreasureLongest"), 'req': [0,0,54] },
        { 'val': '1,4', 'text': loca.GetText("LAB", "FindTreasureTravellingErudite"), 'req': [1,0,0] },
        { 'val': '1,5', 'text': loca.GetText("LAB", "FindTreasureBeanACollada"), 'req': [0,1,0] }
    ]},
    { 'label': loca.GetText("LAB", "SpecialistTaskFindAdventureZone"), 'data': [
        { 'val': '2,0', 'text': loca.GetText("LAB", "FindAdventureZoneShort"), 'req': [0,0,26] },
        { 'val': '2,1', 'text': loca.GetText("LAB", "FindAdventureZoneMedium"), 'req': [0,0,36] },
        { 'val': '2,2', 'text': loca.GetText("LAB", "FindAdventureZoneLong"), 'req': [0,0,42] },
        { 'val': '2,3', 'text': loca.GetText("LAB", "FindAdventureZoneVeryLong"), 'req': [0,0,56] }
    ]}
];
```

**Requirement Format**: `[hasArtifactSkill, hasBeanSkill, minLevel]`
- `[0,0,8]` = No special skills, Level 8 required
- `[1,0,0]` = Artifact Search skill required
- `[0,1,0]` = Bean a Collada skill required

## Sending Tasks

### Complete Example

```javascript
function sendExplorerToTask(explorer, taskType, subTaskID) {
    try {
        // Validate requirements
        if (!canPerformTask(explorer, taskType, subTaskID)) {
            game.showAlert("Requirements not met");
            return false;
        }
        
        // Create task VO
        var specTask = game.def("Communication.VO::dStartSpecialistTaskVO", true);
        specTask.subTaskID = subTaskID;
        specTask.paramString = "";
        specTask.uniqueID = explorer.GetUniqueID();
        
        // Send task
        game.gi.SendServerAction(95, taskType, 0, 0, specTask);
        return true;
    } catch (e) {
        game.showAlert("Error: " + e.message);
        return false;
    }
}
```

## Task Duration

Task duration is calculated based on:
1. Base duration from task definition
2. Skill bonuses (searchtime modifier)
3. Specialist time bonus

See [Explorer Methods](explorer-methods.md) for duration calculation examples.

## Related Documentation

- [Explorer Methods](explorer-methods.md) - Explorer API methods
- [Explorer Skills](explorer-skills.md) - Skill tree reference
- [Server Actions](../../game-interface/server-actions.md) - SendServerAction reference


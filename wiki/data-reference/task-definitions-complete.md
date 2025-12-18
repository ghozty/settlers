# Complete Task Definitions Reference

Complete reference of all specialist task definitions, IDs, and requirements.

## Explorer Tasks

### Treasure Search (Task Type: 1)

| Subtask ID | Task Name | Required Level | Special Requirement |
|------------|-----------|----------------|---------------------|
| 0 | Short Treasure | 8 | - |
| 1 | Medium Treasure | 20 | - |
| 2 | Long Treasure | 32 | - |
| 3 | Very Long Treasure | 40 | - |
| 4 | Artifact Search | - | Artifact Search Skill (ID: 39) |
| 5 | Bean a Collada | - | Bean a Collada Skill (ID: 40) |
| 6 | Prolonged Treasure | 54 | - |

### Adventure Zone (Task Type: 2)

| Subtask ID | Task Name | Required Level |
|------------|-----------|----------------|
| 0 | Short Adventure | 26 |
| 1 | Medium Adventure | 36 |
| 2 | Long Adventure | 42 |
| 3 | Very Long Adventure | 56 |

## Geologist Tasks (Task Type: 0)

| Subtask ID | Resource Name | Required Level |
|------------|---------------|----------------|
| 0 | Stone | 0 |
| 1 | Bronze Ore | 9 |
| 2 | Marble | 19 |
| 3 | Iron Ore | 20 |
| 4 | Gold Ore | 23 |
| 5 | Coal | 24 |
| 6 | Granite | 60 |
| 7 | Titanium Ore | 61 |
| 8 | Saltpeter | 62 |

## Task Format

Tasks are sent as strings: `"{taskType},{subTaskID}"`

Examples:
- `"1,0"` = Short Treasure (Explorer)
- `"2,1"` = Medium Adventure (Explorer)
- `"0,3"` = Iron Ore Search (Geologist)

## Related Documentation

- [Explorer Tasks](../api-reference/specialists/explorers/explorer-tasks.md) - Detailed explorer task reference
- [Geologist Tasks](../api-reference/specialists/geologists/geologist-tasks.md) - Detailed geologist task reference
- [Server Actions](../api-reference/game-interface/server-actions.md) - SendServerAction reference


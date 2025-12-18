# Example: Specialist Tasks Script Analysis

Complete analysis of `Specialist_Tasks.js` - A comprehensive specialist management tool.

## Overview

`Specialist_Tasks.js` is a comprehensive specialist management script that displays idle and working specialists, manages explorer task assignments, and provides mine status information.

## Architecture

### Main Components

1. **Data Collection** (`SpecialistViewer_CollectData`)
   - Collects idle and working explorers
   - Collects idle and working geologists
   - Scans for active mines and available deposits
   - Categorizes mines by type

2. **UI Rendering** (`SpecialistViewer_RenderHTML`)
   - Renders specialist sections with tables
   - Creates task dropdowns for explorers
   - Displays task durations
   - Shows mine and deposit information

3. **Task Management**
   - Individual task assignment
   - Mass task selection
   - "Send All" functionality
   - Duration calculation

## Key Patterns

### Specialist Collection Pattern

```javascript
function collectSpecialists(baseType) {
    var idle = [];
    var working = [];
    var zone = game.gi.mCurrentPlayerZone;
    var specialists = zone.GetSpecialists_vector();
    
    specialists.forEach(function(specialist) {
        try {
            if (specialist.getPlayerID() === -1) return;
            if (specialist.GetBaseType() !== baseType) return;
            
            var task = specialist.GetTask();
            if (task === null) {
                idle.push(specialist);
            } else {
                working.push({
                    specialist: specialist,
                    task: task,
                    remainingTime: task.GetRemainingTime()
                });
            }
        } catch (e) { }
    });
    
    return { idle: idle, working: working };
}
```

### Task Duration Calculation

```javascript
function getExplorerTaskDuration(explorer, taskValue) {
    // Get task definition
    var taskDef = swmmo.getDefinitionByName("global").specialistTaskDefinitions_vector[taskType];
    var baseDuration = taskDef.subtasks_vector[subTaskId].duration;
    
    // Apply skill bonuses
    var calculatedTime = baseDuration;
    explorer.getSkillTree().getItems_vector().forEach(function(skill) {
        // Apply skill modifiers
    });
    
    // Apply time bonus
    calculatedTime = (calculatedTime / explorer.GetSpecialistDescription().GetTimeBonus()) * 100;
    
    return loca.FormatDuration(calculatedTime, 1);
}
```

## Features

- **Idle/Working Display**: Shows both idle and working specialists with task information
- **Task Assignment**: Dropdown-based task selection for explorers
- **Mass Selection**: Change all explorer tasks at once
- **Duration Display**: Shows estimated task completion time
- **Mine Status**: Displays active mines and available deposits
- **Real Mine Filtering**: Filters out farms and wells from mine list

## Related Documentation

- [Explorer Methods](../../api-reference/specialists/explorers/explorer-methods.md) - Explorer API
- [Geologist Methods](../../api-reference/specialists/geologists/geologist-methods.md) - Geologist API
- [Server Actions](../../api-reference/game-interface/server-actions.md) - SendServerAction


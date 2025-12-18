# Example: Explorer Manager Analysis

Complete analysis of `AG_ExplorerManager.js` - An automated explorer and geologist management system.

## Overview

`AG_ExplorerManager.js` is an automated specialist management script that periodically sends idle explorers and geologists on tasks with randomized intervals and delays.

## Architecture

### Main Components

1. **Configuration System**
   - Mode selection (explorer, geologist, or both)
   - Task selection per specialist type
   - Randomized interval settings
   - Settings persistence

2. **Timer Management**
   - Global timer state (survives script reloads)
   - Randomized intervals between scans
   - Randomized delays between specialist dispatches

3. **Task Assignment**
   - Explorer task assignment (treasure or adventure)
   - Geologist resource search assignment
   - Level requirement checking
   - Skill requirement checking

## Key Patterns

### Global State Management

```javascript
// Global state (survives script reloads)
if (typeof window.AG_ExplorerManager_TimerID === 'undefined') {
    window.AG_ExplorerManager_TimerID = null;
}
if (typeof window.AG_ExplorerManager_IsRunning === 'undefined') {
    window.AG_ExplorerManager_IsRunning = false;
}
```

### Randomized Intervals

```javascript
function getRandomInterval() {
    var min = config.intervalMin;
    var max = config.intervalMax;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
```

### Settings Persistence

```javascript
function saveSettings() {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(config));
    } catch (e) {
        log("Error saving settings: " + e.message);
    }
}

function loadSettings() {
    try {
        var saved = localStorage.getItem(SETTINGS_KEY);
        if (saved) {
            var savedConfig = JSON.parse(saved);
            Object.assign(config, savedConfig);
        }
    } catch (e) {
        log("Error loading settings: " + e.message);
    }
}
```

## Features

- **Automated Task Assignment**: Automatically sends idle specialists on tasks
- **Randomized Timing**: Uses randomized intervals to avoid detection patterns
- **Settings UI**: Provides a settings modal for configuration
- **Dual Mode Support**: Can manage both explorers and geologists
- **State Persistence**: Settings and state survive script reloads
- **Level Checking**: Validates level requirements before task assignment

## Related Documentation

- [Explorer Methods](../../api-reference/specialists/explorers/explorer-methods.md) - Explorer API
- [Geologist Methods](../../api-reference/specialists/geologists/geologist-methods.md) - Geologist API
- [State Management](../../patterns-best-practices/state-management.md) - State patterns
- [Async Operations](../../patterns-best-practices/async-operations.md) - Timing patterns


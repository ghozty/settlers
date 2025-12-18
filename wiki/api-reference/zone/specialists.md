# Zone Specialists API

The Specialists container provides access to all specialists (Explorers, Geologists, Generals, Marshals) in the current zone.

## Access Path

```javascript
var zone = game.gi.mCurrentPlayerZone;
var specialists = zone.GetSpecialists_vector();
```

## Method

### `GetSpecialists_vector()`

**Signature**: `GetSpecialists_vector(): Vector<cSpecialist>`

**Description**: Gets all specialists in the zone as a vector.

**Returns**: Vector of `cSpecialist` objects

**Usage**:
```javascript
var specialists = zone.GetSpecialists_vector();

specialists.forEach(function(specialist) {
    // Process specialist
});
```

## Specialist Base Types

Specialists are categorized by base type:

| Base Type | Specialist Type | Description |
|-----------|----------------|-------------|
| `1` | Explorer | Searches for treasures and adventure zones |
| `2` | Geologist | Searches for resource deposits |
| `3` | General | Leads armies in combat |
| `4` | Marshal | Advanced military commander |

## Common Iteration Patterns

### Basic Iteration

```javascript
var zone = game.gi.mCurrentPlayerZone;
var specialists = zone.GetSpecialists_vector();

specialists.forEach(function(specialist) {
    try {
        // Filter by player
        if (specialist.getPlayerID() === -1) return;
        
        // Get specialist info
        var baseType = specialist.GetBaseType();
        var name = specialist.getName(false);
        var task = specialist.GetTask();
        
        // Process specialist
    } catch (e) {
        // Skip problematic specialist
    }
});
```

### Filter by Base Type

```javascript
function getSpecialistsByType(baseType) {
    var filtered = [];
    var zone = game.gi.mCurrentPlayerZone;
    var specialists = zone.GetSpecialists_vector();
    
    specialists.forEach(function(specialist) {
        try {
            if (specialist.getPlayerID() === -1) return;
            if (specialist.GetBaseType() !== baseType) return;
            
            filtered.push(specialist);
        } catch (e) { }
    });
    
    return filtered;
}

// Usage
var explorers = getSpecialistsByType(1);
var geologists = getSpecialistsByType(2);
```

### Filter Idle Specialists

```javascript
function getIdleSpecialists(baseType) {
    var idle = [];
    var zone = game.gi.mCurrentPlayerZone;
    var specialists = zone.GetSpecialists_vector();
    
    specialists.forEach(function(specialist) {
        try {
            if (specialist.getPlayerID() === -1) return;
            if (specialist.GetBaseType() !== baseType) return;
            
            var task = specialist.GetTask();
            if (task === null) {
                idle.push(specialist);
            }
        } catch (e) { }
    });
    
    return idle;
}

// Usage
var idleExplorers = getIdleSpecialists(1);
var idleGeologists = getIdleSpecialists(2);
```

## Specialist Properties

### `getPlayerID()`

**Signature**: `getPlayerID(): int`

**Description**: Gets the player ID that owns this specialist.

**Returns**: 
- Player ID (int) if owned by a player
- `-1` if not owned by a player (visitor, NPC, etc.)

**Usage**:
```javascript
if (specialist.getPlayerID() === -1) {
    // Skip - not player's specialist
    return;
}
```

**Important**: Always filter by `getPlayerID() !== -1` to get only player's specialists.

### `GetBaseType()`

**Signature**: `GetBaseType(): int`

**Description**: Gets the specialist base type.

**Returns**: Base type (1 = Explorer, 2 = Geologist, 3 = General, 4 = Marshal)

**Usage**:
```javascript
var baseType = specialist.GetBaseType();

if (baseType === 1) {
    // Explorer
} else if (baseType === 2) {
    // Geologist
} else if (baseType === 3) {
    // General
} else if (baseType === 4) {
    // Marshal
}
```

### `GetTask()`

**Signature**: `GetTask(): cSpecialistTask | null`

**Description**: Gets the current task of the specialist.

**Returns**:
- `cSpecialistTask`: Task object if specialist is working
- `null`: Specialist is idle

**Usage**:
```javascript
var task = specialist.GetTask();
var isIdle = (task === null);

if (isIdle) {
    // Specialist is available for new task
} else {
    // Specialist is working
    var remainingTime = task.GetRemainingTime();
    var taskDef = task.getTaskDefinition();
}
```

### `getName(includeHTML)`

**Signature**: `getName(includeHTML: Boolean): string`

**Description**: Gets the specialist's name.

**Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `includeHTML` | `Boolean` | Whether to include HTML formatting |

**Returns**: Specialist name (string)

**Usage**:
```javascript
// Plain text name (recommended)
var name = specialist.getName(false);

// Name with HTML (if available)
var nameHTML = specialist.getName(true);
```

**Example from Specialist_Tasks.js**:
```javascript
var name = specialist.getName(false);
// Examples: "Explorer", "Ghost Explorer", "Blacktree Explorer", 
//           "Geologist", "Merry Geologist", etc.
```

### `GetUniqueID()`

**Signature**: `GetUniqueID(): dUniqueID`

**Description**: Gets the specialist's unique identifier.

**Returns**: `dUniqueID` object

**Usage**:
```javascript
var uniqueID = specialist.GetUniqueID();
// uniqueID.uniqueID1 and uniqueID.uniqueID2

// Convert to string format
var uniqueIdString = uniqueID.uniqueID1 + "_" + uniqueID.uniqueID2;
```

**Example from Specialist_Tasks.js**:
```javascript
data.idleExplorers.push({
    name: name, 
    specialist: specialist,
    uniqueID: specialist.GetUniqueID(),
    // ... other data
});

// Later, when sending task:
var uniqueId = explorer.uniqueID.uniqueID1 + "_" + explorer.uniqueID.uniqueID2;
```

### `GetType()`

**Signature**: `GetType(): int`

**Description**: Gets the specialist's specific type ID (different from base type).

**Returns**: Specialist type ID (int)

**Usage**:
```javascript
var type = specialist.GetType();
// Different explorer/geologist variants have different type IDs
```

**Note**: Base type (1-4) is the category, Type ID is the specific variant.

### `getIconID()`

**Signature**: `getIconID(): string`

**Description**: Gets the icon ID for the specialist.

**Returns**: Icon ID string (e.g., "icon_explorer.png", "icon_geologist.png")

**Usage**:
```javascript
var iconID = specialist.getIconID();
// Use with getImageTag() for UI display
```

## Task-Related Methods

### `GetTask().GetRemainingTime()`

**Signature**: `GetRemainingTime(): Number`

**Description**: Gets the remaining time for the current task in milliseconds.

**Returns**: Remaining time in milliseconds (Number)

**Usage**:
```javascript
var task = specialist.GetTask();
if (task) {
    var remainingTime = task.GetRemainingTime();
    var timeText = loca.FormatDuration(remainingTime, 1);
    // Example: "2h 30m"
}
```

**Example from Specialist_Tasks.js**:
```javascript
if (!isIdle) {
    try {
        if (task && task.GetRemainingTime) {
            remainingTime = task.GetRemainingTime();
        }
    } catch (e) { }
}
```

### `GetTask().getTaskDefinition()`

**Signature**: `getTaskDefinition(): cTaskDefinition`

**Description**: Gets the task definition object.

**Returns**: `cTaskDefinition` object

**Usage**:
```javascript
var task = specialist.GetTask();
if (task) {
    var taskDef = task.getTaskDefinition();
    var taskName = taskDef.mainTask.taskName_string + taskDef.taskType_string;
    var localizedName = loca.GetText("LAB", taskName);
    // Example: "FindTreasureShort", "FindDepositIronOre"
}
```

**Example from Specialist_Tasks.js**:
```javascript
if (!isIdle) {
    try {
        if (baseType === 1 || baseType === 2) {
            if (task && task.getTaskDefinition) {
                var taskDef = task.getTaskDefinition();
                var taskName = taskDef.mainTask.taskName_string + taskDef.taskType_string;
                taskInfo = loca.GetText("LAB", taskName);
            }
        }
    } catch (e) { }
}
```

## Skill-Related Methods

### `getSkillTree()`

**Signature**: `getSkillTree(): cSkillTree`

**Description**: Gets the specialist's skill tree object.

**Returns**: `cSkillTree` object

**Usage**:
```javascript
var skillTree = specialist.getSkillTree();
var skills = skillTree.getItems_vector();

skills.forEach(function(skill) {
    var skillId = skill.getId();
    var skillLevel = skill.getLevel();
    
    // Check for specific skills
    if (skillId === 39 && skillLevel > 0) {
        // Has Artifact Search skill
    }
    if (skillId === 40 && skillLevel > 0) {
        // Has Bean a Collada skill
    }
});
```

**Example from Specialist_Tasks.js**:
```javascript
if (baseType === 1) {
    try {
        specialist.getSkillTree().getItems_vector().forEach(function(skill) {
            if (skill.getId() === 39 && skill.getLevel() > 0) {
                hasArtSkill = true; // Artifact Search
            }
            if (skill.getId() === 40 && skill.getLevel() > 0) {
                hasBeanSkill = true; // Bean a Collada
            }
        });
    } catch (e) { }
}
```

### `skills`

**Type**: `cSkills`  
**Description**: Alternative access to specialist skills.

**Usage**:
```javascript
// Combine skill tree and skills
var allSkills = specialist.getSkillTree().getItems_vector()
    .concat(specialist.skills.getItems_vector());

allSkills.forEach(function(skill) {
    // Process skill
});
```

## Common Patterns

### Pattern: Collect All Specialist Data

```javascript
function collectSpecialistData() {
    var data = {
        idleExplorers: [],
        workingExplorers: [],
        idleGeologists: [],
        workingGeologists: []
    };
    
    var zone = game.gi.mCurrentPlayerZone;
    var specialists = zone.GetSpecialists_vector();
    var playerLevel = game.player.GetPlayerLevel();
    
    specialists.forEach(function (specialist) {
        try {
            var baseType = specialist.GetBaseType();
            var task = specialist.GetTask();
            var playerID = specialist.getPlayerID();
            
            if (playerID === -1) return;
            
            var name = specialist.getName(false);
            var isIdle = (task === null);
            
            // Check skills (for explorers)
            var hasArtSkill = false;
            var hasBeanSkill = false;
            
            if (baseType === 1) {
                specialist.getSkillTree().getItems_vector().forEach(function(skill) {
                    if (skill.getId() === 39 && skill.getLevel() > 0) hasArtSkill = true;
                    if (skill.getId() === 40 && skill.getLevel() > 0) hasBeanSkill = true;
                });
            }
            
            // Get task info for working specialists
            var taskInfo = "Unknown task";
            var remainingTime = 0;
            
            if (!isIdle) {
                if (task && task.getTaskDefinition) {
                    var taskDef = task.getTaskDefinition();
                    var taskName = taskDef.mainTask.taskName_string + taskDef.taskType_string;
                    taskInfo = loca.GetText("LAB", taskName);
                }
                if (task && task.GetRemainingTime) {
                    remainingTime = task.GetRemainingTime();
                }
            }
            
            // Categorize
            if (baseType === 1) {
                if (isIdle) {
                    data.idleExplorers.push({
                        name: name,
                        specialist: specialist,
                        uniqueID: specialist.GetUniqueID(),
                        playerLevel: playerLevel,
                        hasArtSkill: hasArtSkill,
                        hasBeanSkill: hasBeanSkill
                    });
                } else {
                    data.workingExplorers.push({
                        name: name,
                        task: taskInfo,
                        remainingTime: remainingTime
                    });
                }
            } else if (baseType === 2) {
                if (isIdle) {
                    data.idleGeologists.push({name: name});
                } else {
                    data.workingGeologists.push({
                        name: name,
                        task: taskInfo,
                        remainingTime: remainingTime
                    });
                }
            }
        } catch (e) { }
    });
    
    return data;
}
```

## Performance Notes

- `GetSpecialists_vector()` is fast - cached vector
- Specialist iteration is efficient even with many specialists
- Always filter by `getPlayerID() !== -1` first
- Use try-catch when iterating - some specialists may be invalid

## Error Handling

### Error Handling Pattern

```javascript
function safeIterateSpecialists(callback) {
    try {
        if (!game.gi || !game.gi.mCurrentPlayerZone) {
            throw new Error("Zone not available");
        }
        
        var zone = game.gi.mCurrentPlayerZone;
        var specialists = zone.GetSpecialists_vector();
        
        specialists.forEach(function(specialist) {
            try {
                // Filter by player first
                if (specialist.getPlayerID() === -1) return;
                
                callback(specialist);
            } catch (specErr) {
                // Skip problematic specialist
                console.warn("Skipped specialist:", specErr);
            }
        });
    } catch (e) {
        game.showAlert("Specialist iteration error: " + e.message);
    }
}
```

## Related Documentation

- [Explorer API](../specialists/explorers/explorer-methods.md) - Explorer-specific methods
- [Geologist API](../specialists/geologists/geologist-methods.md) - Geologist-specific methods
- [General API](../specialists/generals/general-methods.md) - General-specific methods
- [Marshal API](../specialists/marshals/marshal-methods.md) - Marshal-specific methods
- [Specialist Overview](../specialists/specialist-overview.md) - Base specialist class

## Examples from Active Scripts

### Specialist_Tasks.js - Complete Data Collection

```javascript
var zone = swmmo.application.mGameInterface.mCurrentPlayerZone;
var specialists = zone.GetSpecialists_vector();
var playerLevel = game.player.GetPlayerLevel();

specialists.forEach(function (specialist) {
    try {
        var baseType = specialist.GetBaseType();
        var task = specialist.GetTask();
        var playerID = specialist.getPlayerID();
        
        if (playerID === -1) return;
        
        var name = specialist.getName(false);
        var isIdle = (task === null);
        
        // Check explorer skills
        var hasArtSkill = false;
        var hasBeanSkill = false;
        
        if (baseType === 1) {
            specialist.getSkillTree().getItems_vector().forEach(function(skill) {
                if (skill.getId() === 39 && skill.getLevel() > 0) hasArtSkill = true;
                if (skill.getId() === 40 && skill.getLevel() > 0) hasBeanSkill = true;
            });
        }
        
        // Get task info
        var taskInfo = "Unknown task";
        var remainingTime = 0;
        
        if (!isIdle) {
            if (baseType === 1 || baseType === 2) {
                if (task && task.getTaskDefinition) {
                    var taskDef = task.getTaskDefinition();
                    var taskName = taskDef.mainTask.taskName_string + taskDef.taskType_string;
                    taskInfo = loca.GetText("LAB", taskName);
                }
            }
            if (task && task.GetRemainingTime) {
                remainingTime = task.GetRemainingTime();
            }
        }
        
        // Categorize
        if (baseType === 1) {
            if (isIdle) {
                data.idleExplorers.push({
                    name: name,
                    specialist: specialist,
                    uniqueID: specialist.GetUniqueID(),
                    playerLevel: playerLevel,
                    hasArtSkill: hasArtSkill,
                    hasBeanSkill: hasBeanSkill
                });
            } else {
                data.workingExplorers.push({
                    name: name,
                    task: taskInfo,
                    remainingTime: remainingTime
                });
            }
        } else if (baseType === 2) {
            if (isIdle) {
                data.idleGeologists.push({name: name});
            } else {
                data.workingGeologists.push({
                    name: name,
                    task: taskInfo,
                    remainingTime: remainingTime
                });
            }
        }
    } catch (e) { }
});
```

### AG_ExplorerManager.js - Get Idle Specialists

```javascript
getIdleSpecialists: function (baseType) {
    var specialists = [];
    var zone = game.gi.mCurrentPlayerZone;
    var allSpecialists = zone.GetSpecialists_vector();
    
    allSpecialists.forEach(function (item) {
        try {
            var itemBaseType = item.GetBaseType();
            var task = item.GetTask();
            var playerID = item.getPlayerID();
            
            if (itemBaseType === baseType && playerID !== -1) {
                if (task === null) {
                    specialists.push(item);
                }
            }
        } catch (itemErr) {
            // Skip problematic items
        }
    });
    
    return specialists;
}
```


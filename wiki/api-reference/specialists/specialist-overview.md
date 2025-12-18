# Specialist Overview

Specialists are NPCs that can perform various tasks in the game. There are four types of specialists: Explorers, Geologists, Generals, and Marshals.

## Base Types

| Base Type | Specialist Type | Description |
|-----------|----------------|-------------|
| `1` | Explorer | Searches for treasures and adventure zones |
| `2` | Geologist | Searches for resource deposits |
| `3` | General | Leads armies in combat |
| `4` | Marshal | Advanced military commander |

## Access Path

```javascript
var zone = game.gi.mCurrentPlayerZone;
var specialists = zone.GetSpecialists_vector();

specialists.forEach(function(specialist) {
    // Filter by player
    if (specialist.getPlayerID() === -1) return;
    
    // Get base type
    var baseType = specialist.GetBaseType();
    // 1 = Explorer, 2 = Geologist, 3 = General, 4 = Marshal
});
```

## Common Methods

All specialists share these common methods:

### `GetBaseType()`

**Signature**: `GetBaseType(): int`

**Description**: Gets the specialist base type.

**Returns**: Base type (1 = Explorer, 2 = Geologist, 3 = General, 4 = Marshal)

### `getPlayerID()`

**Signature**: `getPlayerID(): int`

**Description**: Gets the player ID that owns this specialist.

**Returns**: Player ID (int) or `-1` if not owned by a player

### `GetTask()`

**Signature**: `GetTask(): cSpecialistTask | null`

**Description**: Gets the current task of the specialist.

**Returns**: Task object if working, `null` if idle

### `getName(includeHTML)`

**Signature**: `getName(includeHTML: Boolean): string`

**Description**: Gets the specialist's name.

**Returns**: Specialist name (string)

### `GetUniqueID()`

**Signature**: `GetUniqueID(): dUniqueID`

**Description**: Gets the specialist's unique identifier.

**Returns**: `dUniqueID` object

### `GetType()`

**Signature**: `GetType(): int`

**Description**: Gets the specialist's specific type ID (variant).

**Returns**: Specialist type ID (int)

### `getIconID()`

**Signature**: `getIconID(): string`

**Description**: Gets the icon ID for the specialist.

**Returns**: Icon ID string

### `getSkillTree()`

**Signature**: `getSkillTree(): cSkillTree`

**Description**: Gets the specialist's skill tree object.

**Returns**: `cSkillTree` object

## Related Documentation

- [Explorer API](explorers/explorer-methods.md) - Explorer-specific methods
- [Geologist API](geologists/geologist-methods.md) - Geologist-specific methods
- [General API](generals/general-methods.md) - General-specific methods
- [Marshal API](marshals/marshal-methods.md) - Marshal-specific methods
- [Zone Specialists](../zone/specialists.md) - Specialist container access


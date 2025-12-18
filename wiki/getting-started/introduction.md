# Introduction to TSO Client Scripting

## Overview

The Settlers Online (TSO) client is built on Adobe AIR/Flash technology and provides a rich API for userscript development. This documentation covers how to create custom scripts that interact with the game client to automate tasks, enhance UI, and provide additional functionality.

## What is a TSO Client Userscript?

A TSO client userscript is a JavaScript file that:

- Runs within the TSO client application
- Has access to the game's internal objects and methods
- Can interact with the game state, buildings, specialists, resources, etc.
- Can create custom UI elements and modals
- Can send server actions and messages
- Can automate repetitive tasks

## Key Concepts

### Game Interface (`game.gi`)

The main entry point to the game API. Provides access to:
- Current zone and player information
- Server action sending
- Building selection and interaction
- Zone navigation

### Zone Objects

Each zone (island) contains:
- **Buildings**: All structures on the map
- **Deposits**: Resource deposits (mines, farms, wells)
- **Specialists**: Explorers, Geologists, Generals, Marshals
- **Production Queues**: Active production in buildings
- **Resources**: Player's resource inventory

### Specialists

Four types of specialists:
- **Explorers** (BaseType: 1): Search for treasures and adventure zones
- **Geologists** (BaseType: 2): Search for resource deposits
- **Generals** (BaseType: 3): Lead armies in combat
- **Marshals** (BaseType: 4): Advanced military commanders

### Buildings

Buildings have:
- **Building ID**: Numeric identifier for building type
- **Building Name**: String identifier (e.g., "Bookbinder", "Farmfield")
- **Grid Position**: Location on the map
- **State**: Active, upgrading, depleted, etc.
- **Production**: Active production queues

### Resources

Resources are identified by:
- **Code Name**: Internal identifier (e.g., "Coin", "IronOre", "Manuscript")
- **Localized Name**: Display name via `loca.GetText("RES", codeName)`
- **Amount**: Current quantity in player's inventory

## Script Execution Environment

### Global Objects

- `game`: Main game object
- `game.gi`: Game interface (`swmmo.application.mGameInterface`)
- `swmmo`: Flash/AIR runtime wrapper
- `loca`: Localization system
- `globalFlash`: Flash UI components
- `window.runtime`: AIR runtime objects

### Script Loading

Scripts are loaded from the `userscripts/` directory and executed in the game context. They have access to all game objects and can modify game behavior.

### Common Patterns

1. **Menu Integration**: Add items to Tools menu via `addToolsMenuItem()`
2. **Modal Windows**: Create custom UI with `createModalWindow()` or `Modal` class
3. **Event Handling**: Use jQuery for DOM manipulation and events
4. **Settings Persistence**: Use `settings.store()` and `settings.read()`
5. **Server Communication**: Use `SendServerAction()` and `SendMessagetoServer()`

## Next Steps

- [Setup Guide](setup.md) - Set up your development environment
- [First Script Tutorial](first-script.md) - Create your first working script
- [Common Patterns](common-patterns.md) - Learn essential patterns

## Related Documentation

- [Game Interface API](../api-reference/game-interface/game-gi.md)
- [Zone API](../api-reference/zone/zone-overview.md)
- [Building API](../api-reference/buildings/building-methods.md)
- [Specialist API](../api-reference/specialists/specialist-overview.md)


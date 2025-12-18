# TSO Client Userscript Documentation Wiki

Welcome to the comprehensive documentation for The Settlers Online (TSO) client userscript development. This wiki serves as a complete reference guide for developing custom scripts that interact with the TSO game client.

## Overview

This documentation covers all aspects of TSO client scripting, including:

- **API Reference**: Complete documentation of all available methods, properties, and objects
- **Data Reference**: Comprehensive tables of IDs, names, and definitions
- **Examples**: Real-world script analysis and patterns
- **Best Practices**: Coding patterns and optimization strategies
- **Troubleshooting**: Common errors and solutions

## Quick Navigation

### Getting Started
- [Introduction](getting-started/introduction.md) - Overview of TSO client scripting
- [Setup](getting-started/setup.md) - Environment setup and prerequisites
- [First Script](getting-started/first-script.md) - Tutorial: Creating your first script
- [Common Patterns](getting-started/common-patterns.md) - Essential coding patterns

### API Reference

#### Core APIs
- [Game Interface](api-reference/game-interface/game-gi.md) - `game.gi` methods and properties
- [Client Messages](api-reference/game-interface/client-messages.md) - `mClientMessages` API
- [Server Actions](api-reference/game-interface/server-actions.md) - `SendServerAction` reference

#### Zone APIs
- [Zone Overview](api-reference/zone/zone-overview.md) - Zone object structure
- [Buildings](api-reference/zone/buildings.md) - Building container and methods
- [Deposits](api-reference/zone/deposits.md) - Deposit container and methods
- [Specialists](api-reference/zone/specialists.md) - Specialist container methods
- [Production Queues](api-reference/zone/production-queues.md) - Production queue access

#### Building APIs
- [Building Methods](api-reference/buildings/building-methods.md) - `cBuilding` class methods
- [Building Properties](api-reference/buildings/building-properties.md) - Properties and state
- [Building IDs](api-reference/buildings/building-ids.md) - Complete building ID reference
- [Building Names](api-reference/buildings/building-names.md) - Building name strings
- [Building Categories](api-reference/buildings/building-categories.md) - Building categorization

#### Specialist APIs
- [Specialist Overview](api-reference/specialists/specialist-overview.md) - Base specialist class
- [Explorers](api-reference/specialists/explorers/) - Explorer API documentation
- [Geologists](api-reference/specialists/geologists/) - Geologist API documentation
- [Generals](api-reference/specialists/generals/) - General API documentation
- [Marshals](api-reference/specialists/marshals/) - Marshal API documentation

#### Resource APIs
- [Resource Access](api-reference/resources/resource-access.md) - Resource retrieval methods
- [Resource List](api-reference/resources/resource-list.md) - Complete resource code names
- [Resource Categories](api-reference/resources/resource-categories.md) - Resource categorization
- [Resource Localization](api-reference/resources/resource-localization.md) - Localization keys

#### Mines & Deposits
- [Mine Types](api-reference/mines-deposits/mine-types.md) - Mine type definitions
- [Deposit Types](api-reference/mines-deposits/deposit-types.md) - Deposit type definitions
- [Depleted States](api-reference/mines-deposits/depleted-states.md) - Depleted mine detection
- [Mine Building Mapping](api-reference/mines-deposits/mine-building-mapping.md) - Mine to building mapping

#### Items
- [Tradable Items](api-reference/items/tradable-items.md) - Complete tradable items list
- [Item Categories](api-reference/items/item-categories.md) - Item categorization
- [Item Prices](api-reference/items/item-prices.md) - Market price reference
- [Item Localization](api-reference/items/item-localization.md) - Item name localization

#### Actions & Messages
- [Action IDs](api-reference/actions-messages/action-ids.md) - `SendServerAction` IDs
- [Message IDs](api-reference/actions-messages/message-ids.md) - `SendMessagetoServer` IDs
- [VO Definitions](api-reference/actions-messages/vo-definitions.md) - Value Object definitions
- [Server Communication](api-reference/actions-messages/server-communication.md) - Communication patterns

#### UI Helpers
- [Modal Windows](api-reference/ui-helpers/modal-windows.md) - Modal window creation
- [Menu Integration](api-reference/ui-helpers/menu-integration.md) - Menu item registration
- [Chat Logging](api-reference/ui-helpers/chat-logging.md) - Chat message logging
- [Localization](api-reference/ui-helpers/localization.md) - Localization utilities

#### Utilities
- [Definitions](api-reference/utilities/definitions.md) - `swmmo.getDefinitionByName`
- [Timers](api-reference/utilities/timers.md) - Timer and queue management
- [Settings](api-reference/utilities/settings.md) - Settings persistence
- [Common Functions](api-reference/utilities/common-functions.md) - Shared utility functions

### Data Reference
- [Building IDs Complete](data-reference/building-ids-complete.md) - Complete building ID table
- [Resource Names Complete](data-reference/resource-names-complete.md) - All resource code names
- [Specialist Types Complete](data-reference/specialist-types-complete.md) - All specialist type IDs
- [Task Definitions Complete](data-reference/task-definitions-complete.md) - All task type/subtask IDs
- [Localization Keys](data-reference/localization-keys.md) - Localization key reference

### Examples
- [Specialist Management](examples/specialist-management/) - Explorer/Geologist management examples
- [Building Management](examples/building-management/) - Building automation examples
- [Resource Management](examples/resource-management/) - Resource access examples
- [Trading](examples/trading/) - Trading system examples
- [UI Patterns](examples/ui-patterns/) - UI implementation examples

### Patterns & Best Practices
- [Error Handling](patterns-best-practices/error-handling.md) - Error handling patterns
- [Async Operations](patterns-best-practices/async-operations.md) - Async and timing patterns
- [State Management](patterns-best-practices/state-management.md) - State persistence patterns
- [Performance](patterns-best-practices/performance.md) - Performance optimization
- [Code Organization](patterns-best-practices/code-organization.md) - Script organization patterns

### Troubleshooting
- [Common Errors](troubleshooting/common-errors.md) - Common error codes and solutions
- [Debugging](troubleshooting/debugging.md) - Debugging techniques
- [Known Issues](troubleshooting/known-issues.md) - Known limitations and workarounds

## Documentation Standards

This documentation follows these standards:

- **Language**: English (for AI compatibility and international standards)
- **Format**: Markdown with code blocks, tables, and diagrams
- **Code Examples**: All examples are from actual working scripts
- **Completeness**: Every method, property, and constant is documented
- **Cross-references**: Extensive linking between related topics

## Contributing

When adding new documentation:

1. Follow the existing structure and format
2. Include code examples from working scripts
3. Document all parameters, return types, and edge cases
4. Add cross-references to related topics
5. Update this README with new sections

## Version Information

This documentation is based on:
- TSO Client (fedorovvl/tso_client repository)
- Active scripts: AG_ExplorerManager.js, CURSOR_AutoFarms.js, CURSOR_QuickTrader.js, Specialist_Tasks.js, WarehouseViewer.user.js
- Sample scripts from the Samples/ directory

---

**Last Updated**: 2025-01-XX


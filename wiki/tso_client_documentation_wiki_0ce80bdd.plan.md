---
name: TSO Client Documentation Wiki
overview: Create a comprehensive, exhaustive documentation wiki for TSO Client userscript development. The documentation will be organized in a wiki folder structure with markdown files covering all APIs, methods, definitions, patterns, and best practices discovered from existing scripts and codebase analysis.
todos:
  - id: create_wiki_structure
    content: Create wiki/ folder structure with all subdirectories
    status: completed
  - id: api_game_interface
    content: Document game.gi API (game-interface/game-gi.md)
    status: completed
    dependencies:
      - create_wiki_structure
  - id: api_zone
    content: Document zone API (zone/zone-overview.md, buildings.md, deposits.md, specialists.md)
    status: completed
    dependencies:
      - create_wiki_structure
  - id: api_buildings
    content: Document building API (buildings/building-methods.md, building-ids.md)
    status: completed
    dependencies:
      - create_wiki_structure
  - id: api_specialists
    content: Document all specialist APIs (explorers, geologists, generals, marshals)
    status: completed
    dependencies:
      - create_wiki_structure
  - id: data_reference
    content: Create complete data reference tables (building IDs, resources, tasks)
    status: completed
    dependencies:
      - create_wiki_structure
  - id: examples_analysis
    content: Analyze and document all active scripts as examples
    status: completed
    dependencies:
      - api_game_interface
      - api_zone
      - api_buildings
      - api_specialists
  - id: patterns_best_practices
    content: Extract and document patterns and best practices
    status: completed
    dependencies:
      - examples_analysis
  - id: troubleshooting
    content: Create troubleshooting guide with common errors
    status: completed
    dependencies:
      - api_game_interface
      - api_zone
  - id: readme_index
    content: Create main README.md with navigation and overview
    status: completed
    dependencies:
      - create_wiki_structure
---

# TSO Client Userscript Documentation Wiki

## Documentation Structure

The documentation will be organized in the `wiki/` folder with the following structure:

```
wiki/
├── README.md                          # Main index and navigation
├── getting-started/
│   ├── introduction.md                # Overview of TSO client scripting
│   ├── setup.md                       # Environment setup
│   ├── first-script.md                # Tutorial: Creating your first script
│   └── common-patterns.md             # Common coding patterns
├── api-reference/
│   ├── game-interface/
│   │   ├── game-gi.md                 # game.gi methods and properties
│   │   ├── client-messages.md         # mClientMessages API
│   │   └── server-actions.md          # SendServerAction reference
│   ├── zone/
│   │   ├── zone-overview.md           # Zone object structure
│   │   ├── buildings.md               # Building container and methods
│   │   ├── deposits.md                # Deposit container and methods
│   │   ├── specialists.md             # Specialist container methods
│   │   └── production-queues.md       # Production queue access
│   ├── buildings/
│   │   ├── building-methods.md        # cBuilding class methods
│   │   ├── building-properties.md     # Properties and state
│   │   ├── building-ids.md            # Complete building ID reference
│   │   ├── building-names.md          # Building name strings
│   │   └── building-categories.md     # Building categorization
│   ├── specialists/
│   │   ├── specialist-overview.md     # Base specialist class
│   │   ├── explorers/
│   │   │   ├── explorer-methods.md    # Explorer-specific methods
│   │   │   ├── explorer-tasks.md      # Task definitions and IDs
│   │   │   ├── explorer-skills.md     # Skill tree and abilities
│   │   │   └── explorer-types.md      # Explorer type definitions
│   │   ├── geologists/
│   │   │   ├── geologist-methods.md   # Geologist-specific methods
│   │   │   ├── geologist-tasks.md     # Resource search tasks
│   │   │   ├── geologist-skills.md    # Skill tree
│   │   │   └── geologist-types.md      # Geologist type definitions
│   │   ├── generals/
│   │   │   ├── general-methods.md     # General-specific methods
│   │   │   ├── general-skills.md      # Combat skills
│   │   │   └── general-types.md       # General type definitions
│   │   └── marshals/
│   │       ├── marshal-methods.md     # Marshal-specific methods
│   │       ├── marshal-skills.md      # Marshal skills
│   │       └── marshal-types.md       # Marshal type definitions
│   ├── resources/
│   │   ├── resource-access.md         # Resource retrieval methods
│   │   ├── resource-list.md           # Complete resource code names
│   │   ├── resource-categories.md     # Resource categorization
│   │   └── resource-localization.md   # Localization keys
│   ├── mines-deposits/
│   │   ├── mine-types.md              # Mine type definitions
│   │   ├── deposit-types.md           # Deposit type definitions
│   │   ├── depleted-states.md          # Depleted mine detection
│   │   └── mine-building-mapping.md   # Mine to building mapping
│   ├── items/
│   │   ├── tradable-items.md          # Complete tradable items list
│   │   ├── item-categories.md         # Item categorization
│   │   ├── item-prices.md             # Market price reference
│   │   └── item-localization.md       # Item name localization
│   ├── actions-messages/
│   │   ├── action-ids.md              # SendServerAction IDs
│   │   ├── message-ids.md             # SendMessagetoServer IDs
│   │   ├── vo-definitions.md          # Value Object definitions
│   │   └── server-communication.md    # Communication patterns
│   ├── ui-helpers/
│   │   ├── modal-windows.md           # Modal window creation
│   │   ├── menu-integration.md        # Menu item registration
│   │   ├── chat-logging.md            # Chat message logging
│   │   └── localization.md            # Localization utilities
│   └── utilities/
│       ├── definitions.md             # swmmo.getDefinitionByName
│       ├── timers.md                  # Timer and queue management
│       ├── settings.md                # Settings persistence
│       └── common-functions.md        # Shared utility functions
├── data-reference/
│   ├── building-ids-complete.md       # Complete building ID table
│   ├── resource-names-complete.md     # All resource code names
│   ├── specialist-types-complete.md   # All specialist type IDs
│   ├── task-definitions-complete.md   # All task type/subtask IDs
│   └── localization-keys.md           # Localization key reference
├── examples/
│   ├── specialist-management/
│   │   ├── explorer-manager.md        # AG_ExplorerManager analysis
│   │   ├── specialist-tasks.md        # Specialist_Tasks.js analysis
│   │   └── sending-tasks.md           # Task assignment patterns
│   ├── building-management/
│   │   ├── auto-rebuild.md            # CURSOR_AutoFarms analysis
│   │   ├── building-detection.md      # Building scanning patterns
│   │   └── production-management.md   # Production queue patterns
│   ├── resource-management/
│   │   ├── warehouse-viewer.md       # WarehouseViewer analysis
│   │   ├── resource-access.md         # Resource retrieval patterns
│   │   └── resource-filtering.md      # Resource filtering patterns
│   ├── trading/
│   │   ├── quick-trader.md            # CURSOR_QuickTrader analysis
│   │   ├── trade-creation.md          # Trade offer patterns
│   │   └── market-integration.md      # Market slot management
│   └── ui-patterns/
│       ├── modal-creation.md          # Modal window patterns
│       ├── table-rendering.md         # Table rendering patterns
│       └── form-handling.md           # Form and input patterns
├── patterns-best-practices/
│   ├── error-handling.md              # Error handling patterns
│   ├── async-operations.md            # Async and timing patterns
│   ├── state-management.md            # State persistence patterns
│   ├── performance.md                 # Performance optimization
│   └── code-organization.md           # Script organization patterns
└── troubleshooting/
    ├── common-errors.md               # Common error codes and solutions
    ├── debugging.md                   # Debugging techniques
    └── known-issues.md                # Known limitations and workarounds
```

## Documentation Content Details

### 1. API Reference Sections

Each API reference file will include:

- **Complete method signatures** with parameter types and return types
- **Detailed parameter descriptions** with valid ranges, constraints, and edge cases
- **Return value documentation** with possible return types and null/undefined cases
- **Code examples** from active scripts showing real-world usage
- **Related methods** and alternative approaches
- **Performance notes** where applicable
- **Common errors** and how to avoid them
- **Internal behavior** notes when relevant

### 2. Data Reference Sections

Complete tables with:

- All IDs mapped to names
- Categories and classifications
- Relationships between entities
- Localization keys
- Deprecated/alternative names

### 3. Examples Sections

For each active script:

- **Architecture overview** with data flow diagrams
- **Key patterns** used
- **API usage** analysis
- **Code snippets** with explanations
- **Lessons learned** and best practices extracted

### 4. Patterns & Best Practices

- **Common patterns** extracted from Samples and active scripts
- **Anti-patterns** to avoid
- **Performance considerations**
- **Code organization** strategies
- **Testing approaches**

## Key Documentation Files

### Core API Files

1. **game-interface/game-gi.md**: Complete `game.gi` API with all methods, properties, and usage patterns
2. **zone/zone-overview.md**: Zone object structure, access patterns, and all available methods
3. **buildings/building-methods.md**: Exhaustive cBuilding method reference with examples
4. **specialists/explorers/explorer-methods.md**: Complete explorer API including task assignment, skill access, duration calculation
5. **specialists/geologists/geologist-methods.md**: Complete geologist API including resource search tasks

### Data Reference Files

1. **building-ids-complete.md**: All building IDs with names, categories, and usage notes
2. **resource-names-complete.md**: All resource code names with categories from WarehouseViewer and QuickTrader
3. **task-definitions-complete.md**: All explorer and geologist task definitions with requirements

### Example Analysis Files

1. **examples/specialist-management/explorer-manager.md**: Deep dive into AG_ExplorerManager.js architecture
2. **examples/building-management/auto-rebuild.md**: CURSOR_AutoFarms.js pattern analysis
3. **examples/trading/quick-trader.md**: CURSOR_QuickTrader.js implementation analysis

## Documentation Standards

- **Language**: English (for AI compatibility and international standards)
- **Format**: Markdown with code blocks, tables, and diagrams
- **Code Examples**: All examples will be from actual working scripts
- **Cross-references**: Extensive linking between related topics
- **Version Notes**: Document any version-specific behaviors
- **Completeness**: Every method, property, and constant will be documented

## Implementation Approach

1. Start with core API references (game-interface, zone, buildings)
2. Document specialists comprehensively (explorers, geologists, generals, marshals)
3. Create complete data reference tables
4. Analyze and document all active scripts as examples
5. Extract and document patterns and best practices
6. Add troubleshooting and common errors

This structure ensures the documentation serves as both a reference guide and a learning resource for AI-assisted development.
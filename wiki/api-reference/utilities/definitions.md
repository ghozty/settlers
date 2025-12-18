# Game Definitions API

Complete reference for accessing game class definitions.

## Getting Definitions

### Using `swmmo.getDefinitionByName()`

```javascript
swmmo.getDefinitionByName(className)
```

**Parameters**:
- `className` (string): Fully qualified class name

**Returns**: Class definition (constructor function)

**Usage**:
```javascript
var dTimedProductionVO = swmmo.getDefinitionByName("Communication.VO::dTimedProductionVO");
var vo = new dTimedProductionVO();
```

### Using `game.def()`

```javascript
game.def(className, create)
```

**Parameters**:
- `className` (string): Fully qualified class name
- `create` (boolean, optional): Whether to create instance

**Returns**: Class definition or instance

**Usage**:
```javascript
// Get definition
var dTradeOfferVO = game.def("Communication.VO::dTradeOfferVO", true);

// Create instance
var vo = new (game.def("Communication.VO::dTradeOfferVO"));
```

## Common Class Names

### Value Objects

| Class Name | Description |
|------------|-------------|
| `Communication.VO::dTimedProductionVO` | Production order VO |
| `Communication.VO::dTradeOfferVO` | Trade offer VO |
| `Communication.VO::dResourceVO` | Resource data VO |
| `Communication.VO::dStartSpecialistTaskVO` | Specialist task VO |
| `Communication.VO::dUniqueID` | Unique identifier VO |

### Game Definitions

| Class Name | Description |
|------------|-------------|
| `global` | Global game definitions |
| `Specialists::cSpecialist` | Specialist class |

## Usage Examples

### Creating Value Objects

```javascript
// Method 1: Using swmmo.getDefinitionByName
var dTimedProductionVO = swmmo.getDefinitionByName("Communication.VO::dTimedProductionVO");
var vo = new dTimedProductionVO();

// Method 2: Using game.def
var vo = new (game.def("Communication.VO::dTradeOfferVO"));
```

### Accessing Global Definitions

```javascript
// Get specialist task definitions
var task = swmmo.getDefinitionByName("global").specialistTaskDefinitions_vector[taskId];
```

## Related Documentation

- [VO Definitions](../actions-messages/vo-definitions.md) - Value Object reference
- [Server Communication](../actions-messages/server-communication.md) - Communication patterns


# Deposit Types Reference

Complete reference of deposit types and their characteristics.

## Deposit Access

```javascript
var zone = game.gi.mCurrentPlayerZone;
var deposits = zone.mStreetDataMap.mDepositContainer;
```

## Deposit Methods

### `GetName_string()`

**Signature**: `GetName_string(): string`

**Description**: Gets the resource type name of the deposit.

**Returns**: Resource code name (e.g., "IronOre", "Coal", "BronzeOre")

### `GetGrid()`

**Signature**: `GetGrid(): int`

**Description**: Gets the grid position of the deposit.

**Returns**: Grid position (int)

### `GetAmount()`

**Signature**: `GetAmount(): int`

**Description**: Gets the remaining resource amount in the deposit.

**Returns**: Resource amount (int)

## Deposit Types

### Ore Deposits

| Deposit Name | Resource | Building Name | Building ID |
|--------------|----------|--------------|-------------|
| `IronOre` | Iron Ore | IronMine | 50 |
| `Coal` | Coal | CoalMine | 37 |
| `BronzeOre` | Bronze Ore | BronzeMine | 36 |
| `GoldOre` | Gold Ore | GoldMine | 46 |
| `TitaniumOre` | Titanium Ore | TitaniumMine | 69 |
| `Salpeter` | Saltpeter | SalpeterMine | 63 |

### Stone Deposits

| Deposit Name | Resource | Building Name | Building ID |
|--------------|----------|--------------|-------------|
| `Marble` | Marble | - | - (Quarry) |
| `Stone` | Stone | - | - (Quarry) |
| `Granite` | Granite | - | - (Quarry) |

### Other Deposits

| Deposit Name | Resource | Building Name | Building ID |
|--------------|----------|--------------|-------------|
| `Corn` | Corn | Farmfield | 43 |
| `Water` | Water | Well | 72 |

## Deposit States

### Active Mine

Deposit with a building constructed on it:

```javascript
var building = zone.GetBuildingFromGridPosition(deposit.GetGrid());
if (building !== null) {
    // Active mine - building is extracting resources
}
```

### Available Deposit

Deposit found but no building constructed:

```javascript
var building = zone.GetBuildingFromGridPosition(deposit.GetGrid());
if (building === null) {
    // Available deposit - can be built upon
}
```

### Depleted Deposit

Deposit that has been exhausted (appears as building ruin):

```javascript
// Depleted deposits appear as buildings, not deposits
if (zone.mStreetDataMap.IsADepletedDeposit(building)) {
    // Building is a depleted deposit ruin
}
```

## Related Documentation

- [Mine Types](mine-types.md) - Mine type definitions
- [Depleted States](depleted-states.md) - Depleted mine detection
- [Mine Building Mapping](mine-building-mapping.md) - Mine to building mapping


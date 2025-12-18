# Mine Building Mapping Reference

Complete mapping between deposits, depleted deposits, and their corresponding buildings.

## Deposit to Building Mapping

### Active Mines

When a deposit has a building constructed on it, the building name follows the pattern: `[Resource]Mine`

| Deposit Name | Resource | Active Building Name | Building ID |
|--------------|----------|---------------------|-------------|
| `IronOre` | Iron Ore | `IronMine` | 50 |
| `Coal` | Coal | `CoalMine` | 37 |
| `BronzeOre` | Bronze Ore | `BronzeMine` | 36 |
| `GoldOre` | Gold Ore | `GoldMine` | 46 |
| `TitaniumOre` | Titanium Ore | `TitaniumMine` | 69 |
| `Salpeter` | Saltpeter | `SalpeterMine` | 63 |

### Farms and Wells

| Deposit Name | Resource | Active Building Name | Building ID |
|--------------|----------|---------------------|-------------|
| `Corn` | Corn | `Farmfield` | 43 |
| `Water` | Water | `Well` | 72 |

### Quarries

Quarries don't have buildings - they're just extraction points:

| Deposit Name | Resource | Building Name | Building ID |
|--------------|----------|--------------|-------------|
| `Marble` | Marble | - | - |
| `Stone` | Stone | - | - |
| `Granite` | Granite | - | - |

## Depleted Deposit to Building Mapping

All depleted deposits follow the pattern: `MineDepletedDeposit[ResourceType]`

| Depleted Name | Original Resource | Rebuild Building | Building ID |
|---------------|-------------------|------------------|-------------|
| `MineDepletedDepositCorn` | Corn | `Farmfield` | 43 |
| `MineDepletedDepositWater` | Water | `Well` | 72 |
| `MineDepletedDepositBronzeOre` | Bronze Ore | `BronzeMine` | 36 |
| `MineDepletedDepositCoal` | Coal | `CoalMine` | 37 |
| `MineDepletedDepositGoldOre` | Gold Ore | `GoldMine` | 46 |
| `MineDepletedDepositIronOre` | Iron Ore | `IronMine` | 50 |
| `MineDepletedDepositTitaniumOre` | Titanium Ore | `TitaniumMine` | 69 |
| `MineDepletedDepositSalpeter` | Saltpeter | `SalpeterMine` | 63 |
| `MineDepletedDepositMarble` | Marble | - | - |
| `MineDepletedDepositStone` | Stone | - | - |

## Mapping Functions

### Get Building ID from Depleted Name

```javascript
function getBuildingIDFromDepleted(depletedName) {
    var mapping = {
        "MineDepletedDepositCorn": 43,        // Farmfield
        "MineDepletedDepositWater": 72,       // Well
        "MineDepletedDepositBronzeOre": 36,   // BronzeMine
        "MineDepletedDepositCoal": 37,        // CoalMine
        "MineDepletedDepositGoldOre": 46,     // GoldMine
        "MineDepletedDepositIronOre": 50,     // IronMine
        "MineDepletedDepositTitaniumOre": 69, // TitaniumMine
        "MineDepletedDepositSalpeter": 63     // SalpeterMine
    };
    
    return mapping[depletedName] || 0;
}
```

### Get Building Name from Deposit

```javascript
function getBuildingNameFromDeposit(depositName) {
    var mapping = {
        "IronOre": "IronMine",
        "Coal": "CoalMine",
        "BronzeOre": "BronzeMine",
        "GoldOre": "GoldMine",
        "TitaniumOre": "TitaniumMine",
        "Salpeter": "SalpeterMine",
        "Corn": "Farmfield",
        "Water": "Well"
    };
    
    return mapping[depositName] || null;
}
```

## Usage Examples

### Check Deposit State

```javascript
function checkDepositState(deposit) {
    var depositName = deposit.GetName_string();
    var grid = deposit.GetGrid();
    var building = zone.GetBuildingFromGridPosition(grid);
    
    if (building === null) {
        return {
            state: "available",
            depositName: depositName,
            grid: grid
        };
    }
    
    if (zone.mStreetDataMap.IsADepletedDeposit(building)) {
        return {
            state: "depleted",
            depositName: depositName,
            buildingName: building.GetBuildingName_string(),
            grid: grid
        };
    }
    
    return {
        state: "active",
        depositName: depositName,
        buildingName: building.GetBuildingName_string(),
        grid: grid
    };
}
```

## Related Documentation

- [Mine Types](mine-types.md) - Mine type definitions
- [Deposit Types](deposit-types.md) - Deposit type definitions
- [Depleted States](depleted-states.md) - Depleted mine detection
- [Building IDs](../buildings/building-ids.md) - Building ID reference


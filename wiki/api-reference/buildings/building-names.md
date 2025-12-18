# Building Names Reference

Complete reference of all building name strings used in the game.

## Building Name Format

Building names are retrieved via:
```javascript
var name = building.GetBuildingName_string();
```

## Production Buildings

| Building Name | Description | Category |
|---------------|-------------|----------|
| `Bookbinder` | Science production building | Science |
| `AdventureBookbinder` | Adventure version of Bookbinder | Science |
| `Bakery` | Bread production | Food |
| `Brewery` | Brew production | Food |
| `Butcher` | Sausage production | Food |
| `Miller` | Flour production | Food |
| `Farm` | Main farm building | Food |
| `Farmfield` | Corn production field | Food |
| `Farmfield_03` | Farmfield variant | Food |
| `Fisher` | Fish production | Food |
| `Hunter` | Meat production | Food |

## Resource Extraction Buildings

| Building Name | Resource | Category |
|---------------|----------|----------|
| `Well` | Water | Resource |
| `Well_03` | Water (variant) | Resource |
| `BronzeMine` | Bronze Ore | Mine |
| `CoalMine` | Coal | Mine |
| `GoldMine` | Gold Ore | Mine |
| `IronMine` | Iron Ore | Mine |
| `TitaniumMine` | Titanium Ore | Mine |
| `SalpeterMine` | Saltpeter | Mine |

## Depleted Deposit Names

All depleted deposits follow the pattern: `MineDepletedDeposit[ResourceType]`

| Depleted Name | Original Resource | Rebuild To |
|---------------|-------------------|------------|
| `MineDepletedDepositCorn` | Corn (Farm) | Farmfield |
| `MineDepletedDepositWater` | Water (Well) | Well |
| `MineDepletedDepositBronzeOre` | Bronze Ore | BronzeMine |
| `MineDepletedDepositCoal` | Coal | CoalMine |
| `MineDepletedDepositGoldOre` | Gold Ore | GoldMine |
| `MineDepletedDepositIronOre` | Iron Ore | IronMine |
| `MineDepletedDepositTitaniumOre` | Titanium Ore | TitaniumMine |
| `MineDepletedDepositSalpeter` | Saltpeter | SalpeterMine |
| `MineDepletedDepositMarble` | Marble | - |
| `MineDepletedDepositStone` | Stone | - |

**Detection Pattern**:
```javascript
if (building.GetBuildingName_string().indexOf("MineDepletedDeposit") >= 0) {
    // Building is a depleted deposit
}
```

**Using IsADepletedDeposit**:
```javascript
if (zone.mStreetDataMap.IsADepletedDeposit(building)) {
    // Building is a depleted deposit
}
```

## Smelters & Workshops

| Building Name | Category | Description |
|---------------|----------|-------------|
| `BronzeSmelter` | Smelting | Bronze production |
| `GoldSmelter` | Smelting | Gold production |
| `IronSmelter` | Smelting | Iron production |
| `SteelForge` | Smelting | Steel production |
| `CokingPlant` | Processing | Coal processing |
| `BronzeWeaponsmith` | Weapons | Bronze weapons |
| `IronWeaponsmith` | Weapons | Iron weapons |
| `SteelWeaponsmith` | Weapons | Steel weapons |
| `Bowmaker` | Weapons | Bow production |
| `Crossbowsmith` | Weapons | Crossbow production |
| `Longbowmaker` | Weapons | Longbow production |
| `ExpeditionWeaponSmith` | Weapons | Expedition weapons |

## Wood Processing

| Building Name | Category | Description |
|---------------|----------|-------------|
| `Forester` | Wood | Plants trees |
| `WoodCutter` | Wood | Cuts trees |
| `Sawmill` | Wood | Processes wood |
| `RealWoodForester` | Exotic Wood | Exotic wood forester |
| `RealWoodCutter` | Exotic Wood | Exotic wood cutter |
| `RealWoodSawmill` | Exotic Wood | Exotic wood sawmill |
| `ExoticWoodSawmill` | Exotic Wood | Exotic wood processing |

## Military Buildings

| Building Name | Category | Description |
|---------------|----------|-------------|
| `Barracks` | Military | Basic military building |
| `Barracks3` | Military | Advanced military building |
| `Stable` | Military | Cavalry building |
| `ProvisionHouse` | Military | Military supplies |

## Administrative & Storage

| Building Name | Category | Description |
|---------------|----------|-------------|
| `Mayorhouse` | Admin | Town hall |
| `Warehouse` | Storage | Resource storage |
| `Tavern` | Admin | Tavern building |
| `Logistics` | Admin | Logistics building |
| `Coinage` | Economy | Coin production |
| `Toolmaker` | Tools | Tool production |

## Residences

| Building Name | Category | Description |
|---------------|----------|-------------|
| `SimpleResidence` | Housing | Basic residence |
| `NobleResidence` | Housing | Advanced residence |

## Paper Production (Science Chain)

| Building Name | Category | Description |
|---------------|----------|-------------|
| `PapermillSimple` | Paper | Basic paper production |
| `PapermillIntermediate` | Paper | Intermediate paper |
| `Lettersmith` | Paper | Letter production |
| `Finesmith` | Paper | Fine paper production |

## Decorations

| Building Name | Category | Description |
|---------------|----------|-------------|
| `lanternSingle` | Decoration | Single lantern |
| `vases` | Decoration | Vase decoration |
| `decoration_mountain_peak` | Decoration | Mountain peak decoration |

## Special Buildings

| Building Name | Category | Description |
|---------------|----------|-------------|
| `AirshipExcelsior` | Event/Special | Special event building |
| `MarbleMason` | Processing | Marble processing |
| `Mason` | Processing | Stone processing |

## Usage Examples

### Finding Buildings by Name

```javascript
function findBuildingsByName(buildingName) {
    var found = [];
    var zone = game.gi.mCurrentPlayerZone;
    var buildings = zone.mStreetDataMap.mBuildingContainer;
    
    buildings.forEach(function(building) {
        try {
            if (building.GetBuildingName_string() === buildingName) {
                found.push(building);
            }
        } catch (e) { }
    });
    
    return found;
}

// Usage
var bookbinders = findBuildingsByName("Bookbinder");
var farms = findBuildingsByName("Farmfield");
```

### Detecting Depleted Deposits

```javascript
function findDepletedDeposits() {
    var depleted = [];
    var zone = game.gi.mCurrentPlayerZone;
    var buildings = zone.mStreetDataMap.mBuildingContainer;
    
    buildings.forEach(function(building) {
        try {
            var name = building.GetBuildingName_string();
            if (name.indexOf("MineDepletedDeposit") === 0) {
                depleted.push({
                    building: building,
                    name: name,
                    grid: building.GetGrid()
                });
            }
        } catch (e) { }
    });
    
    return depleted;
}
```

## Related Documentation

- [Building IDs](building-ids.md) - Building ID reference
- [Building Categories](building-categories.md) - Building categorization
- [Building Methods](building-methods.md) - cBuilding class methods


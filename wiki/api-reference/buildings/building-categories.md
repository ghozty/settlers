# Building Categories Reference

Complete categorization of all buildings by their function and purpose.

## Category System

Buildings are categorized by their primary function in the game. This categorization helps organize building lists and filter buildings by type.

## Production Buildings

Buildings that produce resources or items.

### Food Production

| Building Name | Produces |
|---------------|----------|
| `Farmfield` | Corn |
| `Bakery` | Bread |
| `Brewery` | Brew |
| `Butcher` | Sausage |
| `Miller` | Flour |
| `Fisher` | Fish |
| `Hunter` | Meat |

### Science Production

| Building Name | Produces |
|---------------|----------|
| `Bookbinder` | Manuscript |
| `AdventureBookbinder` | Manuscript (Adventure) |
| `PapermillSimple` | Simple Paper |
| `PapermillIntermediate` | Intermediate Paper |
| `Lettersmith` | Letters |
| `Finesmith` | Fine Paper |

### Resource Extraction

| Building Name | Extracts |
|---------------|----------|
| `Well` | Water |
| `BronzeMine` | Bronze Ore |
| `CoalMine` | Coal |
| `GoldMine` | Gold Ore |
| `IronMine` | Iron Ore |
| `TitaniumMine` | Titanium Ore |
| `SalpeterMine` | Saltpeter |
| `Forester` | Wood (plants trees) |
| `WoodCutter` | Wood (cuts trees) |

### Processing Buildings

| Building Name | Processes |
|---------------|-----------|
| `Sawmill` | Wood → Plank |
| `BronzeSmelter` | Bronze Ore → Bronze |
| `GoldSmelter` | Gold Ore → Gold |
| `IronSmelter` | Iron Ore → Iron |
| `SteelForge` | Iron → Steel |
| `CokingPlant` | Coal processing |
| `MarbleMason` | Marble processing |
| `Mason` | Stone processing |

### Weapon Production

| Building Name | Produces |
|---------------|----------|
| `BronzeWeaponsmith` | Bronze weapons |
| `IronWeaponsmith` | Iron weapons |
| `SteelWeaponsmith` | Steel weapons |
| `Bowmaker` | Bows |
| `Crossbowsmith` | Crossbows |
| `Longbowmaker` | Longbows |
| `ExpeditionWeaponSmith` | Expedition weapons |

## Infrastructure Buildings

Buildings that provide infrastructure and services.

### Storage

| Building Name | Function |
|---------------|----------|
| `Warehouse` | Resource storage |

### Administrative

| Building Name | Function |
|---------------|----------|
| `Mayorhouse` | Town hall |
| `Tavern` | Tavern services |
| `Logistics` | Logistics management |
| `Coinage` | Coin production |

### Housing

| Building Name | Function |
|---------------|----------|
| `SimpleResidence` | Basic housing |
| `NobleResidence` | Advanced housing |

## Military Buildings

Buildings related to military operations.

| Building Name | Function |
|---------------|----------|
| `Barracks` | Basic military training |
| `Barracks3` | Advanced military training |
| `Stable` | Cavalry training |
| `ProvisionHouse` | Military supplies |

## Special Categories

### Depleted Deposits

All depleted deposits follow the pattern: `MineDepletedDeposit[ResourceType]`

These are ruins that appear when resources are depleted and can be rebuilt.

### Decorations

Non-functional buildings for aesthetic purposes:
- `lanternSingle`
- `vases`
- `decoration_mountain_peak`

### Special/Event Buildings

- `AirshipExcelsior` - Event building

## Categorization Patterns

### By Production Type

```javascript
var PRODUCTION_BUILDINGS = {
    food: ["Farmfield", "Bakery", "Brewery", "Butcher", "Miller", "Fisher", "Hunter"],
    science: ["Bookbinder", "AdventureBookbinder"],
    extraction: ["Well", "BronzeMine", "CoalMine", "GoldMine", "IronMine", "TitaniumMine", "SalpeterMine"],
    processing: ["Sawmill", "BronzeSmelter", "GoldSmelter", "IronSmelter", "SteelForge"],
    weapons: ["BronzeWeaponsmith", "IronWeaponsmith", "SteelWeaponsmith", "Bowmaker", "Crossbowsmith"]
};
```

### By Function

```javascript
function categorizeBuilding(building) {
    var name = building.GetBuildingName_string();
    
    if (name.indexOf("MineDepletedDeposit") === 0) {
        return "depleted";
    }
    
    if (building.IsDecoration()) {
        return "decoration";
    }
    
    if (building.isGarrison()) {
        return "military";
    }
    
    // Production check
    if (building.productionType !== undefined && building.productionType > 0) {
        return "production";
    }
    
    // Storage check
    if (name === "Warehouse") {
        return "storage";
    }
    
    return "other";
}
```

## Usage Examples

### Filter Buildings by Category

```javascript
function getBuildingsByCategory(category) {
    var filtered = [];
    var zone = game.gi.mCurrentPlayerZone;
    var buildings = zone.mStreetDataMap.mBuildingContainer;
    
    buildings.forEach(function(building) {
        try {
            var cat = categorizeBuilding(building);
            if (cat === category) {
                filtered.push(building);
            }
        } catch (e) { }
    });
    
    return filtered;
}

// Usage
var productionBuildings = getBuildingsByCategory("production");
var militaryBuildings = getBuildingsByCategory("military");
```

## Related Documentation

- [Building Names](building-names.md) - Building name strings
- [Building IDs](building-ids.md) - Building ID reference
- [Building Methods](building-methods.md) - cBuilding class methods


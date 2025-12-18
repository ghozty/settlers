# Complete Building IDs Reference

This is a comprehensive reference of all building names and their corresponding IDs. Use these IDs with `SendServerAction(50, buildingID, grid, 0, null)` to construct buildings.

## Production Buildings

| Building Name | Building ID | Category | Notes |
|---------------|-------------|----------|-------|
| Bookbinder | 87 | Science | Produces Manuscript, uses ProductionType 2 |
| AdventureBookbinder | 1383 | Science | Adventure version |
| Bakery | 0 | Food | - |
| Brewery | 2 | Food | - |
| Butcher | 5 | Food | - |
| Miller | 13 | Food | - |
| Farm | 42 | Food | Main farm building |
| Farmfield | 43 | Food | Used for corn production, rebuilt after depletion |
| Farmfield_03 | 247 | Food | Variant |
| Fisher | 44 | Food | - |
| Hunter | 49 | Food | - |

## Resource Extraction

| Building Name | Building ID | Resource | Notes |
|---------------|-------------|----------|-------|
| Well | 72 | Water | Rebuilt after drying up |
| Well_03 | 176 | Water | Variant |
| BronzeMine | 36 | BronzeOre | - |
| CoalMine | 37 | Coal | - |
| GoldMine | 46 | GoldOre | - |
| IronMine | 50 | IronOre | - |
| TitaniumMine | 69 | TitaniumOre | - |
| SalpeterMine | 63 | Salpeter | - |

## Depleted Deposits (Ruins)

| Ruin Name | Building ID | Original Resource | Rebuild To |
|-----------|-------------|-------------------|------------|
| MineDepletedDepositCorn | 215 | Corn (Farm) | Farmfield (43) |
| MineDepletedDepositWater | 214 | Water (Well) | Well (72) |
| MineDepletedDepositBronzeOre | 207 | BronzeOre | BronzeMine (36) |
| MineDepletedDepositCoal | - | Coal | CoalMine (37) |
| MineDepletedDepositGoldOre | 206 | GoldOre | GoldMine (46) |
| MineDepletedDepositIronOre | 208 | IronOre | IronMine (50) |
| MineDepletedDepositTitaniumOre | - | TitaniumOre | TitaniumMine (69) |
| MineDepletedDepositSalpeter | - | Salpeter | SalpeterMine (63) |
| MineDepletedDepositMarble | 213 | Marble | - |
| MineDepletedDepositStone | 211 | Stone | - |

## Smelters & Workshops

| Building Name | Building ID | Category | Notes |
|---------------|-------------|----------|-------|
| BronzeSmelter | 3 | Smelting | - |
| GoldSmelter | 10 | Smelting | - |
| IronSmelter | 12 | Smelting | - |
| SteelForge | 66 | Smelting | - |
| CokingPlant | 8 | Processing | - |
| BronzeWeaponsmith | 4 | Weapons | - |
| IronWeaponsmith | 51 | Weapons | - |
| SteelWeaponsmith | 67 | Weapons | - |
| Bowmaker | 35 | Weapons | - |
| Crossbowsmith | 9 | Weapons | - |
| Longbowmaker | 53 | Weapons | - |
| ExpeditionWeaponSmith | 582 | Weapons | - |

## Wood Processing

| Building Name | Building ID | Category | Notes |
|---------------|-------------|----------|-------|
| Forester | 45 | Wood | Plants trees |
| WoodCutter | 73 | Wood | Cuts trees |
| Sawmill | 14 | Wood | Processes wood |
| RealWoodForester | 60 | Exotic Wood | - |
| RealWoodCutter | 61 | Exotic Wood | - |
| RealWoodSawmill | 62 | Exotic Wood | - |
| ExoticWoodSawmill | 41 | Exotic Wood | - |

## Military Buildings

| Building Name | Building ID | Category | Notes |
|---------------|-------------|----------|-------|
| Barracks | 33 | Military | Basic |
| Barracks3 | 581 | Military | Advanced |
| Stable | 15 | Military | Cavalry |
| ProvisionHouse | 59 | Military | Supplies |

## Administrative & Storage

| Building Name | Building ID | Category | Notes |
|---------------|-------------|----------|-------|
| Mayorhouse | 80 | Admin | Town hall |
| Warehouse | 71 | Storage | Resource storage |
| Tavern | 68 | Admin | - |
| Logistics | 52 | Admin | - |
| Coinage | 7 | Economy | - |
| Toolmaker | 19 | Tools | - |

## Residences

| Building Name | Building ID | Category | Notes |
|---------------|-------------|----------|-------|
| SimpleResidence | 64 | Housing | Basic |
| NobleResidence | 57 | Housing | Advanced |

## Paper Production (Science Chain)

| Building Name | Building ID | Category | Notes |
|---------------|-------------|----------|-------|
| PapermillSimple | 367 | Paper | Basic paper |
| PapermillIntermediate | 369 | Paper | Intermediate |
| Lettersmith | 371 | Paper | - |
| Finesmith | 370 | Paper | - |

## Decorations

| Building Name | Building ID | Category | Notes |
|---------------|-------------|----------|-------|
| lanternSingle | 129 | Decoration | - |
| vases | 141 | Decoration | - |
| decoration_mountain_peak | 1176 | Decoration | - |

## Mountains (Destroyable)

| Building Name | Building ID | Notes |
|---------------|-------------|-------|
| DestroyableMountain_Mines_01 | 625 | - |
| DestroyableMountain_Mines_02 | 626 | - |
| DestroyableMountain_Mines_03 | 627 | - |
| DestroyableMountain_Mountain_BIG_sw01 | 622 | - |
| DestroyableMountain_Mountain_BIG_sw02 | 623 | - |
| DestroyableMountain_Mountain_BIG_sw03 | 624 | - |
| MountainClanColossus | 1781 | - |

## Bandits

| Building Name | Building ID | Notes |
|---------------|-------------|-------|
| Bandits_New | 715 | Basic |
| BanditsLvl2_New | 716 | Level 2 |
| BanditsLvl3_New | 717 | Level 3 |
| Banditsleader_New | 718 | Leader |

## Special

| Building Name | Building ID | Notes |
|---------------|-------------|-------|
| AirshipExcelsior | 867 | Event/Special |
| MarbleMason | 54 | Marble processing |
| Mason | 55 | Stone processing |

## Usage

```javascript
// Build a building
game.gi.SendServerAction(50, buildingID, grid, 0, null);

// Example: Build Farmfield
game.gi.SendServerAction(50, 43, grid, 0, null);
```

## Related Documentation

- [Building Methods](../api-reference/buildings/building-methods.md) - cBuilding class methods
- [Server Actions](../api-reference/game-interface/server-actions.md) - SendServerAction reference


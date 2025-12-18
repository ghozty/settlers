# Tradable Items Reference

Complete reference of all tradable items in the game market.

## Item Categories

Tradable items are organized into categories:

- **Advanced Resources** (23 items)
- **Basic Resources** (6 items)
- **Military** (20 items)
- **Other** (2 items)
- **Processed Resources** (13 items)
- **Special** (12 items)

**Total**: 76 tradable items

## Advanced Resources (23 items)

| Item Name | Code Name | Market Price |
|-----------|-----------|--------------|
| Attack Bow | CompositeBow | - |
| Attack Pike | Pike | - |
| Attack Saber | Saber | - |
| Coins | Coin | 1 |
| Gold | Gold | 0.45 |
| Gold Ore | GoldOre | 0.475 |
| Hardwood | RealWood | 0.018 |
| Hardwood Planks | RealPlank | 0.0225 |
| Heavy Crossbow | ExpeditionCrossbow | - |
| Heavy Lance | BattleLance | - |
| Heavy Mace | SpikedMace | - |
| Horse | Horse | 0.0225 |
| Intermediate Paper | IntermediatePaper | 0.135 |
| Iron | Iron | 0.405 |
| Iron Ore | IronOre | 0.225 |
| Iron Swords | IronSword | 0.27 |
| Longbows | Longbow | 0.18 |
| Marble | Marble | 0.054 |
| Meat | Meat | 0.045 |
| Printing Press Letter | Letter | 0.27 |
| Sausages | Sausage | 0.038 |
| Steel | Steel | 0.54 |
| Steel Swords | SteelSword | 0.54 |

## Basic Resources (6 items)

| Item Name | Code Name | Market Price |
|-----------|-----------|--------------|
| Fish | Fish | 0.0018 |
| Guild Coins | GuildCoins | 4.5 |
| Map Fragment | MapPart | 0.441 |
| Pinewood | Wood | 0.009 |
| Pinewood Planks | Plank | 0.009 |
| Stones | Stone | 0.018 |

## Military (20 items)

| Item Name | Code Name | Market Price |
|-----------|-----------|--------------|
| Advanced Paper | AdvancedPaper | 0.675 |
| Advanced Tools | AdvancedTools | 3.5 |
| Book Fitting | BookFitting | 3.325 |
| Cannons | Cannon | 6.65 |
| Carriages | Carriage | 2.25 |
| Crossbows | Crossbow | 3.325 |
| Damascene Sword | TitaniumSword | 3.15 |
| Exotic Wood | ExoticWood | 0.095 |
| Exotic Wood Planks | ExoticPlank | 0.099 |
| Granite | Granite | 0.38 |
| Grout | Grout | 18 |
| Gunpowder | Gunpowder | 5.4 |
| Magic Bean | MagicBean | 2.88 |
| Magic Beanstalk | MagicBeanstalk | 5.39 |
| Oil | Oil | - |
| Oilseed | Oilseed | - |
| Saltpeter | Salpeter | 2.7 |
| Titanium | Titanium | 1.8 |
| Titanium Ore | TitaniumOre | 2.25 |
| Wheels | Wheel | 1.8 |

## Other (2 items)

| Item Name | Code Name | Market Price |
|-----------|-----------|--------------|
| Adamantium Ore | CollectibleAdamantium | - |
| Banner | CollectibleBanner | - |

## Processed Resources (13 items)

| Item Name | Code Name | Market Price |
|-----------|-----------|--------------|
| Bows | Bow | 0.038 |
| Bread | Bread | 0.0081 |
| Brew | Beer | 0.018 |
| Bronze | Bronze | 0.038 |
| Bronze Swords | BronzeSword | 0.036 |
| Coal | Coal | 0.0114 |
| Copper Ore | BronzeOre | 0.045 |
| Flour | Flour | 0.0072 |
| Nib | Nib | 0.198 |
| Simple Paper | SimplePaper | 0.0405 |
| Tools | Tool | 0.036 |
| Water | Water | 0.0018 |
| Wheat | Corn | 0.0114 |

## Special (12 items)

| Item Name | Code Name | Market Price |
|-----------|-----------|--------------|
| Arquebuse | Archebuse | 6.65 |
| Battle Horse | BattleHorse | 0.9 |
| Mahogany Planks | MahoganyPlank | 0.315 |
| Mahogany Wood | MahoganyWood | 0.475 |
| Mortar | Mortar | 11.4 |
| Platinum | Platinum | 0.475 |
| Platinum Ore | PlatinumOre | 0.1125 |
| Platinum Sword | PlatinumSword | 2.85 |
| Saddle Cloth | Saddlecloth | 0.855 |
| Wagon | Wagon | 2.85 |
| Wool | Wool | 0.38 |
| Woolen Cloth | Cloth | 0.54 |

## Usage

### Get Item Price

```javascript
var PRICE_DB = {
    "Coin": 1,
    "Gold": 0.45,
    "IronOre": 0.225,
    // ... etc
};

function getItemPrice(codeName) {
    return PRICE_DB[codeName] || 0;
}
```

### Get Item Category

```javascript
var CATEGORY_MAP = {
    "Coin": "Advanced Resources",
    "Gold": "Advanced Resources",
    "IronOre": "Advanced Resources",
    // ... etc
};

function getItemCategory(codeName) {
    return CATEGORY_MAP[codeName] || "Unknown";
}
```

## Related Documentation

- [Item Categories](item-categories.md) - Item categorization
- [Item Prices](item-prices.md) - Market price reference
- [Item Localization](item-localization.md) - Item name localization


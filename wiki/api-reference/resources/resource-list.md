# Resource List Reference

Complete list of all resource code names used in the game.

## Resource Code Names

Resources are identified by code names (internal identifiers). These are used with `GetPlayerResource(resourceName)`.

## Building Materials

| Code Name | Description | Localization Key |
|-----------|-------------|------------------|
| `AdvancedTools` | Advanced tools | `RES.AdvancedTools` |
| `Money` | Coins | `RES.Money` |
| `StarCoins` | Tokens | `RES.StarCoins` |
| `GuildCoins` | Guild coins | `RES.GuildCoins` |
| `ExoticWoodPlank` | Exotic wood plank | `RES.ExoticWoodPlank` |
| `Granite` | Granite | `RES.Granite` |
| `Grout` | Grout | `RES.Grout` |
| `HardWoodPlank` | Hard wood plank | `RES.HardWoodPlank` |
| `MahoganyPlank` | Mahogany plank | `RES.MahoganyPlank` |
| `Marble` | Marble | `RES.Marble` |
| `Oil` | Oil | `RES.Oil` |
| `Plank` | Pinewood plank | `RES.Plank` |
| `Stone` | Stone | `RES.Stone` |
| `Tools` | Basic tools | `RES.Tools` |
| `RealWood` | Real wood | `RES.RealWood` |
| `RealPlank` | Real plank | `RES.RealPlank` |
| `RealStone` | Real stone | `RES.RealStone` |

## Food

| Code Name | Description | Localization Key |
|-----------|-------------|------------------|
| `Bread` | Bread | `RES.Bread` |
| `Brew` | Brew/Beer | `RES.Brew` |
| `Fish` | Fish | `RES.Fish` |
| `Sausage` | Sausage | `RES.Sausage` |
| `Meat` | Meat | `RES.Meat` |

## Resources (Ores & Raw Materials)

| Code Name | Description | Localization Key |
|-----------|-------------|------------------|
| `Bronze` | Bronze | `RES.Bronze` |
| `BronzeOre` | Bronze ore | `RES.BronzeOre` |
| `Carriage` | Carriage | `RES.Carriage` |
| `Coal` | Coal | `RES.Coal` |
| `ExoticWood` | Exotic wood | `RES.ExoticWood` |
| `Flour` | Flour | `RES.Flour` |
| `Gold` | Gold | `RES.Gold` |
| `GoldOre` | Gold ore | `RES.GoldOre` |
| `Gunpowder` | Gunpowder | `RES.Gunpowder` |
| `HardWood` | Hard wood | `RES.HardWood` |
| `Iron` | Iron | `RES.Iron` |
| `IronOre` | Iron ore | `RES.IronOre` |
| `MagicBean` | Magic bean | `RES.MagicBean` |
| `MagicBeanStalk` | Magic bean stalk | `RES.MagicBeanStalk` |
| `MahoganyWood` | Mahogany wood | `RES.MahoganyWood` |
| `Oilseed` | Oilseed | `RES.Oilseed` |
| `Wood` | Pinewood | `RES.Wood` |
| `Platinum` | Platinum | `RES.Platinum` |
| `PlatinumOre` | Platinum ore | `RES.PlatinumOre` |
| `SaddleCloth` | Saddle cloth | `RES.SaddleCloth` |
| `Salpeter` | Saltpeter | `RES.Salpeter` |
| `Steel` | Steel | `RES.Steel` |
| `Titanium` | Titanium | `RES.Titanium` |
| `TitaniumOre` | Titanium ore | `RES.TitaniumOre` |
| `Wagon` | Wagon | `RES.Wagon` |
| `Water` | Water | `RES.Water` |
| `Corn` | Corn/Wheat | `RES.Corn` |
| `Wheel` | Wheel | `RES.Wheel` |
| `Wool` | Wool | `RES.Wool` |
| `WoolenCloth` | Woolen cloth | `RES.WoolenCloth` |
| `Pumpkin` | Pumpkin (event) | `RES.Pumpkin` |
| `Coins` | Coins (alternative) | `RES.Coins` |

## Science

| Code Name | Description | Localization Key |
|-----------|-------------|------------------|
| `AdvancedPaper` | Advanced paper | `RES.AdvancedPaper` |
| `BookFitting` | Book fitting | `RES.BookFitting` |
| `IntermediatePaper` | Intermediate paper | `RES.IntermediatePaper` |
| `Nib` | Nib | `RES.Nib` |
| `Printingpressletter` | Printing press letter | `RES.Printingpressletter` |
| `Paper` | Simple paper | `RES.Paper` |
| `BookManuscript` | Book manuscript | `RES.BookManuscript` |
| `BookTome` | Book tome | `RES.BookTome` |
| `BookCodex` | Book codex | `RES.BookCodex` |
| `SimplePaper` | Simple paper | `RES.SimplePaper` |

## Weapons

| Code Name | Description | Localization Key |
|-----------|-------------|------------------|
| `Archebuse` | Archebuse | `RES.Archebuse` |
| `Bow_2` | Attack bow | `RES.Bow_2` |
| `Pike` | Attack pike | `RES.Pike` |
| `Saber` | Attack saber | `RES.Saber` |
| `BattleHorse` | Battle horse | `RES.BattleHorse` |
| `Bow` | Bow | `RES.Bow` |
| `BronzeSword` | Bronze sword | `RES.BronzeSword` |
| `Cannon` | Cannon | `RES.Cannon` |
| `Crossbow` | Crossbow | `RES.Crossbow` |
| `DamasceneSword` | Damascene sword | `RES.DamasceneSword` |
| `Crossbow_2` | Heavy crossbow | `RES.Crossbow_2` |
| `Lance` | Heavy lance | `RES.Lance` |
| `Mace` | Heavy mace | `RES.Mace` |
| `Horse` | Horse | `RES.Horse` |
| `IronSword` | Iron sword | `RES.IronSword` |
| `Longbow` | Longbow | `RES.Longbow` |
| `Mortar` | Mortar | `RES.Mortar` |
| `PlatinumSword` | Platinum sword | `RES.PlatinumSword` |
| `SteelSword` | Steel sword | `RES.SteelSword` |

## Usage

### Get Resource Amount

```javascript
var resourcesObj = zone.GetResourcesForPlayerID(playerID);
var coinData = resourcesObj.GetPlayerResource("Coin");
var coinAmount = coinData ? coinData.amount : 0;
```

### Get Localized Name

```javascript
var resourceName = loca.GetText("RES", "Coin");
// Returns localized name for Coin
```

## Related Documentation

- [Resource Access](resource-access.md) - Resource retrieval methods
- [Resource Categories](resource-categories.md) - Resource categorization
- [Resource Localization](resource-localization.md) - Localization keys


# Star Menu Items API

Complete reference for accessing and working with Star Menu items (buffs, boosters, resources).

## Overview

The Star Menu contains various items that players can use:
- **Add Resource**: Resources stored in Star Menu (overflow from warehouse)
- **Fill Deposit**: Deposit items for mines (Fish Deposit, Iron Deposit, etc.)
- **Buffs**: Productivity buffs, recruiting buffs, area buffs, etc.
- **Adventures**: Adventure items
- **Boosters**: Various game boosters

## Access Path

```javascript
// Primary access path
var buffVector = game.gi.mCurrentPlayer.getAvailableBuffs_vector();

// Alternative access path
var buffVector = swmmo.application.mGameInterface.mCurrentPlayer.getAvailableBuffs_vector();
```

## Core Method

### `getAvailableBuffs_vector()`

**Signature**: `getAvailableBuffs_vector(): Vector<cBuff>`

**Description**: Returns a vector containing all items in the player's Star Menu.

**Returns**: Vector of `cBuff` objects

**Usage**:
```javascript
var buffVector = game.gi.mCurrentPlayer.getAvailableBuffs_vector();
if (buffVector && buffVector.length > 0) {
    for (var i = 0; i < buffVector.length; i++) {
        var item = buffVector[i];
        // Process item
    }
}
```

## Buff Item Structure

Each item in the vector is a `cBuff` object with the following methods:

### Item Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `GetAmount()` | `int` | Quantity of this item |
| `GetBuffDefinition()` | `cBuffDefinition` | Definition object with item details |
| `GetUniqueId()` | `object` | Unique identifier `{uniqueID1, uniqueID2}` |
| `GetType()` | `string` | Item type (e.g., "FillDeposit", "AddResource") |
| `toString()` | `string` | XML representation with all properties |

### Definition Methods

The `cBuffDefinition` object (from `GetBuffDefinition()`) provides:

| Method | Returns | Description |
|--------|---------|-------------|
| `GetName_string()` | `string` | Code name (e.g., "FillDeposit", "AddResource") |
| `GetType()` | `string` | Item type |
| `GetAmount()` | `int` | Base amount (usually 1) |
| `GetLocalizedName()` | `string` | Localized display name (if available) |
| `GetDisplayName()` | `string` | Display name (if available) |

## Extracting Resource Information

### Critical Discovery: `toString()` Method

The most reliable way to get resource information from "Add Resource" and "Fill Deposit" items is through the `toString()` method, which returns XML containing the `resourceName` attribute.

**Example Output**:
```xml
<cBuff uniqueId='<dUniqueID='12400:0'/>' type='Instant' resourceName='Fish' amount='93000' randomSeed='0'' />
<cBuff uniqueId='<dUniqueID='16534:0'/>' type='Instant' resourceName='Coin' amount='51670' randomSeed='0'' />
<cBuff uniqueId='<dUniqueID='16009:0'/>' type='Instant' resourceName='BronzeOre' amount='580' randomSeed='0'' />
```

**Extraction Pattern**:
```javascript
function extractResourceFromBuff(item) {
    try {
        var itemStr = item.toString();
        var match = itemStr.match(/resourceName='([^']+)'/);
        if (match && match[1]) {
            return match[1]; // Returns: "Fish", "Coin", "BronzeOre", etc.
        }
    } catch (e) { }
    return null;
}
```

## Item Types

### Add Resource Items

Resources stored in Star Menu (warehouse overflow or collected items).

**Identification**:
```javascript
var codeName = def.GetName_string().toLowerCase();
var isAddResource = codeName.indexOf("addresource") !== -1;
```

**Example Data**:
| resourceName | Localized | Category |
|--------------|-----------|----------|
| `Coin` | Coins | Resources |
| `Fish` | Fish | Food |
| `BronzeOre` | Bronze Ore | Resources |
| `IronOre` | Iron Ore | Resources |
| `Wood` | Pinewood | Resources |

### Fill Deposit Items

Deposit items that can be added to mines.

**Identification**:
```javascript
var codeName = def.GetName_string().toLowerCase();
var isDeposit = codeName.indexOf("filldeposit") !== -1 || 
                codeName.indexOf("deposit") !== -1 ||
                codeName.indexOf("addcontent") !== -1;
```

**Display Convention**:
- Item Name: `{ResourceName} (Deposit)` - e.g., "Fish (Deposit)"
- Category: `{ResourceCategory} (Deposit)` - e.g., "Food (Deposit)"

**Special Case - Any Deposit**:
When `resourceName` is not found in `toString()`, the item is a universal "Any Deposit" that can be used on any mine type.

```javascript
if (!resourceName && isDeposit) {
    displayName = "Any Deposit";
    category = "Universal Deposit";
}
```

### Buff Items

Various buffs and boosters.

**Common Types**:
| CodeName Pattern | Category |
|------------------|----------|
| `ProductivityBuff*` | Productivity Buff |
| `RecruitingBuff*` | Recruiting Buff |
| `ProvisionerBuff*` | Provisioner Buff |
| `BookbinderBuff*` | Bookbinder Buff |
| `AreaBuff*` | Area Buff |
| `MultiplierBuff*` | Multiplier Buff |
| `Adventure*` | Adventure |

## Complete Example

```javascript
function getStarMenuItems() {
    var items = [];
    
    try {
        var buffVector = game.gi.mCurrentPlayer.getAvailableBuffs_vector();
        if (!buffVector) return items;
        
        for (var i = 0; i < buffVector.length; i++) {
            var item = buffVector[i];
            if (!item) continue;
            
            var amount = item.GetAmount ? item.GetAmount() : 0;
            if (amount <= 0) continue;
            
            var def = item.GetBuffDefinition ? item.GetBuffDefinition() : null;
            if (!def) continue;
            
            var codeName = def.GetName_string ? def.GetName_string() : "Unknown";
            var lowerName = codeName.toLowerCase();
            
            // Check item type
            var isAddResource = lowerName.indexOf("addresource") !== -1;
            var isDeposit = lowerName.indexOf("filldeposit") !== -1 || 
                           lowerName.indexOf("deposit") !== -1;
            
            var displayName = codeName;
            var category = "Other";
            
            if (isAddResource || isDeposit) {
                // Extract resource name from toString()
                var itemStr = item.toString();
                var match = itemStr.match(/resourceName='([^']+)'/);
                
                if (match && match[1]) {
                    var resourceName = match[1];
                    
                    // Get localized name
                    try {
                        var locName = loca.GetText("RES", resourceName);
                        if (locName && locName.indexOf("undefined") === -1) {
                            displayName = locName;
                        } else {
                            displayName = resourceName;
                        }
                    } catch (e) {
                        displayName = resourceName;
                    }
                    
                    // Add (Deposit) suffix for deposits
                    if (isDeposit) {
                        displayName += " (Deposit)";
                        category = "Deposit";
                    } else {
                        category = "Resource";
                    }
                } else if (isDeposit) {
                    // No resourceName = Any Deposit
                    displayName = "Any Deposit";
                    category = "Universal Deposit";
                }
            } else {
                // Try localization for other items
                displayName = getLocalizedBuffName(codeName, def, item);
                category = getBuffCategory(codeName);
            }
            
            items.push({
                codeName: codeName,
                displayName: displayName,
                category: category,
                amount: amount
            });
        }
    } catch (e) {
        console.error("Star Menu error:", e);
    }
    
    return items;
}
```

## Localization for Buff Items

Buff items may require trying multiple localization categories:

```javascript
function getLocalizedBuffName(codeName, def, item) {
    var categories = ["RES", "BUF", "BUFF", "ADV", "ITM", "ITEM", "LAB", "TXT", "GUI"];
    
    // Try definition methods first
    try {
        if (def.GetLocalizedName) {
            var name = def.GetLocalizedName();
            if (name && name.indexOf("undefined") === -1) return name;
        }
    } catch (e) { }
    
    // Try loca categories
    for (var i = 0; i < categories.length; i++) {
        try {
            var loc = loca.GetText(categories[i], codeName);
            if (loc && loc !== codeName && loc.indexOf("undefined") === -1) {
                return loc;
            }
        } catch (e) { }
    }
    
    return codeName;
}
```

## Important Notes

1. **Object.keys() returns empty**: `Object.keys(item)` and `Object.keys(def)` return empty arrays - properties are not enumerable
2. **JSON.stringify() returns {}**: Standard JSON serialization doesn't work on these objects
3. **toString() is the key**: The `toString()` method provides XML with all important data
4. **Resource names are internal**: Use `loca.GetText("RES", resourceName)` to get display names

## Related Documentation

- [Game Interface](../game-interface/game-gi.md) - `mCurrentPlayer` access
- [Localization](../ui-helpers/localization.md) - Localization categories
- [Resource List](../resources/resource-list.md) - Resource code names
- [Item Categories](item-categories.md) - Item categorization

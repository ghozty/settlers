# Item Prices Reference

Complete reference of market prices for tradable items.

## Market Price Database

Market prices are used for calculating trade offers. Prices are relative to Coin (Coin = 1.0).

### From CURSOR_QuickTrader.js

```javascript
var PRICE_DB = {
    // Advanced Resources
    "Coin": 1,
    "Gold": 0.45,
    "GoldOre": 0.475,
    "RealWood": 0.018,
    "RealPlank": 0.0225,
    "Horse": 0.0225,
    "IntermediatePaper": 0.135,
    "Iron": 0.405,
    "IronOre": 0.225,
    "IronSword": 0.27,
    "Longbow": 0.18,
    "Marble": 0.054,
    "Meat": 0.045,
    "Letter": 0.27,
    "Sausage": 0.038,
    "Steel": 0.54,
    "SteelSword": 0.54,
    
    // Basic Resources
    "Fish": 0.0018,
    "GuildCoins": 4.5,
    "MapPart": 0.441,
    "Wood": 0.009,
    "Plank": 0.009,
    "Stone": 0.018,
    
    // Military
    "AdvancedPaper": 0.675,
    "AdvancedTools": 3.5,
    "BookFitting": 3.325,
    "Cannon": 6.65,
    "Carriage": 2.25,
    "Crossbow": 3.325,
    "TitaniumSword": 3.15,
    "ExoticWood": 0.095,
    "ExoticPlank": 0.099,
    "Granite": 0.38,
    "Grout": 18,
    "Gunpowder": 5.4,
    "MagicBean": 2.88,
    "MagicBeanstalk": 5.39,
    "Salpeter": 2.7,
    "Titanium": 1.8,
    "TitaniumOre": 2.25,
    "Wheel": 1.8,
    
    // Processed Resources
    "Bow": 0.038,
    "Bread": 0.0081,
    "Beer": 0.018,
    "Bronze": 0.038,
    "BronzeSword": 0.036,
    "Coal": 0.0114,
    "BronzeOre": 0.045,
    "Flour": 0.0072,
    "Nib": 0.198,
    "SimplePaper": 0.0405,
    "Tool": 0.036,
    "Water": 0.0018,
    "Corn": 0.0114,
    
    // Special
    "Archebuse": 6.65,
    "BattleHorse": 0.9,
    "MahoganyPlank": 0.315,
    "MahoganyWood": 0.475,
    "Mortar": 11.4,
    "Platinum": 0.475,
    "PlatinumOre": 0.1125,
    "PlatinumSword": 2.85,
    "Saddlecloth": 0.855,
    "Wagon": 2.85,
    "Wool": 0.38,
    "Cloth": 0.54
};
```

## Price Calculation

### Get Item Price

```javascript
function getItemPrice(codeName) {
    return PRICE_DB[codeName] || 0;
}
```

### Calculate Trade Amounts

```javascript
function calculateTradeAmounts(itemCodeName, coinAmount, mode) {
    var itemPrice = PRICE_DB[itemCodeName] || 0;
    if (itemPrice === 0) return null;
    
    if (mode === 'buy') {
        // BUY: Offer Coins, Want Items
        var itemAmount = Math.floor(coinAmount / itemPrice);
        return {
            offerCoins: coinAmount,
            wantItems: itemAmount
        };
    } else {
        // SELL: Offer Items, Want Coins
        var coinAmount = Math.floor(itemAmount * itemPrice);
        return {
            offerItems: itemAmount,
            wantCoins: coinAmount
        };
    }
}
```

## Related Documentation

- [Tradable Items](tradable-items.md) - Complete tradable items list
- [Item Categories](item-categories.md) - Item categorization
- [Item Localization](item-localization.md) - Item name localization


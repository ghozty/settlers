# Example: Quick Trader

Complete example from `CURSOR_QuickTrader.js` for automated trading.

## Overview

This example demonstrates:
- Creating trade offers
- Calculating prices
- Managing market slots
- BUY/SELL modes

## Key Functions

### Creating Trade Offer

```javascript
function createTradeOffer(offerResource, offerAmount, costResource, costAmount, slots) {
    try {
        var offerRes = new (game.def("Communication.VO::dResourceVO"));
        offerRes.amount = offerRes.producedAmount = offerAmount;
        offerRes.name_string = offerResource;
        
        var costRes = new (game.def("Communication.VO::dResourceVO"));
        costRes.amount = costRes.producedAmount = costAmount;
        costRes.name_string = costResource;
        
        var tradeOffer = new (game.def("Communication.VO::dTradeOfferVO"));
        tradeOffer.offerRes = offerRes;
        tradeOffer.costsRes = costRes;
        tradeOffer.receipientId = 0;
        tradeOffer.lots = slots || 4;
        
        var freeSlotPos = game.gi.mHomePlayer.mTradeData.getNextFreeSlotForType(0);
        if (freeSlotPos === 0) {
            tradeOffer.slotType = 0;
            tradeOffer.slotPos = freeSlotPos;
        } else {
            tradeOffer.slotType = 2;
            tradeOffer.slotPos = game.gi.mHomePlayer.mTradeData.getNextFreeSlotForType(2);
        }
        
        game.gi.mClientMessages.SendMessagetoServer(1049, game.gi.mCurrentViewedZoneID, tradeOffer);
        return true;
    } catch (e) {
        game.showAlert("Trade error: " + e.message);
        return false;
    }
}
```

## Related Documentation

- [Client Messages](../../api-reference/game-interface/client-messages.md) - SendMessagetoServer
- [VO Definitions](../../api-reference/actions-messages/vo-definitions.md) - Value Objects


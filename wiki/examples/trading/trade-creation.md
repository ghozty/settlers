# Example: Trade Creation Patterns

Complete patterns for creating trade offers on the market.

## Overview

This example demonstrates various patterns for:
- Creating trade offers
- Setting up resource VOs
- Managing market slots
- Handling trade errors

## Key Patterns

### Basic Trade Creation

```javascript
function createTradeOffer(offerResource, offerAmount, costResource, costAmount) {
    try {
        // Create offer resource VO
        var offerRes = new (game.def("Communication.VO::dResourceVO"));
        offerRes.amount = offerRes.producedAmount = offerAmount;
        offerRes.name_string = offerResource;
        
        // Create cost resource VO
        var costRes = new (game.def("Communication.VO::dResourceVO"));
        costRes.amount = costRes.producedAmount = costAmount;
        costRes.name_string = costResource;
        
        // Create trade offer VO
        var tradeOffer = new (game.def("Communication.VO::dTradeOfferVO"));
        tradeOffer.offerRes = offerRes;
        tradeOffer.costsRes = costRes;
        tradeOffer.receipientId = 0; // Market
        tradeOffer.lots = 4;
        
        // Get available slot
        var freeSlotPos = game.gi.mHomePlayer.mTradeData.getNextFreeSlotForType(0);
        if (freeSlotPos === 0) {
            tradeOffer.slotType = 0;
            tradeOffer.slotPos = freeSlotPos;
        } else {
            tradeOffer.slotType = 2;
            tradeOffer.slotPos = game.gi.mHomePlayer.mTradeData.getNextFreeSlotForType(2);
        }
        
        // Send trade offer
        game.gi.mClientMessages.SendMessagetoServer(1049, game.gi.mCurrentViewedZoneID, tradeOffer);
        return true;
    } catch (e) {
        game.showAlert("Trade error: " + e.message);
        return false;
    }
}
```

### Slot Management

```javascript
function getAvailableSlot(slotType) {
    try {
        var slotPos = game.gi.mHomePlayer.mTradeData.getNextFreeSlotForType(slotType);
        return slotPos;
    } catch (e) {
        return 0;
    }
}
```

## Related Documentation

- [Client Messages](../../api-reference/game-interface/client-messages.md) - SendMessagetoServer
- [VO Definitions](../../api-reference/actions-messages/vo-definitions.md) - Value Objects
- [Market Slot Management](./market-slot-management.md) - Slot management


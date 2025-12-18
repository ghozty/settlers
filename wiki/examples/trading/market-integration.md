# Example: Market Integration Patterns

Complete patterns for integrating with the game market system.

## Overview

This example demonstrates various patterns for:
- Accessing market data
- Managing trade slots
- Checking slot availability
- Handling market operations

## Key Patterns

### Market Slot Access

```javascript
function getMarketSlots() {
    try {
        var tradeData = game.gi.mHomePlayer.mTradeData;
        
        // Get free slots
        var freeSlotPos = tradeData.getNextFreeSlotForType(0);
        var paidSlotPos = tradeData.getNextFreeSlotForType(2);
        
        return {
            free: freeSlotPos,
            paid: paidSlotPos
        };
    } catch (e) {
        return { free: 0, paid: 0 };
    }
}
```

### Slot Availability Check

```javascript
function hasAvailableSlot(slotType) {
    try {
        var slotPos = game.gi.mHomePlayer.mTradeData.getNextFreeSlotForType(slotType);
        return slotPos !== 0;
    } catch (e) {
        return false;
    }
}
```

## Related Documentation

- [Client Messages](../../api-reference/game-interface/client-messages.md) - SendMessagetoServer
- [Trade Creation](./trade-creation.md) - Trade offer patterns
- [Market Slot Management](./market-slot-management.md) - Slot management


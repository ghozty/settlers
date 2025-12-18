# Performance Optimization

Best practices for optimizing script performance.

## Efficient Iteration

### Pattern: Early Returns

```javascript
buildings.forEach(function(building) {
    try {
        if (building.getPlayerID() === -1) return; // Early return
        if (building.GetBaseType() !== 1) return; // Early return
        
        // Process building
    } catch (e) { }
});
```

## Caching

### Pattern: Cache Zone Objects

```javascript
var cachedZone = null;
var cachedZoneID = null;

function getZone() {
    var currentZoneID = game.gi.mCurrentViewedZoneID;
    if (cachedZone === null || cachedZoneID !== currentZoneID) {
        cachedZone = game.gi.mCurrentPlayerZone;
        cachedZoneID = currentZoneID;
    }
    return cachedZone;
}
```

## Batch Operations

### Pattern: Batch Server Actions

```javascript
// Instead of sending actions immediately:
actions.forEach(function(action) {
    game.gi.SendServerAction(50, action.buildingID, action.grid, 0, null);
});

// Use delays:
var queue = new TimedQueue(1000);
actions.forEach(function(action) {
    queue.add(function() {
        game.gi.SendServerAction(50, action.buildingID, action.grid, 0, null);
    });
});
queue.run();
```

## Related Documentation

- [Async Operations](async-operations.md) - Async operation patterns
- [Error Handling](error-handling.md) - Error handling patterns


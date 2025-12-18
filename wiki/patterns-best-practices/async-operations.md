# Async Operations Patterns

Best practices for handling asynchronous operations in TSO client userscripts.

## Sequential Actions with Delays

### Pattern: Using setTimeout

```javascript
function sendActionsWithDelay(actions, index) {
    if (index >= actions.length) return;
    
    var action = actions[index];
    game.gi.SendServerAction(50, action.buildingID, action.grid, 0, null);
    
    setTimeout(function() {
        sendActionsWithDelay(actions, index + 1);
    }, 1000); // 1 second delay
}
```

### Pattern: Using TimedQueue

```javascript
var queue = new TimedQueue(1000); // 1 second delay

actions.forEach(function(action) {
    queue.add(function() {
        game.gi.SendServerAction(50, action.buildingID, action.grid, 0, null);
    });
});

queue.run();
```

## Error Handling in Async Operations

### Pattern: Error Handling with Retry

```javascript
function sendActionWithRetry(action, retries) {
    retries = retries || 3;
    
    try {
        game.gi.SendServerAction(action.actionID, action.buildingID, action.grid, 0, null);
    } catch (e) {
        if (retries > 0) {
            setTimeout(function() {
                sendActionWithRetry(action, retries - 1);
            }, 1000);
        } else {
            game.showAlert("Action failed: " + e.message);
        }
    }
}
```

## Related Documentation

- [Server Communication](../api-reference/actions-messages/server-communication.md) - Communication patterns
- [Error Handling](error-handling.md) - Error handling patterns
- [Performance](performance.md) - Performance optimization


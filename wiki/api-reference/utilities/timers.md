# Timers API

Complete reference for timing operations and delays.

## JavaScript Timers

### `setTimeout()`

```javascript
setTimeout(function, delay)
```

**Parameters**:
- `function`: Function to execute
- `delay`: Delay in milliseconds

**Usage**:
```javascript
setTimeout(function() {
    // Code to execute after delay
}, 1000); // 1 second delay
```

### `setInterval()`

```javascript
setInterval(function, interval)
```

**Parameters**:
- `function`: Function to execute repeatedly
- `interval`: Interval in milliseconds

**Usage**:
```javascript
var intervalId = setInterval(function() {
    // Code to execute repeatedly
}, 5000); // Every 5 seconds

// Clear interval
clearInterval(intervalId);
```

## TimedQueue Pattern

### Using TimedQueue for Sequential Actions

```javascript
var queue = new TimedQueue(delay);

queue.add(function() {
    // Action 1
});

queue.add(function() {
    // Action 2
});

queue.run();
```

**Example from server-communication.md**:
```javascript
var queue = new TimedQueue(1000); // 1 second delay

actions.forEach(function(action) {
    queue.add(function() {
        game.gi.SendServerAction(50, action.buildingID, action.grid, 0, null);
    });
});

queue.run();
```

## Sequential Actions Pattern

### Using setTimeout for Sequential Actions

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

## Related Documentation

- [Server Communication](../actions-messages/server-communication.md) - Communication patterns
- [Error Handling](../../patterns-best-practices/error-handling.md) - Error handling patterns


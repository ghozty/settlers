# Common Errors and Solutions

This guide covers common errors encountered when developing TSO client scripts and their solutions.

## Error #1034: Type Coercion Failed

**Cause**: Wrong parameter type passed to a method.

**Solution**: Verify parameter types match the expected types.

**Example**:
```javascript
// Wrong
game.gi.SendServerAction("50", buildingID, grid, 0, null); // actionID should be int, not string

// Correct
game.gi.SendServerAction(50, buildingID, grid, 0, null);
```

## Error #1037: Cannot Assign to Method

**Cause**: Trying to hook, override, or intercept a sealed/final method.

**Solution**: Use direct method calls only. Do not try to override sealed methods.

**Common Sealed Methods**:
- `game.gi.SendServerAction`
- `game.gi.mClientMessages.SendMessagetoServer`

**Example**:
```javascript
// Wrong - trying to hook
game.gi.SendServerAction = function() { /* ... */ };

// Correct - direct call
game.gi.SendServerAction(50, buildingID, grid, 0, null);
```

## Error #1063: Argument Count Mismatch

**Cause**: Wrong number of parameters passed to a method.

**Solution**: Verify method signature and provide all required parameters.

**Example**:
```javascript
// Wrong
game.gi.SendServerAction(50, buildingID); // Missing parameters

// Correct
game.gi.SendServerAction(50, buildingID, grid, 0, null);
```

## Cannot read property 'mCurrentPlayerZone'

**Cause**: Zone not loaded or game interface not available.

**Solution**: Check if zone exists before accessing.

**Example**:
```javascript
// Wrong
var zone = game.gi.mCurrentPlayerZone;
var buildings = zone.mStreetDataMap.mBuildingContainer; // May fail if zone is null

// Correct
if (!game.gi || !game.gi.mCurrentPlayerZone) {
    game.showAlert("Zone not available");
    return;
}
var zone = game.gi.mCurrentPlayerZone;
```

## Cannot read property 'GetSpecialists_vector'

**Cause**: Zone object is invalid or not fully loaded.

**Solution**: Validate zone object and use try-catch.

**Example**:
```javascript
try {
    if (!game.gi || !game.gi.mCurrentPlayerZone) {
        throw new Error("Zone not available");
    }
    var zone = game.gi.mCurrentPlayerZone;
    var specialists = zone.GetSpecialists_vector();
} catch (e) {
    game.showAlert("Error: " + e.message);
}
```

## Building methods not available

**Cause**: Building object is invalid or null.

**Solution**: Check if building exists and use try-catch when iterating.

**Example**:
```javascript
buildings.forEach(function(building) {
    try {
        var name = building.GetBuildingName_string();
        // Process building
    } catch (e) {
        // Skip problematic building
    }
});
```

## Production not collecting

**Cause**: Using unreliable `waitForPickup` property or incorrect collection method.

**Solution**: Use production queue methods to check completion.

**Example**:
```javascript
// Wrong - unreliable
if (building.waitForPickup) {
    collectProduction();
}

// Correct
var queue = zone.GetProductionQueue(2);
if (queue) {
    var item = queue.mTimedProductions_vector[0];
    if (item.GetProducedItems() >= item.GetAmount()) {
        queue.finishProduction(null, null);
    }
}
```

## Task not sending

**Cause**: Invalid task parameters or specialist not idle.

**Solution**: Validate task parameters and check specialist state.

**Example**:
```javascript
// Check if specialist is idle
var task = specialist.GetTask();
if (task !== null) {
    game.showAlert("Specialist is already on a task");
    return;
}

// Validate task parameters
if (taskType < 0 || subTaskID < 0) {
    game.showAlert("Invalid task parameters");
    return;
}
```

## Related Documentation

- [Error Handling](../../patterns-best-practices/error-handling.md) - Error handling patterns
- [Debugging](debugging.md) - Debugging techniques


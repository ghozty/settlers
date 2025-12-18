# Known Issues and Limitations

Known limitations and workarounds for TSO client scripting.

## Sealed Methods Cannot Be Hooked

**Issue**: Methods like `SendServerAction` and `SendMessagetoServer` are sealed and cannot be intercepted.

**Workaround**: Use direct method calls only. Do not attempt to hook these methods.

## waitForPickup Property is Unreliable

**Issue**: The `building.waitForPickup` property can be `true` even during production.

**Workaround**: Use production queue methods to check completion:

```javascript
// Correct method
var queue = zone.GetProductionQueue(2);
var item = queue.mTimedProductions_vector[0];
var isComplete = item.GetProducedItems() >= item.GetAmount();
```

## Zone May Not Be Available Immediately

**Issue**: Zone object may not be available immediately after script load.

**Workaround**: Always check if zone exists before accessing:

```javascript
if (!game.gi || !game.gi.mCurrentPlayerZone) {
    game.showAlert("Zone not available");
    return;
}
```

## Some Buildings May Be Invalid

**Issue**: When iterating buildings, some building objects may be invalid.

**Workaround**: Use try-catch when iterating:

```javascript
buildings.forEach(function(building) {
    try {
        // Process building
    } catch (e) {
        // Skip problematic building
    }
});
```

## Related Documentation

- [Common Errors](common-errors.md) - Error codes and solutions
- [Debugging](debugging.md) - Debugging techniques


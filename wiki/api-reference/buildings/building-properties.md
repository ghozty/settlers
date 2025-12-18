# Building Properties API

Complete reference of all properties available on `cBuilding` objects.

## State Properties

### `waitForPickup`

**Type**: `Boolean`  
**Description**: **NOT RELIABLE!** Indicates if production is waiting for pickup.

**Warning**: This property can be `true` even during production. Do not rely on it for detecting complete production.

**Incorrect Usage**:
```javascript
// DON'T DO THIS
if (building.waitForPickup) {
    // This may be true even during production!
    collectProduction();
}
```

**Correct Method**: Use production queue methods instead:
```javascript
// CORRECT: Check production queue
var queue = zone.GetProductionQueue(2);
if (queue) {
    var item = queue.mTimedProductions_vector[0];
    var isComplete = item.GetProducedItems() >= item.GetAmount();
    if (isComplete) {
        queue.finishProduction(null, null);
    }
}
```

### `showWaitForPickupIcon`

**Type**: `Boolean`  
**Description**: Whether the pickup icon is shown in the UI.

**Usage**:
```javascript
if (building.showWaitForPickupIcon) {
    // UI shows pickup icon (but still not reliable!)
}
```

**Note**: This is also unreliable - use production queue methods instead.

## Production Properties

### `productionType`

**Type**: `int`  
**Description**: Production queue type for this building.

**Values**:
- `0`: Default production
- `1`: Reserved/Unused
- `2`: Science production (Bookbinder, AdventureBookbinder)
- `3+`: Other production types (Culture buildings, etc.)

**Usage**:
```javascript
var queueType = building.productionType;
var queue = zone.GetProductionQueue(queueType);
```

**Example from CURSOR_AutoFarms.js**:
```javascript
// Bookbinder uses productionType 2
var queue = zone.GetProductionQueue(2);
```

### `productionQueue`

**Type**: `cTimedProductionQueue`  
**Description**: Direct reference to the building's production queue.

**Usage**:
```javascript
var queue = building.productionQueue;
if (queue) {
    var productions = queue.mTimedProductions_vector;
    if (productions && productions.length > 0) {
        var item = productions[0];
        // Check production status
    }
}
```

**Note**: May be `null` if building doesn't have a production queue.

**Alternative Access**:
```javascript
// More reliable: Get queue by type
var queueType = building.productionType;
var queue = zone.GetProductionQueue(queueType);
```

### `productionBuff`

**Type**: `BuffAppliance`  
**Description**: Active buff on the building (if any).

**Usage**:
```javascript
if (building.productionBuff) {
    // Building has an active buff
    // Buff may affect production speed, output, etc.
}
```

**Note**: May be `null` if no buff is active.

## Internal Properties

These properties are used internally by the game and may not be directly accessible or reliable:

- Building state flags
- Construction timers
- Resource input/output tracking
- Upgrade state

## Important Notes

### Do Not Rely On `waitForPickup`

The `waitForPickup` property is **unreliable** and should not be used to detect complete production. Always use production queue methods:

```javascript
// CORRECT: Use production queue
var queue = zone.GetProductionQueue(building.productionType);
if (queue) {
    var item = queue.mTimedProductions_vector[0];
    var isComplete = item.GetProducedItems() >= item.GetAmount();
}
```

### Production Queue Access

Always check if `productionQueue` exists before accessing:

```javascript
if (building.productionQueue) {
    // Safe to access
} else {
    // Building doesn't have a production queue
    // OR use zone.GetProductionQueue() instead
}
```

## Related Documentation

- [Building Methods](building-methods.md) - cBuilding class methods
- [Production Queues](../zone/production-queues.md) - Production queue API
- [Zone Overview](../zone/zone-overview.md) - Zone object structure


# Common Functions API

Complete reference for common utility functions.

## Helper Functions

### Format Duration

```javascript
loca.FormatDuration(time, format)
```

**Parameters**:
- `time`: Time in milliseconds
- `format`: Format type (1 = duration format)

**Usage**:
```javascript
var duration = loca.FormatDuration(calculatedTime, 1);
```

### Create Table Row

```javascript
createTableRow(data, isHeader)
```

**Parameters**:
- `data`: Array of column data
- `isHeader`: Whether this is a header row

**Usage**:
```javascript
var row = createTableRow([
    [5, "Column 1"],
    [4, "Column 2"],
    [3, "Column 3"]
], false);
```

### Create Switch

```javascript
createSwitch(checkboxId, isChecked)
```

**Parameters**:
- `checkboxId`: ID for the checkbox
- `isChecked`: Initial checked state

**Returns**: HTML string for switch element

**Usage**:
```javascript
var switchHtml = createSwitch("mySwitch", true);
```

## Related Documentation

- [Definitions](definitions.md) - Game definitions
- [Timers](timers.md) - Timing operations
- [Settings](settings.md) - Settings management


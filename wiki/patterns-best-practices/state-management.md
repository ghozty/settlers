# State Management Patterns

Best practices for managing script state and configuration.

## Configuration Objects

### Pattern: Simple Configuration

```javascript
var CONFIG = {
    enabled: true,
    delay: 1000,
    maxItems: 100
};
```

### Pattern: Configuration with Defaults

```javascript
var DEFAULT_CONFIG = {
    enabled: true,
    delay: 1000,
    maxItems: 100
};

var CONFIG = Object.assign({}, DEFAULT_CONFIG);
```

## State Variables

### Pattern: Initialization Flags

```javascript
var _modalInitialized = false;

function openModal() {
    if (!_modalInitialized) {
        createModalWindow('myModal', 'My Modal');
        _modalInitialized = true;
    }
    
    // Update content
    $('#myModalData').html(generateContent());
    $('#myModal:not(:visible)').modal({ backdrop: "static" });
}
```

## Related Documentation

- [Settings](../api-reference/utilities/settings.md) - Settings management
- [Code Organization](code-organization.md) - Code structure patterns


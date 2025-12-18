# Settings API

Complete reference for managing script settings and configuration.

## Configuration Patterns

### Simple Configuration Object

```javascript
var CONFIG = {
    setting1: true,
    setting2: 100,
    setting3: "value"
};
```

### Configuration with Defaults

```javascript
var DEFAULT_CONFIG = {
    enabled: true,
    delay: 1000,
    maxItems: 100
};

var CONFIG = DEFAULT_CONFIG;
```

## Settings Storage

### Using Local Storage

```javascript
// Save settings
localStorage.setItem('myScript_settings', JSON.stringify(CONFIG));

// Load settings
var saved = localStorage.getItem('myScript_settings');
if (saved) {
    CONFIG = JSON.parse(saved);
}
```

## Related Documentation

- [Common Functions](common-functions.md) - Utility functions
- [Error Handling](../../patterns-best-practices/error-handling.md) - Error handling patterns


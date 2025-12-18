# Modal Windows API

Complete reference for creating and managing modal windows in TSO client userscripts.

## Basic Modal Creation

### Using `createModalWindow()`

```javascript
createModalWindow(modalId, title, drop)
```

**Parameters**:
- `modalId` (string): Unique ID for the modal
- `title` (string): Modal title text
- `drop` (boolean, optional): Whether to remove modal on hide (default: false)

**Usage**:
```javascript
createModalWindow('myModal', 'Modal Title');
```

**Example from Specialist_Tasks.js**:
```javascript
createModalWindow('specialistViewerModal', 'Specialists Tasks');
```

### Using Modal Class

```javascript
var modal = new Modal(modalId, title, removeOnHide);
modal.create();
modal.Body().html('<p>Content</p>');
modal.show();
```

**Example from AG_ExplorerManager.js**:
```javascript
var modal = new Modal("AG_ExplorerSettings", "🔧 Explorer Manager Settings", false);
modal.create();
```

## Modal Methods

### Creating Modal

```javascript
var modal = new Modal("myModal", "Title", false);
modal.create();
```

### Showing Modal

```javascript
// Method 1: Using Modal class
modal.show();

// Method 2: Using jQuery
$('#myModal:not(:visible)').modal({ backdrop: "static" });
```

### Hiding Modal

```javascript
// Method 1: Using Modal class
modal.hide();

// Method 2: Using jQuery
$('#myModal').modal('hide');
```

### Accessing Modal Elements

```javascript
// Title
modal.Title().html('New Title');

// Body
modal.Body().html('<p>Content</p>');

// Footer
modal.withFooter('button').click(function() { /* ... */ });
```

## Styling Modals

### Basic Styling

```javascript
$('#myModal .modal-dialog').css({
    'width': '850px',
    'max-width': '95%'
});

$('#myModal .modal-body').css({
    'max-height': '500px',
    'overflow-y': 'auto',
    'background': '#f5f5f5',
    'padding': '15px'
});
```

**Example from CURSOR_QuickTrader.js**:
```javascript
$('#QuickTraderModal .modal-dialog').css({
    'width': '850px',
    'max-width': '95%'
});

$('#QuickTraderModal .modal-content').css({
    'background': '#8B7355',
    'border': '2px solid #5a4535',
    'border-radius': '8px'
});
```

## Common Patterns

### Pattern: Open Modal with Content

```javascript
function openMyModal() {
    // Close other modals
    $("div[role='dialog']:not(#myModal):visible").modal("hide");
    
    // Remove existing if any
    $('#myModal').remove();
    
    // Create new modal
    createModalWindow('myModal', 'My Modal');
    
    // Style
    $('#myModal .modal-dialog').css({
        'width': '600px',
        'max-width': '95%'
    });
    
    // Add content
    $('#myModalData').html('<p>Content here</p>');
    
    // Show
    $('#myModal:not(:visible)').modal({ backdrop: "static" });
}
```

### Pattern: Modal with Initialization Flag

```javascript
var _modalInitialized = false;

function openModal() {
    if (!_modalInitialized) {
        $('#myModal').remove();
        createModalWindow('myModal', 'My Modal');
        _modalInitialized = true;
    }
    
    // Update content
    $('#myModalData').html(generateContent());
    
    // Show
    $('#myModal:not(:visible)').modal({ backdrop: "static" });
}
```

## Related Documentation

- [Menu Integration](menu-integration.md) - Adding menu items
- [Chat Logging](chat-logging.md) - Logging to chat
- [Localization](localization.md) - Localizing text


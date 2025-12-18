# Example: Modal Creation Patterns

Complete patterns for creating and managing modal windows.

## Overview

This example demonstrates various patterns for:
- Creating modal windows
- Styling modals
- Managing modal lifecycle
- Handling modal events

## Key Patterns

### Basic Modal Creation

```javascript
function createMyModal() {
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

### Modal with Initialization Flag

```javascript
var _modalInitialized = false;

function openModal() {
    if (!_modalInitialized) {
        $('#myModal').remove();
        createModalWindow('myModal', 'My Modal');
        $('#myModal .modal-dialog').css({
            'width': '850px',
            'max-width': '95%'
        });
        _modalInitialized = true;
    }
    
    // Update content
    $('#myModalData').html(generateContent());
    
    // Show
    $('#myModal:not(:visible)').modal({ backdrop: "static" });
}
```

### Using Modal Class

```javascript
var modal = new Modal("myModal", "Modal Title", false);
modal.create();
modal.Body().html('<p>Content</p>');
modal.show();
```

## Related Documentation

- [Modal Windows](../../api-reference/ui-helpers/modal-windows.md) - Modal API


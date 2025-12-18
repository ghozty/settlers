# Example: Modal Windows

Example of creating and managing modal windows.

## Overview

This example demonstrates:
- Creating modal windows
- Styling modals
- Managing modal content
- Event handling

## Key Functions

### Creating Modal

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

## Related Documentation

- [Modal Windows](../../api-reference/ui-helpers/modal-windows.md) - Modal API


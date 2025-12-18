# Example: Form Handling Patterns

Complete patterns for handling forms and inputs in modal windows.

## Overview

This example demonstrates various patterns for:
- Creating form inputs
- Handling form submissions
- Validating inputs
- Managing form state

## Key Patterns

### Basic Form Creation

```javascript
function createForm() {
    var html = '<form id="myForm">';
    html += '<div class="form-group">';
    html += '<label>Name:</label>';
    html += '<input type="text" id="nameInput" class="form-control">';
    html += '</div>';
    html += '<div class="form-group">';
    html += '<label>Amount:</label>';
    html += '<input type="number" id="amountInput" class="form-control">';
    html += '</div>';
    html += '<button type="button" class="btn btn-primary" id="submitBtn">Submit</button>';
    html += '</form>';
    
    return html;
}
```

### Form Submission Handler

```javascript
function setupFormHandlers() {
    $('#submitBtn').off('click').on('click', function() {
        var name = $('#nameInput').val();
        var amount = parseInt($('#amountInput').val());
        
        if (!name || name.trim() === '') {
            game.showAlert("Name is required");
            return;
        }
        
        if (isNaN(amount) || amount <= 0) {
            game.showAlert("Amount must be a positive number");
            return;
        }
        
        // Process form
        processForm(name, amount);
    });
}
```

### Dropdown Creation

```javascript
function createDropdown(id, options, selectedValue) {
    var html = '<select id="' + id + '" class="form-control">';
    html += '<option value="0">Cancel</option>';
    
    options.forEach(function(option) {
        var selected = (option.value === selectedValue) ? ' selected' : '';
        html += '<option value="' + option.value + '"' + selected + '>' + option.text + '</option>';
    });
    
    html += '</select>';
    return html;
}
```

## Related Documentation

- [Modal Windows](../../api-reference/ui-helpers/modal-windows.md) - Modal API
- [Menu Integration](../../api-reference/ui-helpers/menu-integration.md) - Menu API


# Example: Table Rendering Patterns

Complete patterns for rendering tables in modal windows.

## Overview

This example demonstrates various patterns for:
- Creating table structures
- Rendering table rows
- Sorting tables
- Styling tables

## Key Patterns

### Basic Table Rendering

```javascript
function renderTable(data) {
    var html = '<div class="container-fluid">';
    
    if (data.length === 0) {
        html += '<div class="row"><div class="col-xs-12">No data available.</div></div>';
    } else {
        data.forEach(function (item) {
            html += createTableRow([
                [5, item.name],
                [4, item.category],
                [3, item.amount.toLocaleString()]
            ]);
        });
    }
    
    html += '</div>';
    return html;
}
```

### Table with Headers

```javascript
function renderTableWithHeaders(data, headers) {
    var html = '<div class="container-fluid">';
    
    // Header row
    html += createTableRow(headers, true);
    
    // Data rows
    data.forEach(function (item) {
        html += createTableRow([
            [5, item.name],
            [4, item.category],
            [3, item.amount.toLocaleString()]
        ]);
    });
    
    html += '</div>';
    return html;
}
```

### Sortable Table

```javascript
function createSortLink(text, key) {
    var icon = "";
    if (_sortConfig.key === key) {
        icon = (_sortConfig.dir === 1) ? " (^)" : " (v)";
    }
    return '<a href="#" class="sortCol" data-key="' + key + '" style="color: white; text-decoration: underline;">' + text + icon + '</a>';
}
```

## Related Documentation

- [Modal Windows](../../api-reference/ui-helpers/modal-windows.md) - Modal API
- [Common Functions](../../api-reference/utilities/common-functions.md) - Utility functions


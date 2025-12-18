# Debugging Techniques

Techniques for debugging TSO client scripts.

## Console Logging

```javascript
console.log("Debug message");
console.error("Error message");
console.warn("Warning message");
```

## Alert Messages

```javascript
game.showAlert("Debug: " + message);
```

## Chat Logging

```javascript
function logToChat(message) {
    try {
        globalFlash.gui.mChatPanel.PutMessageToChannelWithoutServer(
            "news",
            new window.runtime.Date(),
            "ScriptName",
            message,
            false,
            false
        );
    } catch (e) {
        // Silent fail
    }
}
```

## Debug Modal

```javascript
function showDebugModal(title, content) {
    if ($('#debugModal').length === 0) {
        createModalWindow('debugModal', title);
        $('#debugModal .modal-dialog').css({
            'width': '800px',
            'max-width': '95%'
        });
    }
    
    var html = '<div style="padding: 20px;">';
    html += '<textarea readonly style="width: 100%; height: 400px; font-family: monospace;">';
    html += content;
    html += '</textarea>';
    html += '<button onclick="navigator.clipboard.writeText(\'' + 
            content.replace(/'/g, "\\'") + '\')">Copy All</button>';
    html += '</div>';
    
    $('#debugModalData').html(html);
    $('#debugModal:not(:visible)').modal({ backdrop: "static" });
}
```

## Object Inspection

```javascript
function inspectObject(obj, name) {
    var output = [];
    output.push("=== " + name + " ===");
    
    for (var key in obj) {
        try {
            var value = obj[key];
            var type = typeof value;
            output.push(key + ": " + type + " = " + 
                       (type === 'function' ? '[Function]' : value));
        } catch (e) {
            output.push(key + ": [Error accessing]");
        }
    }
    
    return output.join("\n");
}
```

## Related Documentation

- [Common Errors](common-errors.md) - Error codes and solutions
- [Known Issues](known-issues.md) - Known limitations


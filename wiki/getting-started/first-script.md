# Creating Your First Script

This tutorial will guide you through creating a simple script that displays information about your specialists.

## Tutorial: Specialist Counter

We'll create a script that:
1. Counts idle and working explorers
2. Displays the counts in a modal window
3. Shows how to access specialist data

## Step 1: Create the Script File

Create a new file: `MyFirstScript.js` in the `userscripts/` directory.

## Step 2: Basic Structure

```javascript
// TSO Client User Script - Specialist Counter
// Displays count of idle and working explorers

var SCRIPT_NAME = "Specialist Counter";

// Add menu item
addToolsMenuItem(SCRIPT_NAME, ShowSpecialistCount);

// Main function
function ShowSpecialistCount() {
    // Check if on home zone
    if (!game.gi.isOnHomzone()) {
        game.showAlert("Please go to your home zone first.");
        return;
    }
    
    // Get specialist data
    var data = CollectSpecialistData();
    
    // Display results
    ShowResults(data);
}
```

## Step 3: Collect Data

```javascript
function CollectSpecialistData() {
    var data = {
        idleExplorers: 0,
        workingExplorers: 0,
        idleGeologists: 0,
        workingGeologists: 0
    };
    
    try {
        // Get current zone
        var zone = game.gi.mCurrentPlayerZone;
        
        // Get all specialists
        var specialists = zone.GetSpecialists_vector();
        
        // Iterate through specialists
        specialists.forEach(function(specialist) {
            try {
                // Check if specialist belongs to player
                if (specialist.getPlayerID() === -1) return;
                
                // Get specialist type
                var baseType = specialist.GetBaseType();
                
                // Check if idle or working
                var task = specialist.GetTask();
                var isIdle = (task === null);
                
                // Count by type
                if (baseType === 1) { // Explorer
                    if (isIdle) {
                        data.idleExplorers++;
                    } else {
                        data.workingExplorers++;
                    }
                } else if (baseType === 2) { // Geologist
                    if (isIdle) {
                        data.idleGeologists++;
                    } else {
                        data.workingGeologists++;
                    }
                }
            } catch (e) {
                // Skip problematic specialists
            }
        });
    } catch (e) {
        game.showAlert("Error collecting data: " + e.message);
    }
    
    return data;
}
```

## Step 4: Display Results

```javascript
function ShowResults(data) {
    // Create modal window
    if ($('#specialistCounterModal').length === 0) {
        createModalWindow('specialistCounterModal', 'Specialist Count');
        $('#specialistCounterModal .modal-dialog').css({
            'width': '500px',
            'max-width': '95%'
        });
    }
    
    // Build HTML content
    var html = '<div style="padding: 20px; font-family: Arial, sans-serif;">';
    html += '<h4 style="color: #2c3e50; margin-top: 0;">Explorers</h4>';
    html += '<p><strong>Idle:</strong> ' + data.idleExplorers + '</p>';
    html += '<p><strong>Working:</strong> ' + data.workingExplorers + '</p>';
    html += '<p><strong>Total:</strong> ' + (data.idleExplorers + data.workingExplorers) + '</p>';
    
    html += '<hr style="margin: 20px 0;">';
    
    html += '<h4 style="color: #2c3e50;">Geologists</h4>';
    html += '<p><strong>Idle:</strong> ' + data.idleGeologists + '</p>';
    html += '<p><strong>Working:</strong> ' + data.workingGeologists + '</p>';
    html += '<p><strong>Total:</strong> ' + (data.idleGeologists + data.workingGeologists) + '</p>';
    
    html += '</div>';
    
    // Set content
    $('#specialistCounterModalData').html(html);
    
    // Show modal
    $('#specialistCounterModal:not(:visible)').modal({ backdrop: "static" });
}
```

## Complete Script

Here's the complete script:

```javascript
// TSO Client User Script - Specialist Counter
// Displays count of idle and working explorers and geologists

var SCRIPT_NAME = "Specialist Counter";

addToolsMenuItem(SCRIPT_NAME, ShowSpecialistCount);

function ShowSpecialistCount() {
    if (!game.gi.isOnHomzone()) {
        game.showAlert("Please go to your home zone first.");
        return;
    }
    
    var data = CollectSpecialistData();
    ShowResults(data);
}

function CollectSpecialistData() {
    var data = {
        idleExplorers: 0,
        workingExplorers: 0,
        idleGeologists: 0,
        workingGeologists: 0
    };
    
    try {
        var zone = game.gi.mCurrentPlayerZone;
        var specialists = zone.GetSpecialists_vector();
        
        specialists.forEach(function(specialist) {
            try {
                if (specialist.getPlayerID() === -1) return;
                
                var baseType = specialist.GetBaseType();
                var task = specialist.GetTask();
                var isIdle = (task === null);
                
                if (baseType === 1) {
                    if (isIdle) data.idleExplorers++;
                    else data.workingExplorers++;
                } else if (baseType === 2) {
                    if (isIdle) data.idleGeologists++;
                    else data.workingGeologists++;
                }
            } catch (e) { }
        });
    } catch (e) {
        game.showAlert("Error: " + e.message);
    }
    
    return data;
}

function ShowResults(data) {
    if ($('#specialistCounterModal').length === 0) {
        createModalWindow('specialistCounterModal', 'Specialist Count');
        $('#specialistCounterModal .modal-dialog').css({
            'width': '500px',
            'max-width': '95%'
        });
    }
    
    var html = '<div style="padding: 20px;">';
    html += '<h4>Explorers</h4>';
    html += '<p>Idle: ' + data.idleExplorers + '</p>';
    html += '<p>Working: ' + data.workingExplorers + '</p>';
    html += '<p>Total: ' + (data.idleExplorers + data.workingExplorers) + '</p>';
    html += '<hr>';
    html += '<h4>Geologists</h4>';
    html += '<p>Idle: ' + data.idleGeologists + '</p>';
    html += '<p>Working: ' + data.workingGeologists + '</p>';
    html += '<p>Total: ' + (data.idleGeologists + data.workingGeologists) + '</p>';
    html += '</div>';
    
    $('#specialistCounterModalData').html(html);
    $('#specialistCounterModal:not(:visible)').modal({ backdrop: "static" });
}
```

## Testing

1. Save the script file
2. Reload scripts in the client (or restart)
3. Go to Tools menu → "Specialist Counter"
4. You should see a modal with counts

## Key Concepts Learned

1. **Menu Integration**: Using `addToolsMenuItem()`
2. **Zone Access**: `game.gi.mCurrentPlayerZone`
3. **Specialist Access**: `zone.GetSpecialists_vector()`
4. **Specialist Properties**: `GetBaseType()`, `GetTask()`, `getPlayerID()`
5. **Modal Creation**: Using `createModalWindow()`
6. **Error Handling**: Try-catch blocks

## Next Steps

- Enhance the script to show specialist names
- Add task information for working specialists
- Add filtering options
- Learn more from [Common Patterns](common-patterns.md)
- Explore [Specialist API](../api-reference/specialists/specialist-overview.md)


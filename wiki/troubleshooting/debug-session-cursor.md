# Debug Session with Cursor AI

This guide explains how to set up remote debug logging from TSO Client scripts to Cursor AI's debug endpoint, enabling real-time log collection during script execution for AI-assisted debugging.

## Overview

When debugging TSO Client scripts, traditional methods (console.log, alerts) have limitations:
- **Console**: May not be accessible in TSO Client
- **Alerts**: Blocking and disruptive to workflow
- **Chat Logging**: Visible but requires manual copy-paste

The debug session method allows logs to be automatically sent to Cursor AI's debug endpoint, where they can be analyzed in real-time to identify issues and generate fixes.

## Architecture

```
TSO Client Script
    ↓ (XMLHttpRequest)
Debug Endpoint (http://127.0.0.1:7243/ingest/[UUID])
    ↓ (writes NDJSON)
Local Log File (.cursor/debug.log)
    ↓ (read by Cursor AI)
AI Analysis & Fix Generation
```

## Implementation

### Step 1: DEBUG_LOG Helper Function

Create a reusable `DEBUG_LOG` function that sends logs to both News Chat (for user visibility) and the debug endpoint (for AI analysis):

```javascript
// DEBUG LOG helper function - sends logs to News Chat and debug endpoint
var DEBUG_LOG_ENDPOINT = 'http://127.0.0.1:7243/ingest/48991fd5-a878-40f7-b87d-23e23f3b5d51';

function DEBUG_LOG(location, message, data, hypothesisId) {
    // Log to News chat first (user can see it)
    try {
        if (typeof TEST_StarShards_LogToChat === 'function') {
            var chatMsg = '[DEBUG] ' + (location || '') + ': ' + (message || '');
            if (data && typeof data === 'object') {
                try {
                    var dataStr = JSON.stringify(data);
                    if (dataStr.length > 100) {
                        dataStr = dataStr.substring(0, 100) + '...';
                    }
                    chatMsg += ' | ' + dataStr;
                } catch (e) {}
            }
            TEST_StarShards_LogToChat(chatMsg);
        }
    } catch (e) {}
    
    // Send to debug endpoint via XMLHttpRequest (fetch may not be available in TSO Client)
    // This is deferred and non-blocking
    try {
        if (typeof XMLHttpRequest !== 'undefined' && typeof JSON !== 'undefined' && typeof setTimeout !== 'undefined') {
            setTimeout(function() {
                try {
                    var payload = {
                        location: location || '',
                        message: message || '',
                        data: data || {},
                        timestamp: Date.now(),
                        sessionId: 'debug-session',
                        runId: 'run1',
                        hypothesisId: hypothesisId || 'NONE'
                    };
                    var xhr = new XMLHttpRequest();
                    xhr.open('POST', DEBUG_LOG_ENDPOINT, true);
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.send(JSON.stringify(payload));
                    // Don't wait for response - fire and forget
                } catch (e) {
                    // Silently ignore XHR errors
                }
            }, 0);
        }
    } catch (e) {
        // Silently ignore if XMLHttpRequest/setTimeout not available
    }
}
```

### Step 2: Chat Logging Helper

Create a helper function for News Chat logging (used by DEBUG_LOG):

```javascript
/**
 * Logs a message to News chat channel.
 */
function TEST_StarShards_LogToChat(msg) {
    try {
        if (globalFlash && globalFlash.gui && globalFlash.gui.mChatPanel) {
            globalFlash.gui.mChatPanel.PutMessageToChannelWithoutServer(
                "news",
                new window.runtime.Date(),
                "StarShards",
                msg,
                false,
                false
            );
        }
    } catch (e) {
        // Silently fail if chat logging is not available
    }
}
```

### Step 3: Instrumentation Points

Add `DEBUG_LOG` calls at critical points in your code:

#### Function Entry Points

```javascript
function TEST_StarShards_ApplyBuffs(data) {
    // DEBUG LOG: Function entry
    DEBUG_LOG('TEST_StarShards_08.js:358', 'ApplyBuffs ENTRY', {}, 'E');
    
    try {
        // ... function logic
    } catch (e) {
        DEBUG_LOG('TEST_StarShards_08.js:395', 'ApplyBuffs ERROR', {
            error: String(e),
            errorStack: e.stack
        }, 'E');
    }
}
```

#### Before Critical Operations

```javascript
// Before creating uniqueID
DEBUG_LOG('TEST_StarShards_08.js:477', 'SendBuffPacket uniqueID created (no parseInt)', {
    id1: id1,
    id2: id2,
    uniqueID: uniqueID,
    uniqueIDType: typeof uniqueID
}, 'A');

// Before server action
DEBUG_LOG('TEST_StarShards_08.js:497', 'SendBuffPacket before SendServerAction', {
    actionId: 61,
    param1: 0,
    grid: grid,
    param2: 0,
    uniqueID: uniqueID,
    uniqueIDType: typeof uniqueID
}, 'A');
```

#### After Critical Operations

```javascript
// After server action
game.gi.SendServerAction(61, 0, grid, 0, uniqueID);

DEBUG_LOG('TEST_StarShards_08.js:507', 'SendBuffPacket after SendServerAction', {
    success: true
}, 'A');
```

#### Variable State Logging

```javascript
// Log variable values
DEBUG_LOG('TEST_StarShards_08.js:364', 'ApplyBuffs needsBuffs result', {
    count: needsBuffs.count,
    detailsCount: needsBuffs.details.length,
    firstDetail: needsBuffs.details.length > 0 ? needsBuffs.details[0] : null
}, 'E');
```

#### Error Handling

```javascript
catch (ex) {
    DEBUG_LOG('TEST_StarShards_08.js:513', 'SendBuffPacket ERROR', {
        error: String(ex),
        errorStack: ex.stack
    }, 'A');
    throw ex;
}
```

### Step 4: Hypothesis Tracking

Use `hypothesisId` parameter to tag logs related to specific hypotheses:

```javascript
// Hypothesis A: uniqueID creation issue
DEBUG_LOG('TEST_StarShards_08.js:477', 'SendBuffPacket uniqueID created', {...}, 'A');

// Hypothesis B: parseInt needed
DEBUG_LOG('TEST_StarShards_08.js:486', 'SendBuffPacket uniqueID created (with parseInt)', {...}, 'B');

// Hypothesis C: Button click handler not attached
DEBUG_LOG('TEST_StarShards_08.js:75', 'Button clicked via delegation', {...}, 'C');

// Hypothesis D: Buff ID lookup issue
DEBUG_LOG('TEST_StarShards_08.js:408', 'GetBuffIdForCode ENTRY', {...}, 'D');

// Hypothesis E: ApplyBuffs flow issue
DEBUG_LOG('TEST_StarShards_08.js:358', 'ApplyBuffs ENTRY', {...}, 'E');
```

## Log Format

Each log entry is sent as a JSON object with the following structure:

```json
{
    "location": "TEST_StarShards_08.js:358",
    "message": "ApplyBuffs ENTRY",
    "data": {
        "count": 1,
        "detailsCount": 1,
        "firstDetail": {
            "grid": 273,
            "buffCode": "ProductivityBuff_StarfallStarExtractor_Buff1"
        }
    },
    "timestamp": 1766064768604,
    "sessionId": "debug-session",
    "runId": "run1",
    "hypothesisId": "E"
}
```

### Field Descriptions

- **location**: File name and line number where log was called (e.g., `"TEST_StarShards_08.js:358"`)
- **message**: Brief description of what's being logged
- **data**: Object containing relevant variable values, state, or context
- **timestamp**: Unix timestamp in milliseconds
- **sessionId**: Session identifier (typically `"debug-session"`)
- **runId**: Run identifier (e.g., `"run1"`, `"run2"`, `"post-fix"`)
- **hypothesisId**: Single letter identifier for hypothesis being tested (e.g., `"A"`, `"B"`, `"C"`)

## Best Practices

### 1. Log Entry and Exit Points

Always log function entry and exit (or error exit):

```javascript
function MyFunction(param1, param2) {
    DEBUG_LOG('MyScript.js:42', 'MyFunction ENTRY', {
        param1: param1,
        param2: param2
    }, 'H');
    
    try {
        // ... logic
        DEBUG_LOG('MyScript.js:50', 'MyFunction EXIT', {
            result: result
        }, 'H');
        return result;
    } catch (e) {
        DEBUG_LOG('MyScript.js:55', 'MyFunction ERROR', {
            error: String(e)
        }, 'H');
        throw e;
    }
}
```

### 2. Log Before and After Critical Operations

```javascript
// Before
DEBUG_LOG('MyScript.js:100', 'Before critical operation', {
    stateBefore: currentState
}, 'H');

// Critical operation
var result = performCriticalOperation();

// After
DEBUG_LOG('MyScript.js:105', 'After critical operation', {
    stateAfter: currentState,
    result: result
}, 'H');
```

### 3. Log Variable Types

When debugging type-related issues, log both value and type:

```javascript
DEBUG_LOG('MyScript.js:200', 'Variable type check', {
    value: myVar,
    type: typeof myVar,
    isNull: myVar === null,
    isUndefined: typeof myVar === 'undefined'
}, 'H');
```

### 4. Log Array/Object Contents (Safely)

```javascript
DEBUG_LOG('MyScript.js:250', 'Array state', {
    length: myArray.length,
    firstItem: myArray.length > 0 ? myArray[0] : null,
    lastItem: myArray.length > 0 ? myArray[myArray.length - 1] : null
}, 'H');
```

### 5. Use Hypothesis IDs Consistently

- **A**: Primary hypothesis (most likely cause)
- **B**: Secondary hypothesis
- **C**: Tertiary hypothesis
- **D-Z**: Additional hypotheses
- **NONE**: General logging, not testing a specific hypothesis

### 6. Keep Data Objects Small

Large objects can cause performance issues. Log only essential fields:

```javascript
// Good: Log essential fields
DEBUG_LOG('MyScript.js:300', 'Building info', {
    grid: building.GetGrid(),
    level: building.GetLevel(),
    isActive: building.IsBuildingActive()
}, 'H');

// Avoid: Logging entire objects
// DEBUG_LOG('MyScript.js:300', 'Building info', { building: building }, 'H');
```

### 7. Non-Blocking Logging

Always use `setTimeout` with 0ms delay to ensure logging doesn't block script execution:

```javascript
setTimeout(function() {
    try {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', DEBUG_LOG_ENDPOINT, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(payload));
        // Fire and forget - don't wait for response
    } catch (e) {
        // Silently ignore errors
    }
}, 0);
```

## Common Patterns

### Pattern 1: Button Click Handler Debugging

```javascript
$('#myButton').on('click', function(e) {
    DEBUG_LOG('MyScript.js:50', 'Button clicked', {
        eventType: e.type,
        targetId: e.target.id
    }, 'C');
    
    try {
        performAction();
    } catch (err) {
        DEBUG_LOG('MyScript.js:55', 'Button click error', {
            error: String(err),
            errorStack: err.stack
        }, 'C');
    }
});
```

### Pattern 2: Server Action Debugging

```javascript
function SendServerAction(actionId, param1, param2, param3, param4) {
    DEBUG_LOG('MyScript.js:100', 'Before SendServerAction', {
        actionId: actionId,
        param1: param1,
        param2: param2,
        param3: param3,
        param4: param4
    }, 'A');
    
    try {
        game.gi.SendServerAction(actionId, param1, param2, param3, param4);
        
        DEBUG_LOG('MyScript.js:110', 'After SendServerAction', {
            success: true
        }, 'A');
    } catch (e) {
        DEBUG_LOG('MyScript.js:115', 'SendServerAction ERROR', {
            error: String(e)
        }, 'A');
        throw e;
    }
}
```

### Pattern 3: Object Creation Debugging

```javascript
function CreateUniqueID(id1, id2) {
    DEBUG_LOG('MyScript.js:200', 'CreateUniqueID ENTRY', {
        id1: id1,
        id1Type: typeof id1,
        id2: id2,
        id2Type: typeof id2
    }, 'A');
    
    // Try without parseInt
    var uniqueID = game.def("Communication.VO::dUniqueID").Create(id1, id2);
    
    DEBUG_LOG('MyScript.js:210', 'CreateUniqueID result (no parseInt)', {
        uniqueID: uniqueID,
        uniqueIDType: typeof uniqueID,
        isNull: uniqueID === null,
        isUndefined: uniqueID === undefined
    }, 'A');
    
    // If failed, try with parseInt
    if (!uniqueID) {
        uniqueID = game.def("Communication.VO::dUniqueID").Create(parseInt(id1), parseInt(id2));
        
        DEBUG_LOG('MyScript.js:220', 'CreateUniqueID result (with parseInt)', {
            uniqueID: uniqueID,
            uniqueIDType: typeof uniqueID
        }, 'B');
    }
    
    return uniqueID;
}
```

### Pattern 4: Queue/Async Operation Debugging

```javascript
var queue = new TimedQueue(1000);
var processed = 0;
var failed = 0;

items.forEach(function(item, idx) {
    queue.add(function() {
        DEBUG_LOG('MyScript.js:300', 'Queue item start', {
            index: idx,
            itemId: item.id,
            processed: processed,
            failed: failed
        }, 'E');
        
        try {
            processItem(item);
            processed++;
            
            DEBUG_LOG('MyScript.js:310', 'Queue item success', {
                index: idx,
                processed: processed
            }, 'E');
        } catch (e) {
            failed++;
            DEBUG_LOG('MyScript.js:315', 'Queue item error', {
                index: idx,
                error: String(e),
                failed: failed
            }, 'E');
        }
    });
});
```

## Troubleshooting

### Logs Not Appearing in Endpoint

1. **Check endpoint URL**: Ensure `DEBUG_LOG_ENDPOINT` is correct
2. **Check XMLHttpRequest availability**: TSO Client may not support XHR
3. **Check network**: Ensure localhost:7243 is accessible
4. **Check console**: Look for XHR errors in browser console

### Script Fails to Load After Adding DEBUG_LOG

1. **Syntax errors**: Ensure all JSON.stringify calls are wrapped in try-catch
2. **Missing dependencies**: Ensure `TEST_StarShards_LogToChat` function exists
3. **XMLHttpRequest not available**: Wrap XHR code in `typeof XMLHttpRequest !== 'undefined'` check

### Performance Issues

1. **Too many logs**: Reduce logging frequency
2. **Large data objects**: Log only essential fields
3. **Synchronous XHR**: Ensure XHR is async (`true` parameter) and deferred with `setTimeout`

## Example: Complete Debug Session

Here's a complete example showing debug logging throughout a function:

```javascript
function ApplyBuffsToBuildings(data) {
    // Entry point
    DEBUG_LOG('MyScript.js:100', 'ApplyBuffsToBuildings ENTRY', {
        buildingsCount: data.buildings.length
    }, 'E');
    
    try {
        // Step 1: Count buildings needing buffs
        var needsBuffs = CountNeedsBuffs(data);
        
        DEBUG_LOG('MyScript.js:108', 'CountNeedsBuffs result', {
            count: needsBuffs.count,
            detailsCount: needsBuffs.details.length
        }, 'E');
        
        if (needsBuffs.count === 0) {
            DEBUG_LOG('MyScript.js:115', 'No buildings need buffs', {}, 'E');
            return;
        }
        
        // Step 2: Process each building
        var queue = new TimedQueue(1000);
        var applied = 0;
        var failed = 0;
        
        needsBuffs.details.forEach(function(detail, idx) {
            queue.add(function() {
                DEBUG_LOG('MyScript.js:125', 'Processing building', {
                    index: idx,
                    grid: detail.grid,
                    buffCode: detail.buffCode
                }, 'E');
                
                try {
                    // Step 3: Get buff ID
                    var buffId = GetBuffIdForCode(detail.buffCode);
                    
                    DEBUG_LOG('MyScript.js:135', 'Buff ID lookup', {
                        buffCode: detail.buffCode,
                        buffId: buffId
                    }, 'D');
                    
                    if (!buffId) {
                        throw new Error("Buff not found");
                    }
                    
                    // Step 4: Send buff packet
                    SendBuffPacket(buffId, detail.grid, detail.buffCode);
                    
                    applied++;
                    DEBUG_LOG('MyScript.js:150', 'Buff applied successfully', {
                        grid: detail.grid,
                        applied: applied,
                        failed: failed
                    }, 'E');
                } catch (e) {
                    failed++;
                    DEBUG_LOG('MyScript.js:155', 'Buff application failed', {
                        grid: detail.grid,
                        error: String(e),
                        applied: applied,
                        failed: failed
                    }, 'E');
                }
            });
        });
        
        queue.run();
        
        DEBUG_LOG('MyScript.js:165', 'ApplyBuffsToBuildings EXIT', {
            applied: applied,
            failed: failed
        }, 'E');
    } catch (e) {
        DEBUG_LOG('MyScript.js:170', 'ApplyBuffsToBuildings ERROR', {
            error: String(e),
            errorStack: e.stack
        }, 'E');
        throw e;
    }
}
```

## Related Documentation

- [Debugging Techniques](debugging.md) - General debugging methods for TSO scripts
- [Common Errors](common-errors.md) - Error codes and solutions
- [Known Issues](known-issues.md) - Known limitations

## Summary

The debug session method enables:

1. **Real-time log collection** from TSO Client scripts
2. **AI-assisted analysis** of runtime behavior
3. **Hypothesis-driven debugging** with tagged logs
4. **Non-blocking logging** that doesn't impact script performance
5. **Dual output** to both News Chat (user) and debug endpoint (AI)

By following this guide, you can set up comprehensive debug logging that helps Cursor AI understand script behavior and generate precise fixes based on actual runtime evidence.

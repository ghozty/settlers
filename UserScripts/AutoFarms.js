// TSO Client User Script - Auto Rebuild Farms & Wells + Binder Manager (Enhanced)
// Periodically scans for depleted farms and dried-up wells and rebuilds them.
// Also manages Bookbinder production:
//   - Collects finished production automatically
//   - Starts new Manuscript production if idle
// Features: Randomized intervals, randomized build delays, queue management.
// Created by Ghozty

var AUTO_REBUILD_CFG = {
    // Scan interval range (milliseconds)
    interval_MIN: 120000, // 2 Minutes
    interval_MAX: 180000, // 2 Minutes
    
    // Build delay range between each build command (milliseconds)
    build_delay_MIN: 5000,  // 5 Seconds
    build_delay_MAX: 15000, // 15 Seconds
    
    // Farm ruin detection
    FARM_RUIN_NAME: "MineDepletedDepositCorn",
    FARM_BUILD_ID: 43, // Farmfield
    
    // Well ruin detection
    WELL_RUIN_NAME: "MineDepletedDepositWater",
    WELL_BUILD_ID: 72,  // Well
    
    // Bookbinder settings
    BINDER_ENABLED: true,           // Enable/disable Bookbinder management
    BINDER_PRODUCT: "Manuscript",   // Product to auto-produce
    BINDER_PRODUCTION_TYPE: 2       // Science Queue type
};

var _arTimeout = null;
var _arRunning = false;

// Add menu item for start/stop toggle
try {
    addToolsMenuItem("CURSOR Auto Rebuild: Start/Stop", _toggleAutoRebuild);
} catch (e) { }

/**
 * Toggles the auto rebuild script on/off.
 */
function _toggleAutoRebuild() {
    if (_arRunning) {
        _stopAutoRebuild();
    } else {
        _startAutoRebuild();
    }
}

/**
 * Starts the auto rebuild loop.
 */
function _startAutoRebuild() {
    if (_arRunning) return;
    _arRunning = true;
    _logRebuild("Auto Rebuild STARTED.");

    // Run immediately
    _rebuildLoop();
}

/**
 * Stops the auto rebuild loop.
 */
function _stopAutoRebuild() {
    _arRunning = false;
    if (_arTimeout) { 
        clearTimeout(_arTimeout); 
        _arTimeout = null; 
    }
    _logRebuild("Auto Rebuild STOPPED.");
}

/**
 * Main loop - scans for ruins, manages Bookbinder, and schedules next scan.
 */
function _rebuildLoop() {
    if (!_arRunning) return;

    try {
        // Check if on home zone
        if (!game.gi.isOnHomzone()) {
            _logRebuild("Not on Home Zone. Skipping scan.");
            _scheduleNextScan();
            return;
        }

        var now = new Date();
        var timeStr = now.toTimeString().split(' ')[0];
        _logRebuild(timeStr + " Scan Started...");

        var zone = swmmo.application.mGameInterface.mCurrentPlayerZone;
        var buildings = zone.mStreetDataMap.mBuildingContainer;

        // --- Bookbinder Check ---
        if (AUTO_REBUILD_CFG.BINDER_ENABLED) {
            _checkBinder(zone, buildings);
        }

        // --- Farm/Well Rebuild ---

        // Check Build Queue availability
        var queueVector = swmmo.application.mGameInterface.mHomePlayer.mBuildQueue.GetQueue_vector();
        var maxSlots = swmmo.application.mGameInterface.mHomePlayer.mBuildQueue.GetTotalAvailableSlots();
        var currentQueueSize = queueVector ? queueVector.length : 0;
        var freeSlots = maxSlots - currentQueueSize;

        if (freeSlots <= 0) {
            _logRebuild("Queue is full (" + currentQueueSize + "/" + maxSlots + "). Skipping build.");
            _scheduleNextScan();
            return;
        }

        var buildList = [];

        // Scan for depleted farms and wells
        buildings.forEach(function (bld) {
            try {
                var name = bld.GetBuildingName_string();
                var grid = bld.GetGrid();
                var buildID = 0;
                var typeName = "";

                if (name === AUTO_REBUILD_CFG.FARM_RUIN_NAME) {
                    buildID = AUTO_REBUILD_CFG.FARM_BUILD_ID;
                    typeName = "Farm";
                } else if (name === AUTO_REBUILD_CFG.WELL_RUIN_NAME) {
                    buildID = AUTO_REBUILD_CFG.WELL_BUILD_ID;
                    typeName = "Well";
                }

                if (buildID > 0) {
                    buildList.push({ id: buildID, grid: grid, name: typeName });
                }
            } catch (innerErr) { }
        });

        // Limit by free slots
        if (buildList.length > freeSlots) {
            _logRebuild("Found " + buildList.length + " ruins, but only " + freeSlots + " slots free. Limiting...");
            buildList = buildList.slice(0, freeSlots);
        }

        if (buildList.length > 0) {
            _logRebuild("Found " + buildList.length + " ruins to rebuild.");
            _processBuildList(buildList);
        } else {
            _logRebuild("No ruins found.");
            _scheduleNextScan();
        }

    } catch (e) {
        _logRebuild("ERROR: " + e.message);
        _stopAutoRebuild();
    }
}

/**
 * Checks the Bookbinder building:
 * 1. If production is complete, collects it
 * 2. If idle (no production), starts new Manuscript production
 * 
 * @param {Object} zone - The current player zone
 * @param {Object} buildings - The building container
 */
function _checkBinder(zone, buildings) {
    try {
        var binderBuilding = null;
        
        // Find Bookbinder building
        buildings.forEach(function (bld) {
            if (bld.GetBuildingName_string() === "Bookbinder") {
                binderBuilding = bld;
            }
        });

        if (!binderBuilding) {
            // No Bookbinder on this zone
            return;
        }

        // Get Production Queue (Type 2 for Bookbinder/Science)
        var queue = zone.GetProductionQueue(AUTO_REBUILD_CFG.BINDER_PRODUCTION_TYPE);
        
        if (!queue) {
            _logRebuild("Binder: Queue not found.");
            return;
        }

        var hasProduction = queue.mTimedProductions_vector && queue.mTimedProductions_vector.length > 0;
        
        if (hasProduction) {
            var item = queue.mTimedProductions_vector[0];
            
            // Check if production is complete
            var isComplete = false;
            var productName = AUTO_REBUILD_CFG.BINDER_PRODUCT;
            
            try {
                var producedItems = item.GetProducedItems();
                var totalAmount = item.GetAmount();
                
                if (producedItems >= totalAmount) {
                    isComplete = true;
                }
            } catch (e) { }
            
            // Secondary check: remaining time
            if (!isComplete) {
                try {
                    var productionTime = item.GetProductionTime();
                    var collectedTime = item.GetCollectedTime();
                    if (productionTime - collectedTime <= 0) {
                        isComplete = true;
                    }
                } catch (e) { }
            }
            
            // Get product name from order
            try {
                var order = item.GetProductionOrder();
                if (order) {
                    var vo = order.GetProductionVO ? order.GetProductionVO() : null;
                    if (vo && vo.type_string) {
                        productName = vo.type_string;
                    }
                }
            } catch (e) { }
            
            if (isComplete) {
                // Production is complete - collect it!
                _logRebuild("Binder: " + productName + " complete. Collecting...");
                
                try {
                    queue.finishProduction(null, null);
                    _logRebuild("Binder: " + productName + " collected!");
                    
                    // After collecting, start new production
                    setTimeout(function() {
                        _startBinderProduction(binderBuilding);
                    }, 1000);
                    
                } catch (collectErr) {
                    _logRebuild("Binder: Collection error: " + collectErr.message);
                }
                
            } else {
                // Production in progress
                try {
                    var productionTime = item.GetProductionTime();
                    var collectedTime = item.GetCollectedTime();
                    var progress = Math.round((collectedTime / productionTime) * 100);
                    _logRebuild("Binder: Producing " + productName + " (" + progress + "%)");
                } catch (e) {
                    _logRebuild("Binder: Production in progress.");
                }
            }
            
        } else {
            // No production - start new one
            _logRebuild("Binder: Idle. Starting " + AUTO_REBUILD_CFG.BINDER_PRODUCT + "...");
            _startBinderProduction(binderBuilding);
        }
        
    } catch (e) {
        _logRebuild("Binder Check Error: " + e.message);
    }
}

/**
 * Starts a new production in the Bookbinder.
 * 
 * @param {Object} binderBuilding - The Bookbinder building object
 */
function _startBinderProduction(binderBuilding) {
    try {
        var dTimedProductionVO = swmmo.getDefinitionByName("Communication.VO::dTimedProductionVO");
        var vo = new dTimedProductionVO();
        vo.productionType = AUTO_REBUILD_CFG.BINDER_PRODUCTION_TYPE;
        vo.type_string = AUTO_REBUILD_CFG.BINDER_PRODUCT;
        vo.amount = 1;
        vo.stacks = 1;
        vo.buildingGrid = binderBuilding.GetGrid();

        game.gi.mClientMessages.SendMessagetoServer(91, game.gi.mCurrentViewedZoneID, vo);
        _logRebuild("Binder: " + AUTO_REBUILD_CFG.BINDER_PRODUCT + " production started.");
        
    } catch (prodErr) {
        _logRebuild("Binder: Start production error: " + prodErr.message);
    }
}

/**
 * Processes the build list, sending build commands with random delays.
 * 
 * @param {Array} list - Array of build items {id, grid, name}
 */
function _processBuildList(list) {
    if (!_arRunning) return;

    if (list.length === 0) {
        _logRebuild("All builds sent.");
        _scheduleNextScan();
        return;
    }

    var item = list.shift();
    var delay = Math.floor(Math.random() * (AUTO_REBUILD_CFG.build_delay_MAX - AUTO_REBUILD_CFG.build_delay_MIN + 1) + AUTO_REBUILD_CFG.build_delay_MIN);

    _logRebuild("Waiting " + _formatDuration(delay) + " for next build (" + item.name + ")...");

    _arTimeout = setTimeout(function () {
        if (!_arRunning) return;
        try {
            // Send build command
            game.gi.SendServerAction(50, item.id, item.grid, 0, null);
            _logRebuild("Build Command Sent for " + item.name + " at " + item.grid);
        } catch (e) {
            _logRebuild("Error sending build: " + e.message);
        }
        _processBuildList(list);
    }, delay);
}

/**
 * Schedules the next scan with a random delay.
 */
function _scheduleNextScan() {
    if (!_arRunning) return;

    var delay = Math.floor(Math.random() * (AUTO_REBUILD_CFG.interval_MAX - AUTO_REBUILD_CFG.interval_MIN + 1) + AUTO_REBUILD_CFG.interval_MIN);
    _logRebuild("Next scan in " + _formatDuration(delay));

    _arTimeout = setTimeout(_rebuildLoop, delay);
}

/**
 * Formats milliseconds into MM:SS format.
 * 
 * @param {number} ms - Time in milliseconds
 * @returns {string} Formatted time string
 */
function _formatDuration(ms) {
    var totalSeconds = Math.floor(ms / 1000);
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = totalSeconds % 60;
    return (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
}

/**
 * Logs a message to the game chat's news channel.
 * 
 * @param {string} msg - The message to log
 */
function _logRebuild(msg) {
    try {
        globalFlash.gui.mChatPanel.PutMessageToChannelWithoutServer(
            "news", 
            new window.runtime.Date(), 
            "AutoRebuild", 
            msg, 
            false, 
            false
        );
    } catch (e) { }
}



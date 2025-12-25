// GeologistManager.js
// Auto-sends idle geologists on tasks based on depleted mines.
// Features: Priority-based assignment, Smart rules (depletedMin, keepOne)
// Created by Cursor AI

// ============================================================================
// GLOBAL STATE (survive script reloads)
// ============================================================================
if (typeof window.GeologistManager_TimerID === 'undefined') {
    window.GeologistManager_TimerID = null;
}
if (typeof window.GeologistManager_IsRunning === 'undefined') {
    window.GeologistManager_IsRunning = false;
}

// ============================================================================
// CONFIGURATION (hard-coded, not changeable via UI)
// ============================================================================
var GEOLOGIST_CONFIG = {
    // Check interval (random between min and max)
    intervalMin: 180000,    // 3 minutes
    intervalMax: 300000,    // 5 minutes
    
    // Delay between sending geologists (random between min and max)
    delayMin: 2000,         // 2 seconds
    delayMax: 4000          // 4 seconds
};

// ============================================================================
// GEOLOGIST TASK DEFINITIONS
// Priority order: Stone → BronzeOre → Marble → IronOre → Coal → GoldOre
// ============================================================================
var GEOLOGIST_TASKS = [
    { subTask: 0, name: 'Stone', resourceType: 'Stone', priority: 1, depletedMin: 2, keepOne: true },
    { subTask: 1, name: 'Bronze Ore', resourceType: 'BronzeOre', priority: 2, depletedMin: 1, keepOne: false },
    { subTask: 2, name: 'Marble', resourceType: 'Marble', priority: 3, depletedMin: 2, keepOne: true },
    { subTask: 3, name: 'Iron Ore', resourceType: 'IronOre', priority: 4, depletedMin: 2, keepOne: true },
    { subTask: 5, name: 'Coal', resourceType: 'Coal', priority: 5, depletedMin: 1, keepOne: false },
    { subTask: 4, name: 'Gold Ore', resourceType: 'GoldOre', priority: 6, depletedMin: 1, keepOne: false }
];

var REAL_MINE_TYPES = ["IronOre", "Coal", "BronzeOre", "GoldOre", "TitaniumOre", "Salpeter", "Marble", "Stone", "Granite"];

// ============================================================================
// MENU FUNCTIONS (global scope for menu binding)
// ============================================================================
function GeologistManager_Toggle() {
    GeologistManager.toggle();
}

// ============================================================================
// MAIN MANAGER OBJECT
// ============================================================================
var GeologistManager = {
    // Constants
    LOG_CHANNEL: "news",
    LOG_SENDER: "GeologistMgr",

    // ========================================================================
    // INITIALIZATION
    // ========================================================================
    init: function () {
        try {
            // Add menu item
            addToolsMenuItem("Geologist Manager: Start/Stop", GeologistManager_Toggle);

            this.log("Script loaded. Use menu to Start/Stop.");
            this.log("Current state: " + (window.GeologistManager_IsRunning ? "RUNNING" : "STOPPED"));
        } catch (e) {
            this.log("Error init: " + e);
        }
    },

    // ========================================================================
    // LOGGING
    // ========================================================================
    log: function (msg) {
        try {
            if (globalFlash && globalFlash.gui && globalFlash.gui.mChatPanel) {
                globalFlash.gui.mChatPanel.PutMessageToChannelWithoutServer(
                    this.LOG_CHANNEL,
                    new window.runtime.Date(),
                    this.LOG_SENDER,
                    msg,
                    false,
                    false
                );
            }
        } catch (e) {
            // Silent fail
        }
    },

    // ========================================================================
    // UTILITY FUNCTIONS
    // ========================================================================
    getRandomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    formatDuration: function (ms) {
        var totalSeconds = Math.floor(ms / 1000);
        var minutes = Math.floor(totalSeconds / 60);
        var seconds = totalSeconds % 60;
        if (minutes > 0) {
            return minutes + "m " + seconds + "s";
        }
        return seconds + "s";
    },

    // ========================================================================
    // START / STOP / TOGGLE
    // ========================================================================
    toggle: function () {
        this.log("Toggle called. Current state: " + (window.GeologistManager_IsRunning ? "RUNNING" : "STOPPED"));

        if (window.GeologistManager_IsRunning) {
            this.stop();
        } else {
            this.start();
        }
    },

    start: function () {
        var _this = this;

        if (window.GeologistManager_IsRunning) {
            this.log("Already running. TimerID: " + window.GeologistManager_TimerID);
            return;
        }

        this.log("Starting Geologist Manager...");
        this.log("Mode: AUTO (priority-based)");

        // Clear any orphan timer first
        if (window.GeologistManager_TimerID !== null) {
            this.log("Clearing orphan timer: " + window.GeologistManager_TimerID);
            clearTimeout(window.GeologistManager_TimerID);
            window.GeologistManager_TimerID = null;
        }

        window.GeologistManager_IsRunning = true;

        // Run once immediately
        this.log("Running initial check...");
        this.run();

        this.log("Started successfully!");
        game.showAlert("Geologist Manager: Started (AUTO mode)");
    },

    scheduleNextRun: function () {
        var _this = this;

        if (!window.GeologistManager_IsRunning) {
            return;
        }

        var nextInterval = this.getRandomInt(GEOLOGIST_CONFIG.intervalMin, GEOLOGIST_CONFIG.intervalMax);
        this.log("Next check in: " + this.formatDuration(nextInterval));

        window.GeologistManager_TimerID = setTimeout(function () {
            _this.run();
        }, nextInterval);
    },

    stop: function () {
        this.log("Stopping Geologist Manager...");

        if (window.GeologistManager_TimerID !== null) {
            clearTimeout(window.GeologistManager_TimerID);
            this.log("Timer " + window.GeologistManager_TimerID + " cleared.");
            window.GeologistManager_TimerID = null;
        }

        window.GeologistManager_IsRunning = false;
        this.log("Stopped.");
        game.showAlert("Geologist Manager: Stopped");
    },

    // ========================================================================
    // MAIN RUN LOOP
    // ========================================================================
    run: function () {
        try {
            this.log("=== Checking for geologists ===");

            if (!game || !game.gi || !game.gi.mCurrentPlayerZone) {
                this.log("ERROR: Game zone not available!");
                this.scheduleNextRun();
                return;
            }

            if (!game.gi.isOnHomzone()) {
                this.log("ERROR: Not on home zone!");
                this.scheduleNextRun();
                return;
            }

            // Collect data
            var data = this.collectData();

            this.log("Found " + data.idleGeologists.length + " idle geologist(s)");
            this.log("Found " + data.workingGeologists.length + " working geologist(s)");

            // Log depleted mines
            var depletedLog = [];
            for (var res in data.depletedMines) {
                if (data.depletedMines[res].length > 0) {
                    depletedLog.push(res + "=" + data.depletedMines[res].length);
                }
            }
            if (depletedLog.length > 0) {
                this.log("Depleted mines: " + depletedLog.join(", "));
            } else {
                this.log("No depleted mines found.");
            }

            if (data.idleGeologists.length === 0) {
                this.log("No idle geologists to send.");
                this.scheduleNextRun();
                return;
            }

            // Calculate assignments
            var assignments = this.calculateAssignments(data);

            if (assignments.length > 0) {
                this.log("Sending " + assignments.length + " geologist(s)...");
                this.sendGeologists(assignments);
            } else {
                this.log("No assignments needed (all rules satisfied).");
                this.scheduleNextRun();
            }
        } catch (e) {
            this.log("ERROR in run: " + e);
            this.scheduleNextRun();
        }
    },

    // ========================================================================
    // DATA COLLECTION
    // ========================================================================
    collectData: function () {
        return {
            idleGeologists: this.getIdleGeologists(),
            workingGeologists: this.getWorkingGeologists(),
            depletedMines: this.getDepletedMines()
        };
    },

    getIdleGeologists: function () {
        var geologists = [];
        var _this = this;

        try {
            var zone = game.gi.mCurrentPlayerZone;
            var specialists = zone.GetSpecialists_vector();

            specialists.forEach(function (specialist) {
                try {
                    var baseType = specialist.GetBaseType();
                    var task = specialist.GetTask();
                    var playerID = specialist.getPlayerID();

                    if (baseType === 2 && playerID !== -1 && task === null) {
                        geologists.push(specialist);
                        _this.log("  -> Idle: " + specialist.getName(false));
                    }
                } catch (e) {
                    // Skip problematic items
                }
            });
        } catch (e) {
            this.log("Error getting idle geologists: " + e);
        }

        return geologists;
    },

    getWorkingGeologists: function () {
        var workingGeologists = [];

        try {
            var zone = game.gi.mCurrentPlayerZone;
            var specialists = zone.GetSpecialists_vector();

            specialists.forEach(function (specialist) {
                try {
                    var baseType = specialist.GetBaseType();
                    var task = specialist.GetTask();
                    var playerID = specialist.getPlayerID();

                    if (baseType === 2 && playerID !== -1 && task !== null) {
                        workingGeologists.push(specialist);
                    }
                } catch (e) {
                    // Skip problematic items
                }
            });
        } catch (e) {
            this.log("Error getting working geologists: " + e);
        }

        return workingGeologists;
    },

    getDepletedMines: function () {
        var depletedMines = {};

        try {
            var zone = game.gi.mCurrentPlayerZone;
            var buildings = zone.mStreetDataMap.mBuildingContainer;

            buildings.forEach(function (building) {
                try {
                    if (zone.mStreetDataMap.IsADepletedDeposit(building)) {
                        var buildingName = building.GetBuildingName_string();
                        var resourceType = buildingName.replace("MineDepletedDeposit", "");

                        if (REAL_MINE_TYPES.indexOf(resourceType) >= 0) {
                            if (!depletedMines[resourceType]) {
                                depletedMines[resourceType] = [];
                            }
                            depletedMines[resourceType].push(building);
                        }
                    }
                } catch (e) {
                    // Skip problematic buildings
                }
            });
        } catch (e) {
            this.log("Error getting depleted mines: " + e);
        }

        return depletedMines;
    },

    // ========================================================================
    // ASSIGNMENT LOGIC
    // ========================================================================
    calculateAssignments: function (data) {
        var assignments = [];
        var idleGeologists = data.idleGeologists.slice(); // Copy array
        var depletedCounts = {};
        var workingGeologistCounts = {};
        var _this = this;

        // Count depleted mines by resource type
        for (var resourceType in data.depletedMines) {
            depletedCounts[resourceType] = data.depletedMines[resourceType].length;
        }

        // Count working geologists by resource type
        data.workingGeologists.forEach(function (specialist) {
            try {
                var task = specialist.GetTask();
                if (task) {
                    // Get the task VO which contains subTaskID
                    var taskVO = task.CreateTaskVOFromSpecialistTask();
                    if (taskVO && taskVO.subTaskID !== undefined) {
                        var subTaskID = taskVO.subTaskID;

                        // Map subTaskID to resource type
                        var resourceType = null;
                        if (subTaskID === 0) resourceType = "Stone";
                        else if (subTaskID === 1) resourceType = "BronzeOre";
                        else if (subTaskID === 2) resourceType = "Marble";
                        else if (subTaskID === 3) resourceType = "IronOre";
                        else if (subTaskID === 4) resourceType = "GoldOre";
                        else if (subTaskID === 5) resourceType = "Coal";
                        else if (subTaskID === 6) resourceType = "Granite";
                        else if (subTaskID === 8) resourceType = "Salpeter";

                        if (resourceType) {
                            workingGeologistCounts[resourceType] = (workingGeologistCounts[resourceType] || 0) + 1;
                        }
                    }
                }
            } catch (e) {
                // Ignore errors
            }
        });

        // Process tasks in priority order
        GEOLOGIST_TASKS.forEach(function (taskDef) {
            if (idleGeologists.length === 0) return; // No more geologists available

            var depletedCount = depletedCounts[taskDef.resourceType] || 0;
            var workingCount = workingGeologistCounts[taskDef.resourceType] || 0;

            // Calculate actual need: depleted mines minus already working geologists
            var actualNeed = Math.max(0, depletedCount - workingCount);

            _this.log("Priority: " + taskDef.name + " → depleted=" + depletedCount + 
                     ", working=" + workingCount + ", need=" + actualNeed);

            // Check if we should send geologists for this resource
            if (actualNeed >= taskDef.depletedMin) {
                // Calculate how many geologists to send
                var geologistsToSend = actualNeed;
                if (taskDef.keepOne) {
                    geologistsToSend = Math.max(0, actualNeed - 1); // Keep 1 depleted
                }

                _this.log("  → Send " + geologistsToSend + " geologist(s) (keepOne=" + taskDef.keepOne + ")");

                // Assign geologists (limited by available idle geologists)
                var count = Math.min(geologistsToSend, idleGeologists.length);
                for (var i = 0; i < count; i++) {
                    var geologist = idleGeologists.shift(); // Remove from available list
                    assignments.push({
                        geologist: geologist,
                        taskDef: taskDef
                    });
                }
            } else {
                _this.log("  → Skip (need < depletedMin)");
            }
        });

        return assignments;
    },

    // ========================================================================
    // SEND GEOLOGISTS
    // ========================================================================
    sendGeologists: function (assignments) {
        var _this = this;
        var index = 0;

        function sendNext() {
            if (index >= assignments.length) {
                _this.log("All " + assignments.length + " geologist(s) sent.");
                _this.log("Remaining idle: " + (_this.getIdleGeologists().length - assignments.length));
                _this.scheduleNextRun();
                return;
            }

            var assignment = assignments[index];
            _this.sendGeologistTask(assignment.geologist, assignment.taskDef);

            index++;

            if (index < assignments.length) {
                var delay = _this.getRandomInt(GEOLOGIST_CONFIG.delayMin, GEOLOGIST_CONFIG.delayMax);
                _this.log("Waiting " + _this.formatDuration(delay) + " before next...");
                setTimeout(sendNext, delay);
            } else {
                _this.log("All " + assignments.length + " geologist(s) sent.");
                _this.scheduleNextRun();
            }
        }

        sendNext();
    },

    sendGeologistTask: function (geologist, taskDef) {
        try {
            var specTask = game.def("Communication.VO::dStartSpecialistTaskVO", true);
            specTask.subTaskID = taskDef.subTask;
            specTask.paramString = "";
            specTask.uniqueID = geologist.GetUniqueID();

            game.gi.SendServerAction(95, 0, 0, 0, specTask);
            this.log("Sent: " + geologist.getName(false) + " → Find " + taskDef.name);
        } catch (ex) {
            this.log("ERROR sending geologist " + geologist.getName(false) + ": " + ex);
        }
    }
};

// ============================================================================
// INITIALIZE
// ============================================================================
GeologistManager.init();

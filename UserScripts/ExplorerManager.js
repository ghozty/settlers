// AG_ExplorerManager.js
// Auto-sends idle explorers/geologists on tasks with randomized intervals.
// Features: Settings UI, Task Selection, Geologist Support
// Created by Ghozty

// ============================================================================
// GLOBAL STATE (survive script reloads)
// ============================================================================
if (typeof window.AG_ExplorerManager_TimerID === 'undefined') {
    window.AG_ExplorerManager_TimerID = null;
}
if (typeof window.AG_ExplorerManager_IsRunning === 'undefined') {
    window.AG_ExplorerManager_IsRunning = false;
}

// ============================================================================
// TASK DEFINITIONS
// ============================================================================
var AG_TASK_DEFINITIONS = {
    explorer: {
        treasure: [
            { id: 0, name: "Short Treasure", taskType: 1, subTask: 0, reqLevel: 8 },
            { id: 1, name: "Medium Treasure", taskType: 1, subTask: 1, reqLevel: 20 },
            { id: 2, name: "Long Treasure", taskType: 1, subTask: 2, reqLevel: 32 },
            { id: 3, name: "Even Longer Treasure", taskType: 1, subTask: 3, reqLevel: 40 },
            { id: 4, name: "Longest Treasure", taskType: 1, subTask: 6, reqLevel: 54 }
        ],
        adventure: [
            { id: 0, name: "Short Adventure", taskType: 2, subTask: 0, reqLevel: 26 },
            { id: 1, name: "Medium Adventure", taskType: 2, subTask: 1, reqLevel: 36 },
            { id: 2, name: "Long Adventure", taskType: 2, subTask: 2, reqLevel: 42 },
            { id: 3, name: "Very Long Adventure", taskType: 2, subTask: 3, reqLevel: 56 }
        ]
    },
    geologist: [
        { id: 0, name: "Stone", taskType: 0, subTask: 0, reqLevel: 0 },
        { id: 1, name: "Bronze Ore", taskType: 0, subTask: 1, reqLevel: 9 },
        { id: 2, name: "Marble", taskType: 0, subTask: 2, reqLevel: 19 },
        { id: 3, name: "Iron Ore", taskType: 0, subTask: 3, reqLevel: 20 },
        { id: 4, name: "Gold Ore", taskType: 0, subTask: 4, reqLevel: 23 },
        { id: 5, name: "Coal", taskType: 0, subTask: 5, reqLevel: 24 },
        { id: 6, name: "Granite", taskType: 0, subTask: 6, reqLevel: 60 },
        { id: 7, name: "Titanium Ore", taskType: 0, subTask: 7, reqLevel: 61 },
        { id: 8, name: "Saltpeter", taskType: 0, subTask: 8, reqLevel: 62 }
    ]
};

// ============================================================================
// MENU FUNCTIONS (global scope for menu binding)
// ============================================================================
function AG_ExplorerManager_Toggle() {
    AG_ExplorerManager.toggle();
}

function AG_ExplorerManager_Settings() {
    AG_ExplorerManager.showSettings();
}

// ============================================================================
// MAIN MANAGER OBJECT
// ============================================================================
var AG_ExplorerManager = {
    // ========================================================================
    // CONFIGURATION (with defaults)
    // ========================================================================
    config: {
        // Mode: "explorer" or "geologist" or "both"
        mode: "explorer",

        // Explorer settings
        explorerTaskCategory: "treasure",  // "treasure" or "adventure"
        explorerTaskId: 0,                 // Index in the task array

        // Geologist settings
        geologistResourceId: 0,            // Resource to search (0-8)

        // Timing settings (milliseconds)
        intervalMin: 180000,               // 3 minutes
        intervalMax: 300000,               // 5 minutes
        delayMin: 2000,                    // 2 seconds between specialists
        delayMax: 4000                     // 4 seconds between specialists
    },

    // Constants
    LOG_CHANNEL: "news",
    LOG_SENDER: "AG_Explorer",
    SETTINGS_KEY: "AG_ExplorerManager",

    // ========================================================================
    // INITIALIZATION
    // ========================================================================
    init: function () {
        try {
            // Load saved settings
            this.loadSettings();

            // Add menu items
            addToolsMenuItem("Explorer Manager: Start/Stop", AG_ExplorerManager_Toggle);
            addToolsMenuItem("Explorer Manager: Settings", AG_ExplorerManager_Settings);

            this.log("Script loaded. Use menu to Start/Stop or open Settings.");
            this.log("Current state: " + (window.AG_ExplorerManager_IsRunning ? "RUNNING" : "STOPPED"));
            this.log("Mode: " + this.config.mode);
        } catch (e) {
            this.log("Error init: " + e);
        }
    },

    // ========================================================================
    // SETTINGS PERSISTENCE
    // ========================================================================
    loadSettings: function () {
        try {
            var saved = settings.read(this.SETTINGS_KEY);
            if (saved) {
                // Merge saved settings with defaults
                for (var key in saved) {
                    if (this.config.hasOwnProperty(key)) {
                        this.config[key] = saved[key];
                    }
                }
                this.log("Settings loaded.");
            }
        } catch (e) {
            this.log("Error loading settings: " + e);
        }
    },

    saveSettings: function () {
        try {
            var dataToSave = {};
            dataToSave[this.SETTINGS_KEY] = this.config;
            settings.store(dataToSave);
            this.log("Settings saved.");
        } catch (e) {
            this.log("Error saving settings: " + e);
        }
    },

    // ========================================================================
    // SETTINGS UI
    // ========================================================================
    showSettings: function () {
        var _this = this;

        try {
            var modal = new Modal("AG_ExplorerSettings", "🔧 Explorer Manager Settings", false);
            modal.create();

            // Build HTML content
            var html = '<div class="container-fluid" style="padding: 15px;">';

            // Mode Selection
            html += '<div class="row" style="margin-bottom: 15px;">';
            html += '<div class="col-md-4"><strong>Mode:</strong></div>';
            html += '<div class="col-md-8">';
            html += '<select id="ag_mode" class="form-control">';
            html += '<option value="explorer"' + (this.config.mode === "explorer" ? ' selected' : '') + '>Explorer Only</option>';
            html += '<option value="geologist"' + (this.config.mode === "geologist" ? ' selected' : '') + '>Geologist Only</option>';
            html += '<option value="both"' + (this.config.mode === "both" ? ' selected' : '') + '>Both</option>';
            html += '</select>';
            html += '</div></div>';

            // Explorer Task Category
            html += '<div class="row" style="margin-bottom: 15px;" id="ag_explorer_section">';
            html += '<div class="col-md-4"><strong>Explorer Task:</strong></div>';
            html += '<div class="col-md-4">';
            html += '<select id="ag_explorer_category" class="form-control">';
            html += '<option value="treasure"' + (this.config.explorerTaskCategory === "treasure" ? ' selected' : '') + '>Treasure Hunt</option>';
            html += '<option value="adventure"' + (this.config.explorerTaskCategory === "adventure" ? ' selected' : '') + '>Adventure Zone</option>';
            html += '</select>';
            html += '</div>';
            html += '<div class="col-md-4">';
            html += '<select id="ag_explorer_task" class="form-control">';
            html += this.buildExplorerTaskOptions();
            html += '</select>';
            html += '</div></div>';

            // Geologist Resource
            html += '<div class="row" style="margin-bottom: 15px;" id="ag_geologist_section">';
            html += '<div class="col-md-4"><strong>Geologist Resource:</strong></div>';
            html += '<div class="col-md-8">';
            html += '<select id="ag_geologist_resource" class="form-control">';
            html += this.buildGeologistResourceOptions();
            html += '</select>';
            html += '</div></div>';

            // Separator
            html += '<hr style="margin: 20px 0;">';

            // Interval Settings
            html += '<div class="row" style="margin-bottom: 10px;">';
            html += '<div class="col-md-12"><strong>Check Interval (minutes):</strong></div>';
            html += '</div>';
            html += '<div class="row" style="margin-bottom: 15px;">';
            html += '<div class="col-md-6">';
            html += '<label>Min: <span id="ag_interval_min_label">' + Math.floor(this.config.intervalMin / 60000) + '</span> min</label>';
            html += '<input type="range" id="ag_interval_min" class="form-control" min="1" max="30" value="' + Math.floor(this.config.intervalMin / 60000) + '">';
            html += '</div>';
            html += '<div class="col-md-6">';
            html += '<label>Max: <span id="ag_interval_max_label">' + Math.floor(this.config.intervalMax / 60000) + '</span> min</label>';
            html += '<input type="range" id="ag_interval_max" class="form-control" min="1" max="30" value="' + Math.floor(this.config.intervalMax / 60000) + '">';
            html += '</div></div>';

            // Delay Settings
            html += '<div class="row" style="margin-bottom: 10px;">';
            html += '<div class="col-md-12"><strong>Delay Between Specialists (seconds):</strong></div>';
            html += '</div>';
            html += '<div class="row" style="margin-bottom: 15px;">';
            html += '<div class="col-md-6">';
            html += '<label>Min: <span id="ag_delay_min_label">' + Math.floor(this.config.delayMin / 1000) + '</span> sec</label>';
            html += '<input type="range" id="ag_delay_min" class="form-control" min="1" max="30" value="' + Math.floor(this.config.delayMin / 1000) + '">';
            html += '</div>';
            html += '<div class="col-md-6">';
            html += '<label>Max: <span id="ag_delay_max_label">' + Math.floor(this.config.delayMax / 1000) + '</span> sec</label>';
            html += '<input type="range" id="ag_delay_max" class="form-control" min="1" max="30" value="' + Math.floor(this.config.delayMax / 1000) + '">';
            html += '</div></div>';

            // Status Info
            html += '<hr style="margin: 20px 0;">';
            html += '<div class="row">';
            html += '<div class="col-md-12">';
            html += '<div class="alert alert-info" style="margin-bottom: 0;">';
            html += '<strong>Status:</strong> ' + (window.AG_ExplorerManager_IsRunning ? '<span style="color: green;">RUNNING</span>' : '<span style="color: red;">STOPPED</span>');
            html += '</div>';
            html += '</div></div>';

            html += '</div>';

            modal.Body().html(html);

            // Add Save button to footer
            modal.Footer().prepend(
                $('<button>')
                    .attr({ "class": "btn btn-success", "id": "ag_save_settings" })
                    .text("💾 Save Settings")
            );

            // Event Handlers
            $('#ag_mode').change(function () {
                var mode = $(this).val();
                if (mode === "explorer") {
                    $('#ag_explorer_section').show();
                    $('#ag_geologist_section').hide();
                } else if (mode === "geologist") {
                    $('#ag_explorer_section').hide();
                    $('#ag_geologist_section').show();
                } else {
                    $('#ag_explorer_section').show();
                    $('#ag_geologist_section').show();
                }
            });

            // Trigger initial visibility
            $('#ag_mode').trigger('change');

            // Explorer category change -> update task dropdown
            $('#ag_explorer_category').change(function () {
                $('#ag_explorer_task').html(_this.buildExplorerTaskOptions($(this).val()));
            });

            // Slider label updates
            $('#ag_interval_min').on('input', function () {
                $('#ag_interval_min_label').text($(this).val());
            });
            $('#ag_interval_max').on('input', function () {
                $('#ag_interval_max_label').text($(this).val());
            });
            $('#ag_delay_min').on('input', function () {
                $('#ag_delay_min_label').text($(this).val());
            });
            $('#ag_delay_max').on('input', function () {
                $('#ag_delay_max_label').text($(this).val());
            });

            // Save button handler
            $('#ag_save_settings').click(function () {
                _this.config.mode = $('#ag_mode').val();
                _this.config.explorerTaskCategory = $('#ag_explorer_category').val();
                _this.config.explorerTaskId = parseInt($('#ag_explorer_task').val());
                _this.config.geologistResourceId = parseInt($('#ag_geologist_resource').val());
                _this.config.intervalMin = parseInt($('#ag_interval_min').val()) * 60000;
                _this.config.intervalMax = parseInt($('#ag_interval_max').val()) * 60000;
                _this.config.delayMin = parseInt($('#ag_delay_min').val()) * 1000;
                _this.config.delayMax = parseInt($('#ag_delay_max').val()) * 1000;

                // Validate min <= max
                if (_this.config.intervalMin > _this.config.intervalMax) {
                    _this.config.intervalMax = _this.config.intervalMin;
                }
                if (_this.config.delayMin > _this.config.delayMax) {
                    _this.config.delayMax = _this.config.delayMin;
                }

                _this.saveSettings();
                $('#AG_ExplorerSettings').modal('hide');
                game.showAlert("Explorer Manager: Settings saved!");
            });

            modal.show();

        } catch (e) {
            this.log("Error showing settings: " + e);
            game.showAlert("Error opening settings: " + e);
        }
    },

    buildExplorerTaskOptions: function (category) {
        category = category || this.config.explorerTaskCategory;
        var tasks = AG_TASK_DEFINITIONS.explorer[category];
        var playerLevel = 99; // Default high level

        try {
            playerLevel = game.player.GetPlayerLevel();
        } catch (e) { }

        var html = '';
        for (var i = 0; i < tasks.length; i++) {
            if (playerLevel >= tasks[i].reqLevel) {
                var selected = (category === this.config.explorerTaskCategory && i === this.config.explorerTaskId) ? ' selected' : '';
                html += '<option value="' + i + '"' + selected + '>' + tasks[i].name + '</option>';
            }
        }
        return html;
    },

    buildGeologistResourceOptions: function () {
        var resources = AG_TASK_DEFINITIONS.geologist;
        var playerLevel = 99;

        try {
            playerLevel = game.player.GetPlayerLevel();
        } catch (e) { }

        var html = '';
        for (var i = 0; i < resources.length; i++) {
            if (playerLevel >= resources[i].reqLevel) {
                var selected = (i === this.config.geologistResourceId) ? ' selected' : '';
                html += '<option value="' + i + '"' + selected + '>' + resources[i].name + '</option>';
            }
        }
        return html;
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
        this.log("Toggle called. Current state: " + (window.AG_ExplorerManager_IsRunning ? "RUNNING" : "STOPPED"));

        if (window.AG_ExplorerManager_IsRunning) {
            this.stop();
        } else {
            this.start();
        }
    },

    start: function () {
        var _this = this;

        if (window.AG_ExplorerManager_IsRunning) {
            this.log("Already running. TimerID: " + window.AG_ExplorerManager_TimerID);
            return;
        }

        this.log("Starting Explorer Manager...");
        this.log("Mode: " + this.config.mode);

        // Clear any orphan timer first
        if (window.AG_ExplorerManager_TimerID !== null) {
            this.log("Clearing orphan timer: " + window.AG_ExplorerManager_TimerID);
            clearTimeout(window.AG_ExplorerManager_TimerID);
            window.AG_ExplorerManager_TimerID = null;
        }

        window.AG_ExplorerManager_IsRunning = true;

        // Run once immediately
        this.log("Running initial check...");
        this.run();

        this.log("Started successfully!");
        game.showAlert("Explorer Manager: Started (" + this.config.mode + " mode)");
    },

    scheduleNextRun: function () {
        var _this = this;

        if (!window.AG_ExplorerManager_IsRunning) {
            return;
        }

        var nextInterval = this.getRandomInt(this.config.intervalMin, this.config.intervalMax);
        this.log("Next check in: " + this.formatDuration(nextInterval));

        window.AG_ExplorerManager_TimerID = setTimeout(function () {
            _this.run();
        }, nextInterval);
    },

    stop: function () {
        this.log("Stopping Explorer Manager...");

        if (window.AG_ExplorerManager_TimerID !== null) {
            clearTimeout(window.AG_ExplorerManager_TimerID);
            this.log("Timer " + window.AG_ExplorerManager_TimerID + " cleared.");
            window.AG_ExplorerManager_TimerID = null;
        }

        window.AG_ExplorerManager_IsRunning = false;
        this.log("Stopped.");
        game.showAlert("Explorer Manager: Stopped");
    },

    // ========================================================================
    // MAIN RUN LOOP
    // ========================================================================
    run: function () {
        try {
            this.log("=== Checking for idle specialists ===");

            if (!game || !game.gi || !game.gi.mCurrentPlayerZone) {
                this.log("ERROR: Game zone not available!");
                this.scheduleNextRun();
                return;
            }

            var allSpecialists = [];

            // Get explorers if mode includes them
            if (this.config.mode === "explorer" || this.config.mode === "both") {
                var idleExplorers = this.getIdleSpecialists(1); // baseType 1 = Explorer
                this.log("Found " + idleExplorers.length + " idle explorer(s).");
                allSpecialists = allSpecialists.concat(idleExplorers.map(function (e) {
                    return { specialist: e, type: "explorer" };
                }));
            }

            // Get geologists if mode includes them
            if (this.config.mode === "geologist" || this.config.mode === "both") {
                var idleGeologists = this.getIdleSpecialists(2); // baseType 2 = Geologist
                this.log("Found " + idleGeologists.length + " idle geologist(s).");
                allSpecialists = allSpecialists.concat(idleGeologists.map(function (g) {
                    return { specialist: g, type: "geologist" };
                }));
            }

            if (allSpecialists.length > 0) {
                this.log("Sending " + allSpecialists.length + " specialist(s) on tasks...");
                this.sendSpecialists(allSpecialists);
            } else {
                this.log("No idle specialists found.");
                this.scheduleNextRun();
            }
        } catch (e) {
            this.log("ERROR in run: " + e);
            this.scheduleNextRun();
        }
    },

    // ========================================================================
    // GET IDLE SPECIALISTS
    // ========================================================================
    getIdleSpecialists: function (baseType) {
        var specialists = [];
        var _this = this;

        try {
            var allSpecialists = game.gi.mCurrentPlayerZone.GetSpecialists_vector();
            this.log("Total specialists in zone: " + allSpecialists.length);

            allSpecialists.forEach(function (item) {
                try {
                    var itemBaseType = item.GetBaseType();
                    var task = item.GetTask();
                    var playerID = item.getPlayerID();

                    if (itemBaseType === baseType && playerID !== -1) {
                        if (task === null) {
                            specialists.push(item);
                            var typeName = baseType === 1 ? "Explorer" : "Geologist";
                            _this.log("  -> Idle " + typeName + ": " + item.getName(false));
                        }
                    }
                } catch (itemErr) {
                    // Skip problematic items
                }
            });
        } catch (e) {
            this.log("Error getting specialists: " + e);
        }

        return specialists;
    },

    // ========================================================================
    // SEND SPECIALISTS
    // ========================================================================
    sendSpecialists: function (specialists) {
        var _this = this;
        var index = 0;

        function sendNext() {
            if (index >= specialists.length) {
                _this.log("All " + specialists.length + " specialist(s) sent.");
                _this.scheduleNextRun();
                return;
            }

            var item = specialists[index];

            if (item.type === "explorer") {
                _this.sendExplorerTask(item.specialist);
            } else if (item.type === "geologist") {
                _this.sendGeologistTask(item.specialist);
            }

            index++;

            if (index < specialists.length) {
                var delay = _this.getRandomInt(_this.config.delayMin, _this.config.delayMax);
                _this.log("Waiting " + _this.formatDuration(delay) + " before next specialist...");
                setTimeout(sendNext, delay);
            } else {
                _this.log("All " + specialists.length + " specialist(s) sent.");
                _this.scheduleNextRun();
            }
        }

        sendNext();
    },

    // ========================================================================
    // SEND EXPLORER TASK
    // ========================================================================
    sendExplorerTask: function (explorer) {
        try {
            var taskDef = AG_TASK_DEFINITIONS.explorer[this.config.explorerTaskCategory][this.config.explorerTaskId];

            if (!taskDef) {
                this.log("ERROR: Invalid explorer task configuration!");
                return;
            }

            var specTask = game.def("Communication.VO::dStartSpecialistTaskVO", true);
            specTask.subTaskID = taskDef.subTask;
            specTask.paramString = "";
            specTask.uniqueID = explorer.GetUniqueID();

            game.gi.SendServerAction(95, taskDef.taskType, 0, 0, specTask);
            this.log("Sent: " + explorer.getName(false) + " -> " + taskDef.name);
        } catch (ex) {
            this.log("ERROR sending explorer " + explorer.getName(false) + ": " + ex);
        }
    },

    // ========================================================================
    // SEND GEOLOGIST TASK
    // ========================================================================
    sendGeologistTask: function (geologist) {
        try {
            var resourceDef = AG_TASK_DEFINITIONS.geologist[this.config.geologistResourceId];

            if (!resourceDef) {
                this.log("ERROR: Invalid geologist resource configuration!");
                return;
            }

            var specTask = game.def("Communication.VO::dStartSpecialistTaskVO", true);
            specTask.subTaskID = resourceDef.subTask;
            specTask.paramString = "";
            specTask.uniqueID = geologist.GetUniqueID();

            game.gi.SendServerAction(95, resourceDef.taskType, 0, 0, specTask);
            this.log("Sent: " + geologist.getName(false) + " -> Find " + resourceDef.name);
        } catch (ex) {
            this.log("ERROR sending geologist " + geologist.getName(false) + ": " + ex);
        }
    },

    // ========================================================================
    // STATUS
    // ========================================================================
    status: function () {
        this.log("=== STATUS ===");
        this.log("IsRunning: " + window.AG_ExplorerManager_IsRunning);
        this.log("TimerID: " + window.AG_ExplorerManager_TimerID);
        this.log("Mode: " + this.config.mode);
        this.log("Check Interval: " + this.formatDuration(this.config.intervalMin) + " - " + this.formatDuration(this.config.intervalMax));
        this.log("Send Delay: " + this.formatDuration(this.config.delayMin) + " - " + this.formatDuration(this.config.delayMax));

        if (this.config.mode === "explorer" || this.config.mode === "both") {
            var taskDef = AG_TASK_DEFINITIONS.explorer[this.config.explorerTaskCategory][this.config.explorerTaskId];
            this.log("Explorer Task: " + (taskDef ? taskDef.name : "Unknown"));
        }

        if (this.config.mode === "geologist" || this.config.mode === "both") {
            var resDef = AG_TASK_DEFINITIONS.geologist[this.config.geologistResourceId];
            this.log("Geologist Resource: " + (resDef ? resDef.name : "Unknown"));
        }
    }
};

// ============================================================================
// INITIALIZE
// ============================================================================
AG_ExplorerManager.init();

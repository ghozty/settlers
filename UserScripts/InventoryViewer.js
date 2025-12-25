////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Inventory Viewer - v3.2                                                                                                //
// A simplified script for listing all items from Star Menu and Storage/Inventory.                                        //
// Two tabs only: Star Menu (Buffs, Boosters, Items) and Inventory (Warehouse Resources).                                 //
// Features: Search, Sort, Refresh, and Export to clipboard.                                                              //
// v3.2 Changes:                                                                                                          //
//   - Extract actual resource names from "Add Resource" and "Fill Deposit" items                                         //
//   - Show resource category (Food, Resources, etc.) instead of generic "Resource Item"                                  //
//   - Better resource detection from buff definitions                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

addToolsMenuItem("Inventory Viewer", InventoryViewerHandler);

var _inventoryViewerModalInitialized = false;
var _inventorySearchString = '';
var _inventoryActiveTab = 'starmenu';
var _inventorySortConfig = { key: 'amount', dir: -1 };

// ===========================================
// RESOURCE DATABASE (for categorization)
// ===========================================
var RESOURCE_DB = {
    // --- BUILDING MATERIALS ---
    "AdvancedTools": "Building Materials", "Money": "Building Materials", "StarCoins": "Building Materials",
    "StarCoin": "Building Materials", "Starcoin": "Building Materials", "starcoins": "Building Materials",
    "GuildCoins": "Building Materials", "GuildCoin": "Building Materials",
    "ExoticWoodPlank": "Building Materials", "ExoticPlank": "Building Materials",
    "Granite": "Building Materials", "Grout": "Building Materials", "HardWoodPlank": "Building Materials",
    "MahoganyPlank": "Building Materials", "Marble": "Building Materials", "Oil": "Building Materials",
    "Plank": "Building Materials", "Stone": "Building Materials", "Tools": "Building Materials",
    "Tool": "Building Materials", "RealWood": "Building Materials", "RealPlank": "Building Materials",
    "RealStone": "Building Materials", "Gems": "Building Materials", "Gem": "Building Materials",
    // --- FOOD ---
    "Bread": "Food", "Brew": "Food", "Beer": "Food", "Fish": "Food", "Sausage": "Food", "Meat": "Food",
    // --- RESOURCES (Ores & Raw Materials) ---
    "Bronze": "Resources", "BronzeOre": "Resources", "Carriage": "Resources", "Coal": "Resources",
    "ExoticWood": "Resources", "Flour": "Resources", "Gold": "Resources", "GoldOre": "Resources",
    "Gunpowder": "Resources", "HardWood": "Resources", "Iron": "Resources", "IronOre": "Resources",
    "MagicBean": "Resources", "MagicBeanStalk": "Resources", "MagicBeanstalk": "Resources",
    "MahoganyWood": "Resources", "Oilseed": "Resources", "Wood": "Resources", "Platinum": "Resources",
    "PlatinumOre": "Resources", "SaddleCloth": "Resources", "Saddlecloth": "Resources", "Salpeter": "Resources",
    "Steel": "Resources", "Titanium": "Resources", "TitaniumOre": "Resources", "Wagon": "Resources",
    "Water": "Resources", "Corn": "Resources", "Wheel": "Resources", "Wool": "Resources",
    "WoolenCloth": "Resources", "Cloth": "Resources", "Pumpkin": "Resources", "Coin": "Resources", "Coins": "Resources",
    "Copper": "Resources", "CopperOre": "Resources", "Silver": "Resources", "SilverOre": "Resources",
    // --- SCIENCE ---
    "AdvancedPaper": "Science", "BookFitting": "Science", "IntermediatePaper": "Science", "Nib": "Science",
    "Printingpressletter": "Science", "Letter": "Science", "Paper": "Science", "SimplePaper": "Science",
    "BookManuscript": "Science", "BookTome": "Science", "BookCodex": "Science",
    // --- WEAPONS ---
    "Archebuse": "Weapons", "Bow": "Weapons", "Bow_2": "Weapons", "CompositeBow": "Weapons", "Pike": "Weapons",
    "Saber": "Weapons", "BattleHorse": "Weapons", "BronzeSword": "Weapons", "Cannon": "Weapons",
    "Crossbow": "Weapons", "Crossbow_2": "Weapons", "ExpeditionCrossbow": "Weapons", "DamasceneSword": "Weapons",
    "BattleLance": "Weapons", "SpikedMace": "Weapons", "Lance": "Weapons", "Mace": "Weapons", "Horse": "Weapons",
    "IronSword": "Weapons", "Longbow": "Weapons", "Mortar": "Weapons", "PlatinumSword": "Weapons",
    "SteelSword": "Weapons", "TitaniumSword": "Weapons",
    // --- SPECIAL ---
    "MapPart": "Special", "CollectibleAdamantium": "Special", "CollectibleBanner": "Special"
};

// ===========================================
// MAIN HANDLER
// ===========================================
function InventoryViewerHandler(event) {
    try {
        $('div[role="dialog"]:not(#inventoryViewerModal):visible').modal('hide');
        if (!_inventoryViewerModalInitialized) {
            $('#inventoryViewerModal').remove();
            createModalWindow('inventoryViewerModal', "Inventory Viewer");
            _inventoryViewerModalInitialized = true;
        }
        _renderInventoryModal();
        $('#inventoryViewerModal:not(:visible)').modal({ backdrop: 'static' });
    } catch (e) {
        alert("Inventory Viewer Error: " + e.message);
    }
}


// ===========================================
// RENDER FUNCTIONS
// ===========================================
function _renderInventoryModal() {
    // Header with 2 tabs only
    $('#inventoryViewerModal .modal-header').html(
        '<div class="container-fluid">' +
        '<h4 style="margin-bottom: 15px;">📦 Inventory Viewer</h4>' +
        '<div class="btn-group" role="group" style="margin-bottom: 10px;">' +
        '<button type="button" class="btn btn-sm inv-tab-btn' + (_inventoryActiveTab === 'starmenu' ? ' btn-primary' : ' btn-default') + '" data-tab="starmenu">🎁 Star Menu</button>' +
        '<button type="button" class="btn btn-sm inv-tab-btn' + (_inventoryActiveTab === 'inventory' ? ' btn-primary' : ' btn-default') + '" data-tab="inventory">🏭 Inventory</button>' +
        '</div>' +
        '<div id="inventorySearchDiv"><b>Search:</b>&emsp;' +
        '<input type="text" id="inventorySearchInput" class="form-control" style="display: inline; width: 300px;" placeholder="Type to search..." value="' + _inventorySearchString + '">' +
        '</div>' +
        '</div>'
    );

    // Tab click handlers
    $('.inv-tab-btn').off('click').on('click', function () {
        _inventoryActiveTab = $(this).data('tab');
        _renderInventoryModal();
    });

    // Search handler
    $('#inventorySearchInput').off('keyup').on('keyup', function (e) {
        _inventorySearchString = $(e.target).val();
        _filterInventoryList();
    });

    // Render active tab content
    _renderInventoryTabContent();

    // Footer
    $("#inventoryViewerModal .modal-footer").html('');
    $("#inventoryViewerModal .modal-footer").prepend([
        $('<button>').attr({ "class": "btn btn-warning pull-left", "id": "debugInventoryBtn" }).text("� DEebug"),
        $('<button>').attr({ "class": "btn btn-success pull-left", "id": "exportInventoryBtn" }).text("📋 Export"),
        $('<button>').attr({ "class": "btn btn-primary refreshInventory" }).text("🔄 Refresh"),
        $('<button>').attr({ "class": "btn btn-danger btnClose" }).text("Close")
    ]);

    $('#inventoryViewerModal .refreshInventory').off('click').on('click', function () { _renderInventoryModal(); });
    $("#inventoryViewerModal .btnClose").off('click').on('click', function (e) { $('#inventoryViewerModal').modal('hide'); });
    $("#exportInventoryBtn").off('click').on('click', function () { _exportInventoryData(); });
    $("#debugInventoryBtn").off('click').on('click', function () { _debugBuffItems(); });
}

function _renderInventoryTabContent() {
    var content = '';
    switch (_inventoryActiveTab) {
        case 'starmenu':
            content = _renderStarMenuTab();
            break;
        case 'inventory':
            content = _renderInventoryTab();
            break;
        default:
            content = _renderStarMenuTab();
    }
    $('#inventoryViewerModalData').html(content);
    _filterInventoryList();
}

// ===========================================
// STAR MENU TAB (Buffs, Boosters, Items)
// ===========================================
function _renderStarMenuTab() {
    var items = _getStarMenuItemsList();

    items.sort(function (a, b) {
        if (a.amount !== b.amount) return b.amount - a.amount;
        return a.localizedName.localeCompare(b.localizedName);
    });

    var out = '<div class="container-fluid">';
    out += '<div class="row" style="font-weight: bold; background: #2c3e50; color: white; padding: 8px; border-radius: 4px;">';
    out += '<div class="col-xs-5">Item Name</div>';
    out += '<div class="col-xs-4">Category</div>';
    out += '<div class="col-xs-3" style="text-align: right;">Stock</div>';
    out += '</div>';

    if (items.length === 0) {
        out += '<div class="row"><div class="col-xs-12" style="padding: 20px; text-align: center; color: #888;">No items found in Star Menu.</div></div>';
    } else {
        items.forEach(function (item, idx) {
            var bgColor = idx % 2 === 0 ? '#1a1a2e' : '#16213e';
            out += '<div class="row inv-item-row" style="background: ' + bgColor + '; padding: 6px; border-bottom: 1px solid #333;">';
            out += '<div class="col-xs-5">' + _escapeHtml(item.localizedName) + '</div>';
            out += '<div class="col-xs-4"><span class="label label-' + _getCategoryColor(item.category) + '">' + item.category + '</span></div>';
            out += '<div class="col-xs-3" style="text-align: right; font-weight: bold; color: #27ae60;">' + item.amount.toLocaleString() + '</div>';
            out += '</div>';
        });
    }
    out += '</div>';
    out += '<div style="margin-top: 10px; font-size: 12px; color: #888;">Total: ' + items.length + ' item types</div>';
    return out;
}

function _getStarMenuItemsList() {
    var itemList = [];
    try {
        var buffVector = null;
        
        // Try different access paths
        if (typeof game !== 'undefined' && game.gi && game.gi.mCurrentPlayer && game.gi.mCurrentPlayer.getAvailableBuffs_vector) {
            buffVector = game.gi.mCurrentPlayer.getAvailableBuffs_vector();
        } else if (typeof swmmo !== 'undefined' && swmmo.application && swmmo.application.mGameInterface && 
                   swmmo.application.mGameInterface.mCurrentPlayer && swmmo.application.mGameInterface.mCurrentPlayer.getAvailableBuffs_vector) {
            buffVector = swmmo.application.mGameInterface.mCurrentPlayer.getAvailableBuffs_vector();
        }

        if (buffVector && buffVector.length > 0) {
            for (var i = 0; i < buffVector.length; i++) {
                try {
                    var item = buffVector[i];
                    if (!item) continue;
                    
                    var amount = item.GetAmount ? item.GetAmount() : 0;
                    if (amount <= 0) continue;
                    
                    var def = item.GetBuffDefinition ? item.GetBuffDefinition() : null;
                    if (!def) continue;
                    
                    var codeName = def.GetName_string ? def.GetName_string() : "Unknown";
                    
                    // Check if this is a resource/deposit item and extract the actual resource name
                    var resourceInfo = _extractResourceFromBuff(def, item, codeName);
                    
                    var localName, category;
                    if (resourceInfo.isResource) {
                        localName = resourceInfo.resourceName;
                        category = resourceInfo.category;
                    } else {
                        localName = _getLocalizedItemName(codeName, def, item);
                        category = _getBuffCategory(codeName);
                    }
                    
                    itemList.push({
                        'name_key': codeName,
                        'localizedName': localName,
                        'category': category,
                        'amount': amount
                    });
                } catch (err) { continue; }
            }
        }
    } catch (e) {
        console.error("Star Menu items list error:", e);
    }
    return itemList;
}

// Extract resource name from Add Resource / Fill Deposit buffs
function _extractResourceFromBuff(def, item, codeName) {
    var result = { isResource: false, resourceName: codeName, category: "Other" };
    
    try {
        var lowerName = codeName.toLowerCase();
        var isAddResource = lowerName.indexOf("addresource") !== -1 || lowerName.indexOf("add_resource") !== -1;
        var isDeposit = lowerName.indexOf("deposit") !== -1 || lowerName.indexOf("addcontent") !== -1 || lowerName.indexOf("filldeposit") !== -1;
        
        if (!isAddResource && !isDeposit) {
            return result;
        }
        
        result.isResource = true;
        var resourceName = null;
        
        // PRIMARY METHOD: Parse from item.toString() which contains resourceName='XXX'
        try {
            if (item && typeof item.toString === 'function') {
                var itemStr = item.toString();
                // Look for resourceName='XXX' pattern
                var match = itemStr.match(/resourceName='([^']+)'/);
                if (match && match[1]) {
                    resourceName = match[1];
                }
            }
        } catch (e) { }
        
        // Fallback: Try other methods if toString didn't work
        if (!resourceName) {
            try {
                if (def.GetResourceName) resourceName = def.GetResourceName();
            } catch (e) { }
        }
        if (!resourceName) {
            try {
                if (item.GetResourceName) resourceName = item.GetResourceName();
            } catch (e) { }
        }
        
        // Get localized resource name and category
        if (resourceName) {
            var localizedRes = resourceName;
            try {
                var loc = loca.GetText("RES", resourceName);
                if (loc && loc.indexOf("undefined") === -1 && loc.indexOf("{") === -1 && loc !== resourceName) {
                    localizedRes = loc;
                }
            } catch (e) { }
            
            // For deposits, append "(Deposit)" to the name
            if (isDeposit) {
                result.resourceName = localizedRes + " (Deposit)";
                // Category shows resource type + (Deposit)
                var baseCategory = RESOURCE_DB[resourceName] || "Resource";
                result.category = baseCategory + " (Deposit)";
            } else {
                result.resourceName = localizedRes;
                result.category = RESOURCE_DB[resourceName] || "Resource";
            }
        } else {
            // No resource name found
            if (isDeposit) {
                // This is "Any Deposit" - can be used on any mine
                result.resourceName = "Any Deposit";
                result.category = "Universal Deposit";
            } else {
                result.resourceName = "Unknown Resource";
                result.category = "Resource";
            }
        }
        
    } catch (e) {
        console.error("Extract resource error:", e);
    }
    
    return result;
}

// Try multiple localization categories to get the best name
function _getLocalizedItemName(codeName, def, item) {
    var localName = codeName;
    var foundName = null;
    
    // List of loca categories to try (in order of preference)
    var locaCategories = ["RES", "BUF", "BUFF", "ADV", "ITM", "ITEM", "LAB", "TXT", "GUI", "DEP"];
    
    // Method 1: Try GetLocalizedName if available on definition
    try {
        if (def && def.GetLocalizedName) {
            var defName = def.GetLocalizedName();
            if (defName && defName.length > 0 && defName.indexOf("undefined") === -1 && defName.indexOf("{") === -1) {
                return defName;
            }
        }
    } catch (e) { }
    
    // Method 2: Try GetDisplayName if available
    try {
        if (def && def.GetDisplayName) {
            var dispName = def.GetDisplayName();
            if (dispName && dispName.length > 0 && dispName.indexOf("undefined") === -1 && dispName.indexOf("{") === -1) {
                return dispName;
            }
        }
    } catch (e) { }
    
    // Method 3: Try item's own GetName methods
    try {
        if (item && item.GetLocalizedName) {
            var itemName = item.GetLocalizedName();
            if (itemName && itemName.length > 0 && itemName.indexOf("undefined") === -1 && itemName.indexOf("{") === -1) {
                return itemName;
            }
        }
    } catch (e) { }
    
    // Method 4: Try loca.GetText with multiple categories
    for (var i = 0; i < locaCategories.length; i++) {
        try {
            var loc = loca.GetText(locaCategories[i], codeName);
            if (loc && loc.length > 0 && loc !== codeName && loc.indexOf("undefined") === -1 && loc.indexOf("{") === -1) {
                foundName = loc;
                break;
            }
        } catch (e) { }
    }
    
    if (foundName) {
        return foundName;
    }
    
    // Method 5: Try to extract a cleaner name from the code name
    // Handle patterns like "Adventure_SomeName" or "Buff_SomeName"
    var cleanName = _cleanupCodeName(codeName);
    if (cleanName !== codeName) {
        // Try localization with cleaned name
        for (var j = 0; j < locaCategories.length; j++) {
            try {
                var loc2 = loca.GetText(locaCategories[j], cleanName);
                if (loc2 && loc2.length > 0 && loc2 !== cleanName && loc2.indexOf("undefined") === -1 && loc2.indexOf("{") === -1) {
                    return loc2;
                }
            } catch (e) { }
        }
        return cleanName; // Return cleaned name if no localization found
    }
    
    return localName;
}

// Clean up code names to make them more readable
function _cleanupCodeName(codeName) {
    if (!codeName) return codeName;
    
    var name = codeName;
    
    // Remove common prefixes
    var prefixes = ["Buff_", "Adventure_", "Item_", "Deposit_", "Resource_", "Building_", 
                    "MultiplierBuff", "ProductivityBuff", "RecruitingBuff", "ProvisionerBuff",
                    "BookbinderBuff", "AreaBuff", "RemoveBuff"];
    
    for (var i = 0; i < prefixes.length; i++) {
        if (name.indexOf(prefixes[i]) === 0) {
            name = name.substring(prefixes[i].length);
            break;
        }
    }
    
    // Remove common suffixes like "_1Day", "_7Days", etc.
    name = name.replace(/_\d+Days?$/i, "");
    name = name.replace(/_\d+Hours?$/i, "");
    
    // Convert CamelCase to spaces
    name = name.replace(/([a-z])([A-Z])/g, '$1 $2');
    
    // Replace underscores with spaces
    name = name.replace(/_/g, ' ');
    
    // Clean up multiple spaces
    name = name.replace(/\s+/g, ' ').trim();
    
    return name;
}

function _getBuffCategory(buffName) {
    if (!buffName) return "Other";
    var name = buffName.toLowerCase();
    
    // Note: Deposits and Resources are handled separately in _extractResourceFromBuff
    // These are fallback categories if extraction fails
    if (name.indexOf("deposit") !== -1 || name.indexOf("addcontent") !== -1 || name.indexOf("filldeposit") !== -1) return "Deposit";
    if (name.indexOf("addresource") !== -1 || name.indexOf("add_resource") !== -1) return "Resource";
    
    // Adventures
    if (name.indexOf("adventure") !== -1 || name.indexOf("quest") !== -1) return "Adventure";
    
    // Buffs by type
    if (name.indexOf("productivity") !== -1) return "Productivity Buff";
    if (name.indexOf("recruiting") !== -1) return "Recruiting Buff";
    if (name.indexOf("provisioner") !== -1) return "Provisioner Buff";
    if (name.indexOf("bookbinder") !== -1) return "Bookbinder Buff";
    if (name.indexOf("area") !== -1 && name.indexOf("buff") !== -1) return "Area Buff";
    if (name.indexOf("remove") !== -1 && name.indexOf("buff") !== -1) return "Remove Buff";
    if (name.indexOf("multiplier") !== -1) return "Multiplier Buff";
    if (name.indexOf("premium") !== -1) return "Premium Buff";
    
    // Specialists
    if (name.indexOf("specialist") !== -1 || name.indexOf("explorer") !== -1 || 
        name.indexOf("geologist") !== -1 || name.indexOf("general") !== -1) return "Specialist";
    
    // Buildings and Decorations
    if (name.indexOf("decoration") !== -1 || name.indexOf("deco") !== -1) return "Decoration";
    if (name.indexOf("building") !== -1) return "Building";
    
    // Generic buff/booster
    if (name.indexOf("boost") !== -1) return "Booster";
    if (name.indexOf("buff") !== -1) return "Buff";
    
    return "Other";
}


// ===========================================
// INVENTORY TAB (Storage/Warehouse Resources)
// ===========================================
function _renderInventoryTab() {
    var resources = _getResourceList();

    // Sort resources by amount descending
    resources.sort(function (a, b) {
        if (a.amount !== b.amount) return b.amount - a.amount;
        return a.localizedName.localeCompare(b.localizedName);
    });

    var out = '<div class="container-fluid">';
    out += '<div class="row" style="font-weight: bold; background: #2c3e50; color: white; padding: 8px; border-radius: 4px;">';
    out += '<div class="col-xs-5">Resource Name</div>';
    out += '<div class="col-xs-4">Category</div>';
    out += '<div class="col-xs-3" style="text-align: right;">Amount</div>';
    out += '</div>';

    if (resources.length === 0) {
        out += '<div class="row"><div class="col-xs-12" style="padding: 20px; text-align: center; color: #888;">No resources found in warehouse.</div></div>';
    } else {
        resources.forEach(function (item, idx) {
            var bgColor = idx % 2 === 0 ? '#1a1a2e' : '#16213e';
            out += '<div class="row inv-item-row" style="background: ' + bgColor + '; padding: 6px; border-bottom: 1px solid #333;">';
            out += '<div class="col-xs-5">' + _escapeHtml(item.localizedName) + '</div>';
            out += '<div class="col-xs-4"><span class="label label-' + _getCategoryColor(item.category) + '">' + item.category + '</span></div>';
            out += '<div class="col-xs-3" style="text-align: right; font-weight: bold; color: #f1c40f;">' + item.amount.toLocaleString() + '</div>';
            out += '</div>';
        });
    }
    out += '</div>';
    out += '<div style="margin-top: 10px; font-size: 12px; color: #888;">Total: ' + resources.length + ' resource types</div>';
    return out;
}

function _getResourceList() {
    var resourceList = [];
    var foundResources = {}; // Track what we've found to avoid duplicates
    
    try {
        var playerID, resourcesObj, zone, player;
        
        // Try different access paths
        if (typeof game !== 'undefined' && game.gi && game.gi.mCurrentPlayer) {
            player = game.gi.mCurrentPlayer;
            playerID = player.GetPlayerId();
            resourcesObj = game.gi.mCurrentPlayerZone.GetResourcesForPlayerID(playerID);
            zone = game.gi.mCurrentPlayerZone;
        } else if (typeof swmmo !== 'undefined' && swmmo.application && swmmo.application.mGameInterface) {
            player = swmmo.application.mGameInterface.mCurrentPlayer;
            playerID = player.GetPlayerId();
            resourcesObj = swmmo.application.mGameInterface.mCurrentPlayerZone.GetResourcesForPlayerID(playerID);
            zone = swmmo.application.mGameInterface.mCurrentPlayerZone;
        }
        
        if (!resourcesObj) {
            console.error("Could not get resources object");
            return resourceList;
        }

        // Special handling for StarCoins - try to get from player object directly
        try {
            var starCoins = 0;
            if (player && player.GetStarCoins) {
                starCoins = player.GetStarCoins();
            } else if (player && player.starCoins) {
                starCoins = player.starCoins;
            } else if (player && player.mStarCoins) {
                starCoins = player.mStarCoins;
            }
            if (starCoins > 0) {
                foundResources["StarCoins"] = true;
                resourceList.push({
                    'name_key': "StarCoins",
                    'localizedName': "Star Coins",
                    'category': "Building Materials",
                    'amount': starCoins
                });
            }
        } catch (e) { /* StarCoins direct access failed */ }

        // Method 1: Check all known resources from RESOURCE_DB
        for (var resName in RESOURCE_DB) {
            try {
                if (foundResources[resName]) continue;
                var resData = resourcesObj.GetPlayerResource(resName);
                if (resData && typeof resData.amount !== 'undefined' && resData.amount > 0) {
                    foundResources[resName] = true;
                    
                    var localName = resName;
                    try { localName = loca.GetText("RES", resName); } catch (e) { }
                    if (!localName || localName.indexOf("undefined") !== -1) localName = resName;

                    resourceList.push({
                        'name_key': resName,
                        'localizedName': localName,
                        'category': RESOURCE_DB[resName],
                        'amount': resData.amount
                    });
                }
            } catch (err) { continue; }
        }
        
        // Method 2: Try to discover resources dynamically from mResourceMap
        try {
            if (resourcesObj.mResourceMap) {
                var resourceMap = resourcesObj.mResourceMap;
                for (var key in resourceMap) {
                    if (foundResources[key]) continue;
                    try {
                        var resData = resourcesObj.GetPlayerResource(key);
                        if (resData && typeof resData.amount !== 'undefined' && resData.amount > 0) {
                            foundResources[key] = true;
                            var localName = key;
                            try { localName = loca.GetText("RES", key); } catch (e) { }
                            if (!localName || localName.indexOf("undefined") !== -1) localName = key;
                            
                            resourceList.push({
                                'name_key': key,
                                'localizedName': localName,
                                'category': RESOURCE_DB[key] || 'Other',
                                'amount': resData.amount
                            });
                        }
                    } catch (err) { continue; }
                }
            }
        } catch (e) { /* Dynamic discovery via mResourceMap failed */ }
        
        // Method 3: Try iterating resourcesObj properties directly
        try {
            for (var prop in resourcesObj) {
                if (typeof resourcesObj[prop] === 'object' && resourcesObj[prop] !== null) {
                    if (resourcesObj[prop].amount && typeof resourcesObj[prop].amount === 'number' && resourcesObj[prop].amount > 0) {
                        if (foundResources[prop]) continue;
                        foundResources[prop] = true;
                        var localName = prop;
                        try { localName = loca.GetText("RES", prop); } catch (e) { }
                        if (!localName || localName.indexOf("undefined") !== -1) localName = prop;
                        
                        resourceList.push({
                            'name_key': prop,
                            'localizedName': localName,
                            'category': RESOURCE_DB[prop] || 'Other',
                            'amount': resourcesObj[prop].amount
                        });
                    }
                }
            }
        } catch (e) { /* Direct property iteration failed */ }
        
        // Method 4: Try GetAllResources if available
        try {
            if (resourcesObj.GetAllResources) {
                var allRes = resourcesObj.GetAllResources();
                if (allRes) {
                    for (var i = 0; i < allRes.length; i++) {
                        var res = allRes[i];
                        var resKey = res.name || res.GetName_string ? res.GetName_string() : null;
                        if (!resKey || foundResources[resKey]) continue;
                        var amt = res.amount || (res.GetAmount ? res.GetAmount() : 0);
                        if (amt <= 0) continue;
                        
                        foundResources[resKey] = true;
                        var localName = resKey;
                        try { localName = loca.GetText("RES", resKey); } catch (e) { }
                        if (!localName || localName.indexOf("undefined") !== -1) localName = resKey;
                        
                        resourceList.push({
                            'name_key': resKey,
                            'localizedName': localName,
                            'category': RESOURCE_DB[resKey] || 'Other',
                            'amount': amt
                        });
                    }
                }
            }
        } catch (e) { /* GetAllResources method failed */ }
        
    } catch (e) {
        console.error("Resource list error:", e);
    }
    return resourceList;
}


// ===========================================
// UTILITY FUNCTIONS
// ===========================================
function _filterInventoryList() {
    if (!_inventorySearchString || _inventorySearchString === "") {
        $('#inventoryViewerModalData .inv-item-row').show();
        return;
    }
    $('#inventoryViewerModalData .inv-item-row').each(function (i, item) {
        var textToSearch = $(item).text().toUpperCase();
        if (textToSearch.indexOf(_inventorySearchString.toUpperCase()) === -1) {
            $(item).hide();
        } else {
            $(item).show();
        }
    });
}

function _getCategoryColor(category) {
    var colors = {
        // Resource categories (for both Inventory and Star Menu resources)
        "Building Materials": "primary",
        "Food": "success",
        "Resources": "info",
        "Science": "warning",
        "Weapons": "danger",
        "Special": "default",
        "Other": "default",
        // Deposit categories (with resource type)
        "Building Materials (Deposit)": "primary",
        "Food (Deposit)": "success",
        "Resources (Deposit)": "info",
        "Science (Deposit)": "warning",
        "Weapons (Deposit)": "danger",
        "Resource (Deposit)": "info",
        "Universal Deposit": "warning",
        // Buff categories
        "Productivity Buff": "success",
        "Recruiting Buff": "info",
        "Provisioner Buff": "warning",
        "Bookbinder Buff": "primary",
        "Area Buff": "danger",
        "Remove Buff": "default",
        "Multiplier Buff": "warning",
        "Premium Buff": "primary",
        "Buff": "success",
        "Booster": "info",
        "Specialist": "warning",
        "Adventure": "danger",
        "Decoration": "primary",
        "Building": "info",
        // Star Menu resource categories
        "Deposit": "success",
        "Resource": "info"
    };
    return colors[category] || "default";
}

function _escapeHtml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function _exportInventoryData() {
    try {
        var starMenuItems = _getStarMenuItemsList();
        var resources = _getResourceList();

        var exportText = "=== INVENTORY EXPORT ===\n";
        exportText += "Date: " + new Date().toLocaleString() + "\n\n";

        exportText += "--- STAR MENU ITEMS (" + starMenuItems.length + ") ---\n";
        starMenuItems.forEach(function (item) {
            exportText += item.localizedName + " | " + item.category + " | " + item.amount.toLocaleString() + "\n";
        });

        exportText += "\n--- INVENTORY/STORAGE (" + resources.length + ") ---\n";
        resources.forEach(function (r) {
            exportText += r.localizedName + " | " + r.category + " | " + r.amount.toLocaleString() + "\n";
        });

        // Show in modal for manual copy
        _showTextModal("Export Data", exportText);

    } catch (e) {
        alert("Export error: " + e.message);
    }
}

// Log initialization
console.log("[InventoryViewer] v3.2 loaded. Access via Tools Menu > Inventory Viewer");

// ===========================================
// DEBUG FUNCTION v2
// ===========================================
function _debugBuffItems() {
    var debugOutput = "=== BUFF DEBUG OUTPUT v2 ===\n";
    debugOutput += "Date: " + new Date().toLocaleString() + "\n\n";
    
    try {
        var buffVector = null;
        
        if (typeof game !== 'undefined' && game.gi && game.gi.mCurrentPlayer && game.gi.mCurrentPlayer.getAvailableBuffs_vector) {
            buffVector = game.gi.mCurrentPlayer.getAvailableBuffs_vector();
        } else if (typeof swmmo !== 'undefined' && swmmo.application && swmmo.application.mGameInterface) {
            buffVector = swmmo.application.mGameInterface.mCurrentPlayer.getAvailableBuffs_vector();
        }
        
        if (!buffVector) {
            debugOutput += "ERROR: Could not get buffVector\n";
        } else {
            debugOutput += "Total buffs in vector: " + buffVector.length + "\n\n";
            
            var debugCount = 0;
            var maxDebug = 3;
            
            for (var i = 0; i < buffVector.length && debugCount < maxDebug; i++) {
                try {
                    var item = buffVector[i];
                    if (!item) continue;
                    
                    var def = item.GetBuffDefinition ? item.GetBuffDefinition() : null;
                    if (!def) continue;
                    
                    var codeName = def.GetName_string ? def.GetName_string() : "Unknown";
                    var lowerName = codeName.toLowerCase();
                    
                    if (lowerName.indexOf("addresource") === -1 && 
                        lowerName.indexOf("deposit") === -1 && 
                        lowerName.indexOf("filldeposit") === -1) {
                        continue;
                    }
                    
                    debugCount++;
                    var amount = item.GetAmount ? item.GetAmount() : 0;
                    
                    debugOutput += "========== ITEM #" + debugCount + " ==========\n";
                    debugOutput += "CodeName: " + codeName + "\n";
                    debugOutput += "Amount: " + amount + "\n\n";
                    
                    // Try ALL possible method names
                    debugOutput += "--- TRYING ALL METHODS ON ITEM ---\n";
                    var allMethods = [
                        'GetResource', 'getResource', 'GetResourceName', 'getResourceName',
                        'GetResourceType', 'getResourceType', 'GetResourceId', 'getResourceId',
                        'GetContent', 'getContent', 'GetContents', 'getContents',
                        'GetData', 'getData', 'GetInfo', 'getInfo',
                        'GetTarget', 'getTarget', 'GetTargetResource', 'getTargetResource',
                        'GetDepositType', 'getDepositType', 'GetDepositResource', 'getDepositResource',
                        'GetFillResource', 'getFillResource', 'GetAddResource', 'getAddResource',
                        'GetValue', 'getValue', 'GetValues', 'getValues',
                        'GetParams', 'getParams', 'GetParameters', 'getParameters',
                        'GetEffect', 'getEffect', 'GetEffects', 'getEffects',
                        'GetReward', 'getReward', 'GetRewards', 'getRewards',
                        'GetItem', 'getItem', 'GetItems', 'getItems',
                        'GetPayload', 'getPayload', 'GetBonus', 'getBonus',
                        'toString', 'ToXML', 'toXML', 'GetUniqueId'
                    ];
                    
                    for (var m = 0; m < allMethods.length; m++) {
                        try {
                            if (typeof item[allMethods[m]] === 'function') {
                                var result = item[allMethods[m]]();
                                debugOutput += "  item." + allMethods[m] + "() = " + _stringifyResult(result) + "\n";
                            }
                        } catch (e) {
                            debugOutput += "  item." + allMethods[m] + "() = ERROR: " + e.message + "\n";
                        }
                    }
                    
                    debugOutput += "\n--- TRYING ALL METHODS ON DEFINITION ---\n";
                    for (var d = 0; d < allMethods.length; d++) {
                        try {
                            if (typeof def[allMethods[d]] === 'function') {
                                var defResult = def[allMethods[d]]();
                                debugOutput += "  def." + allMethods[d] + "() = " + _stringifyResult(defResult) + "\n";
                            }
                        } catch (e) {
                            debugOutput += "  def." + allMethods[d] + "() = ERROR: " + e.message + "\n";
                        }
                    }
                    
                    // Try Object.keys
                    debugOutput += "\n--- OBJECT KEYS ---\n";
                    try {
                        debugOutput += "  Object.keys(item): " + JSON.stringify(Object.keys(item)) + "\n";
                    } catch (e) { debugOutput += "  Object.keys(item): ERROR\n"; }
                    try {
                        debugOutput += "  Object.keys(def): " + JSON.stringify(Object.keys(def)) + "\n";
                    } catch (e) { debugOutput += "  Object.keys(def): ERROR\n"; }
                    
                    // Try JSON stringify
                    debugOutput += "\n--- JSON STRINGIFY ---\n";
                    try {
                        debugOutput += "  JSON.stringify(item): " + JSON.stringify(item) + "\n";
                    } catch (e) { debugOutput += "  JSON.stringify(item): ERROR - " + e.message + "\n"; }
                    try {
                        debugOutput += "  JSON.stringify(def): " + JSON.stringify(def) + "\n";
                    } catch (e) { debugOutput += "  JSON.stringify(def): ERROR - " + e.message + "\n"; }
                    
                    debugOutput += "\n";
                    
                } catch (err) {
                    debugOutput += "Error processing item " + i + ": " + err.message + "\n";
                }
            }
        }
        
    } catch (e) {
        debugOutput += "FATAL ERROR: " + e.message + "\n";
    }
    
    _showTextModal("Debug Output", debugOutput);
    console.log(debugOutput);
}

function _stringifyResult(result) {
    if (result === null) return "null";
    if (result === undefined) return "undefined";
    if (typeof result === 'string') return '"' + result + '"';
    if (typeof result === 'number' || typeof result === 'boolean') return String(result);
    if (typeof result === 'function') return "[Function]";
    if (Array.isArray(result)) {
        var arrStr = "[";
        for (var ai = 0; ai < Math.min(result.length, 5); ai++) {
            arrStr += _stringifyResult(result[ai]) + ", ";
        }
        if (result.length > 5) arrStr += "...";
        return arrStr + "] (length: " + result.length + ")";
    }
    if (typeof result === 'object') {
        var objStr = "{";
        var count = 0;
        try {
            var commonProps = ['name', 'Name', 'type', 'Type', 'id', 'Id', 'ID', 'value', 'Value', 
                               'resource', 'Resource', 'amount', 'Amount', 'data', 'Data',
                               'uniqueID1', 'uniqueID2'];
            for (var p = 0; p < commonProps.length; p++) {
                if (result[commonProps[p]] !== undefined && typeof result[commonProps[p]] !== 'function') {
                    objStr += commonProps[p] + ": " + result[commonProps[p]] + ", ";
                    count++;
                }
            }
            if (typeof result.GetName_string === 'function') {
                objStr += "GetName_string(): " + result.GetName_string() + ", ";
                count++;
            }
            if (typeof result.GetType === 'function') {
                objStr += "GetType(): " + result.GetType() + ", ";
                count++;
            }
        } catch (e) {}
        if (count === 0) objStr += "[Object]";
        return objStr + "}";
    }
    return String(result);
}

// ===========================================
// TEXT MODAL FOR COPY
// ===========================================
function _showTextModal(title, content) {
    // Remove existing modal if any
    $('#textOutputModal').remove();
    
    var modalHtml = '<div id="textOutputModal" class="modal fade" role="dialog">' +
        '<div class="modal-dialog modal-lg">' +
        '<div class="modal-content" style="background: #1a1a2e; color: #ecf0f1;">' +
        '<div class="modal-header" style="border-bottom: 1px solid #333;">' +
        '<button type="button" class="close" data-dismiss="modal" style="color: #fff;">&times;</button>' +
        '<h4 class="modal-title">' + title + '</h4>' +
        '</div>' +
        '<div class="modal-body">' +
        '<p style="color: #888;">Select all (Ctrl+A) and copy (Ctrl+C):</p>' +
        '<textarea id="textOutputArea" style="width: 100%; height: 400px; background: #0d0d1a; color: #27ae60; border: 1px solid #333; font-family: monospace; font-size: 11px; padding: 10px;" readonly></textarea>' +
        '</div>' +
        '<div class="modal-footer" style="border-top: 1px solid #333;">' +
        '<button type="button" class="btn btn-primary" id="selectAllBtn">Select All</button>' +
        '<button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
    
    $('body').append(modalHtml);
    $('#textOutputArea').val(content);
    $('#textOutputModal').modal('show');
    
    // Select all button
    $('#selectAllBtn').off('click').on('click', function() {
        var textarea = document.getElementById('textOutputArea');
        textarea.select();
        textarea.setSelectionRange(0, textarea.value.length);
    });
    
    // Auto-select on focus
    $('#textOutputArea').off('focus').on('focus', function() {
        this.select();
    });
}

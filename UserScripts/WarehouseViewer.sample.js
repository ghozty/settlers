////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Warehouse Viewer - v1.0                                                                                                  //
// A simple example script for listing resources and other items from the warehouse.                                        //
// Displays a comprehensive view of all warehouse resources in a searchable and sortable table.                            //
// Resources are categorized into Building Materials, Food, Resources, Science, and Weapons.                                //
// Features include: search by name or category, sort by name/category/amount, and real-time resource updates.             //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

addToolsMenuItem("Warehouse and Resources", WarehouseViewerHandler);

var _warehouseViewerModalInitialized = false;
var searchStringRes = '';
var _sortConfig = { key: 'amount', dir: -1 }; 

// --- Merged database with your list ---
var RESOURCE_DB = {
    // --- BUILDING MATERIALS ---
    "AdvancedTools": "Building Materials",
    "Money": "Building Materials",      // Coins
    "StarCoins": "Building Materials",  // Tokens
    "GuildCoins": "Building Materials",
    "ExoticWoodPlank": "Building Materials",
    "Granite": "Building Materials",
    "Grout": "Building Materials",
    "HardWoodPlank": "Building Materials",
    "MahoganyPlank": "Building Materials",
    "Marble": "Building Materials",
    "Oil": "Building Materials",
    "Plank": "Building Materials",      // Pinewood Plank
    "Stone": "Building Materials",
    "Tools": "Building Materials",
    "RealWood": "Building Materials",
    "RealPlank": "Building Materials",
    "RealStone": "Building Materials",

    // --- FOOD ---
    "Bread": "Food",
    "Brew": "Food",
    "Fish": "Food",
    "Sausage": "Food",
    "Meat": "Food", // Meat was listed as Resource but can also be in Food group, kept according to your list
    
    // --- RESOURCE (Mines and Raw Materials were here in your list) ---
    "Bronze": "Resource",
    "BronzeOre": "Resource", // Copper Ore
    "Carriage": "Resource",
    "Coal": "Resource",
    "ExoticWood": "Resource",
    "Flour": "Resource",
    "Gold": "Resource",
    "GoldOre": "Resource",
    "Gunpowder": "Resource",
    "HardWood": "Resource",
    "Iron": "Resource",
    "IronOre": "Resource",
    "MagicBean": "Resource",
    "MagicBeanStalk": "Resource",
    "MahoganyWood": "Resource",
    "Oilseed": "Resource",
    "Wood": "Resource",      // Pinewood
    "Platinum": "Resource",
    "PlatinumOre": "Resource",
    "SaddleCloth": "Resource",
    "Salpeter": "Resource",
    "Steel": "Resource",
    "Titanium": "Resource",
    "TitaniumOre": "Resource",
    "Wagon": "Resource",
    "Water": "Resource",
    "Corn": "Resource",      // Wheat
    "Wheel": "Resource",
    "Wool": "Resource",
    "WoolenCloth": "Resource",
    "Pumpkin": "Resource",   // Event items are generally considered Resource
    "Coins": "Resource",     // Backup

    // --- SCIENCE ---
    "AdvancedPaper": "Science",
    "BookFitting": "Science",
    "IntermediatePaper": "Science",
    "Nib": "Science",
    "Printingpressletter": "Science",
    "Paper": "Science",      // Simple Paper
    "BookManuscript": "Science",
    "BookTome": "Science",
    "BookCodex": "Science",
    "SimplePaper": "Science",

    // --- WEAPONS ---
    "Archebuse": "Weapons",
    "Bow_2": "Weapons",      // Attack Bow
    "Pike": "Weapons",       // Attack Pike
    "Saber": "Weapons",      // Attack Saber
    "BattleHorse": "Weapons",
    "Bow": "Weapons",
    "BronzeSword": "Weapons",
    "Cannon": "Weapons",
    "Crossbow": "Weapons",
    "DamasceneSword": "Weapons",
    "Crossbow_2": "Weapons", // Heavy Crossbow
    "Lance": "Weapons",      // Heavy Lance
    "Mace": "Weapons",       // Heavy Mace
    "Horse": "Weapons",
    "IronSword": "Weapons",
    "Longbow": "Weapons",
    "Mortar": "Weapons",
    "PlatinumSword": "Weapons",
    "SteelSword": "Weapons"
};

function WarehouseViewerHandler(event) {
    try {
        $('div[role="dialog"]:not(#warehouseViewerModal):visible').modal('hide');

        if (!_warehouseViewerModalInitialized) {
            $('#warehouseViewerModal').remove();
            createModalWindow('warehouseViewerModal', "Warehouse View");
            _warehouseViewerModalInitialized = true;
        }

        $('#warehouseViewerModal .modal-header').html(
            '<div class="container-fluid"><h4>Warehouse Resource List</h4></div>' +
            '<div class="container-fluid" id="warehouseSearchDiv"><b>Search:</b>&emsp;</div>'
        );

        $('<input>', {
            'type': 'text',
            'id': 'searchResourceFind',
            'class': 'form-control',
            'style': 'display: inline;width: 300px;',
            'placeholder': 'Name or Category...',
            'value': searchStringRes
        }).appendTo('#warehouseSearchDiv');

        // TABLE HEADERS
        var headers = [
            [5, createSortLink("Name", "localizedName")],
            [4, createSortLink("Category", "category")],
            [3, createSortLink("Amount", "amount")]
        ];
        
        $('#warehouseViewerModal .modal-header').append('<br><div class="container-fluid">' + createTableRow(headers, true) + '</div>');

        $('#warehouseViewerModal #searchResourceFind').keyup(function (e) {
            searchStringRes = $(e.target).val();
            _filterWarehouseList();
        });

        // Event Delegation (Sort)
        $(document).off('click', '.sortCol').on('click', '.sortCol', function(e) {
            e.preventDefault();
            var key = $(this).attr('data-key');
            
            if (_sortConfig.key === key) {
                _sortConfig.dir = _sortConfig.dir * -1;
            } else {
                _sortConfig.key = key;
                _sortConfig.dir = (key === 'amount') ? -1 : 1;
            }
            _updateWarehouseModalData();
        });

        _updateWarehouseModalData();

        $('#warehouseViewerModal:not(:visible)').modal({ backdrop: 'static' });

        $("#warehouseViewerModal .modal-footer").html('');
        $("#warehouseViewerModal .modal-footer").prepend([
            $('<button>').attr({ "class": "btn btn-primary pull-left refreshWarehouse" }).text("Refresh"),
            $('<button>').attr({ "class": "btn btn-danger btnClose" }).text("Close")
        ]);

        $('#warehouseViewerModal .refreshWarehouse').click(function () { _updateWarehouseModalData(); });
        $("#warehouseViewerModal .btnClose").click(function (e) { $('#warehouseViewerModal').modal('hide'); });

    } catch (e) {
        alert("Script Initialization Error: " + e.message);
    }
}

function createSortLink(text, key) {
    var icon = "";
    if (_sortConfig.key === key) {
        icon = (_sortConfig.dir === 1) ? " (^)" : " (v)";
    }
    return '<a href="#" class="sortCol" data-key="' + key + '" style="color: white; text-decoration: underline;">' + text + icon + '</a>';
}

function _updateWarehouseModalData() {
    try {
        var resourceList = _getResourceList();
        
        resourceList.sort(function (a, b) {
            var valA = a[_sortConfig.key];
            var valB = b[_sortConfig.key];

            if (typeof valA === 'string') valA = valA.toLowerCase();
            if (typeof valB === 'string') valB = valB.toLowerCase();

            if (valA < valB) return -1 * _sortConfig.dir;
            if (valA > valB) return 1 * _sortConfig.dir;
            return 0;
        });

        var headers = [
            [5, createSortLink("Name", "localizedName")],
            [4, createSortLink("Category", "category")],
            [3, createSortLink("Amount", "amount")]
        ];
        
        $('#warehouseViewerModal .modal-header .container-fluid').last().html(createTableRow(headers, true));
        $('#warehouseViewerModalData').html(_renderWarehouseTable(resourceList));
        _filterWarehouseList();
    } catch (e) {
        alert("Update Error: " + e.message);
    }
}

function _filterWarehouseList() {
    if (!searchStringRes || searchStringRes == "") {
        $('#warehouseViewerModalData .container-fluid .row').show();
        return;
    }
    $('#warehouseViewerModalData .container-fluid .row').each(function (i, item) {
        var textToSearch = $(item).text().toUpperCase();
        if (textToSearch.indexOf(searchStringRes.toUpperCase()) == -1) {
            $(item).hide();
        } else {
            $(item).show();
        }
    });
}

function _getResourceList() {
    var resourceList = [];
    try {
        var playerID = swmmo.application.mGameInterface.mCurrentPlayer.GetPlayerId();
        var resourcesObj = swmmo.application.mGameInterface.mCurrentPlayerZone.GetResourcesForPlayerID(playerID);
        
        for (var resName in RESOURCE_DB) {
            try {
                var resData = resourcesObj.GetPlayerResource(resName);
                if (resData && typeof resData.amount !== 'undefined' && resData.amount > 0) {
                    
                    var localName = resName;
                    try { localName = loca.GetText("RES", resName); } catch(e){}
                    if (!localName || localName.indexOf("undefined") !== -1) localName = resName;

                    var cat = RESOURCE_DB[resName];

                    resourceList.push({
                        'name_key': resName,
                        'localizedName': localName,
                        'category': cat,
                        'amount': resData.amount
                    });
                }
            } catch (err) { continue; }
        }
    } catch (e) {
        alert("List Error: " + e.message);
    }
    return resourceList;
}

function _renderWarehouseTable(resourceList) {
    var out = '<div class="container-fluid">';
    if (resourceList.length === 0) {
        out += '<div class="row"><div class="col-xs-12">No resources found.</div></div>';
    } else {
        resourceList.forEach(function (item) {
            out += createTableRow([
                [5, item.localizedName],
                [4, item.category],
                [3, item.amount.toLocaleString()]
            ]);
        });
    }
    out += '</div>';
    return out;
}
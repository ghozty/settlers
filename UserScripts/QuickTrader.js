// TSO Client User Script - Quick Trader
// Provides a simplified trading interface with pre-calculated prices.
// BUY: Purchase items with Coins at discounted rates
// SELL: Sell items for Coins at premium rates
// Created by Ghozty

var QuickTrader = (function () {
    var NAME = 'Quick Trader';
    
    // ===========================================
    // CONFIGURATION - Adjust these values as needed
    // ===========================================
    var CONFIG = {
        // BUY settings
        BUY_Multiplier: 0.90,    // Buy at 90% of market price (discount)
        BUY_Max_Coin: 25000,     // Maximum coins to offer per trade
        BUY_Max_Items: 50000,    // Maximum items to request per trade
        BUY_Slots: 4,            // Number of market slots to use (1-4)
        
        // SELL settings
        SELL_Multiplier: 5.00,   // Sell at 500% of market price (premium)
        SELL_Max_Coin: 25000,    // Maximum coins to request per trade
        SELL_Max_Items: 25000,   // Maximum items to offer per trade
        SELL_Slots: 4            // Number of market slots to use (1-4)
    };
    
    // ===========================================
    // PRICE DATABASE - Market prices for tradable items
    // Format: { CodeName: MarketPrice }
    // ===========================================
    var PRICE_DB = {
        // Advanced Resources
        "Coin": 1,
        "Gold": 0.45,
        "GoldOre": 0.475,
        "RealWood": 0.018,
        "RealPlank": 0.0225,
        "Horse": 0.0225,
        "IntermediatePaper": 0.135,
        "Iron": 0.405,
        "IronOre": 0.225,
        "IronSword": 0.27,
        "Longbow": 0.18,
        "Marble": 0.054,
        "Meat": 0.045,
        "Letter": 0.27,
        "Sausage": 0.038,
        "Steel": 0.54,
        "SteelSword": 0.54,
        
        // Basic Resources
        "Fish": 0.0018,
        "GuildCoins": 4.5,
        "MapPart": 0.441,
        "Wood": 0.009,
        "Plank": 0.009,
        "Stone": 0.018,
        
        // Military
        "AdvancedPaper": 0.675,
        "AdvancedTools": 3.5,
        "BookFitting": 3.325,
        "Cannon": 6.65,
        "Carriage": 2.25,
        "Crossbow": 3.325,
        "TitaniumSword": 3.15,
        "ExoticWood": 0.095,
        "ExoticPlank": 0.099,
        "Granite": 0.38,
        "Grout": 18,
        "Gunpowder": 5.4,
        "MagicBean": 2.88,
        "MagicBeanstalk": 5.39,
        "Salpeter": 2.7,
        "Titanium": 1.8,
        "TitaniumOre": 2.25,
        "Wheel": 1.8,
        
        // Processed Resources
        "Bow": 0.038,
        "Bread": 0.0081,
        "Beer": 0.018,
        "Bronze": 0.038,
        "BronzeSword": 0.036,
        "Coal": 0.0114,
        "BronzeOre": 0.045,
        "Flour": 0.0072,
        "Nib": 0.198,
        "SimplePaper": 0.0405,
        "Tool": 0.036,
        "Water": 0.0018,
        "Corn": 0.0114,
        
        // Special
        "Archebuse": 6.65,
        "BattleHorse": 0.9,
        "MahoganyPlank": 0.315,
        "MahoganyWood": 0.475,
        "Mortar": 11.4,
        "Platinum": 0.475,
        "PlatinumOre": 0.1125,
        "PlatinumSword": 2.85,
        "Saddlecloth": 0.855,
        "Wagon": 2.85,
        "Wool": 0.38,
        "Cloth": 0.54
    };
    
    // ===========================================
    // CATEGORY MAPPING - For filtering
    // ===========================================
    var CATEGORY_MAP = {
        "Coin": "Advanced Resources",
        "Gold": "Advanced Resources",
        "GoldOre": "Advanced Resources",
        "RealWood": "Advanced Resources",
        "RealPlank": "Advanced Resources",
        "Horse": "Advanced Resources",
        "IntermediatePaper": "Advanced Resources",
        "Iron": "Advanced Resources",
        "IronOre": "Advanced Resources",
        "IronSword": "Advanced Resources",
        "Longbow": "Advanced Resources",
        "Marble": "Advanced Resources",
        "Meat": "Advanced Resources",
        "Letter": "Advanced Resources",
        "Sausage": "Advanced Resources",
        "Steel": "Advanced Resources",
        "SteelSword": "Advanced Resources",
        "Fish": "Basic Resources",
        "GuildCoins": "Basic Resources",
        "MapPart": "Basic Resources",
        "Wood": "Basic Resources",
        "Plank": "Basic Resources",
        "Stone": "Basic Resources",
        "AdvancedPaper": "Military",
        "AdvancedTools": "Military",
        "BookFitting": "Military",
        "Cannon": "Military",
        "Carriage": "Military",
        "Crossbow": "Military",
        "TitaniumSword": "Military",
        "ExoticWood": "Military",
        "ExoticPlank": "Military",
        "Granite": "Military",
        "Grout": "Military",
        "Gunpowder": "Military",
        "MagicBean": "Military",
        "MagicBeanstalk": "Military",
        "Salpeter": "Military",
        "Titanium": "Military",
        "TitaniumOre": "Military",
        "Wheel": "Military",
        "Bow": "Processed Resources",
        "Bread": "Processed Resources",
        "Beer": "Processed Resources",
        "Bronze": "Processed Resources",
        "BronzeSword": "Processed Resources",
        "Coal": "Processed Resources",
        "BronzeOre": "Processed Resources",
        "Flour": "Processed Resources",
        "Nib": "Processed Resources",
        "SimplePaper": "Processed Resources",
        "Tool": "Processed Resources",
        "Water": "Processed Resources",
        "Corn": "Processed Resources",
        "Archebuse": "Special",
        "BattleHorse": "Special",
        "MahoganyPlank": "Special",
        "MahoganyWood": "Special",
        "Mortar": "Special",
        "Platinum": "Special",
        "PlatinumOre": "Special",
        "PlatinumSword": "Special",
        "Saddlecloth": "Special",
        "Wagon": "Special",
        "Wool": "Special",
        "Cloth": "Special"
    };
    
    // State variables
    var currentMode = 'buy'; // 'buy' or 'sell'
    var currentCategory = 'all';
    var isProcessing = false;
    var currentSortColumn = 'name'; // 'name', 'stock', 'coins', 'items'
    var currentSortOrder = 'asc'; // 'asc' or 'desc'
    
    // ===========================================
    // INITIALIZATION
    // ===========================================
    
    /**
     * Initialize the script and add menu item
     */
    function init() {
        try {
            addToolsMenuItem(NAME, openModal);
        } catch (e) {
            if (typeof debug !== 'undefined') debug(e);
        }
    }
    
    /**
     * Opens the Quick Trader modal window
     */
    function openModal() {
        if (!game || !game.gi || !game.gi.isOnHomzone()) {
            game.showAlert(getText('not_home'));
            return;
        }
        
        // Close other modals
        $("div[role='dialog']:not(#QuickTraderModal):visible").modal("hide");
        
        // Remove existing modal if any
        $('#QuickTraderModal').remove();
        
        // Create new modal
        createModalWindow('QuickTraderModal', NAME);
        
        // Style the modal for larger content - matching SalesMan style
        $('#QuickTraderModal .modal-dialog').css({
            'width': '850px',
            'max-width': '95%'
        });
        
        $('#QuickTraderModal .modal-content').css({
            'background': '#8B7355',
            'border': '2px solid #5a4535',
            'border-radius': '8px'
        });
        
        $('#QuickTraderModal .modal-header').css({
            'background': 'linear-gradient(180deg, #6B5344, #5a4535)',
            'border-bottom': '1px solid #4a3828',
            'color': '#e8dcc8'
        });
        
        $('#QuickTraderModal .modal-body').css({
            'max-height': '500px',
            'overflow-y': 'auto',
            'background': '#a89880',
            'padding': '10px'
        });
        
        $('#QuickTraderModal .modal-footer').css({
            'background': 'linear-gradient(180deg, #6B5344, #5a4535)',
            'border-top': '1px solid #4a3828'
        });
        
        // Render content
        renderHeader();
        renderBody();
        renderFooter();
        
        // Show modal
        $('#QuickTraderModal:not(:visible)').modal({ backdrop: "static" });
    }
    
    // ===========================================
    // RENDER FUNCTIONS
    // ===========================================
    
    /**
     * Renders the header with coin balance and mode switch
     */
    function renderHeader() {
        var coinBalance = getPlayerStock('Coin');
        var coinBalanceFormatted = formatNumber(coinBalance);
        
        // Header HTML with coin balance and tabs
        var headerHtml = '';
        
        // Coin balance display - matching SalesMan style
        headerHtml += '<div style="background: linear-gradient(180deg, #8B7355, #6B5344); padding: 12px; border-radius: 5px; margin-bottom: 12px; text-align: center; border: 1px solid #5a4535;">';
        headerHtml += '<div style="display: inline-block; vertical-align: middle;">';
        headerHtml += getImageTag('Coin', '28px');
        headerHtml += '</div>';
        headerHtml += '<span style="font-size: 20px; font-weight: bold; color: #FFD700; margin-left: 10px; vertical-align: middle; text-shadow: 1px 1px 2px #000;">';
        headerHtml += coinBalanceFormatted + ' Coins';
        headerHtml += '</span>';
        headerHtml += '</div>';
        
        // Tab buttons - brown theme
        headerHtml += '<div style="margin-bottom: 12px;">';
        headerHtml += '<button class="btn" id="QT_BuyTab" style="margin-right: 5px; min-width: 120px; background: ' + (currentMode === 'buy' ? '#5a8f3e' : '#6B5344') + '; color: #fff; border: 1px solid #4a4030;">';
        headerHtml += 'BUY Items';
        headerHtml += '</button>';
        headerHtml += '<button class="btn" id="QT_SellTab" style="min-width: 120px; background: ' + (currentMode === 'sell' ? '#c9952c' : '#6B5344') + '; color: #fff; border: 1px solid #4a4030;">';
        headerHtml += 'SELL Items';
        headerHtml += '</button>';
        
        // Category filter dropdown - brown styled
        headerHtml += '<select id="QT_CategoryFilter" class="form-control" style="display: inline-block; width: 200px; margin-left: 20px; background: #d4c4a8; color: #3d3225; border: 1px solid #8B7355;">';
        headerHtml += '<option value="all">All Categories</option>';
        headerHtml += '<option value="Advanced Resources">Advanced Resources</option>';
        headerHtml += '<option value="Basic Resources">Basic Resources</option>';
        headerHtml += '<option value="Military">Military</option>';
        headerHtml += '<option value="Processed Resources">Processed Resources</option>';
        headerHtml += '<option value="Special">Special</option>';
        headerHtml += '</select>';
        headerHtml += '</div>';
        
        // Mode info - subtle brown tones
        if (currentMode === 'buy') {
            headerHtml += '<div style="background: #5a8f3e; color: #fff; padding: 6px 12px; border-radius: 3px; margin-bottom: 8px; font-size: 12px;">';
            headerHtml += '<strong>BUY Mode:</strong> Offer Coins to purchase items at ' + (CONFIG.BUY_Multiplier * 100).toFixed(0) + '% of market price';
            headerHtml += '</div>';
        } else {
            headerHtml += '<div style="background: #c9952c; color: #fff; padding: 6px 12px; border-radius: 3px; margin-bottom: 8px; font-size: 12px;">';
            headerHtml += '<strong>SELL Mode:</strong> Sell items for Coins at ' + (CONFIG.SELL_Multiplier * 100).toFixed(0) + '% of market price';
            headerHtml += '</div>';
        }
        
        $('#QuickTraderModalData').html('<div class="container-fluid" style="background: #c4b998; padding: 10px; border-radius: 5px;">' + headerHtml + '<div id="QT_TableContainer"></div></div>');
        
        // Event handlers
        $('#QT_BuyTab').off('click').on('click', function() {
            if (isProcessing) return;
            currentMode = 'buy';
            renderHeader();
            renderBody();
        });
        
        $('#QT_SellTab').off('click').on('click', function() {
            if (isProcessing) return;
            currentMode = 'sell';
            renderHeader();
            renderBody();
        });
        
        $('#QT_CategoryFilter').val(currentCategory).off('change').on('change', function() {
            currentCategory = $(this).val();
            renderBody();
        });
    }
    
    /**
     * Renders the main table body with items
     * Uses SalesMan Market Helper color scheme (brown tones)
     */
    function renderBody() {
        var $container = $('#QT_TableContainer').empty();
        
        // Get items based on mode
        var items = getTradeItems();
        
        if (items.length === 0) {
            $container.html('<div style="text-align: center; padding: 40px; color: #5a4535; background: #d4c4a8; border-radius: 5px;">No items available for trading in this category.</div>');
            return;
        }
        
        // Header row style - dark brown
        var headerStyle = 'background: #6B5344; color: #e8dcc8; font-weight: bold; padding: 8px 5px; border-bottom: 2px solid #4a3828;';
        // Light row - lighter tan
        var lightRowBg = '#d4c4a8';
        // Dark row - darker tan  
        var darkRowBg = '#c4b498';
        // Text color
        var textColor = '#3d3225';
        
        // Create table with SalesMan-style colors
        var tableHtml = '<table style="width: 100%; border-collapse: collapse; font-size: 12px; background: #c4b498; border: 1px solid #8B7355;">';
        
        // Header row with sortable columns
        var sortArrow = function(col) {
            if (currentSortColumn === col) {
                return currentSortOrder === 'asc' ? ' ▲' : ' ▼';
            }
            return '';
        };
        
        tableHtml += '<tr style="' + headerStyle + '">';
        tableHtml += '<th style="width: 35px; padding: 8px 5px;"></th>'; // Icon
        tableHtml += '<th class="QT_SortHeader" data-column="name" style="text-align: left; padding: 8px 5px; cursor: pointer;">Item Name' + sortArrow('name') + '</th>';
        tableHtml += '<th class="QT_SortHeader" data-column="stock" style="text-align: right; padding: 8px 5px; width: 80px; cursor: pointer;">Stock' + sortArrow('stock') + '</th>';
        tableHtml += '<th style="text-align: right; padding: 8px 5px; width: 80px;">Unit Price</th>';
        
        if (currentMode === 'buy') {
            tableHtml += '<th style="text-align: right; padding: 8px 5px; width: 100px;">Buy Price</th>';
            tableHtml += '<th class="QT_SortHeader" data-column="coins" style="text-align: right; padding: 8px 5px; width: 90px; cursor: pointer;">Coins' + sortArrow('coins') + '</th>';
            tableHtml += '<th class="QT_SortHeader" data-column="items" style="text-align: right; padding: 8px 5px; width: 90px; cursor: pointer;">Items' + sortArrow('items') + '</th>';
        } else {
            tableHtml += '<th style="text-align: right; padding: 8px 5px; width: 100px;">Sell Price</th>';
            tableHtml += '<th class="QT_SortHeader" data-column="items" style="text-align: right; padding: 8px 5px; width: 90px; cursor: pointer;">Items' + sortArrow('items') + '</th>';
            tableHtml += '<th class="QT_SortHeader" data-column="coins" style="text-align: right; padding: 8px 5px; width: 90px; cursor: pointer;">Coins' + sortArrow('coins') + '</th>';
        }
        
        tableHtml += '<th style="width: 50px; text-align: center; padding: 8px 5px;">Action</th>';
        tableHtml += '</tr>';
        
        // Data rows with alternating colors
        items.forEach(function(item, index) {
            var rowBg = (index % 2 === 0) ? lightRowBg : darkRowBg;
            var rowOpacity = item.canTrade ? '1' : '0.5';
            
            tableHtml += '<tr style="background: ' + rowBg + '; opacity: ' + rowOpacity + '; border-bottom: 1px solid #b8a888;">';
            tableHtml += '<td style="padding: 6px 5px; vertical-align: middle;">' + getImageTag(item.codeName, '24px') + '</td>';
            tableHtml += '<td style="padding: 6px 5px; color: ' + textColor + '; vertical-align: middle;">' + item.displayName + '</td>';
            tableHtml += '<td style="text-align: right; padding: 6px 5px; color: ' + textColor + '; vertical-align: middle;">' + formatNumber(item.stock) + '</td>';
            tableHtml += '<td style="text-align: right; padding: 6px 5px; color: ' + textColor + '; vertical-align: middle;">' + item.unitPrice.toFixed(4) + '</td>';
            tableHtml += '<td style="text-align: right; padding: 6px 5px; color: ' + textColor + '; vertical-align: middle;">' + item.tradePrice.toFixed(4) + '</td>';
            
            if (currentMode === 'buy') {
                tableHtml += '<td style="text-align: right; padding: 6px 5px; color: #8B4513; font-weight: bold; vertical-align: middle;">' + formatNumber(item.coinsAmount) + '</td>';
                tableHtml += '<td style="text-align: right; padding: 6px 5px; color: #2e7d32; font-weight: bold; vertical-align: middle;">' + formatNumber(item.itemsAmount) + '</td>';
            } else {
                tableHtml += '<td style="text-align: right; padding: 6px 5px; color: #8B4513; font-weight: bold; vertical-align: middle;">' + formatNumber(item.itemsAmount) + '</td>';
                tableHtml += '<td style="text-align: right; padding: 6px 5px; color: #2e7d32; font-weight: bold; vertical-align: middle;">' + formatNumber(item.coinsAmount) + '</td>';
            }
            
            // Action button - trade icon style like SalesMan
            if (item.canTrade) {
                tableHtml += '<td style="text-align: center; padding: 6px 5px; vertical-align: middle;">';
                tableHtml += '<div class="QT_TradeBtn" data-code="' + item.codeName + '" data-coins="' + item.coinsAmount + '" data-items="' + item.itemsAmount + '" ';
                tableHtml += 'style="display: inline-block; cursor: pointer; padding: 2px 6px; background: #5a8f3e; border-radius: 3px; border: 1px solid #4a7f2e;">';
                tableHtml += getImageTag('Trade', '20px');
                tableHtml += '</div>';
                tableHtml += '</td>';
            } else {
                tableHtml += '<td style="text-align: center; padding: 6px 5px; color: #999; vertical-align: middle;">-</td>';
            }
            
            tableHtml += '</tr>';
        });
        
        tableHtml += '</table>';
        
        $container.html(tableHtml);
        
        // Bind trade button events
        $('.QT_TradeBtn').off('click').on('click', function() {
            if (isProcessing) return;
            
            var codeName = $(this).data('code');
            var coinsAmount = $(this).data('coins');
            var itemsAmount = $(this).data('items');
            
            executeTrade(codeName, coinsAmount, itemsAmount);
        });
        
        // Hover effect for trade buttons
        $('.QT_TradeBtn').hover(
            function() { $(this).css('background', '#6aaf4e'); },
            function() { $(this).css('background', '#5a8f3e'); }
        );
        
        // Sort header click events
        $('.QT_SortHeader').off('click').on('click', function() {
            if (isProcessing) return;
            
            var column = $(this).data('column');
            
            // Toggle sort order if clicking same column, otherwise default to ascending
            if (currentSortColumn === column) {
                currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
            } else {
                currentSortColumn = column;
                currentSortOrder = 'asc';
            }
            
            renderBody();
        });
        
        // Hover effect for sortable headers
        $('.QT_SortHeader').hover(
            function() { $(this).css('background', '#7B6354'); },
            function() { $(this).css('background', ''); }
        );
    }
    
    /**
     * Renders the footer with Refresh button
     * Styled to match SalesMan Market Helper
     */
    function renderFooter() {
        var $modal = $('#QuickTraderModal');
        var $footer = $modal.find('.modal-footer');
        
        // Clear existing buttons except close
        $footer.find('button:not([data-dismiss="modal"])').remove();
        
        // Style close button
        $footer.find('button[data-dismiss="modal"]').css({
            'background': '#6B5344',
            'border': '1px solid #4a3828',
            'color': '#e8dcc8'
        });
        
        // Add Refresh button - styled like SalesMan buttons
        var $refreshBtn = $('<button>')
            .attr('id', 'QT_RefreshBtn')
            .css({
                'background': '#5a8f3e',
                'border': '1px solid #4a7f2e',
                'color': '#fff',
                'padding': '6px 15px',
                'border-radius': '4px',
                'cursor': 'pointer',
                'margin-right': '10px'
            })
            .html('Refresh')
            .click(function() {
                if (isProcessing) return;
                refreshData();
            });
        
        $footer.prepend($refreshBtn);
    }
    
    // ===========================================
    // DATA FUNCTIONS
    // ===========================================
    
    /**
     * Gets the list of tradable items based on current mode
     * @returns {Array} Array of item objects with trade calculations
     */
    function getTradeItems() {
        var items = [];
        var coinBalance = getPlayerStock('Coin');
        
        // Get all items with prices
        for (var codeName in PRICE_DB) {
            if (!PRICE_DB.hasOwnProperty(codeName)) continue;
            
            // Skip Coin itself - we don't trade Coin for Coin
            if (codeName === 'Coin') continue;
            
            var unitPrice = PRICE_DB[codeName];
            var category = CATEGORY_MAP[codeName] || 'Other';
            
            // Category filter
            if (currentCategory !== 'all' && category !== currentCategory) continue;
            
            var stock = getPlayerStock(codeName);
            var displayName = getItemDisplayName(codeName);
            
            var tradePrice, coinsAmount, itemsAmount, canTrade;
            
            if (currentMode === 'buy') {
                // BUY MODE: Offer Coins, Get Items
                tradePrice = unitPrice * CONFIG.BUY_Multiplier;
                
                // Calculate max coins we can offer (reserve 250 coins)
                var maxCoinsByConfig = CONFIG.BUY_Max_Coin;
                var maxCoinsByBalance = Math.floor((coinBalance - 250) / 4);
                var maxCoins = Math.min(maxCoinsByConfig, maxCoinsByBalance);
                
                // Calculate items we can get for those coins
                var maxItemsByCoins = Math.floor(maxCoins / tradePrice);
                var maxItemsByConfig = CONFIG.BUY_Max_Items;
                itemsAmount = Math.min(maxItemsByCoins, maxItemsByConfig);
                
                // Recalculate coins based on actual items
                coinsAmount = Math.ceil(itemsAmount * tradePrice);
                
                // Can trade if we have enough coins and items > 0
                canTrade = coinsAmount > 0 && itemsAmount > 0 && coinBalance >= coinsAmount;
                
            } else {
                // SELL MODE: Offer Items, Get Coins
                // Only show items we have in stock
                if (stock <= 0) continue;
                
                tradePrice = unitPrice * CONFIG.SELL_Multiplier;
                
                // Calculate max items we can offer
                var maxItemsByStock = Math.floor(stock / 4);
                var maxItemsByConfig = CONFIG.SELL_Max_Items;
                itemsAmount = Math.min(maxItemsByStock, maxItemsByConfig);
                
                // Calculate coins we would get
                var potentialCoins = Math.floor(itemsAmount * tradePrice);
                var maxCoinsByConfig = CONFIG.SELL_Max_Coin;
                coinsAmount = Math.min(potentialCoins, maxCoinsByConfig);
                
                // Recalculate items if coins were capped
                if (potentialCoins > maxCoinsByConfig) {
                    itemsAmount = Math.ceil(maxCoinsByConfig / tradePrice);
                }
                
                // Can trade if we have items to offer
                canTrade = itemsAmount > 0 && coinsAmount > 0;
            }
            
            items.push({
                codeName: codeName,
                displayName: displayName,
                category: category,
                stock: stock,
                unitPrice: unitPrice,
                tradePrice: tradePrice,
                coinsAmount: coinsAmount,
                itemsAmount: itemsAmount,
                canTrade: canTrade
            });
        }
        
        // Sort items based on current sort settings
        items.sort(function(a, b) {
            var aVal, bVal;
            
            switch(currentSortColumn) {
                case 'name':
                    aVal = a.displayName.toLowerCase();
                    bVal = b.displayName.toLowerCase();
                    return currentSortOrder === 'asc' 
                        ? aVal.localeCompare(bVal) 
                        : bVal.localeCompare(aVal);
                
                case 'stock':
                    aVal = a.stock;
                    bVal = b.stock;
                    break;
                
                case 'coins':
                    aVal = a.coinsAmount;
                    bVal = b.coinsAmount;
                    break;
                
                case 'items':
                    aVal = a.itemsAmount;
                    bVal = b.itemsAmount;
                    break;
                
                default:
                    return 0;
            }
            
            // Numeric sorting
            if (currentSortOrder === 'asc') {
                return aVal - bVal;
            } else {
                return bVal - aVal;
            }
        });
        
        return items;
    }
    
    /**
     * Gets the localized display name for an item
     * @param {string} codeName - The internal code name
     * @returns {string} The display name
     */
    function getItemDisplayName(codeName) {
        try {
            return loca.GetText("RES", codeName);
        } catch (e) {
            return codeName;
        }
    }
    
    /**
     * Gets the player's current stock of an item
     * @param {string} codeName - The internal code name
     * @returns {number} The stock amount
     */
    function getPlayerStock(codeName) {
        try {
            if (!game || !game.gi || !game.gi.mCurrentPlayer) return 0;
            var playerID = game.gi.mCurrentPlayer.GetPlayerId();
            var resourcesObj = game.gi.mCurrentPlayerZone.GetResourcesForPlayerID(playerID);
            var resData = resourcesObj.GetPlayerResource(codeName);
            if (resData && typeof resData.amount !== 'undefined') {
                return resData.amount;
            }
            return 0;
        } catch (e) {
            return 0;
        }
    }
    
    // ===========================================
    // TRADE FUNCTIONS
    // ===========================================
    
    /**
     * Executes a trade
     * @param {string} codeName - The item code name
     * @param {number} coinsAmount - Amount of coins
     * @param {number} itemsAmount - Amount of items
     */
    function executeTrade(codeName, coinsAmount, itemsAmount) {
        if (isProcessing) return;
        
        isProcessing = true;
        disableButtons(true);
        
        try {
            var offerRes = new (game.def("Communication.VO::dResourceVO"));
            var costRes = new (game.def("Communication.VO::dResourceVO"));
            
            if (currentMode === 'buy') {
                // BUY: Offer Coins, Want Items
                offerRes.amount = offerRes.producedAmount = coinsAmount;
                offerRes.name_string = 'Coin';
                
                costRes.amount = costRes.producedAmount = itemsAmount;
                costRes.name_string = codeName;
            } else {
                // SELL: Offer Items, Want Coins
                offerRes.amount = offerRes.producedAmount = itemsAmount;
                offerRes.name_string = codeName;
                
                costRes.amount = costRes.producedAmount = coinsAmount;
                costRes.name_string = 'Coin';
            }
            
            var tradeOffer = new (game.def("Communication.VO::dTradeOfferVO"));
            tradeOffer.offerRes = offerRes;
            tradeOffer.costsRes = costRes;
            tradeOffer.receipientId = 0; // Market trade
            tradeOffer.lots = currentMode === 'buy' ? CONFIG.BUY_Slots : CONFIG.SELL_Slots;
            
            // Check for FREE slot first (slotType 0), then use PAID slot (slotType 2)
            // getNextFreeSlotForType(0) returns the next available free slot position
            // If free slot is available (position 0 exists), use it
            var freeSlotPos = game.gi.mHomePlayer.mTradeData.getNextFreeSlotForType(0);
            var paidSlotPos = game.gi.mHomePlayer.mTradeData.getNextFreeSlotForType(2);
            
            // Use free slot if available (freeSlotPos === 0 means first free slot is available)
            if (freeSlotPos === 0) {
                tradeOffer.slotType = 0; // Free slot
                tradeOffer.slotPos = freeSlotPos;
            } else {
                tradeOffer.slotType = 2; // Paid slot
                tradeOffer.slotPos = paidSlotPos;
            }
            
            // Send trade
            game.gi.mClientMessages.SendMessagetoServer(1049, game.gi.mCurrentViewedZoneID, tradeOffer);
            
            var itemName = getItemDisplayName(codeName);
            var msg = currentMode === 'buy' 
                ? 'BUY Order: ' + formatNumber(itemsAmount) + ' ' + itemName + ' for ' + formatNumber(coinsAmount) + ' Coins'
                : 'SELL Order: ' + formatNumber(itemsAmount) + ' ' + itemName + ' for ' + formatNumber(coinsAmount) + ' Coins';
            
            game.showAlert(msg);
            
            // Refresh after a short delay
            setTimeout(function() {
                refreshData();
                isProcessing = false;
                disableButtons(false);
            }, 2000);
            
        } catch (e) {
            game.showAlert('Trade Error: ' + e.message);
            isProcessing = false;
            disableButtons(false);
        }
    }
    
    /**
     * Refreshes the data and re-renders
     */
    function refreshData() {
        renderHeader();
        renderBody();
    }
    
    /**
     * Enables or disables all trade buttons
     * @param {boolean} disabled - Whether to disable
     */
    function disableButtons(disabled) {
        $('.QT_TradeBtn').prop('disabled', disabled);
        $('#QT_RefreshBtn').prop('disabled', disabled);
        $('#QT_BuyTab').prop('disabled', disabled);
        $('#QT_SellTab').prop('disabled', disabled);
        
        if (disabled) {
            $('.QT_TradeBtn').css('opacity', '0.5');
        } else {
            $('.QT_TradeBtn').css('opacity', '1');
        }
    }
    
    // ===========================================
    // UTILITY FUNCTIONS
    // ===========================================
    
    /**
     * Formats a number with thousand separators
     * @param {number} num - The number to format
     * @returns {string} Formatted number string
     */
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    
    // Return public interface
    return { init: init };
})();

// Initialize the script
QuickTrader.init();


(function () {
    'use strict';

    /* @ngInject */
    function InsightResultsItemDetailController($state, $stateParams, insight, insightItem, localeService,
                                                insightLocaleFactory, itemCommentsDialog, ticketPriceDialog,
                                                insightDataService, announceService, $translate, FiConstants,
                                                isAdmin, _, insightTabFactory, insightItemLocales, insightItemSegments,
                                                gameRunStatusValue, insightItemTopWords, $window, company) {

        var vm = this;
        vm.insight  = insight;
        vm.item = insightItem;
        vm.insight = insight;
        vm.locales = insight.gameRunLocaleList;
        vm.showTicketPriceCurve = false;
        vm.selectedTabIndex = 0;
        vm.selectedGraph = 'demand-curve';
        // The view type is defaulted to list to show a single row of data
        vm.viewType = FiConstants.VIEW_TYPE.LIST;
        vm.isLocalesTab = 'locales';
        vm.isSegmentsTab = 'segments';
        vm.topWords = [];
        vm.positiveWords = [];
        vm.negativeWords = [];
        vm.menuOptions = [];
        vm.company = company;

        vm.toggleTicketPriceCurve = function (status) {
            vm.showTicketPriceCurve = status;
        };
        function resultsData(array) {
            for (var i = 0; i < array.length; i++) {
                array[i].currentLocale = {
                        locale : array[i].gameRunLocale,
                        gameRunStatus : array[i].gameRunStatus
                    };
                array[i].isItemInResults = insightLocaleFactory.isInsightLocaleResults(array[i].currentLocale);
                array[i].flagImageUrl = localeService.getFlagImageUrl(array[i].gameRunLocale);
                array[i].showResultsPredicate = isAdmin || array[i].gameRunStatus !== 'HIDDEN';
                array[i].isHidden = gameRunStatusValue.isHidden(array[i]);
                array[i].isResults = gameRunStatusValue.hasResults(array[i]);
                if (array[i].gameItemId === null) {
                    array[i].isItemNotTested = true;
                } else {
                    array[i].isItemNotTested = false;
                }
                if (array[i].reference !== null) {
                    array[i].isReferenceItem = true;
                } else {
                    array[i].isReferenceItem = false;
                }
                array[i].showItemData = array[i].isItemInResults && !array[i].isItemNotTested && !array[i].isReferenceItem;
                if (array[i].gameRunLocale === vm.currentLocale.locale) {
                    array.unshift(array[i]);
                    array.splice(i + 1, 1);
                }
            }
        }

        function buildOptionsMenuList() {
            vm.menuOptions.push({
                value : FiConstants.MENU_OPTIONS.PRINT_OPTION_VALUE,
                label : $translate.instant(FiConstants.MENU_OPTIONS.PRINT_OPTION_VALUE.toUpperCase())
            });
        }

        vm.selectOption = function (index) {
            var selectedOption = vm.menuOptions[index];
            if (selectedOption.value.toLowerCase() === FiConstants.MENU_OPTIONS.PRINT_OPTION_VALUE) {

                $window.open($state.href('print.itemDetailReport', {
                    insightId : vm.insight.insightId,
                    locale : vm.currentLocale.locale,
                    gameItemId : vm.item.gameItemId,
                    segmentId : vm.selectedSegment.gameRunId
                }, {
                    absolute: true,
                    reload: true
                }), '_blank');
            }
        };

        function parseItemLocales() {
            vm.itemLocalesResults = _.sortBy(insightItemLocales, 'gameRunLocale');
            resultsData(vm.itemLocalesResults);
        }

        function parseItemSegments() {
            var gameRunId = insightItemSegments.gameRunId;
            var gameItemId = insightItemSegments.gameItemId;
            var gameRunName = $translate.instant('ALL_RESPONDENTS');
            var maxGMPrice = insightItemSegments.maxGMPrice;
            var maxGrossMarginPercent = insightItemSegments.maxGrossMarginPercent;
            var modelPrice = insightItemSegments.modelPrice;
            var testPrice = insightItemSegments.testPrice;
            var totalValue = insightItemSegments.totalValue;
            var overallNegative = insightItemSegments.overallNegative;
            var overallPositive = insightItemSegments.overallPositive;
            var allRespondents = {
                gameRunId : gameRunId,
                gameItemId : gameItemId,
                gameRunName : gameRunName,
                gameRunStatus : 'RESULTS',
                maxGMPrice : maxGMPrice,
                maxGrossMarginPercent : maxGrossMarginPercent,
                modelPrice : modelPrice,
                testPrice : testPrice,
                totalValue : totalValue,
                overallNegative : overallNegative,
                overallPositive : overallPositive
            };
            vm.itemSegmentsResults = insightItemSegments.segmentGameItems;
            vm.itemSegmentsResults.unshift(allRespondents);
            for (var i = 0; i < vm.itemSegmentsResults.length; i++) {
                vm.itemSegmentsResults[i].currentLocale = vm.currentLocale;
                vm.itemSegmentsResults[i].isItemInResults = true;
                vm.itemSegmentsResults[i].showResultsPredicate = true;
                vm.itemSegmentsResults[i].isHidden = gameRunStatusValue.isHidden(vm.itemSegmentsResults[i]);
                vm.itemSegmentsResults[i].isResults = gameRunStatusValue.hasResults(vm.itemSegmentsResults[i]);
                vm.itemSegmentsResults[i].showItemData = vm.itemSegmentsResults[i].isResults && !vm.itemSegmentsResults[i].isGenerating;
            }
        }

        function getSegmentsByLocale(locale) {

            insightDataService.getInsightSegments(vm.insight.insightId, locale).then(function (segments) {
                vm.segments = segments || [];
                vm.isLocaleHasSegments = vm.segments.length > 0;

            }).catch(announceService.error);
        }

        function getSelectedSegment() {
            if (!insightTabFactory.selectedSegment) {
                vm.selectedSegment = vm.itemSegmentsResults[0];
            } else {
                vm.selectedSegment = insightTabFactory.selectedSegment;
            }
        }

        function parseItemTopWords() {
            angular.forEach(insightItemTopWords, function (data) {
                vm.topWords.push(data.word);
                vm.positiveWords.push(data.positiveFrequency);
                vm.negativeWords.push(data.negativeFrequency);
            });
        }

        function init() {
            // Read the locale code from the state and the segment from the tab factory
            var localeCode = $stateParams.locale;

            // Find the locale object among the list of locales for the insight
            vm.currentLocale = localeService.findLocale(localeCode, vm.locales);

            // If the locale status has results, display sentiment tab
            vm.localeIsResults = insightLocaleFactory.isInsightLocaleResults(vm.currentLocale);

            // If selected locale is All locales, show please select locale messge
            vm.showPleaseSelectLocaleMsg = localeService.isAllLocales(vm.currentLocale);

            // Build menu options
            buildOptionsMenuList();

            // Parse item locale details
            parseItemLocales();

            // Get locales Segments
            getSegmentsByLocale(localeCode);
            // Parse item segments details
            parseItemSegments();
            // Find selected segment to be bold
            getSelectedSegment();
            // Get comments top words and display it
            parseItemTopWords();
            // Checkout has top words or not
            vm.hasTopWords = insightItemTopWords.length > 0;
        }

        vm.getSegments = function () {
            return insightTabFactory.segments;
        };

        vm.close = function () {
            $state.go('insightTabWithLocale.items', {
                insightId : vm.insight.insightId,
                locale : vm.currentLocale.locale
            });
        };

        /**
         * Event listener fired when a new tab is selected
         */
        vm.selectTab = function () {
            // Only hide the ticket price curve if the newly selected tab is not the demand curve tab
            if (vm.selectedTabIndex !== 0) {
                vm.showTicketPriceCurve = false;
                vm.selectedGraph = 'demand-curve';
            }
        };

        /**
         * Shows the Ticket Price Dialog
         */
        vm.showTicketPriceDialog = function () {
            ticketPriceDialog.show(vm.currentLocale, vm.item.ticketPrice, vm.item.testPrice).then(function (response) {
                if (response && response.action === 'save') {
                    var ticketPrice = parseFloat(response.ticketPrice);

                    insightDataService.updateInsightItemTicketPrice(vm.item.gameItemId, ticketPrice).then(function (data) {
                        vm.item.ticketPriceCurve = data.ticketPriceCurve;
                        vm.item.ticketPrice = data.ticketPrice;

                        vm.showTicketPriceCurve = true;
                        vm.selectedGraph = 'ticket-price';
                        announceService.info('TICKET_PRICE_SUCCESSFULLY_UPDATED');
                    }, function () {
                        vm.showTicketPriceCurve = false;
                        vm.selectedGraph = 'demand-curve';
                        announceService.error('UNKNOWN_ERROR');
                    });
                }
            });
        };

        /**
         * Shows the View Comments Dialog
         */
        vm.showItemCommentsDialog = function () {
            itemCommentsDialog.show(vm.item.gameItemId);
        };

        /**
         * Clear Ticket Price
         */
        vm.clearTicketPrice = function () {
            insightDataService.clearInsightItemTicketPrice(vm.item.gameItemId).then(function () {
                vm.item.ticketPrice = null;
                vm.selectedGraph = 'demand-curve';
                vm.showTicketPriceCurve = false;
                announceService.info('TICKET_PRICE_CLEARED');
            }, function () {
                announceService.error('UNKNOWN_ERROR');
            });
        };

        /**
         * Returns whether the selected segment represents All Respondents
         *
         * @returns {boolean}
         */
        vm.isAllRespondents = function () {

            // If the gameRunId of the selected segment is equal to the current locale's gameRunId, this is
            //  indicative of  All Respondents
            if (!insightTabFactory.selectedSegment) {
                return false;
            }

            return insightTabFactory.selectedSegment.gameRunId === vm.currentLocale.gameRunId;
        };

        /**
         * Returns whether to show the locales tab underneath Item Details
         *
         * @returns {boolean}
         */
        vm.showLocalesTab = function () {
            // Show tab if All Respondents is selected and the item has more than one locale
            return vm.isAllRespondents() && vm.itemLocalesResults && vm.itemLocalesResults.length > 1;
        };

        /**
         * Returns whether to show the Demand Curve tab underneath Item Details
         *
         * @returns {boolean}
         */
        vm.showDemandCurveTab = function () {

            // Only show if pricing is enabled for the insight
            return vm.insight.pricingEnabled;
        };

        init();
    }


    angular
        .module('fi.insight')
        .controller('InsightResultsItemDetailController', InsightResultsItemDetailController);
}());

(function () {

    'use strict';

    /* @ngInject */
    function ItemSummaryReportController(insight, localeService, insightLocaleFactory, $stateParams,
                                         $rootScope, $translate, insightDataService, _) {

        var vm = this;

        var ITEMS_PER_PAGE = 6;

        function findSegment() {
            var segment = _.find(vm.segments, function (segment) {
                return segment.gameRunId.toString() === $stateParams.segmentId;
            });

            if (!segment) {
                if ($stateParams.segmentId === vm.insightLocale.gameRunId.toString()) {
                    segment = {
                        name : $translate.instant('ALL_RESPONDENTS'),
                        gameRunId : vm.insightLocale.gameRunId
                    };
                }
            }

            return segment;
        }

        vm.isNewPage = function (index) {
            return index !== 0 && index % ITEMS_PER_PAGE === 0;
        };

        /**
         * Processes the items, hiding / showing any messages and progress indicators
         *
         * @param items
         */
        function processItemResults(items) {
            if (localeService.isAllLocales(vm.currentLocale)) {
                items = items.map(function (item) {
                    item.percentTestPrice = item.percentTestPrice || 0;
                    item.percentTestPrice = item.totalValue + (item.percentTestPrice / 1000);

                    return item;
                });
            }
            vm.items = items;
        }

        /**
         * Gets insight items by the given gameRunId.  Note this gameRunId could represent a locale or a segment ID
         *
         * @param gameRunId
         */
        function getItemsByGameRunId(gameRunId) {

            insightDataService.getInsightItems(gameRunId).then(processItemResults);
        }

        /**
         * Gets insight items for all locales on the insight.
         *
         * @param insightId
         */
        function getItemsForAllLocales(insightId) {

            insightDataService.getInsightItemsForAllLocales(insightId).then(processItemResults);
        }

        function getInsightDetail() {

            // Clear out the items displayed, which will hide the item list
            vm.items = [];

            if (!localeService.isAllLocales(vm.currentLocale)) {

                // Get all the items for the segment (note if 'All Respondents', this will be the locale gamerun)
                getItemsByGameRunId(vm.currentSegment.gameRunId);
            } else {
                // Get the items for all locales
                getItemsForAllLocales(insight.insightId);
            }
        }

        function getSegmentsByLocale(localeCode) {

            return insightDataService.getInsightSegments(vm.insight.insightId, localeCode);
        }

        function init() {

            vm.insight = insight;

            vm.insightPricingEnabled = vm.insight.pricingEnabled;
            vm.maxGmPricingEnabled = vm.insight.maxGrossMargin;

            vm.locales = insight.gameRunLocaleList;
            vm.companyData = $rootScope.companyData;

            // Combine these
            vm.currentLocale = localeService.findLocale($stateParams.locale);

            vm.insightLocale = insightLocaleFactory.findInsightLocale($stateParams.locale, vm.locales);
            vm.isAllLocales = localeService.isAllLocales(vm.currentLocale);

            if (!vm.companyData.i18nEnabled) {
                vm.showLocaleFlag = false;
                vm.showLocaleCode = false;
            } else {

                if (vm.isAllLocales) {
                    vm.showLocaleFlag = false;
                    vm.showLocaleCode = true;
                    vm.localeCode = $translate.instant('ALL_LOCALES');
                } else {
                    vm.showLocaleFlag = true;
                    vm.showLocaleCode = true;
                    vm.localeCode = vm.currentLocale.locale;
                }
            }

            if (!vm.isAllLocales) {

                // Get all the segments for the locale
                getSegmentsByLocale(vm.currentLocale.locale).then(function (segments) {
                    vm.segments = segments;
                    vm.currentSegment = findSegment();
                    getInsightDetail();
                });
            } else {

                getInsightDetail();
            }
        }

        /**
         * Returns the precision that should be used to display the total value
         */
        vm.getTotalValuePrecision = function () {
            // Show one decimal place if All Locales is selected, 0 otherwise
            return vm.isAllLocales ? 1 : 0;
        };

        /**
         * Returns whether to display the model price in the results list
         *
         * @returns {boolean}
         */
        vm.showModelPrice = function () {
            return !vm.isAllLocales && vm.insightPricingEnabled && !vm.maxGmPricingEnabled;
        };

        /**
         * Returns whether to display the Max Gross Margin Price in the results list
         *
         * @returns {boolean}
         */
        vm.showMaxGmPrice = function () {
            return !vm.isAllLocales && vm.insightPricingEnabled && vm.maxGmPricingEnabled;
        };

        init();
    }

    angular
        .module('fi.insight')
        .controller('ItemSummaryReportController', ItemSummaryReportController);

}());

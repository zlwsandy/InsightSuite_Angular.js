(function () {
    'use strict';

    /* @ngInject */
    function insightResultsItem() {
        return {
            restrict: 'E',
            templateUrl: 'insight/items/insight-results-item.directive.html',
            controller : InsightResultsItemController,
            controllerAs : 'InsightResultsItemController',
            bindToController : true,
            scope : {
                item : '=',
                sortBy : '=',
                currentLocale : '=',
                insight : '=',
                viewType : '=',
                hideImage : '='
            }
        };
    }

    function InsightResultsItemController($state, localeService, imageBrowseDialog) {
        var vm = this;

        function init() {

            vm.insightPricingEnabled = vm.insight.pricingEnabled;
            vm.maxGmPricingEnabled = vm.insight.maxGrossMargin;

            // Convert null and undefined to false to prevent JavaScript shenanigans with null/undefined
            //  in chained conditions
            if (vm.insightPricingEnabled === null || vm.insightPricingEnabled === undefined) {
                vm.insightPricingEnabled = false;
            }

            if (vm.maxGmPricingEnabled === null || vm.maxGmPricingEnabled === undefined) {
                vm.maxGmPricingEnabled = false;
            }
        }

        /**
         * Returns whether the currently selected locale is representative of all locales
         *
         * @returns {boolean}
         */
        vm.isAllLocales = function () {
            return localeService.isAllLocales(vm.currentLocale);
        };

        /**
         * Returns the precision that should be used to display the total value
         */
        vm.getTotalValuePrecision = function () {
            // Show one decimal place if All Locales is selected, 0 otherwise
            return vm.isAllLocales() ? 1 : 0;
        };

        /**
         * Returns whether to display the model price in the results list
         *
         * @returns {boolean}
         */
        vm.showModelPrice = function () {
            return !vm.isAllLocales() && vm.insightPricingEnabled && !vm.maxGmPricingEnabled;
        };

        /**
         * Returns whether to display the Max Gross Margin Price in the results list
         *
         * @returns {boolean}
         */
        vm.showMaxGmPrice = function () {
            return !vm.isAllLocales() && vm.insightPricingEnabled && vm.maxGmPricingEnabled;
        };

        /**
         * Returns whether to display the Gross Margin Delta Basis Points in the results list
         *
         * @returns {boolean}
         */
        vm.showGrossMarginDeltaBasisPoints = function () {
            return !vm.isAllLocales() && vm.insightPricingEnabled && vm.maxGmPricingEnabled;
        };

        /**
         * Navigates to the item detail state (unless the item thumbnail was clicked)
         */
        vm.viewItemDetail = function (evt) {
            if (!evt || !evt.target || evt.target.className !== 'item-thumbnail') {
                // Only attempt to view item details if All Locales is not selected
                if (!vm.isAllLocales()) {
                    $state.go('insightTabNoActionbarWithLocale.itemDetail', {
                        insightId : vm.insight.insightId,
                        locale : vm.currentLocale.locale,
                        gameItemId : vm.item.gameItemId
                    }, {reload : true});
                }
            } else {
                imageBrowseDialog.show(vm.item.itemImages);
            }
        };

        init();
    }

    angular
        .module('fi.insight')
        .directive('insightResultsItem', insightResultsItem);
}());

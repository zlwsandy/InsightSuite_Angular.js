/**
 * @name InsightResultsItems
 * @restrict E
 * @module fi.insight
 *
 * @description Displays a list of results for insight items.  Used for completed locales where results are available
 *
 * @param {items=} items : an array of items to display in the list
 * @param {currentSegment=} currentSegment : the currently selected segment
 * @param {currentLocale=} currentLocale : the currently selected locale
 * @param {insight=} insight : insight containing the items
 * @param {showNoItemsMsg=} showNoItemsMsg : a boolean indicating whether to show the No Items message
 * @param {showNotEnoughInfoSegmentMsg=} showNotEnoughInfoSegmentMsg : a boolean indicating whether to show the Not Enough Info message
 * @param {showProcessingSegmentMsg=} showProcessingSegmentMsg : a boolean indicating whether to show the Processing Segment message
 *
 *
 * @usage
 *   <insight-results-items
 *      items="someController.items"
 *      current-segment="someController.currentSegment"
 *      current-locale="someController.currentLocale"
 *      insight="someController.insight"
 *      show-no-items-msg="someController.showNoItemsMsg"
 *      show-not-enough-info-segment-msg="someController.showNotEnoughInfoSegmentMsg"
 *      show-processing-segment-msg="someController.showProcessingSegmentMsg">
 *   <insight-results-items
 */
(function () {
    'use strict';

    /* @ngInject */
    function InsightResultsItems() {
        return {
            restrict: 'E',
            templateUrl : 'insight/items/insight-results-items.directive.html',
            controller : InsightResultsItemsController,
            controllerAs : 'InsightResultsItemsController',
            bindToController : true,
            scope : {
                items : '=',
                insight : '=',
                currentSegment : '=',
                currentLocale : '=',
                showNoItemsMsg : '=',
                showNotEnoughInfoSegmentMsg : '=',
                showProcessingSegmentMsg : '=',
                viewType : '='
            }
        };
    }

    function InsightResultsItemsController($scope, FiConstants, imageLoader, localeService, _, $rootScope) {

        var vm = this;

        vm.showSortBySelect = false;
        /**
         * Returns a sort function based on the currently selected sortBy option maintained by this controller
         *
         * @returns {Function}
         */
        function getSortFunction() {
            return function (a, b) {

                // Only attempt to sort if the objects contain the property selected for sort
                if (vm.sortBy && a.hasOwnProperty(vm.sortBy.prop) && b.hasOwnProperty(vm.sortBy.prop)) {

                    // Sort Descending
                    if (a[vm.sortBy.prop] < b[vm.sortBy.prop]) {
                        return 1;
                    }

                    if (a[vm.sortBy.prop] > b[vm.sortBy.prop]) {
                        return -1;
                    }

                    // If the items are equal in their selected sortBy, then sort by the item number to keep items
                    //  consistently sorted
                    return a.number - b.number;
                }

                return 0;
            };
        }

        function init() {
            vm.sortBy = {};

            vm.insightPricingEnabled = vm.insight.pricingEnabled;
            vm.maxGmPricingEnabled = vm.insight.maxGrossMargin;

            // Watch the items list for changes.  When it changes, resort the items list based on what the value is
            $scope.$watch(function () {
                return vm.items;
            }, function () {
                var ptcExport = _.some(vm.items, function (item) {
                    return item.vendorIntegrationType === 'PTC_FLEXPLM';
                });

                // Cache the images in the browser when the results list loads
                imageLoader.loadFullsizeImagesByItems(vm.items);

                vm.items.sort(getSortFunction());

                // Show the sortBy select if more than one item
                vm.showSortBySelect = vm.items.length > 1;

                $rootScope.$broadcast('PTC_EXPORT_TOGGLE', ptcExport);
            });
        }

        // Event handler for the sort by directive
        vm.sortByChange = function (currentSortBy) {
            vm.sortBy = currentSortBy;
            vm.items.sort(getSortFunction());
        };

        /**
         * Returns whether the current view type is List
         *
         * @returns {boolean}
         */
        vm.isListView = function () {
            return vm.viewType === FiConstants.VIEW_TYPE.LIST;
        };

        /**
         * Sets the current view type to list
         */
        vm.showListView = function () {
            vm.viewType = FiConstants.VIEW_TYPE.LIST;
        };

        /**
         * Called from the view
         *
         * @returns {Boolean}
         */
        vm.isAllLocales = function () {
            return localeService.isAllLocales(vm.currentLocale);
        };

        init();
    }

    angular
        .module('fi.insight')
        .directive('insightResultsItems', InsightResultsItems);
}());

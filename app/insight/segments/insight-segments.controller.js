(function () {
    'use strict';

    /* @ngInject */

    function InsightsSegmentsController(gameRunStatusValue, insightDataService, $stateParams, $state, announceService,
                                        insight, isAdmin, localeService, insightLocaleFactory, $translate, imageBrowseDialog) {
        var vm = this;
        vm.gameRunStatusValue = gameRunStatusValue;
        vm.isAdmin = isAdmin;
        vm.insight = insight;
        vm.locales = insight.gameRunLocaleList;
        vm.currentLocale = null;
        vm.segments = [];
        vm.resultArray = [];
        vm.showPleaseSelectLocaleMsg = false;
        vm.showLocaleResults = false;
        vm.showNoSegmentsAvailableMsg = false;
        var ASCENDING = 'asc';
        var DESCENDING = 'desc';


        vm.getCellColor = function (value) {
            return 'total-value-' + value;
        };

        vm.getTotalValueDisplay = function (segment, index) {
            if (gameRunStatusValue.isHidden(segment)) {
                return index === 0 ? $translate.instant('NOT_AVAILABLE') : '';
            } else if (segment.isGenerating) {
                return index === 0 ? $translate.instant('GENERATING') : '';
            }

            return segment.totalValue;
        };

        vm.changeOrder = function () {
            if (vm.currentSort === vm.previousSort) {
                if (vm.status === ASCENDING) {
                    vm.status = DESCENDING;
                } else {
                    vm.status = ASCENDING;
                }
            }
        };

        vm.getSort = function () {
            function sortFn(a, b) {
                var aPctTestPrice = a.percentTestPrice;
                var bPctTestPrice = b.percentTestPrice;
                var aNumber = a.number;
                var bNumber = b.number;
                if (aPctTestPrice < bPctTestPrice) {
                    return vm.status === ASCENDING ? -1 : 1;
                }
                if (aPctTestPrice > bPctTestPrice) {
                    return vm.status === ASCENDING ? 1 : -1;
                }
                return vm.status === ASCENDING ? bNumber - aNumber : aNumber - bNumber;
            }
            return vm.allItems.sort(sortFn);
        };

        vm.toggleSort = function (index, segment) {
            if (gameRunStatusValue.hasResults(segment)) {
                vm.previousSort = vm.currentSort;
                vm.currentSort = index;
                vm.changeOrder();
                var sortFn = function (a, b) {
                    var findSortData = function (array) {
                        var gameItemSegments = array.sortedSegmentsArray;

                        for (var i = 0; i < gameItemSegments.length; i++) {
                            if (gameItemSegments[i].gameRunName === segment.gameRunName) {
                                var pctTestPrice = gameItemSegments[i].percentTestPrice;
                                var number = gameItemSegments[i].number;
                                return {'pctTestPrice' : pctTestPrice, 'number' : number};
                            }
                        }
                    };

                    var aSort = findSortData(a);
                    var bSort = findSortData(b);

                    if (aSort.pctTestPrice < bSort.pctTestPrice) {
                        return vm.status === ASCENDING ? -1 : 1;
                    }
                    if (aSort.pctTestPrice > bSort.pctTestPrice) {
                        return vm.status === ASCENDING ? 1 : -1;
                    }
                    return vm.status === ASCENDING ? bSort.number - aSort.number : aSort.number - bSort.number;

                };
                return vm.allItems.sort(sortFn);
            }
        };

        vm.toggleSortAll = function () {
            vm.previousSort = vm.currentSort;
            vm.currentSort = 'all';
            vm.changeOrder();
            vm.getSort();
        };

        function getSegmentsByLocale(locale) {

            insightDataService.getInsightSegments(vm.insight.insightId, locale).then(function (segments) {
                vm.segments = segments || [];
                vm.showNoSegmentsAvailableMsg = !vm.segments || vm.segments.length < 1;
            }).catch(announceService.error);
        }

        function getItemsSegments(gameRunId) {

            insightDataService.getInsightItemSegments(gameRunId).then(function (allItems) {
                if (allItems.length > 0) {
                    vm.currentSort = 'all';
                    vm.status = DESCENDING;
                    vm.allItems = allItems;
                    vm.getSort();

                    vm.allItems[0].segmentGameItems.map (function (value, index) {
                        var segmentMap = {};
                        segmentMap[value.gameRunId] = index;
                        vm.resultArray.push(segmentMap);
                    });

                    vm.resultObject = vm.resultArray.reduce(function (result, currentObject) {
                        for (var key in currentObject) {
                            if (currentObject.hasOwnProperty(key)) {
                                result[key] = currentObject[key];
                            }
                        }
                        return result;
                    }, {});

                    //loop items and segments. sort all the segments based on the first item's segments order
                    for (var i = 0; i < allItems.length; i++) {
                        var sortedSegmentsArray = [];
                        var item = allItems[i];
                        for (var j = 0; j < item.segmentGameItems.length; j++) {
                            var segment = item.segmentGameItems[j];
                            var segmentId = segment.gameRunId;
                            var indexHeader = vm.resultObject[segmentId];
                            sortedSegmentsArray[indexHeader] = segment;
                        }
                        item.sortedSegmentsArray = sortedSegmentsArray;
                    }
                }
            }).catch(announceService.error);
        }


        vm.addSegments = function () {
            $state.go('insightTabNoActionbarWithLocale.manageSegments', {
                locale : vm.currentLocale.locale,
                insightId : vm.insight.insightId
            });
        };

        function init() {

            // Read the locale code off the state parameters
            var localeCode = $stateParams.locale;

            // Find the locale object among the list of locales for the insight
            vm.currentLocale = localeService.findLocale(localeCode, vm.locales);

            // If All Locales is selected, then show the please select locale message
            vm.showPleaseSelectLocaleMsg = localeService.isAllLocales(vm.currentLocale);
            // If locale status does not have results, then show this message
            vm.showLocaleResults = insightLocaleFactory.isInsightLocaleResults(vm.currentLocale);
            if (vm.currentLocale) {
                var gameRunId = vm.currentLocale.gameRunId;

                if (!localeService.isAllLocales(localeCode)) {

                    if (vm.showLocaleResults) {
                        // Get all the segments for the locale
                        getSegmentsByLocale(localeCode);
                        getItemsSegments(gameRunId);
                    }
                } else {
                    vm.showPleaseSelectLocaleMsg = true;
                }
            } else {
                vm.showPleaseSelectLocaleMsg = true;
            }
        }

        /**
         * Locale Change Handler.
         *
         * @param current
         */
        vm.localeChange = function (current) {

            if (vm.currentLocale && !angular.isUndefined(current)) {

                // If locale changes to a valid value, refresh state with new locale
                $state.go('insightTabWithLocale.segments', {
                    insightId: $stateParams.insightId,
                    locale: current.locale
                });
            }
        };

        vm.showImageBrowseDialog = function (item) {
            if (item) {
                imageBrowseDialog.show(item.itemImages);
            }
        };

        init();

    }

    angular
        .module('fi.insight')
        .controller('InsightsSegmentsController', InsightsSegmentsController);
}());

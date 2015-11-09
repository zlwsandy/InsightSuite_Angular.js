(function () {
    'use strict';

    /* @ngInject */
    function InsightItemsController(gameRunStatusValue, insightDataService, $stateParams, $scope, $rootScope, announceService,
                                    insight, isAdmin, insightLocaleFactory, localeService, $filter, $translate, insightTabFactory,
                                    itemDataService, $q, _) {
        var vm = this,
            uploadListener;

        vm.isAdmin = isAdmin;
        vm.insight = insight;
        vm.locales = insight.gameRunLocaleList;
        vm.currentLocale = null;
        vm.addedItems = {};

        function init() {
            // Read the locale code from the state and the segment from the tab factory
            var localeCode = $stateParams.locale;
            var selectedSegment = insightTabFactory.selectedSegment;

            vm.viewType = insightTabFactory.selectedViewType;

            // Set the current locale object based on the locale code in the state
            setCurrentLocale(localeCode);

            // Get the insight items, passing in the selected segment if it exists
            getInsightDetail(selectedSegment);

            // Watch the selected segment value on the tab factory.  When it changes, refresh the item detail
            $scope.$watch(function () {
                return insightTabFactory.selectedSegment;
            }, function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    getInsightDetail(newVal);
                }
            });

            // Watch the selected view type and insight tab factory.  When it changes, set the local variable, which cascades to the directives
            //  Note:  this is hacktastically temporary because the real toggle for this will eventually be on the item
            //  directive itself, so the tab factory and this controller will have no clue what the viewType is
            $scope.$watch(function () {
                return insightTabFactory.selectedViewType;
            }, function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    vm.viewType = newVal;
                }
            });
            $scope.$watch(function () {
                return vm.viewType;
            }, function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    insightTabFactory.selectedViewType = newVal;
                }
            });



            // listen for uploaded insights
            uploadListener = $rootScope.$on('insightItem:uploadResult', function (e, uploadedData) {
                // dismiss and add all the created items not dismissed from list and
                // prior to user uploading more items
                if (_.has(vm.addedItems, 'create')) {
                    vm.dismissAll('create');
                }

                if (_.has(vm.addedItems, 'itemsExistForOtherLocaleInInsight')) {
                    vm.dismissAll('itemsExistForOtherLocaleInInsight');
                }

                assignUploadResults(uploadedData);
            });
        }

        function updateListMessages() {

            // if its create or exists in other insight it will be added to the list
            // so remove no items message
            vm.showNoItemsMsg = !(_.isEmpty(vm.addedItems) !== false ||
                vm.items.length > 0 ||
                vm.addedItems.create.length > 0 ||
                vm.addedItems.itemsExistForOtherLocaleInInsight.length > 0 ||
                vm.addedItems.itemsExistForLocaleInOtherInsights.length > 0 ||
                vm.addedItems.itemsExistForOtherLocale.length > 0);
        }

        var UPLOAD_MSG_WATCHERS = ['insightItemsController.items.length',
                                   'insightItemsController.addedItems.create.length',
                                   'insightItemsController.addedItems.itemsExistForOtherLocaleInInsight.length',
                                   'insightItemsController.addedItems.itemsExistForLocaleInOtherInsights.length',
                                   'insightItemsController.addedItems.itemsExistForOtherLocale.length'];

        $scope.$watchGroup(UPLOAD_MSG_WATCHERS, updateListMessages);

        /**
         * Determine the list to put the uploaded data into depending on the emitted
         * data sent form the items upload controller
         *
         * @param uploadedData
         */
        function assignUploadResults(uploadedData) {
            // A.
            // items that do not exist in system
            // create
            vm.addedItems.create = uploadedData.create;
            if (vm.locales.length > 1) {
                $translate('SUCCESSFULLY_CREATED_ITEM', {
                    items: vm.addedItems.create.length,
                    locale: vm.currentLocale.locale
                }).then(function (msg) {
                    vm.addedItems.createMsg = msg;
                });
            } else {
                $translate('SUCCESSFULLY_CREATE_ITEM_SINGLE_LOCALE', {
                    items: vm.addedItems.create.length
                }).then(function (msg) {
                    vm.addedItems.createMsg = msg;
                });
            }

            // D.
            // items exist for different locale in and only in the current insight
            // added to specific locale
            vm.addedItems.itemsExistForOtherLocaleInInsight = uploadedData.itemsExistForOtherLocaleInInsight;
            $translate('ITEMS_EXIST_FOR_OTHER_LOCALE_IN_INSIGHT', {
                items: vm.addedItems.itemsExistForOtherLocaleInInsight.length,
                locale: vm.currentLocale.locale
            }).then(function (msg) {
                vm.addedItems.itemsExistForOtherLocaleInInsightMsg = msg;
            });

            // B.
            // items exist for selected locale in current insight
            vm.addedItems.itemsExistForLocaleInInsight = uploadedData.itemsExistForLocaleInInsight;
            $translate('ITEMS_EXIST_FOR_LOCALE_IN_INSIGHT', {
                items: vm.addedItems.itemsExistForLocaleInInsight.length,
                locale: vm.currentLocale.locale
            }).then(function (msg) {
                vm.addedItems.itemsExistForLocaleInInsightMsg = msg;
            });


            // C.
            // items exist for the selected locale but only in other insights
            // or
            // items which exist for the selected locale but not part of any insight
            vm.addedItems.itemsExistForLocaleInOtherInsights = uploadedData.itemsExistForLocaleInOtherInsights;
            $translate('ITEMS_EXIST_FOR_LOCALE_IN_OTHER_INSIGHTS', {
                items: vm.addedItems.itemsExistForLocaleInOtherInsights.length,
                locale: vm.currentLocale.locale
            }).then(function (msg) {
                vm.addedItems.itemsExistForLocaleInOtherInsightsMsg = msg;
            });


            // E.
            // items exist for a different locale but also in other insights
            // or
            // items exist for a different locale but only in other insights
            // or
            // items exist in a different locale but not part of any insight
            vm.addedItems.itemsExistForOtherLocale = uploadedData.itemsExistForOtherLocale;
            $translate('ITEMS_EXIST_FOR_OTHER_LOCALE', {
                items: vm.addedItems.itemsExistForOtherLocale.length
            }).then(function (msg) {
                vm.addedItems.itemsExistForOtherLocaleMsg = msg;
            });
        }

        /**
         * Sets the current locale object in this controller by matching the given locale code against the list of
         * locales available on this insight
         *
         * @param localeCode
         */
        function setCurrentLocale(localeCode) {

            vm.currentLocale = localeService.findLocale(localeCode, vm.locales);
        }

        /**
         * Processes the items, hiding / showing any messages and progress indicators
         *
         * @param items
         */
        function processItemResults(items) {
            if (localeService.isAllLocales(vm.currentLocale)) {
                _.forEach(items, function (item) {
                    /**
                     * Set the percentTestPrice on an All Locales item to the totalValue,
                     * so that it is sorted appropriately when sorting by totalValue.
                     * See FI-13344.
                     * Sorts by total value, then by percentTestPrice by adding
                     * the percentTestPrice shifted right by 3 decimal places (percentTestPrice / 1000).
                     */
                    item.percentTestPrice = item.percentTestPrice || 0;
                    item.percentTestPrice = item.totalValue + (item.percentTestPrice / 1000);
                });
            }

            vm.items = $filter('orderBy')(items, 'number');

            vm.showProgressLoader = false;
            if (vm.items.length <= 0) {
                vm.showNoItemsMsg = true;
                vm.showItems = false;
            } else {
                vm.showNoItemsMsg = false;
                vm.showItems = true;
            }
        }

        /**
         * Gets insight items by the given gameRunId.  Note this gameRunId could represent a locale or a segment ID
         *
         * @param gameRunId
         */
        function getItemsByGameRunId(gameRunId) {

            insightDataService.getInsightItems(gameRunId).then(processItemResults).catch(announceService.error);
        }

        /**
         * Gets insight items for all locales on the insight.
         *
         * @param insightId
         */
        function getItemsForAllLocales(insightId) {

            insightDataService.getInsightItemsForAllLocales(insightId).then(processItemResults).catch(announceService.error);
        }

        /**
         * Gets insight items based on either the locale or the given segment.  If the given segment is falsy or if
         * the given segment does not have a status, function will get insight detail based on the current locale
         *
         * If the given segment exists with a valid status, then that segment will be used to get insight items or
         * display any messages
         *
         * @param selectedSegment
         */
        function getInsightDetail(selectedSegment) {

            // Hide all info messages on screen
            vm.hideAll();

            // Clear out the items displayed, which will hide the item list
            vm.items = [];

            if (selectedSegment && selectedSegment.gameRunStatus) {
                if (gameRunStatusValue.hasResults(selectedSegment)) {

                    // Load items based on the selected segment ID
                    getItemsByGameRunId(selectedSegment.gameRunId);

                } else if (gameRunStatusValue.isHidden(selectedSegment)) {

                    // Show 'Not Enough Data' message if segment is HIDDEN
                    vm.showNotEnoughInfoSegmentMsg = true;

                } else if (selectedSegment.isGenerating) {

                    // Show 'Processing' message if segment is still generating
                    vm.showProcessingSegmentMsg = true;
                }
            } else {
                if (vm.currentLocale) {

                    if (!localeService.isAllLocales(vm.currentLocale)) {

                        // Get all the items for the locale
                        getItemsByGameRunId(vm.currentLocale.gameRunId);
                    } else {
                        // Get the items for all locales
                        getItemsForAllLocales(insight.insightId);
                    }
                } else {
                    vm.showPleaseSelectLocaleMsg = true;
                    vm.showProgressLoader = false;
                }
            }
        }
        /**
         * Updates the insight list with new items that were
         * selected to be added and removes from the message list.
         *
         * @param list
         * @param items
         */
        function updateInsightsList(list, newItems) {
            itemDataService
                .createItems(newItems, vm.currentLocale)
                .then(function (items) {

                    // remove items not that were not specifically added for this call
                    items = _.filter(items, function (x) {
                        return _.find(newItems, function (y) {
                            return x.itemId === y.itemId;
                        });
                    });

                    // add back items that are already being displayed as added
                    items = _.flatten([vm.items, items]);

                    // clear the items list
                    vm.items = [];
                    // populate the list with return items
                    processItemResults(items);
                    // remove all items in message list
                    var i = newItems.length;
                    while (i--) {
                        vm.removeItem(list, newItems[i]);
                    }
                })
                .catch(announceService.error);
        }

        /**
         * Hides all info messages displayed
         */
        vm.hideAll = function () {
            vm.showNotEnoughInfoSegmentMsg = false;
            vm.showProcessingSegmentMsg = false;
            vm.showNoItemsMsg = false;
        };

        /**
         * Show the Insight Item Results if All Locales are selected or if a locale with results is selected
         */
        vm.showResults = function () {
            return insightLocaleFactory.isInsightLocaleResults(vm.currentLocale) || localeService.isAllLocales(vm.currentLocale);
        };

        /**
         * Determines what to do with the item depending on the list
         * that contains it
         *
         * @param list
         * @param item
         */
        function addItemsActions(list, item) {
            function addItems() {
                $q.when(vm.addItem(item))
                .then(vm.removeItem(list, item));
            }
            function removeItems() {
                vm.removeItem(list, item);
            }
            var actions = {
                'create': addItems,
                'itemsExistForOtherLocaleInInsight': addItems,
                'itemsExistForLocaleInInsight': removeItems,
                'itemsExistForLocaleInOtherInsights': removeItems,
                'itemsExistForOtherLocale': removeItems
            };
            actions[list]();
        }

        /**
         * Removes a particular item on a particular list of added items
         *
         * @param list
         * @param item
         */
        vm.dismiss = function (list, item) {
            addItemsActions(list, item);
        };

        /**
         * Adds new uploaded item to items list
         *
         * @param item
         */
        vm.addItem = function (item) {
            vm.items.push(item);
            vm.items = $filter('orderBy')(vm.items, 'number');
        };

        /**
         * Sends item data to server to update item with upload information
         *
         * @param item
         */
        vm.add = function (list, item) {
            // send data to server, update list, and
            // remove from message list
            updateInsightsList(list, [item]);
        };

        /**
         * Add all items and then remove them from the list
         *
         * @param list
         */
        vm.addAll = function (list) {
            // send data to server, update list, and
            // remove from message list
            updateInsightsList(list, vm.addedItems[list]);
        };

        /**
         * Remove new uploaded item from the particular list of uploaded items
         *
         * @param list
         * @param item
         */
        vm.removeItem = function (list, item) {
            var i = vm.addedItems[list].indexOf(item);
            if (i !== -1) {
                vm.addedItems[list].splice(i, 1);
            }
        };

        /**
         * Loops through the list of added Items per a particular list
         *
         * @param list
         */
        vm.dismissAll = function (list) {
            var i = vm.addedItems[list].length;
            while (i--) {
                addItemsActions(list, vm.addedItems[list][i]);
            }
        };

        init();

        // destroy upload listener
        $scope.$on('$destroy', uploadListener);
    }

    angular
        .module('fi.insight')
        .controller('InsightItemsController', InsightItemsController);
}());

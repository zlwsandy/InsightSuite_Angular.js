(function () {

    'use strict';

    /* @ngInject */
    function InsightSetupItemDetailController(_, $q, $state, $stateParams, $mdDialog, $translate, $scope, insight, insightItem, gameRunStatusValue,
                                              localeService, insightDataService, announceService, companyService, fiService, dialogAlert, FiConstants,
                                              formatter, itemDataService, insightItemTransformer, insightEditCancelDialogService) {
        var vm = this, ITEMS_LIST_ROUTE = 'insightTabWithLocale.items';
        vm.insight = insight;

        vm.referenceItemOptions = [
            { name: 'TEST_ITEM', value: null },
            { name: 'HIGH', value: 'HIGH' },
            { name: 'LOW', value: 'LOW' }
        ];

        function init() {
            // Read the locale code from the state
            var localeCode = $stateParams.locale;

            // Find the locale object in the list of locales for the insight
            vm.currentLocale = localeService.findLocale(localeCode, insight.gameRunLocaleList);

            // Set the item object for editing
            vm.original = convertNullPricesToZero(insightItem);
            vm.localItem = angular.copy(vm.original);

            // Needed for md-select-label
            vm.referenceItem = vm.findReferenceItem(vm.localItem.reference);

            vm.setValidation();
        }

        vm.setValidation = function () {
            vm.minAllowable = 0;
            vm.maxAllowable = 999999999.99;
            vm.validationParams = {
                min : formatter.formatCurrency(vm.minAllowable, vm.currentLocale.locale),
                max : formatter.formatCurrency(vm.maxAllowable, vm.currentLocale.locale),
                format : formatter.getNumberFormatDisplay(vm.currentLocale.locale)
            };
        };

        /**
        *   Converts prices with a null value to zero.
        *   This is needed to work with the international currency support.
        *   The fi-currency-input directive defaults to a 0 value for nulls.
        *   When doing an object compare for changes, null/zero price values must match.
        */
        function convertNullPricesToZero(item) {
            item.promotionalPrice = item.promotionalPrice === null ? 0 : parseFloat(item.promotionalPrice);
            item.unitCost = item.unitCost === null ? 0 : parseFloat(item.unitCost);
            item.testPrice = item.testPrice === null ? 0 : parseFloat(item.testPrice);
            return item;
        }

        vm.findReferenceItem = function (value) {
            return _.find(vm.referenceItemOptions, function (option) {
                return value === option.value;
            });
        };

        /**
        * Change handler for the reference item select.
        * In order to get the selected option to display properly with ng-class an
        * <md-select-label> must be used.  Instead of relying on the Model which only
        * maintains the string value, a separate object is being assigned.
        */
        vm.changeReferenceItem = function () {
            vm.referenceItem = vm.findReferenceItem(vm.localItem.reference);
        };

        /**
        *  Used to disable the save and remove buttons.
        */
        vm.isActionDisabled = function () {
            return (!gameRunStatusValue.isInSetup(vm.currentLocale) && !gameRunStatusValue.isSummarySetup(vm.currentLocale));
        };

        /**
        *   Check to see if the item has been changed, ignoring images.
        */
        vm.isItemChanged = function () {
            var omitArray = ['itemImages', 'primaryImage'];
            return !angular.equals(_.omit(vm.original, omitArray), _.omit(vm.localItem, omitArray));
        };

        vm.close = function () {
            // if the item is not in a setup status then we aren't concerned with saving changes
            if (!gameRunStatusValue.isInSetup(vm.currentLocale) && !gameRunStatusValue.isSummarySetup(vm.currentLocale)) {
                return $state.go(ITEMS_LIST_ROUTE);
            }
            // check to see if changes have been made.  If so, prompt before changing state.
            if (!vm.isItemChanged()) {
                $state.go(ITEMS_LIST_ROUTE);
            } else {
                insightEditCancelDialogService.show()
                    .then(function () {
                        $state.go(ITEMS_LIST_ROUTE);
                    });
            }
        };

        vm.save = function () {
            return insightDataService
                    .updateInsightItem(vm.insight, vm.localItem, vm.currentLocale.locale)
                    .then(function (updatedItem) {
                        // update the original item
                        vm.original = updatedItem;
                        vm.reset();
                        announceService.info('SAVED_CHANGES');
                        return updatedItem;
                    })
                    .catch(function (rejected) {
                        if (rejected === 'ERROR_CANNOT_EDIT_ITEM_FROM_PENDING_INSIGHT') {
                            dialogAlert.show('INSIGHT_ITEM_CANNOT_EDIT');
                            vm.reset();
                        } else {
                            announceService.error(rejected);
                        }
                    });
        };

        vm.remove = function () {
            var announceError = angular.bind(vm, announceService.error, 'ERROR_REMOVING_ITEM_FROM_GAMERUN', { itemName: vm.original.name });

            insightDataService.removeInsightItem(vm.currentLocale, vm.original)
                .then(function () {
                    return companyService.getCompany(fiService.companyId(), true);
                })
                .then(function (company) {
                    var message = {
                        insightName: vm.insight.name,
                        itemName: vm.original.name,
                        locale: vm.currentLocale.locale,
                        i18nEnabled: !!company.i18nEnabled
                    };
                    announceService.info('REMOVED_ITEM_FROM_GAMERUN', message);
                    $state.go(ITEMS_LIST_ROUTE);
                })
                .catch(announceError);
        };

        vm.reset = function () {
            vm.localItem = angular.copy(vm.original);
            vm.changeReferenceItem();
            $scope.itemForm.$setPristine();
        };

        vm.showImageUpload = function () {
            return (!angular.isUndefined(vm.original.itemImages) &&
                vm.original.itemImages.length < FiConstants.MAX_IMAGE_SLOTS &&
                (gameRunStatusValue.isInSetup(vm.currentLocale) || gameRunStatusValue.isSummarySetup(vm.currentLocale)));
        };

        vm.addImage = function () {
            $mdDialog.show({
                locals: {
                    item: vm.original
                },
                controller: 'InsightImagesUploadController',
                controllerAs: 'insightImagesUploadController',
                bindToController: true,
                preserveScope: true,
                templateUrl: 'insight/items/insight-images-upload.html'
            });
        };

        vm.unlinkImage = function (image) {
            var response = itemDataService.unlinkImage(vm.original, image);
            updateImages(response);
        };

        vm.setPrimaryImage = function (image) {
            var response = itemDataService.setPrimaryImage(vm.original, image);
            updateImages(response);
        };

        function updateImages(response) {
            response
                .then(function (images) {
                    vm.original.itemImages = images;
                    announceService.info('SAVED_CHANGES');

                    return vm.original;
                })
                .then(insightItemTransformer) // reset primary image
                .catch(announceService.error);
        }

        vm.enableImageOverflowMenu = function () {
            return gameRunStatusValue.isInSetupGroup(vm.currentLocale);
        };

        init();
    }

    angular
        .module('fi.insight')
        .controller('InsightSetupItemDetailController', InsightSetupItemDetailController);

}());

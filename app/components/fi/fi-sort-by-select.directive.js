(function () {
    'use strict';

    /* @ngInject */
    function FiSortBySelectDirective() {
        return {
            restrict : 'E',
            templateUrl: 'components/fi/fi-sort-by-select.directive.html',
            controller : FiSortBySelectController,
            controllerAs : 'FiSortBySelectController',
            bindToController : true,
            scope : {
                change : '&',
                defaultValue : '=',
                disabled : '=',
                visible : '=',
                currentLocale : '=',
                insightPricingEnabled : '=',
                maxGmPricingEnabled : '='
            }
        };
    }

    function FiSortBySelectController(_, localeService, $rootScope, $translate) {
        var vm = this;

        var SORT_BY_TOTAL_VALUE = 'SORT_BY_TOTAL_VALUE';
        var SORT_BY_LOVE_IT_LIKE_IT = 'SORT_BY_LOVE_IT_LIKE_IT';
        var SORT_BY_LEAVE_IT_HATE_IT = 'SORT_BY_LEAVE_IT_HATE_IT';
        var SORT_BY_TEST_PRICE = 'SORT_BY_TEST_PRICE';
        var SORT_BY_MODEL_PRICE = 'SORT_BY_MODEL_PRICE';
        var SORT_BY_MAX_GM_PRICE = 'SORT_BY_MAX_GM_PRICE';
        var SORT_BY_GM_PCT = 'SORT_BY_GM_PCT';

        function determineOptions() {
            var translationKeys = [
                SORT_BY_TOTAL_VALUE,
                SORT_BY_LOVE_IT_LIKE_IT,
                SORT_BY_LEAVE_IT_HATE_IT,
                SORT_BY_TEST_PRICE,
                SORT_BY_MODEL_PRICE,
                SORT_BY_MAX_GM_PRICE,
                SORT_BY_GM_PCT
            ];

            return $translate(translationKeys).then(function (translation) {

                var defaultOptions = [
                    {
                        prop : 'percentTestPrice', // Total Value sorts by the Percent Test Price
                        label : translation[SORT_BY_TOTAL_VALUE]
                    },
                    {
                        prop : 'overallPositive',
                        label : translation[SORT_BY_LOVE_IT_LIKE_IT]
                    },
                    {
                        prop : 'overallNegative',
                        label : translation[SORT_BY_LEAVE_IT_HATE_IT]
                    }
                ];

                if (!localeService.isAllLocales(vm.currentLocale) || !vm.i18nEnabled) {
                    if (!localeService.isAllLocales(vm.currentLocale)) {

                        defaultOptions.push({
                            prop : 'testPrice',
                            label : translation[SORT_BY_TEST_PRICE]
                        });

                        if (vm.insightPricingEnabled) {
                            if (vm.maxGmPricingEnabled) {

                                defaultOptions.push({
                                    prop : 'maxGMPrice',
                                    label : translation[SORT_BY_MAX_GM_PRICE]
                                });
                                defaultOptions.push({
                                    prop : 'maxGrossMarginPercent',
                                    label : translation[SORT_BY_GM_PCT]
                                });

                            } else {
                                defaultOptions.push({
                                    prop : 'modelPrice',
                                    label : translation[SORT_BY_MODEL_PRICE]
                                });
                            }
                        }
                    }
                }

                return defaultOptions;

            });
        }

        /**
         * Finds the default value in the list of options.  If no default value was provided, then
         * the default value is the first option in the array
         *
         * If the default value is provided, but is not in the array, the default value is the first option in the array
         * @returns {*}
         */
        function findDefaultValue() {
            if (!vm.defaultValue) {
                return vm.options[0];
            }

            return _.find(vm.options, function (option) {
                return option.prop === vm.defaultValue;
            });
        }

        function init() {

            vm.i18nEnabled = $rootScope.companyData.i18nEnabled;

            determineOptions().then(function (options) {
                vm.options = options;
                vm.selectedValue = findDefaultValue() || vm.options[0];

                // Invoke the change sort by so that any listeners are notified of the default option
                vm.changeSortBy();
            });
        }

        vm.changeSortBy = function () {

            // invoke the callback function passed in via the directive "change" attribute
            vm.change({'currentSortBy' : vm.selectedValue});
        };

        init();
    }

    angular
        .module('fi.common')
        .directive('fiSortBySelect', FiSortBySelectDirective);
}());

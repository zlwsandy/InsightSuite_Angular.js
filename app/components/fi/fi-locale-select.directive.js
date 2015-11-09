/**
 * @name fiLocaleSelect
 * @restrict E
 * @module fi.common
 *
 * @description Displays a select box, with locales as options, showing flag, name, and insight status.
 *
 * @param {array=} locales : an array of locales to display as options
 * @param {expression=} currentLocale : the locale that should currently be selected
 * @param {callback=} change : a callback event to call when the selection changes.  passes the model as an argument.
 * @param {boolean=} disabled : determines if the control is enabled/disabled.
 * @param {boolean=} visible : determines if the control is displayed/hidden.
 * @param {boolean=} resultsStatusOnly : determines if the All Locales option is included for results status only or any status. (optional argument)
 *
 * @usage
 *   <fi-locale-select
 *      locales="someController.arrayOfLocales"
 *      current-locale="someController.aLocaleObject"
 *      change="someController.anEventHandler" *NOTE:  omit the parentheses on the event name
 *      disabled="someController.boolean"
 *      visible="someController.boolean"
 *      results-status-only="someController.boolean"></fi-locale-select>
 *   </fi-locale-select>
 */
(function () {
    'use strict';

    /* @ngInject */
    function fiLocaleSelect() {

        var directive = {
            restrict: 'E',
            templateUrl: 'components/fi/fi-locale-select.directive.html',
            scope: {
                locales: '=',
                currentLocale: '=',
                change: '&',
                disabled: '=',
                visible: '=',
                resultsStatusOnly: '='
            },
            controller: FiLocaleSelectController,
            controllerAs: 'FiLocaleSelectController',
            bindToController: true
        };

        return directive;
    }

    /* @ngInject */
    function FiLocaleSelectController($scope, _, localeService, insightLocaleFactory) {

        var vm = this, SEPARATOR = '-';

        var allLocales = {
            locale : 'all',
            label : 'ALL_LOCALES',
            flagImageUrl : null
        };

        /**
         * Looks up the flag image URL for the given locale
         *
         * @param locale
         * @returns {String} - URL of flag image
         */
        function getFlagImageUrl(locale) {
            var url = null;
            if (localeService.locales[locale]) {
                url = localeService.locales[locale].desktopFlagUrl;
            }
            return url;
        }

        /**
         * Populates locale info
         */
        function populateLocaleInfo() {
            _.forEach(vm.locales, function (locale) {
                locale.flagImageUrl = getFlagImageUrl(locale.locale);
                locale.label = localeService.getLanguage(locale.locale) + SEPARATOR + locale.currencyCode;
            });
        }

        /**
         * Determines the options to set in the locales dropdown
         */
        function determineOptions() {

            // Count the locale statuses and store to an object
            var localesInResults = _.filter(vm.localeOptions, function (locale) {
                return insightLocaleFactory.isInsightLocaleResults(locale);
            });

            // If all locales have results and there is more than one locale, then add an All Locales option
            if (vm.localeOptions && vm.localeOptions.length > 1 && (!vm.resultsStatusOnly || localesInResults.length === vm.localeOptions.length)) {
                vm.localeOptions.unshift(allLocales);
            }
        }

        /**
         * Initialization function
         */
        function init() {
            populateLocaleInfo();

            // Create defensive copy of the locale array since we may be modifying it based on locale status
            vm.localeOptions = _.cloneDeep($scope.FiLocaleSelectController.locales);
            determineOptions();

            // if 'all' string is passed instead of locale object then default to 'All Locales' option
            // and trigger the change event to set the parent
            if (vm.currentLocale === 'all') {
                vm.selectedLocale = allLocales;
                vm.changeLocale();
            } else {
                vm.selectedLocale = vm.visible ? _.find(vm.localeOptions, 'locale', vm.currentLocale.locale) : null;
            }
        }

        vm.changeLocale = function () {
            // invoke the callback function passed in via the directive "change" attribute
            vm.change({'current' : vm.selectedLocale});
        };

        init();
    }

    angular
        .module('fi.common')
        .directive('fiLocaleSelect', fiLocaleSelect);
}());

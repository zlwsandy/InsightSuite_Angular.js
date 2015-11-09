/**
 * @name fiCurrency
 * @restrict E
 * @module fi.common
 *
 * @description Formats currency according to a locale
 *
 * @param {value=} value : Value to display as formatted currency
 * @param {currentLocale=} currentLocale : the locale to use for formatting the currency value
 * @param [symbolClass@] symbolClass : optional parameter to pass which will be applied to the currency symbol for
 *  styling.  This can be any string value and should represent a CSS class that will be used to style the symbol
 *  separately from the amount
 * @param {roundAtThreshold=} roundAtThreshold : optional parameter which will round the currency value if it is
 *  greater than a threshold value of 100
 *
 * @usage
 *   <fi-currency
 *      value="someController.amount"
 *      current-locale="someController.aLocaleObject"
 *      symbol-class="uom">
 *   </fi-currency>
 */
(function () {
    'use strict';

    /* @ngInject */
    function FiCurrencyDirective() {
        return {
            restrict : 'E',
            template : '<span ng-bind-html="FiCurrencyController.formatted"></span>',
            scope : {
                value : '@',
                currentLocale : '=',
                symbolClass : '@',
                roundAtThreshold : '='
            },
            controller: FiCurrencyController,
            controllerAs: 'FiCurrencyController',
            bindToController: true
        };
    }

    /* @ngInject */
    function FiCurrencyController(formatter, $scope, $sce, localeService) {

        var vm = this;
        var DEFAULT_VALUE = '0.00';

        /**
         * Returns the currency symbol for the given locale code
         *
         * @param localeCode
         * @returns String - Currency symbol
         */
        function getCurrencySymbol(localeCode) {
            var localeInfo = localeService.findLocale(localeCode);

            return localeInfo && localeInfo.numberFormat ? localeInfo.numberFormat.currencySymbol : '';
        }

        /**
         * Wrap the currency symbol in span and attach the given class to it
         *
         * @param value - Value containing the symbol
         * @param symbol - Symbol to wrap
         * @param symbolClass -  Symbol class to apply once wrapped
         * @returns {string} - Value that will be interpolated on the template as trusted HTML
         */
        function wrapSymbol(value, symbol, symbolClass) {
            return value.split(symbol).join('<span class="' + symbolClass + '">' + symbol + '</span>');
        }

        /**
         * Process the locale by getting its format information, formatting the value, and building the trusted HTML
         */
        function processLocale() {

            // Get the currency symbol for the locale code
            var symbol = getCurrencySymbol(vm.currentLocale.locale);

            // Format the value given using the formatter factory
            var preFormatted = formatter.formatCurrency(vm.value, vm.currentLocale.locale, undefined, false, vm.roundAtThreshold);

            // If a symbol class was passed, then wrap it in a span and attach the given class to the span
            if (vm.symbolClass) {
                vm.formatted = $sce.trustAsHtml(wrapSymbol(preFormatted, symbol, vm.symbolClass));
            } else {
                vm.formatted = $sce.trustAsHtml(preFormatted);
            }
        }

        /**
         * Initialization Block
         */
        function init() {
            // If no value was passed, default it to equal the default value
            vm.value = vm.value || DEFAULT_VALUE;

            // Process the given locale
            processLocale();

            // Watch the locale so that if it changes, the value is updated
            $scope.$watch(function () {
                return vm.currentLocale;
            }, processLocale, true);

            $scope.$watch(function () {
                return vm.value;
            }, processLocale);
        }

        init();
    }

    angular
        .module('fi.common')
        .directive('fiCurrency', FiCurrencyDirective);
}());

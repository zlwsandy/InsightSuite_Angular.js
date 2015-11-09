/**
 * @name fiCurrencyInput
 * @restrict E
 * @module fi.common
 *
 * @description Input directive for entering currency values.  Directive will format the value for display by using the
 *  given current locale.  The model value submitted as part of any form will be formatted to en_US value.
 *
 *  The directive also has two validations baked in:
 *
 *  Locale Format : Validation will be performed to ensure that the entered value adheres to the given locale format.
 *      See fi-locale-number-validator for validation rules around locales
 *
 *  Number Range : (optional) If a min/max is provided, the input directive will validate that the number is within a
 *      given range.  See fi-number-range-validator for validation rules.
 *
 * @param {localeCode@} localeCode : Locale code to use as the basis for the view model and any locale validation
 * @param {name@} name : Name to use on form for any form validation / ng-message display
 * @param [min@] min : Min value allowed for the input
 * @param [max@] max : Max value allowed for the input
 * @param [label@] label : Label to use as the placeholder for the input
 * @param [required=] required : Optional param to indicate the value is required
 *
 * @usage
 *   <fi-currency-input name="fieldName"
 *      locale-code="someController.currentLocale.locale"
 *      ng-model="someController.someItem.price
 *      min="0"
 *      max="999">
 *   </fi-currency-input>
 *
 */
(function () {
    'use strict';

    function FiCurrencyInputDirective(formatter, _) {

        var template = '<div layout="column"><label ng-if="label">{{label}}</label><input type="text" ng-required="required" fi-locale-number-validator name={{name}} class="currency-input" locale-code="{{localeCode}}" fi-number-range-validator min="{{min}}" max="{{max}}" aria-label="{{num}}" ng-model="num"/></div>';

        return {
            restrict: 'E',
            template: template,
            require: 'ngModel',
            replace: true,
            scope : {
                localeCode : '@',
                name : '@',
                min : '@',
                max : '@',
                label : '@',
                required : '='
            },
            link: function (scope, elem, attr, ngModelCtrl) {

                /**
                 * Format the model value for display by formatting to the locales currency and hiding the currency
                 *  symbol
                 */
                ngModelCtrl.$formatters.push(function (modelValue) {
                    return {
                        num:  formatter.formatCurrency(modelValue, scope.localeCode, 2, true)
                    };
                });

                /**
                 * Parse the view value for the model by converting back to US formats
                 */
                ngModelCtrl.$parsers.push(function (viewValue) {
                    if (_.isNull(viewValue.num)) {
                        return viewValue.num;
                    } else {
                        // convert strings to numbers.  checks the length to avoid issue with empty string parsing preventing the view from being updated.
                        return viewValue.num.length === 0 ? formatter.formatNumberToUS(viewValue.num, scope.localeCode) : parseFloat(formatter.formatNumberToUS(viewValue.num, scope.localeCode));
                    }
                });

                /**
                 * When the model value changes, update the view value
                 */
                scope.$watch('num', function (newValue, oldValue) {
                    if (!angular.equals(newValue, oldValue)) {
                        ngModelCtrl.$setViewValue({ num: scope.num });
                    }
                });

                /**
                 * Render view value changes back to the DOM
                 */
                ngModelCtrl.$render = function () {
                    if (!ngModelCtrl.$viewValue) {
                        ngModelCtrl.$viewValue = { num: 0 };
                    }

                    scope.num  = ngModelCtrl.$viewValue.num;
                };
            }
        };
    }

    angular.module('fi.common')
        .directive('fiCurrencyInput', FiCurrencyInputDirective);
}());

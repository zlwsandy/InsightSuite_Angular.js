/**
 * @name fiNumberRangeValidator
 * @restrict A
 * @module fi.common
 *
 * @description Validates an input to determine whether it contains a valid number within a specified range.  Both the
 * min and max parameters are optional.  If both are specified as valid numbers, then the validation will check
 * whether the value of the input is within that range (inclusive).
 *
 * If the min is not specified, but max is, then validation checks whether the input value is less than or equal to the
 * max
 *
 * If the max is not specified, but min is, then validation checks whether the input value is greater than or equal to
 * the min
 *
 * If neither are specified, and the input is a valid number, then validation returns true
 *
 * If input is not a valid number, validation returns false regardless of the min/max parameters
 *
 * @param [min=] min : min allowable value
 * @param [max=] max : max allowable value
 *
 * @usage
 *   <input fi-number-range-validator
 *      min="0"
 *      max="5"
 *      ng-model="someController.value">
 */
(function () {
    'use strict';

    /* @ngInject */
    function fiNumberRangeValidator(formatter) {

        return {
            require: 'ngModel',
            link: function (scope, elem, attr, ngModel) {
                var range = {
                    min : attr.min,
                    max : attr.max
                };

                var localeCode = attr.localeCode;

                /**
                 * Determines whether the given value is within the specified range
                 *
                 * @param value
                 * @param range
                 * @returns {boolean}
                 */
                scope.isRangeValid = function (value, range) {

                    var min;
                    var max;
                    var inputValue;

                    // If the value is not a valid number, then its not valid at all
                    if (isNaN(value)) {
                        return false;
                    }

                    // Convert the number to an actual Number
                    inputValue = parseFloat(value);

                    // If the min (or max) is not a number, then set to null.  Otherwise, convert to Numbers
                    min = isNaN(range.min) ? null : parseFloat(range.min, 10);
                    max = isNaN(range.max) ? null : parseFloat(range.max, 10);

                    if (min !== null) {
                        if (max !== null) {
                            return inputValue >= min && inputValue <= max;
                        }

                        return inputValue >= min;
                    }

                    if (max !== null) {
                        return inputValue <= max;
                    }

                    return true;
                };

                ngModel.$parsers.push(function (value) {
                    var formatted = formatter.formatNumberToUS(value, localeCode);
                    ngModel.$setValidity('range', scope.isRangeValid(formatted, range));
                    return value;
                });
            }
        };
    }

    angular
        .module('fi.common')
        .directive('fiNumberRangeValidator', fiNumberRangeValidator);
}());

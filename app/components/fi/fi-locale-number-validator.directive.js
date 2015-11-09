/**
 * @name fiLocaleNumberValidator
 * @restrict A
 * @module fi.common
 *
 * @description Validates a number to determine whether it is in a valid format for a given locale.
 *
 *
 * @param {localeCode=} localeCode : Locale code to use as the basis for the format to validate against
 *
 * @usage
 *   <input fi-locale-number-validator
 *      locale-code="someController.currentLocale.locale"
 *      ng-model="someController.value">
 */
(function () {
    'use strict';

    /* @ngInject */
    function fiLocaleNumberValidator(localeService, _) {

        return {
            require: 'ngModel',
            priority: 2,
            link: function (scope, elem, attr, ngModel) {

                var anyDigits = /^\d+$/;
                var oneToThreeDigits = /^\d{1,3}$/;
                var oneOrTwoDigits = /^\d{1,2}$/;
                var threeDigits = /^\d{3}$/;

                scope.validateFormat = function (value, locale) {

                    // If the locale is not found or has no number formatting, the value is invalid
                    // NOTE:  Should this be valid?
                    if (!locale || !locale.numberFormat) {
                        return false;
                    }

                    var decimalSeparator = locale.numberFormat.currencyDecimalSeparator;
                    var groupingSeparator = locale.numberFormat.groupingSeparator;
                    var wholeNumber;
                    var wholeNumberParts;
                    var fractionValid;
                    var wholeNumberValid;

                    // First split the value based on what the decimal separator is for the locale.  This will separate
                    //  the number into its whole number and fractional parts
                    var parts = value.split(decimalSeparator);

                    // If the split length is 1, then the decimal separator doesn't appear.  The resultant value
                    //  represents just the whole number portion and can then be validated for grouping
                    if (parts.length === 1) {
                        wholeNumber = parts[0];

                    } else if (parts.length === 2) {

                        // If the split length is two, then there is one occurrence of the decimal separator, which is
                        //  valid.  Next is to test whether the fractional portion is one or two digits.  If not, then
                        //  the number is invalid
                        fractionValid = oneOrTwoDigits.test(parts[1]);
                        if (!fractionValid) {
                            return false;
                        }

                        // The fractional part is one or two digits, so save off the whole number for grouping validation
                        wholeNumber = parts[0];
                    } else {
                        // If the split length is anything other than 1 or 2, this means there are more than one
                        //  occurrences of the decimal separator, which means the number is invalid
                        return false;
                    }

                    // Split the whole number based on the locale's grouping separator
                    // If the grouping separator is an empty space (i.e. fr_FR), then split using a local empty string
                    // This is done because the empty space returned from the API does not seem to work with splitting
                    //  or with equality testing.  So, to determine if it is an empty string, its trimmed and then
                    //  compared to a zero-length string
                    if (groupingSeparator.trim() === '') {
                        wholeNumberParts = wholeNumber.split(' ');
                    } else {
                        wholeNumberParts = wholeNumber.split(groupingSeparator);
                    }

                    // If the whole number split is a length of 1, then there are no grouping separators used which is
                    //  a valid format, so validate that whatever is in that split is all digits
                    if (wholeNumberParts.length === 1) {
                        return anyDigits.test(wholeNumber);
                    }

                    // If the whole number split is greater than 1, then validate each group that results from the split
                    wholeNumberValid = _.filter(wholeNumberParts, function (part, index) {

                        // The first index can be 1 to 3 digits (e.g. 1,000, 10,000, 100,000)
                        if (index === 0) {
                            return oneToThreeDigits.test(part);
                        }

                        // All other groups in the split must be three digits
                        return threeDigits.test(part);
                    });

                    // The whole number is valid if the number of valid groups is equal to the total number of groups
                    return wholeNumberValid.length === wholeNumberParts.length;
                };

                /**
                 * Determines whether the given value is valid for a locale
                 *
                 * @param value
                 * @param range
                 * @returns {boolean}
                 */
                scope.isLocaleFormatValid = function (value) {
                    var locale = localeService.findLocale(attr.localeCode);

                    return scope.validateFormat(value, locale);
                };

                ngModel.$parsers.unshift(function (value) {
                    ngModel.$setValidity('localeNumber', scope.isLocaleFormatValid(value));
                    return value;
                });
            }
        };
    }

    angular
        .module('fi.common')
        .directive('fiLocaleNumberValidator', fiLocaleNumberValidator);
}());

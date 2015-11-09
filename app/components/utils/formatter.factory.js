/**
 * Formatter Factory for formatting numbers and currency
 *
 * Note:  Most of this code was lifted from Angular's source code for its number and currency filters.  It was then
 * repurposed so that the code was used as a factory instead and then changed to integrate with First Insight locale
 * configurations and formats rather than Angular's $locale service
 */
(function () {
    'use strict';

    /* @ngInject */
    function NumberFormatter(_, localeService) {

        var DECIMAL_SEP = '.';
        var CURRENCY_ROUND_THRESHOLD = 100;

        // Number patterns.  Note these are from Angular's locale format files.  Should eventually be moved to
        // the locale service API
        var patterns = [
            {
                gSize: 3,
                lgSize: 3,
                maxFrac: 3,
                minFrac: 0,
                minInt: 1,
                negPre: '-',
                negSuf: '',
                posPre: '',
                posSuf: ''
            },
            {
                gSize: 3,
                lgSize: 3,
                maxFrac: 2,
                minFrac: 2,
                minInt: 1,
                negPre: '\u00a4-',
                negSuf: '',
                posPre: '\u00a4',
                posSuf: ''
            }
        ];

        /**
         * Returns the locale number formats for a given locale code.
         *
         * @param localeCode
         * @returns {*}
         */
        function getLocaleNumberFormats(localeCode) {
            var localeInfo = localeService.findLocale(localeCode);

            return _.isEmpty(localeInfo) ? localeInfo : localeInfo.numberFormat;
        }

        /**
         * Formats a number for a given locale code with optional fraction size
         *
         * @param number
         * @param localeCode
         * @param fractionSize
         * @returns {*}
         */
        function formatNumber(number, localeCode, fractionSize) {

            // If number is undefined or null or the locale code is not provided, return whatever was given as
            //  the number value
            if (_.isUndefined(number) || _.isNull(number) || !localeCode) {
                return number;
            }

            var formats = getLocaleNumberFormats(localeCode);

            // If the locale code is not supported by the locale API, then simply return the number
            return !formats ? number : formatValue(number, patterns[0], formats.groupingSeparator,
                formats.currencyDecimalSeparator, fractionSize);
        }

        /**
         * Formats a number from an origin locale into the en_US locale.  Useful for converting for doing mathematical
         * operations against different locales
         *
         * @param number - Number to reformat
         * @param originLocale - Origin locale in which number is currently formatted
         * @param groupNumbers - If true, will apply the en_US grouping separator (,) to the whole number if applicable
         */
        function formatNumberToUS(number, originLocaleCode, groupNumbers) {

            var formats;
            var parts;

            // If number is undefined or null or the locale code is not provided, return whatever was given as
            //  the number value
            if (_.isUndefined(number) || _.isNull(number) || !originLocaleCode) {
                return number;
            }

            formats = getLocaleNumberFormats(originLocaleCode);

            if (!formats) {
                return number;
            }

            parts = number.split(formats.currencyDecimalSeparator);

            // Split the whole number based on the locale's grouping separator
            // If the grouping separator is an empty space (i.e. fr_FR), then split using a local empty string
            // This is done because the empty space returned from the API does not seem to work with splitting
            //  or with equality testing.  So, to determine if it is an empty string, its trimmed and then
            //  compared to a zero-length string
            if (formats.groupingSeparator.trim() === '') {
                parts[0] = parts[0].split(/\s/).join(groupNumbers ? ',' : '');
            } else {
                parts[0] = parts[0].split(formats.groupingSeparator).join(groupNumbers ? ',' : '');
            }

            return parts.join('.');
        }

        /**
         * Format currency.
         *
         * @param amount
         * @param localeCode
         * @param fractionSize - Fraction digits to format to.  If not specified, the locale's currency fraction digits
         *  is used
         * @param hideCurrencySymbol - If true, returned string will not contain currency symbol
         * @param roundAtThreshold - If true, function will round the returned formatted currency value at a
         *  threshold of 100.  Will override the fractionSize and locale currency fraction digits if true
         * @returns {*}
         */
        function formatCurrency(amount, localeCode, fractionSize, hideCurrencySymbol, roundAtThreshold) {

            var formats;
            var currencySymbol;
            var formattedValue;

            // If amount is undefined or null or the locale code is not provided, return whatever was given as
            //  the amount value
            if (_.isUndefined(amount) || _.isNull(amount) || !localeCode) {
                return amount;
            }

            formats = getLocaleNumberFormats(localeCode);

            // If the formats weren't found, don't attempt to format the number.  Just return the given amount as-is
            if (!formats) {
                return amount;
            }

            currencySymbol = formats.currencySymbol;

            // If roundAtThreshold is true, then set the fraction digits to 0
            if (roundAtThreshold) {
                if (amount >= CURRENCY_ROUND_THRESHOLD) {
                    fractionSize = 0;
                } else {
                    // If fraction size was not provided, then use the fraction digits for the locale format
                    if (_.isUndefined(fractionSize) || _.isNull(fractionSize)) {
                        fractionSize = formats.currencyFractionDigits;
                    }
                }
            } else {
                // If fraction size was not provided, then use the fraction digits for the locale format
                if (_.isUndefined(fractionSize) || _.isNull(fractionSize)) {
                    fractionSize = formats.currencyFractionDigits;
                }
            }

            formattedValue = formatValue(amount, patterns[1], formats.groupingSeparator, formats.currencyDecimalSeparator, fractionSize);

            return hideCurrencySymbol ?
                formattedValue.replace(/\u00A4/g, '') :
                formattedValue.replace(/\u00A4/g, currencySymbol);
        }

        /**
         * Returns a number format for display on screen
         *
         * @param localeCode
         * @returns {string}
         */
        function getNumberFormatDisplay(localeCode) {

            var formats = getLocaleNumberFormats(localeCode);

            return '#' + formats.groupingSeparator + '###' + formats.currencyDecimalSeparator + '##';
        }

        /**
         * Formats a number value
         *
         * @param number
         * @param pattern
         * @param groupSep
         * @param decimalSep
         * @param fractionSize
         * @returns {*}
         */
        function formatValue(number, pattern, groupSep, decimalSep, fractionSize) {

            if (_.isObject(number)) {
                return '';
            }

            var isNegative = number < 0;
            number = Math.abs(number);

            var isInfinity = number === Infinity;
            if (!isInfinity && !isFinite(number)) {
                return '';
            }

            var numStr = number + '',
                formatedText = '',
                hasExponent = false,
                parts = [];

            // Return the infinity symbol if the number is Infinity
            if (isInfinity) {
                formatedText = '\u221e';
            }

            if (!isInfinity && numStr.indexOf('e') !== -1) {
                var match = numStr.match(/([\d\.]+)e(-?)(\d+)/);
                if (match && match[2] === '-' && match[3] > fractionSize + 1) {
                    number = 0;
                } else {
                    formatedText = numStr;
                    hasExponent = true;
                }
            }

            if (!isInfinity && !hasExponent) {
                var fractionLen = (numStr.split(DECIMAL_SEP)[1] || '').length;

                // determine fractionSize if it is not specified
                if (_.isUndefined(fractionSize) || _.isNull(fractionSize)) {
                    fractionSize = Math.min(Math.max(pattern.minFrac, fractionLen), pattern.maxFrac);
                }

                // safely round numbers in JS without hitting imprecisions of floating-point arithmetics
                // inspired by:
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
                number = +(Math.round(+(number.toString() + 'e' + fractionSize)).toString() + 'e' + -fractionSize);

                var fraction = ('' + number).split(DECIMAL_SEP);
                var whole = fraction[0];
                fraction = fraction[1] || '';

                var i, pos = 0,
                    lgroup = pattern.lgSize,
                    group = pattern.gSize;

                if (whole.length >= (lgroup + group)) {
                    pos = whole.length - lgroup;
                    for (i = 0; i < pos; i++) {
                        if ((pos - i) % group === 0 && i !== 0) {
                            formatedText += groupSep;
                        }
                        formatedText += whole.charAt(i);
                    }
                }

                for (i = pos; i < whole.length; i++) {
                    if ((whole.length - i) % lgroup === 0 && i !== 0) {
                        formatedText += groupSep;
                    }
                    formatedText += whole.charAt(i);
                }

                // format fraction part.
                while (fraction.length < fractionSize) {
                    fraction += '0';
                }

                if (fractionSize && fractionSize !== '0') {
                    formatedText += decimalSep + fraction.substr(0, fractionSize);
                }
            } else {
                if (fractionSize > 0 && number < 1) {
                    formatedText = number.toFixed(fractionSize);
                    number = parseFloat(formatedText);
                }
            }

            if (number === 0) {
                isNegative = false;
            }

            parts.push(isNegative ? pattern.negPre : pattern.posPre,
                formatedText,
                isNegative ? pattern.negSuf : pattern.posSuf);

            return parts.join('');
        }

        return {
            formatNumber : formatNumber,
            formatCurrency : formatCurrency,
            getNumberFormatDisplay : getNumberFormatDisplay,
            formatNumberToUS : formatNumberToUS
        };
    }

    angular
        .module('fi.common')
        .factory('formatter', NumberFormatter);
}());

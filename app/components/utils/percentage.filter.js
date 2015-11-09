/**
 * @name percentage
 * @module fi.common
 *
 * @description Filter for formatting decimal numbers into whole number percentages
 *
 * @param {input} input : The number to format.  If input is not a valid number, NaN is returned
 * @param {decimals} decimals : Integer representing the number of decimals to format the percentage.  If no decimals are
 *  specified or the value is not a valid number, 0 is used
 * @param {callback} showPercentSign : Boolean indicating whether to display the percent sign in the displayed result.
 *  Defaults to false.
 *
 * @usage
 *   <div
 *      {{someController.someDecimalValue | percentage: 0:false}}
 *   </div>
 */
(function () {
    'use strict';

    /* @ngInject */
    function percentage($filter) {
        return function (input, decimals, showPercentSign) {
            if (isNaN(input)) {
                return NaN;
            }
            if (!decimals || isNaN(decimals)) {
                decimals = 0;
            }

            var formatted = $filter('number')(input * 100, decimals);

            if (showPercentSign) {
                formatted += '%';
            }
            return formatted;
        };
    }

    angular
        .module('fi.common')
        .filter('percentage', percentage);
}());

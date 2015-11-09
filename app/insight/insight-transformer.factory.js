(function () {
    'use strict';

    /* @ngInject */
    function InsightTransformer(_, localeService) {

        // var calculateLocaleTotals = function (locales) {
        //
        //     var localeTotals = {};
        //     if (!locales || locales.length === 0) {
        //         return {
        //             total: 0
        //         };
        //     }
        //
        //     localeTotals = _.countBy(locales, function (locale) {
        //         return locale.gameRunStatus;
        //     });
        //
        //     localeTotals.total = locales.length;
        //
        //     return localeTotals;
        // };

        var transformResponse = function (insight) {

            insight.createTimeConverted = new Date(insight.createTime);

            if (insight.completionDate) {
                insight.completionDateConverted = new Date(insight.completionDate);
            }

            if (insight.collectionStartDate) {
                insight.collectionStartDateConverted = new Date(insight.collectionStartDate);
            }

            if (insight.locale) {
                insight.language = localeService.getLanguage(insight.locale);
                insight.currency = localeService.findLocale(insight.locale).numberFormat.currencyCode;
            }

            return insight;
        };

        return function (results) {
            var totalAvailable = results.totalAvailable;
            results = angular.fromJson(results);

            // if (results.gameRunLocaleList) {
            //     results.localeTotals = calculateLocaleTotals(results.gameRunLocaleList);
            // }

            if (_.isArray(results)) {
                results = _.map(results, transformResponse);
                results.totalAvailable = totalAvailable;

                return results;
            }

            return transformResponse(results);
        };

    }

    angular
        .module('fi.insight')
        .factory('insightTransformer', InsightTransformer);
}());

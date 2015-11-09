(function () {
    'use strict';

    /* @ngInject */
    function InsightLocaleFactory(_, localeService) {

        // List of Insight Locale Statuses that indicate results
        var resultsInsightLocaleStatuses = [
            'summary_results',
            'results',
            'hidden'
        ];

        // List of Insight Locale Statuses that indicate setup
        var setupInsightLocaleStatuses = [
            'setup',
            'denied',
            'summary_setup'
        ];

        /**
         * Returns whether the given insight-locale has results
         *
         * @param insightLocale object (note only the object can be passed)
         * @returns {boolean}
         */
        function isInsightLocaleResults(insightLocale) {
            var insightLocaleStatus;
            if (!insightLocale || !insightLocale.gameRunStatus) {
                return false;
            }
            insightLocaleStatus = insightLocale.gameRunStatus.toLowerCase();

            return _.includes(resultsInsightLocaleStatuses, insightLocaleStatus);
        }

        /**
         * Returns whether the given insight-locale is in setup
         *
         * @param locale object (note only the object can be passed)
         * @returns {boolean}
         */
        function isInsightLocaleInSetup(insightLocale) {
            var insightLocaleStatus;
            if (!insightLocale || !insightLocale.gameRunStatus) {
                return false;
            }
            insightLocaleStatus = insightLocale.gameRunStatus.toLowerCase();

            return _.includes(setupInsightLocaleStatuses, insightLocaleStatus);
        }

        /**
         * Finds the locale code in the given list of insight locales.
         *
         * If the locale code indicates All Locales:
         *
         *      If the list of insight locales are all in results status and there is more than one in the list, then
         *          function will return a mock All Locales object
         *
         *      If the list of insight locales only contains one insight locale and it is in results status, then
         *          function will return that insight locale
         *
         *      If the list of insight locales contains only some in results status, function will return undefined.
         *
         * If the locale code does not indicate All Locales, then an attempt will be made to find the given locale
         * code among the list of insight locales.  If found it will be returned.
         *
         * If the locale cannot be found or the locales list is falsy or empty, then function will return undefined
         *
         * @param localeCode
         * @return {locale}
         */
        function findInsightLocale(localeCode, insightLocales) {

            if (!insightLocales || insightLocales.length === 0) {
                return undefined;
            }

            // If the locale code indicates All Locales are chosen, then mock an All Locales object as the current locale
            //  This is done because the list of available locales on the insight won't contain an 'All Locale' so it
            //  needs mocked when needed
            if (localeService.isAllLocales(localeCode)) {

                // Count the locale statuses and store to an object
                var localesInResults = _.filter(insightLocales, function (locale) {
                    return isInsightLocaleResults(locale);
                });

                if (localesInResults.length === insightLocales.length) {
                    if (insightLocales.length > 1) {
                        return localeService.allLocales;
                    }

                    return insightLocales[0];
                }

                return undefined;
            }

            if (insightLocales) {
                return _.find(insightLocales, function (locale) {
                    return localeCode === locale.locale;
                });
            }

            return undefined;
        }

        return {
            isInsightLocaleResults : isInsightLocaleResults,
            isInsightLocaleInSetup : isInsightLocaleInSetup,
            findInsightLocale : findInsightLocale
        };
    }

    angular
        .module('fi.insight')
        .factory('insightLocaleFactory', InsightLocaleFactory);
}());

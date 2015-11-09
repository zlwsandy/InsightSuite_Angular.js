(function () {
    'use strict';

    /* @ngInject */
    function LocaleService(utilsService, $http, $q, _) {
        var locales = {};
        var deferred = $q.defer();

        // Object representing All Locales
        var allLocales = {
            locale : 'all',
            label : 'All Locales',
            flagImageUrl : null
        };

        function init() {
            $http
                .get('/api/fi/locales')
                .then(utilsService.transformHttpPromise)
                .then(function (data) {
                    var length = data.length;
                    var locale;
                    for (var i = 0; i < length; i++) {
                        locale = data[i].locale;
                        locales[locale] = data[i];
                    }
                })
                .then(function () {
                    deferred.resolve();
                })
                .catch(function () {
                    deferred.reject();
                });
        }

        function isInitialized() {
            return deferred.promise;
        }

        // Private function - Tests whether the given localeCode is representative of 'All Locales'
        function isAllLocaleCode(localeCode) {
            return localeCode.toLowerCase() === 'all';
        }

        /**
         * Returns whether the given locale object or locale code represents 'All Locales'
         *
         * @param Either a locale object or a string representing the locale code.  If parameter is not
         *  an object or a string, then function will return false
         *
         * @returns {boolean}
         */
        function isAllLocales(locale) {
            if (!locale) {
                return false;
            }
            if (_.isString(locale)) {
                return isAllLocaleCode(locale);
            }
            if (_.isObject(locale) && locale.locale) {
                return isAllLocaleCode(locale.locale);
            }
            return false;
        }

        /**
         * FIXME - Refactor calls to this to use insightLocaleFactory (as it was a few months ago...)
         *
         * Finds the locale code in the given list of locales.  If the locale code indicates All Locales, function will
         * return an 'All Locale' object.  If the locale cannot be found or the locales list is falsy or empty, then
         * function will return undefined
         *
         * @param localeCode
         * @deprecated - Use insightLocaleFactory.findInsightLocale
         */
        function findLocale(localeCode, localesList) {

            // If the locale code indicates All Locales are chosen, then mock an All Locales object as the current locale
            //  This is done because the list of available locales on the insight won't contain an 'All Locale' so it
            //  needs mocked when needed
            if (isAllLocales(localeCode)) {
                return allLocales;
            }

            if (localesList) {
                return _.find(localesList, function (locale) {
                    return localeCode === locale.locale;
                });
            }

            return locales[localeCode];
        }

        /**
         * Returns the language string associated with the localeCode.
         *
         * @param localeCode
         */
        function getLanguage(localeCode) {
            var lang = _.first(localeCode.split('_'));
            return lang || localeCode;
        }

        /**
         * Looks up the flag image URL for the given locale
         *
         * @param locale
         * @returns {String} - URL of flag image
         */
        function getFlagImageUrl(locale) {
            var url = null;
            if (locales[locale]) {
                url = locales[locale].desktopFlagUrl;
            }
            return url;
        }

        init();

        return {
            isInitialized: isInitialized,
            locales: locales,
            findLocale : findLocale,
            isAllLocales : isAllLocales,
            getLanguage: getLanguage,
            getFlagImageUrl: getFlagImageUrl,
            allLocales : _.cloneDeep(allLocales)
        };
    }

    angular
        .module('fi.common')
        .service('localeService', LocaleService);
}());

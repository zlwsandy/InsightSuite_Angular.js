(function () {
    'use strict';

    var app = angular.module('fi', [
        'fi.insight',
        'fi.wave',
        'fi.common',
        'fi.login',
        'fi.imgcrop',
        'fi.constants',
        'ngMaterial',
        'ui.router',
        'pascalprecht.translate',
        'infinite-scroll',
        'ngCookies',
        'ngClipboard',
        'ngMessages',
        'highcharts-ng',
        'ngSanitize'
    ]);

    angular.module('fi.common', [
        'fi.constants',
        'ngMaterial',
        'ui.router',
        'pascalprecht.translate',
        'infinite-scroll',
        'ngCookies',
        'ngClipboard',
        'ngMessages',
        'highcharts-ng'
    ]);

    var insight = angular.module('fi.insight', [
        'fi.common',
        'fi.imgcrop',
        'fi.constants',
        'ngMaterial',
        'ui.router',
        'pascalprecht.translate',
        'infinite-scroll',
        'ngCookies',
        'ngClipboard',
        'ngMessages',
        'flow',
        'highcharts-ng',
        'ngSanitize'
    ]);

    angular.module('fi.wave', [
        'fi.common',
        'fi.imgcrop',
        'fi.constants',
        'ngMaterial',
        'ui.router',
        'pascalprecht.translate',
        'infinite-scroll',
        'ngCookies',
        'ngClipboard',
        'ngMessages',
        'highcharts-ng'
    ]);

    angular.module('fi.login', [
        'fi.common',
        'fi.imgcrop',
        'fi.constants',
        'ngMaterial',
        'ui.router',
        'pascalprecht.translate',
        'ngCookies',
        'ngClipboard',
        'ngMessages',
        'highcharts-ng'
    ]);

    angular.module('fi.constants', []);

    //For performance infinte-scroll can only be called every 2 seconds
    angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 2000);

    insight.config(['flowFactoryProvider', function (flowFactoryProvider) {
        flowFactoryProvider.defaults = {
            testChunks: false,
            permanentErrors : [500, 501],
            maxChunkRetries : 1,
            withCredentials : true,
            simultaneousUploads: 1
        };
    }]);

    /* @ngInject */
    app.config(function ($httpProvider) {
        $httpProvider.interceptors.push('companyCookieInterceptorFactory');
    });

    /* @ngInject */
    app.run(function ($translate, $window, $rootScope, routeErrorHandler) {
        angular
            .element($window)
            .on('storage', function (event) {
                if (event.key === $translate.storageKey() && event.newValue !== event.oldValue) {
                    $translate.use(event.newValue);
                }
            });

        // State Change Events
        $rootScope.$on('$stateChangeSuccess', function (event, to, toParams, from, fromParams) {

            // Grow the headers back to normal size on state change
            $rootScope.$broadcast('scrollGrow');

            $rootScope.previousState = from;
            $rootScope.previousStateParams = fromParams;
        });

        $rootScope.$on('$stateChangeError', routeErrorHandler.errorHandler);
    });
}());

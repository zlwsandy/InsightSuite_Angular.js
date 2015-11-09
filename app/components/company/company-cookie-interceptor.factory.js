(function () {
    'use strict';

    /* @ngInject */
    function companyCookieInterceptorFactory($cookies, $window, $q) {
        function request(config) {
            if (angular.isUndefined($cookies.cid)) {
                $window.location.href = '/logoff.fi';

                // probably not needed but Justin Case said to
                return $q.reject();
            }

            return config;
        }

        return {
            request: request
        };
    }

    angular
        .module('fi.common')
        .factory('companyCookieInterceptorFactory', companyCookieInterceptorFactory);
}());

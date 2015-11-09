(function () {
    'use strict';

    /* @ngInject */
    function fiService($cookies, $http, $q, utilsService, $window) {
        var baseGameUrl;

        $http.get('/api/fi/gameplayUrl').success(function (data) {
            baseGameUrl = data.data;
        });

        function logoff() {
            $window.location.href = '/logoff.fi';
        }

        function companyId() {
            return $cookies.cid;
        }

        function gameplayBaseUrl() {
            return baseGameUrl;
        }

        function currentUser() {
            return $http
                .get('/api/fi/currentuser', {cache: true})
                .then(utilsService.transformHttpPromise);
        }

        function getCompanyList() {
            return $http
                .get('/api/fi/companies', {cache: false})
                .then(utilsService.transformHttpPromise);
        }

        function isSysAdmin() {
            return currentUser()
            .then(function (user) {
                if (user.userRole === 'SYSADMIN') {
                    return true;
                } else {
                    return $q.reject(false);
                }
            });
        }

        function isFiAdmin() {
            return currentUser()
            .then(function (user) {
                if (user.userRole === 'FIADMIN') {
                    return true;
                } else {
                    return $q.reject(false);
                }
            });
        }

        function isCompanyAdmin() {
            return currentUser()
            .then(function (user) {
                if (user.userRole === 'COMPANYADMIN') {
                    return true;
                } else {
                    return $q.reject(false);
                }
            });
        }

        function isAdmin() {
            return currentUser()
            .then(function (user) {
                if (user.userRole === 'SYSADMIN' || user.userRole === 'FIADMIN') {
                    return true;
                } else {
                    return $q.reject(false);
                }
            });
        }

        function serverTime() {
            return $http
                .get('/api/fi/time')
                .then(utilsService.transformHttpPromise)
                .then(function (data) {
                    return new Date(data.serverTime);
                });
        }

        return {
            companyId: companyId,
            getCompanyList: getCompanyList,
            gameplayBaseUrl: gameplayBaseUrl,
            currentUser: currentUser,
            isSysAdmin: isSysAdmin,
            isFiAdmin: isFiAdmin,
            isCompanyAdmin: isCompanyAdmin,
            isAdmin: isAdmin,
            logoff: logoff,
            serverTime: serverTime
        };
    }

    angular
        .module('fi.common')
        .factory('fiService', fiService);
}());

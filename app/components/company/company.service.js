(function () {
    'use strict';

    /* @ngInject */
    function CompanyService(fiService, utilsService, $http, $q) {
        function getCompany(id, doCache) {
            return $http
                .get('../api/company/' + id, { cache: doCache })
                .catch(function (response) {
                    return $q.reject(response.data.message);
                }).then(function (response) {
                    return response.data.data;
                });
        }

        function getLocaleList() {
            var promise = $http.get('../api/company/' + fiService.companyId() + '/locales');

            return utilsService.transformHttpPromise(promise);
        }

        return {
            getCompany: getCompany,
            getLocaleList: getLocaleList
        };
    }

    angular
        .module('fi.common')
        .service('companyService', CompanyService);
}());

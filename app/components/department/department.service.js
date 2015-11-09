(function () {
    'use strict';

    /* @ngInject */
    function departmentService(fiService, utilsService, $http) {

        function getDepartments() {
            return $http.get('../api/departments/company/' + fiService.companyId())
                .then(utilsService.transformHttpPromise);
        }

        return {
            getDepartments: getDepartments
        };
    }

    angular
        .module('fi.common')
        .factory('departmentService', departmentService);
}());

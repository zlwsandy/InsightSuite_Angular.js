(function () {
    'use strict';

    /* @ngInject */
    function LoginService($http, companyService) {

        /**
         * Set company to admin by issuing request to obtain company cookie and then subsequently retrieving
         *  company information
         * @param id - Company ID to admin
         * @return {Promise} - Promise that resolves to the company data matching the given ID
         */
        function setCompanyToAdmin(id) {
            return $http
                .get('/secure/company!adminCompany.fi?id=' + id, {cache: false})
                    .then(angular.bind(null, companyService.getCompany, id, true));
        }

        return {
            setCompanyToAdmin: setCompanyToAdmin
        };
    }

    angular
        .module('fi.login')
        .service('loginService', LoginService);
}());

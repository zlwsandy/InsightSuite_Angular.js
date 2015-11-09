(function () {
    'use strict';

    /* @ngInject */
    function LoginAdminCompanyController(fiService, loginService, $state, $rootScope) {
        var vm = this;
        vm.companySelected = null;
        vm.showProgressLoader = true;

        function getCompanyList() {
            fiService
                .getCompanyList()
                .then(function (companies) {
                    vm.showProgressLoader = false;
                    vm.companyList = companies;
                });
        }

        function setCompanyToAdmin() {
            if (vm.companySelected === null) {
                return;
            }

            // Set company to admin and then set company data on rootScope
            //  This data in rootScope is what allows the main routes in the application to proceed
            loginService.setCompanyToAdmin(vm.companySelected).then(function (data) {
                $rootScope.companyData = data;
            });
        }

        function init() {
            var id = fiService.companyId();
            if (!(id && id > 0)) {

                if (angular.isUndefined(id)) {
                    fiService.logoff();
                } else {
                    getCompanyList();
                }
            } else {
                $state.go('insightsListTab.results');
            }
        }

        init();

        vm.setCompanyToAdmin = setCompanyToAdmin;
    }

    angular
        .module('fi.login')
        .controller('LoginAdminCompanyController', LoginAdminCompanyController);
}());

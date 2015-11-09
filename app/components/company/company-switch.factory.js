(function () {
    'use strict';

    /* @ngInject */
    function companySwitchFactory(_, companyService, announceService, fiService, $mdDialog, $state) {
        function administeringNewCompany(id) {
            var inform = _.partial(announceService.info, 'ADMINISTERING_NEW_COMPANY');

            return companyService
                .getCompany(id, true)
                .then(inform);
        }

        function watch(newCompanyId) {
            //If companyId is not set then forward to login screen to force the user to admin a company
            if (!(newCompanyId && newCompanyId > 0)) {

                if (angular.isUndefined(newCompanyId)) {
                    fiService.logoff();
                } else {
                    $state.go('loginAdminCompany');
                }
            } else {
                $state.go('insightsListTab.results');

                return $mdDialog
                    .cancel()
                    .then(administeringNewCompany(newCompanyId));
            }
        }

        return {
            watch: watch
        };
    }

    angular
        .module('fi.common')
        .factory('companySwitchFactory', companySwitchFactory);
}());

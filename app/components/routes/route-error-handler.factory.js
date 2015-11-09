(function () {
    'use strict';

    /* @ngInject */
    function RouteErrorHandlerFactory(_, companyService, announceService, fiService, $mdDialog, $state) {

        function errorHandler(event, toState, toParams, fromState, fromParams, error) {
            var id = fiService.companyId();

            if (!(id && id > 0)) {
                event.preventDefault();

                if (angular.isUndefined(id)) {
                    fiService.logoff();
                } else {
                    $state.transitionTo('loginAdminCompany');
                }

                return;
            }

            if (error === 'not admin') {
                event.preventDefault();
                $state.transitionTo('403');
            }
        }

        return {
            errorHandler: errorHandler
        };
    }

    angular
        .module('fi.common')
        .factory('routeErrorHandler', RouteErrorHandlerFactory);
}());

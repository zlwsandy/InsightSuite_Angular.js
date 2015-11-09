/**
 * @name        ConfirmExit
 * @restrict    A
 * @module      fi.common
 *
 * @description
 *
 * @param {boolean} confirmExit : tells the directive if the page is dirty or not.
 *                                if it is dirty then it prompts the confirm dialog.
 *
 * @usage
 *      <div confirm-exit="someForm.$dirty"></div>
 */
(function () {
    'use strict';

    function ConfirmExitController($rootScope, $scope, $state, insightEditCancelDialogService, $cookies) {
        var vm = this;

        $scope.$on('$stateChangeStart', function (event, toState, toParams) {
            if (vm.confirmExit && !($cookies.cid <= 0 || angular.isUndefined($cookies.cid))) {
                event.preventDefault();
                insightEditCancelDialogService.show(event).then(function () {
                    vm.confirmExit = false;
                    $state.go(toState.name, toParams);
                });
            }
        });
    }

    /* @ngInject */
    function ConfirmExit() {
        return {
            restrict: 'A',
            scope: {
                confirmExit: '='
            },
            controller: ConfirmExitController,
            controllerAs: 'ConfirmExitController',
            bindToController: true
        };
    }

    angular
        .module('fi.common')
        .directive('confirmExit', ConfirmExit);
}());

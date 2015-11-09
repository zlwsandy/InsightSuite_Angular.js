(function () {
    'use strict';

    /* @ngInject */
    function ProgressService($mdDialog) {

        var vm = this;

        vm.hide = function () {
            $mdDialog.hide('close');
        };

        vm.show = function () {
            return $mdDialog.show({
                templateUrl: 'components/utils/fi-progress.html'
            });
        };
    }

    angular
        .module('fi.common')
        .service('progressService', ProgressService);
}());

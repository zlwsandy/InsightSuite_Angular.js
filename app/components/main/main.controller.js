(function () {
    'use strict';

    /* @ngInject */
    function MainController(companySwitchFactory, fiService, menuService, $scope) {
        var vm = this;

        function init() {
            vm.menu = menuService;

            $scope.$watch(fiService.companyId, companySwitchFactory.watch);
        }

        init();
    }

    angular
        .module('fi.common')
        .controller('MainController', MainController);
}());

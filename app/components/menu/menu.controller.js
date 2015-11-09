(function () {
    'use strict';

    /* @ngInject */
    function MenuController($mdSidenav, menuConfig, menuService) {
        var vm = this;

        function init() {
            vm.toggleLeft = function () {
                $mdSidenav('left').toggle();
            };

            vm.config = menuConfig;
            menuService.name = menuConfig.name;
        }

        init();
    }

    angular
        .module('fi.common')
        .controller('MenuController', MenuController);
}());

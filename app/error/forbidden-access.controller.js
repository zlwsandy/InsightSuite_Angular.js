(function () {
    'use strict';

    /* @ngInject */
    function ForbiddenAccessController(menuConfig, menuService, serverTime) {
        var vm = this;

        vm.config = menuConfig;
        vm.currentYear = serverTime.getFullYear();
        menuService.name = menuConfig.name;
    }

    angular
        .module('fi.common')
        .controller('ForbiddenAccessController', ForbiddenAccessController);
}());

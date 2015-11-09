(function () {
    'use strict';

    /* @ngInject */
    function menuService() {
        return {
            name: 'FIRST_INSIGHT'
        };
    }

    angular
        .module('fi.common')
        .factory('menuService', menuService);
}());

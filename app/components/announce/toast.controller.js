(function () {
    'use strict';

    /* @ngInject */
    function ToastController(content, $mdToast) {
        var vm = this;

        vm.content = content;

        vm.dismissToast = function () {
            $mdToast.hide();
        };
    }

    angular
        .module('fi.common')
        .controller('ToastController', ToastController);
}());

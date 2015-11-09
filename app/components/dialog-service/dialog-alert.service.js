(function () {
    'use strict';

    /* @ngInject */
    function DialogAlertService($log, $mdDialog) {

        var vm = this;

        var OK = 'OK';


        vm.show = function (title, message, onClose) {
            return $mdDialog.show({
                templateUrl: 'components/dialog-service/dialog-alert.html',
                controller : function (title, message, $mdDialog) {
                    this.title = title;
                    this.message = message;
                    this.ok = OK;

                    this.close = function () {
                        $mdDialog.hide('close');
                        if (onClose) {
                            onClose();
                        }
                    };
                },
                controllerAs : 'dialogAlertServiceController',
                locals : {
                    title : title,
                    message : message,
                    onClose : onClose
                }
            });
        };

    }

    angular
        .module('fi.common')
        .service('dialogAlertService', DialogAlertService);
}());

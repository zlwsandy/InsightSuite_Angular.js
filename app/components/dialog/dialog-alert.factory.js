(function () {
    'use strict';

    /* @ngInject */
    function dialogAlert($log, $mdDialog, $translate) {
        var OK = 'OK';

        function show(message, data) {
            return $translate([message, OK], data)
                .then(showAlertDialog(message));
        }

        function showAlertDialog(MESSAGE) {
            return function (translations) {
                var dialog = $mdDialog
                    .alert()
                    .content(translations[MESSAGE])
                    .ok(translations[OK]);

                $log.info(translations[MESSAGE]);
                return $mdDialog.show(dialog);
            };
        }

        return {
            show: show
        };
    }

    angular
        .module('fi.common')
        .factory('dialogAlert', dialogAlert);
}());

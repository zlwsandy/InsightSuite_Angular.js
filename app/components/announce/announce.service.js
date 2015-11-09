(function () {
    'use strict';

    var TOAST_DELAY = 5 * 1000;

    /* @ngInject */
    function announceService($log, $mdToast, $translate) {
        function log(message, data) {
            return $translate(message, data)
                .then(toast('log'));
        }
        function info(message, data) {
            return $translate(message, data)
                .then(toast('info'));
        }
        function warn(message, data) {
            return $translate(message, data)
                .then(toast('warn'));
        }
        function error(message, data) {
            message = (!angular.isString(message) && 'UNKNOWN_ERROR') || message;
            return $translate(message, data)
                .then(function (t) {
                    if (t === 'NO_LABEL') {
                        t = $translate('UNKNOWN_ERROR');
                    }

                    return t;
                })
                .then(toast('error'));
        }
        function debug(message, data) {
            return $translate(message, data)
                .then(toast('debug'));
        }

        function toast(logLevel) {

            return function (translatedMessage) {

                $log[logLevel](translatedMessage);

                var toast = $mdToast.build({
                    controller : 'ToastController',
                    controllerAs : 'toastController',
                    locals : {
                        content : translatedMessage
                    },
                    templateUrl : 'components/announce/toast.html',
                    hideDelay : TOAST_DELAY
                });

                return $mdToast.show(toast);
            };
        }

        return {
            log: log,
            info: info,
            warn: warn,
            error: error,
            debug: debug
        };
    }

    angular
        .module('fi.common')
        .factory('announceService', announceService);
}());

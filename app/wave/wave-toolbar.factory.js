(function () {
    'use strict';

    /* @ngInject */
    function WaveToolbarFactory() {
        var onlyLive = false;

        return {
            onlyLive: onlyLive
        };
    }

    angular
        .module('fi.wave')
        .factory('waveToolbarFactory', WaveToolbarFactory);
}());

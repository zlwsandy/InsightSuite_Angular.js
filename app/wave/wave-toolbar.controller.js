(function () {
    'use strict';

    /* @ngInject */
    function WaveToolbarController(waveToolbarFactory) {
        var vm = this;

        vm.onlyLive = waveToolbarFactory.onlyLive;
        vm.toggle = function () {
            waveToolbarFactory.onlyLive = !waveToolbarFactory.onlyLive;
        };
    }

    angular
        .module('fi.wave')
        .controller('WaveToolbarController', WaveToolbarController);
}());

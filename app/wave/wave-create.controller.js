(function () {
    'use strict';

    /* @ngInject */
    function WaveCreateController($mdDialog, $anchorScroll) {
        this.showAdvanced = function (waveController, ev) {
            $anchorScroll();
            $mdDialog.show({
                controller: 'WaveCreateDialogController',
                templateUrl: 'wave/wave-create.html',
                targetEvent: ev
            }).then(function (newWave) {
                waveController.waves.push(newWave);
            });
        };
    }

    angular
        .module('fi.wave')
        .controller('WaveCreateController', WaveCreateController);
}());

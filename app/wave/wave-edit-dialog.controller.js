(function () {
    'use strict';

    /* @ngInject */
    function WaveEditDialogController(waveService, announceService, $mdDialog, $scope, $q, $log) {
        var vm = this;

        function save(wave) {
            if ($scope.editWaveForm.$valid) {
                waveService
                    .editWave(wave)
                    .then(function (updatedWave) {
                        $mdDialog.hide(updatedWave);
                        announceService.info('WAVE_EDIT_SUCCESS', {
                            waveName: updatedWave.name
                        });
                    })
                    .catch(announceService.error);
            } else {
                $log.error('validation error');
            }
        }

        function cancel() {
            $mdDialog.cancel();
        }

        vm.wave = waveService.getCurrentWave();
        vm.save = save;
        vm.cancel = cancel;
    }

    angular
        .module('fi.wave')
        .controller('WaveEditDialogController', WaveEditDialogController);
}());

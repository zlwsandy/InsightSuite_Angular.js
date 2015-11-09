(function () {
    'use strict';

    /* @ngInject */
    function WaveCreateDialogController(fiService, waveService, announceService, $mdDialog, $scope, $log) {
        var vm = this;
        vm.gamePlayBaseUrl = fiService.gameplayBaseUrl();
        vm.wavePath = '';

        function save(ev) {
            if ($scope.createWaveForm.$valid) {
                vm.wavePath = angular.element(document.getElementById('wavePath')).val();
                vm.company = {
                    id: fiService.companyId()
                };

                waveService
                    .createWave(vm)
                    .then(function (wave) {
                        $mdDialog.hide(wave);
                        announceService.info('WAVE_CREATE_SUCCESS', {
                            waveName: wave.name
                        });
                    })
                    .catch(announceService.error);
            } else {
                var inputContainers = ev.target.getElementsByTagName('md-input-container');
                angular.element(inputContainers[0]).addClass('md-input-invalid');
                angular.element(inputContainers[1]).addClass('md-input-invalid');
                $log.error('validation error');
            }
        }

        function cancel() {
            $mdDialog.cancel();
        }

        vm.save = save;
        vm.cancel = cancel;
    }

    angular
        .module('fi.wave')
        .controller('WaveCreateDialogController', WaveCreateDialogController);
}());

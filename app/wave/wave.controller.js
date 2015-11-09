(function () {
    'use strict';

    /* @ngInject */
    function WaveController(fiService, waveService, announceService, waveToolbarFactory, $mdSidenav, $scope, $rootScope) {
        var vm = this;
        vm.selectedIndex = 0; // Setting default tab to 'Links'
        vm.currentWaveName = '';
        vm.localeList = waveService.getLocaleList();
        vm.locale = '';
        vm.onlyLive = waveToolbarFactory.onlyLive;
        vm.waves = [];

        vm.toggleRight = function (wave) {
            waveService.setCurrentWave(wave);
            vm.currentWaveName = wave.name;
            waveService.broadcastCurrentWave(wave);
            vm.selectedIndex = 0;
            $mdSidenav('waveTabs').toggle();
            vm.locale = '';
        };

        vm.company = {
            'id': fiService.companyId()
        };

        vm.localeFilter = function (link) {
            return (vm.locale === null || vm.locale === '' || vm.locale === link.locale);
        };

        function getWaves() {
            waveService
                .getWaves(vm.company, { onlyLive: vm.onlyLive })
                .then(function (data) {
                    angular.copy(data, vm.waves);
                })
                .catch(announceService.error);
        }

        getWaves();
        waveService.loadMoreWaves(vm);

        function updateWave(ev, wave) {
            var i;
            var waves = vm.waves;
            for (i = 0; i < waves.length; i++) {
                if (waves[i].waveId === wave.waveId) {
                    waves[i] = wave;
                    break;
                }
            }
        }

        $scope.$on('waveChange', updateWave);

        function deleteWave(ev, wave) {
            var waveId = wave.waveId;
            vm.waves = vm.waves.filter(function (candidate) {
                return waveId !== candidate.waveId;
            });
        }

        $scope.$on('deleteWaveBroadcast', deleteWave);

        $scope.$watch(function () {
            return waveToolbarFactory.onlyLive;
        }, function (onlyLive) {
            vm.onlyLive = onlyLive;
            getWaves();
        });

        $scope.$watch(waveService.getLocaleList, function (list) {
            vm.locale = '';
            vm.localeList = list;
        });

        $scope.$watch(
            function () {
                return vm.locale;
            },
            function (locale) {
                $rootScope.$broadcast('localeFilterChange', locale);
            }
        );
    }

    angular
        .module('fi.wave')
        .controller('WaveController', WaveController);
}());

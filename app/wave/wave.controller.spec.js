'use strict';

describe('waveController', function () {
    beforeEach(module('fi.wave'));

    var scope, waveService, WaveController, $rootScope;

    beforeEach(inject(function ($q) {
        var localeList;
        var currentWave;

        waveService = {
            getWaves: function (company, onlyLive) {
                return $q.when([{waveId: 1}, {waveId: 10}, {waveId: 100}]);
            },
            loadMoreWaves: function (controller) {
                controller.infiniteScroll = {};
            },
            onWaveChange: function () {},
            getCurrentWave: function () {
                return currentWave;
            },
            setCurrentWave: function (wave) {
                currentWave = angular.copy(wave);
            },
            broadcastCurrentWave: function (wave) {
                return;
            },
            getLocaleList: function () {
                return localeList;
            },
            setLocaleList: function (list) {
                localeList = list;
            }
        };
    }));

    beforeEach(inject(function ($controller, _$rootScope_) {
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();

        var fiService = {
            gameplayBaseUrl: function () {
                return 'url';
            },
            companyId: function () {
                return 90;
            }
        };
        WaveController = $controller('WaveController as wave', {
            $scope: scope,
            waveService: waveService,
            fiService: fiService
        });
        $rootScope.$digest();
    }));

    it('get an array of waves', function () {
        expect(WaveController.waves.length).toBe(3);
    });

    it('can set current wave', function () {
        var wave = {
            name: 'sgt. pepper'
        };
        WaveController.toggleRight(wave);

        expect(WaveController.currentWaveName).toBe(wave.name);
        expect(waveService.getCurrentWave()).toEqual(wave);
    });

    it('update on waveChange event', function () {
        var wave = {waveId: 100};
        var count = 0;

        for (var i = 0; i < WaveController.waves.length; i++) {
            expect(WaveController.waves[i]).not.toBe(false);
        }
        $rootScope.$broadcast('waveChange', wave);
        for (var i = 0; i < WaveController.waves.length; i++) {
            if (WaveController.waves[i] === wave) {
                count++;
            }
        }
        expect(count).toBe(1);
    });

    it('toggleRight test', function () {
        var wave = {
            name: 'sgt. pepper'
        };
        WaveController.locale = 'before';
        expect(WaveController.locale).not.toBe('');
        WaveController.toggleRight(wave);
        expect(WaveController.locale).toBe('');
    });

    it('picks up waveService localeList change', function () {
        var newLocaleList = [1, 2, 9, 8, 3, 4, 7, 6, 5];

        expect(WaveController.localeList).not.toBe(newLocaleList);
        waveService.setLocaleList(newLocaleList);
        $rootScope.$digest();
        expect(WaveController.localeList).toBe(newLocaleList.sort());
    });

    it('deleteWave on deleteWaveBroadcast event', function () {
        var wave = {waveId: 100};
        var count = 0;

        for (var i = 0; i < WaveController.waves.length; i++) {
            expect(WaveController.waves[i]).not.toBe(false);
        }
        $rootScope.$broadcast('deleteWaveBroadcast', wave);
        for (var i = 0; i < WaveController.waves.length; i++) {
            if (WaveController.waves[i] === wave) {
                count++;
            }
        }
        expect(count).toBe(0);
    });

    describe('watch waveToolbarFactory only live', function () {
        beforeEach(inject(function ($rootScope, waveToolbarFactory) {
            waveToolbarFactory.onlyLive = true;

            $rootScope.$digest();
        }));

        it('should set the only live value on the view model', function () {
            expect(WaveController.onlyLive).toBe(true);
        });
    });
});

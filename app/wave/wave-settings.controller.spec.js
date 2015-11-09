'use strict';

describe('WaveSettingsController', function () {
    var WaveSettingsController, announceService;
    var $rootScope;
    var waveDeferredPromise;

    var wave = {
        name: 'ziggy',
        locales: ['en_US']
    };

    var waveResponse = {
        data: {
            status: true,
            data: wave
        }
    };

    var dialogCancelled = false;

    function waveUrlFn(wave, localeInfo, allowChoice) {
        return {
            wave: wave,
            localeInfo: localeInfo,
            allowChoice: allowChoice
        };
    }

    beforeEach(module('fi.wave'));

    beforeEach(function () {
        inject(function ($controller, $q, _$rootScope_, _announceService_) {
            $rootScope = _$rootScope_;
            waveDeferredPromise = $q.defer();

            announceService = _announceService_;
            WaveSettingsController = $controller('WaveSettingsController', {
                waveService: {
                    getCurrentWave: function () {
                        return wave;
                    },
                    waveFullUrlSelectLocale: waveUrlFn,
                    waveFullUrlForLocale: waveUrlFn,
                    getWave: function () {
                        return waveDeferredPromise.promise;
                    }
                },
                $mdDialog: {
                    cancel: function () {
                        dialogCancelled = true;
                    }
                },
                announceService: _announceService_
            });
        });
    });

    it('test waveUrl(localeInfo)', function () {
        waveDeferredPromise.resolve(waveResponse);
        $rootScope.$digest();

        var localeInfo = WaveSettingsController.createLocaleInfo();
        expect(WaveSettingsController.waveUrl(localeInfo)).toEqual(waveUrlFn(wave));

        localeInfo = WaveSettingsController.createLocaleInfo('en_US');
        localeInfo.linkType = 'localeOnly';
        expect(WaveSettingsController.waveUrl(localeInfo)).toEqual(waveUrlFn(wave, localeInfo.name));

        localeInfo.linkType = 'localeWithChoice';
        expect(WaveSettingsController.waveUrl(localeInfo)).toEqual(waveUrlFn(wave, localeInfo.name, true));

        localeInfo.linkType = false;
        expect(WaveSettingsController.waveUrl(localeInfo)).toEqual(undefined);
    });

    describe('announce', function () {
        it('should call announceService.info', function () {
            waveDeferredPromise.resolve(waveResponse);
            $rootScope.$digest();

            spyOn(announceService, 'info');
            WaveSettingsController.announce();
            expect(announceService.info).toHaveBeenCalled();
        });

        it('should call announceService.error', function () {
            spyOn(announceService, 'error');

            waveDeferredPromise.reject(waveResponse);
            $rootScope.$digest();

            expect(announceService.error).toHaveBeenCalled();
        });

        it('should call announceService.error', function () {
            spyOn(announceService, 'error');

            var failedResponse = angular.copy(waveResponse);
            failedResponse.data.status = false;

            waveDeferredPromise.resolve(failedResponse);
            $rootScope.$digest();

            expect(announceService.error).toHaveBeenCalled();
        });
    });

    it('test close()', function () {
        expect(dialogCancelled).toBe(false);
        WaveSettingsController.close();
        expect(dialogCancelled).toBe(true);
    });
});

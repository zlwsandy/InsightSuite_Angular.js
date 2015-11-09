'use strict';

describe('waveService url tests', function () {
    var waveService;
    var url = 'simple url';
    var $httpBackend;
    var wave = {
        waveId: -9870,
        urlDir : 'fuzzy',
        urlName : 'lumpkins'
    };

    beforeEach(module('fi.wave'));

    beforeEach(function () {
        var mock = {
            gameplayBaseUrl: function () {
                return url;
            }
        };

        module(function ($provide) {
            $provide.value('fiService', mock);
        });

        inject(function ($injector) {
            waveService = $injector.get('waveService');
            $httpBackend = $injector.get('$httpBackend');
        });
    });

    it('test waveService.waveBaseUrl(wave)', function () {
        expect(waveService.waveBaseUrl(wave)).toBe(url + '/wp/' + wave.urlDir);
    });

    it('test waveService.waveFullUrl(wave)', function () {
        expect(waveService.waveFullUrl(wave)).toBe(url + '/wp/' + wave.urlDir + '/' + wave.urlName);
    });

    it('test waveService.waveFullUrlForLocale(wave)', function () {
        var locale = 'en_US';
        var expectedUrl = url + '/wp/' + wave.urlDir + '/' + wave.urlName + '?locale=' + locale;
        expect(waveService.waveFullUrlForLocale(wave, locale, false)).toBe(expectedUrl);

        var extra = '&waveDir=' + wave.urlDir + '&waveName=' + wave.urlName;
        expect(waveService.waveFullUrlForLocale(wave, locale, true)).toBe(expectedUrl + extra);
    });

    it('test waveFullUrlSelectLocale(wave)', function () {
        var expectedUrl = url + '/wp/' + wave.urlDir + '/' + wave.urlName + '?selectloc=1';
        expect(waveService.waveFullUrlSelectLocale(wave)).toBe(expectedUrl);
    });

    it('test getCurrentWaveId()', function () {
        waveService.setCurrentWave(wave);

        var currentWave = waveService.getCurrentWave();
        expect(currentWave).toEqual(wave);

        var currentWaveId = waveService.getCurrentWaveId();
        expect(currentWaveId).toBe(currentWave.waveId);
    });

    it('negative test checkWaveForUpdates(wave)', function () {
        $httpBackend
            .expectGET('../api/wave/' + wave.waveId)
            .respond({});

        var promise = waveService.checkWaveForUpdates(wave);
        var fired;

        promise.success(function (data) {
            expect(data).toEqual({});
            fired = true;
        });

        expect(fired).toBe(undefined);
        $httpBackend.flush();
        expect(fired).toBe(true);
    });

    it('negative test checkWaveForUpdates(wave)', function () {
        var responseValue = {status: true};
        $httpBackend
            .expectGET('../api/wave/' + wave.waveId)
            .respond(responseValue);

        var promise = waveService.checkWaveForUpdates(wave);
        var fired;

        promise.success(function (data) {
            expect(data).toEqual(responseValue);
            fired = true;
        });

        expect(fired).toBe(undefined);
        $httpBackend.flush();
        expect(fired).toBe(true);
    });

    it('test checkWaveForUpdates(wave)', function () {
        $httpBackend
            .expectGET('../api/wave/' + wave.waveId)
            .respond(wave);

        var promise = waveService.checkWaveForUpdates(wave);
        var fired;

        promise.success(function (data) {
            expect(data).toEqual(wave);
            fired = true;
        });

        expect(fired).toBe(undefined);
        $httpBackend.flush();
        expect(fired).toBe(true);
    });

    it('should have a locale filter', function () {
        var localeList = waveService.getLocaleList();
        expect(localeList).not.toBe(null);
        expect(localeList).not.toBe(undefined);
    });

    it('should have stateful locale list', function () {
        var list = [9, 8, 1, 2, 7, 6, 3, 4, 5];

        expect(waveService.getLocaleList).not.toBe(list);
        waveService.setLocaleList(list.slice(0));
        expect(waveService.getLocaleList()).not.toBe(list);
        expect(waveService.getLocaleList()).toEqual(list.sort());
    });

    describe('getWaves', function () {
        var companyId = 90;
        var onlyLive = false;

        it('should retrieve a list of twenty waves', function () {
            var waves;

            $httpBackend
                .expectGET('../api/waves/company/' + companyId + '?filter=onlyLive::' + onlyLive + '&limit=20&start=0')
                .respond({
                    status: true,
                    data: [{
                        name: 'Wave'
                    }]
                });

            waveService
                .getWaves({ id: companyId}, { onlyLive: onlyLive })
                .then(function (result) {
                    waves = result;
                });

            $httpBackend.flush();

            expect(waves).toEqual([{
                name: 'Wave'
            }]);
        });

        it('should override the limit of waves to retrieve', function () {
            var waves;

            $httpBackend
                .expectGET('../api/waves/company/' + companyId + '?filter=onlyLive::' + onlyLive + '&limit=33&start=0')
                .respond({
                    status: true,
                    data: [{
                        name: 'Wave'
                    }]
                });

            waveService
                .getWaves({ id: companyId}, {
                    onlyLive: onlyLive,
                    limit: 33
                })
                .then(function (result) {
                    waves = result;
                });

            $httpBackend.flush();

            expect(waves).toEqual([{
                name: 'Wave'
            }]);
        });

        it('should override the starting index of waves to retrieve', function () {
            var waves;

            $httpBackend
                .expectGET('../api/waves/company/' + companyId + '?filter=onlyLive::' + onlyLive + '&limit=20&start=101')
                .respond({
                    status: true,
                    data: [{
                        name: 'Wave'
                    }]
                });

            waveService
                .getWaves({ id: companyId}, {
                    start: 101,
                    onlyLive: onlyLive
                })
                .then(function (result) {
                    waves = result;
                });

            $httpBackend.flush();

            expect(waves).toEqual([{
                name: 'Wave'
            }]);
        });

        it('should return an empty list when the company id is falsey', inject(function ($rootScope) {
            var waves, undefinedCompanyId;
            undefinedCompanyId = undefined;

            waveService
                .getWaves({ id: undefinedCompanyId })
                .then(function (result) {
                    waves = result;
                });

            $rootScope.$digest();

            expect(waves).toEqual([]);
        }));
    });

});

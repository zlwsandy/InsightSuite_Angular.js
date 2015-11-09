'use strict';

describe('WaveEditController', function () {
    beforeEach(module('fi.wave'));

    var $rootScope, $mdDialog, $httpBackend, $q, controller, $translate, announceService;

    beforeEach(inject(function ($injector) {
        $rootScope = $injector.get('$rootScope');
        $mdDialog = $injector.get('$mdDialog');
        $httpBackend = $injector.get('$httpBackend');
        $q = $injector.get('$q');
        $translate = $injector.get('$translate');
        announceService = $injector.get('announceService');
    }));

    beforeEach(inject(function ($controller, waveService) {
        controller = $controller('WaveEditController as edit', {
            $scope: $rootScope.$new(),
            waveService: waveService,
            announceService: announceService
        });
    }));

    it('controller calls the dialog box when save button is clicked', function () {
        spyOn($mdDialog, 'show').and.callThrough();
        controller.showAdvanced('someEvent', null, null);
        expect($mdDialog.show).toHaveBeenCalled();
    });

    it('should update the list of waves by replacing the old wave with its updated form', function () {
        var firstWave, wave, lastWave, waves, promise;

        firstWave = {
            waveId: 43,
            value: 'unchanged'
        };
        wave = {
            waveId: 42,
            value: 'old'
        };
        lastWave = {
            waveId: 41,
            value: 'unchanged'
        };
        waves = [firstWave, wave, lastWave];
        promise = $q(function (resolve) {
            resolve({
                waveId: 42,
                value: 'updated'
            });
        });

        $httpBackend
            .expectGET('/api/fi/gameplayUrl')
            .respond({ data: 'urlValue' });

        spyOn($mdDialog, 'show').and.returnValue(promise);
        controller.showAdvanced('event', wave, waves);
        $rootScope.$digest();
        $httpBackend.flush();

        expect(waves[0].value).toBe('unchanged');
        expect(waves[1].value).toBe('updated');
        expect(waves[2].value).toBe('unchanged');
        expect(waves.length).toBe(3);
    });

    it('should show settings dialog', function () {
        var wave = {
            waveId: 42,
            canBeDeleted: false
        };
        spyOn($mdDialog, 'show').and.callThrough();
        controller.showSettings('event', wave);
        expect($mdDialog.show).toHaveBeenCalled();
    });

    it('should display delete wave warning dialog', function () {

        var wave = {
            waveId: 42,
            canBeDeleted: false
        };

        var promise = $q(function (resolve) {
            resolve({
                waveId: 42,
                canBeDeleted: false
            });
        });

        spyOn($mdDialog, 'show').and.returnValue(promise);

        controller.showDeleteDialog('event', wave);

    });

    it('should display delete wave confirmation dialog', function () {

        var wave = {
            waveId: 42,
            canBeDeleted: true
        };

        var promise = $q(function (resolve) {
            resolve({
                waveId: 42,
                canBeDeleted: false
            });
        });

        spyOn($mdDialog, 'show').and.returnValue(promise);

        controller.showDeleteDialog('event', wave);
        controller.deleteWave(wave);
        expect($mdDialog.show).toHaveBeenCalled();

    });

});

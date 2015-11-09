'use strict';

describe('WaveEditDialogController', function () {
    beforeEach(module('fi.wave'));

    var $rootScope, $mdDialog, $httpBackend, $log, announceService, controller;

    beforeEach(inject(function ($injector) {
        $rootScope = $injector.get('$rootScope');
        $mdDialog = $injector.get('$mdDialog');
        $httpBackend = $injector.get('$httpBackend');
        $log = $injector.get('$log');
        announceService = $injector.get('announceService');
    }));

    beforeEach(inject(function ($controller, waveService) {
        controller = $controller('WaveEditDialogController', {
            $scope: $rootScope.$new(),
            waveService: waveService,
            announceService: announceService
        });
    }));

    describe('clicks save', function () {
        beforeEach(function () {
            $httpBackend
                .expectGET('/api/fi/gameplayUrl')
                .respond({ data: 'urlValue' });
        });

        it('should save and announce the update', function () {
            $httpBackend
                .whenPUT('../api/wave/1')
                .respond({
                    status: true,
                    data: {
                        waveId: 1,
                        value: 'updated',
                        name: 'editedWave'
                    }
                });

            $rootScope.editWaveForm = {
                $valid: true
            };

            spyOn(announceService, 'info');
            spyOn($mdDialog, 'hide');
            controller.save({ waveId: 1 });
            $rootScope.$digest();
            $httpBackend.flush();

            expect($mdDialog.hide).toHaveBeenCalledWith({
                waveId: 1,
                value: 'updated',
                name: 'editedWave'
            });
            expect(announceService.info).toHaveBeenCalled();
        });

        it('should announce an error when the server returns an error', function () {
            var wave = {
                waveId: 1
            };

            $httpBackend
                .whenPUT('../api/wave/1')
                .respond({
                    status: false,
                    message: 'SERVER ERROR',
                    data: null
                });


            $rootScope.editWaveForm = {
                $valid: true
            };
            spyOn(announceService, 'error');
            controller.save(wave);
            $rootScope.$digest();
            $httpBackend.flush();

            expect(announceService.error).toHaveBeenCalled();
        });

        it('should log an error if the input is invalid', function () {
            $rootScope.editWaveForm = {
                $valid: false
            };

            spyOn($log, 'error');
            controller.save(null);
            $rootScope.$digest();
            $httpBackend.flush();

            expect($log.error).toHaveBeenCalledWith('validation error');
        });
    });

    describe('clicks cancel', function () {
        it('should call $mdDialog cancel method', function () {
            spyOn($mdDialog, 'cancel');
            controller.cancel();
            expect($mdDialog.cancel).toHaveBeenCalled();
        });
    });
});

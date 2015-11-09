'use strict';

describe('Create a wave using the WaveCreateDialogController', function () {
    beforeEach(module('fi.wave'));

    var $rootScope, $httpBackend, $mdDialog, $log, controller, $translate, announceService;

    beforeEach(inject(function ($injector) {
        $rootScope = $injector.get('$rootScope');
        $httpBackend = $injector.get('$httpBackend');
        $mdDialog = $injector.get('$mdDialog');
        $log = $injector.get('$log');
        $translate = $injector.get('$translate');
        announceService = $injector.get('announceService');
    }));

    beforeEach(inject(function ($controller, $cookies, waveService, fiService) {
        controller = $controller('WaveCreateDialogController', {
            $scope: $rootScope.$new(),
            waveService: waveService,
            fiService: fiService,
            $mdDialog: $mdDialog,
            $log: $log,
            $cookies: $cookies,
            announceService: announceService
        });
    }));

    describe('calling save', function () {
        beforeEach(function () {
            $httpBackend
                .expectGET('/api/fi/gameplayUrl')
                .respond({
                    data: 'urlValue'
                });
        });

        it('should save when the form is valid', function () {
            $httpBackend
                .whenPOST('../api/wave')
                .respond({
                    status: true,
                    data: {
                        waveId: 1,
                        name: 'createdWave'
                    }
                });

            $rootScope.createWaveForm = {
                $valid: true
            };

            spyOn($mdDialog, 'hide');
            spyOn(announceService, 'info');
            controller.save();
            $rootScope.$digest();
            $httpBackend.flush();

            expect(announceService.info).toHaveBeenCalled();
            expect($mdDialog.hide).toHaveBeenCalled();
        });

        it('should log an error when the form is not valid', function () {
            $rootScope.createWaveForm = {
                $valid: false
            };
            var testForm = document.createElement('div');
            testForm.innerHTML = '<form name="createWaveForm" ng-submit="create.save($event)" novalidate="">' +
                '<md-input-container class="md-primary md-default-theme md-input-invalid"></md-input-container>' +
                '<md-input-container class="md-primary md-default-theme md-input-invalid"></md-input-container>' +
                '</form>';
            var ev = {
                target: testForm
            };
            spyOn($log, 'error');
            controller.save(ev);

            expect($log.error).toHaveBeenCalled();
        });

        it('should log an error when the server returns an error', function () {
            var wave;

            $httpBackend
                .whenPOST('../api/wave')
                .respond({
                    status: false,
                    message: 'SERVER ERROR',
                    data: null
                });

            $rootScope.createWaveForm = {
                $valid: true
            };
            spyOn(announceService, 'error');
            controller.save(wave);
            $rootScope.$digest();
            $httpBackend.flush();

            expect(announceService.error).toHaveBeenCalled();
        });
    });

    describe('calling cancel', function () {
        it('should call the cancel dialog', function () {
            spyOn($mdDialog, 'cancel').and.callThrough();
            controller.cancel();
            expect($mdDialog.cancel).toHaveBeenCalled();
        });
    });
});

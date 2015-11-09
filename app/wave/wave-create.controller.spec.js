'use strict';

describe('WaveCreateController', function () {
    beforeEach(module('fi.wave'));

    var $rootScope, $q, $mdDialog, controller;

    beforeEach(inject(function ($injector) {
        $rootScope = $injector.get('$rootScope');
        $q = $injector.get('$q');
        $mdDialog = $injector.get('$mdDialog');
    }));

    beforeEach(inject(function ($controller) {
        controller = $controller('WaveCreateController as create', {
            $scope: $rootScope.$new()
        });
    }));

    it('should call the dialog box when add button is clicked', function () {
        spyOn($mdDialog, 'show').and.callThrough();
        controller.showAdvanced(null, 'someEvent');
        expect($mdDialog.show).toHaveBeenCalled();
    });

    it('should add the new wave to the existing waves', function () {
        var waveController = { waves: [] };
        var promise = $q(function (resolve) {
            resolve({ name: 'new wave' });
        });

        spyOn($mdDialog, 'show').and.returnValue(promise);
        controller.showAdvanced(waveController, 'someEvent');
        $rootScope.$digest();

        expect(waveController.waves.length).toBe(1);
    });
});

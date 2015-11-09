'use strict';

describe('WaveToolbarController', function () {
    var waveToolbarController;

    beforeEach(module('fi.wave'));

    beforeEach(inject(function ($controller, $rootScope, waveToolbarFactory) {
        waveToolbarController = $controller('WaveToolbarController', {
            $scope: $rootScope.$new(),
            waveToolbarFactory: waveToolbarFactory
        });
    }));

    describe('onlyLive', function () {
        it('should default to false', inject(function (waveToolbarFactory) {
            expect(waveToolbarFactory.onlyLive).toBe(false);
        }));
    });

    describe('toggle', function () {
        it('should reassign the negated only live value', inject(function (waveToolbarFactory) {
            waveToolbarController.toggle();

            expect(waveToolbarFactory.onlyLive).toBe(true);
        }));
    });
});

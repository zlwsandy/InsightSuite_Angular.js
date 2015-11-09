'use strict';

describe('menuController', function () {
    var controller, $mdSidenav, fiService;

    beforeEach(module('fi.common'));

    beforeEach(inject(function ($controller, $rootScope) {
        $mdSidenav = jasmine.createSpy('$mdSidenav');
        fiService = jasmine.createSpyObj('fiService', ['companyId']);
        controller = $controller('MenuController', {
            $scope: $rootScope.$new(),
            $mdSidenav: $mdSidenav,
            fiService: fiService,
            menuConfig: {}
        });
    }));

    describe('toggleLeft', function () {
        it('should toggle the left side nav', function () {
            var leftNav = jasmine.createSpyObj('leftNav', ['toggle']);

            $mdSidenav.and.returnValue(leftNav);

            controller.toggleLeft();

            expect($mdSidenav).toHaveBeenCalledWith('left');
            expect(leftNav.toggle).toHaveBeenCalled();
        });
    });
});

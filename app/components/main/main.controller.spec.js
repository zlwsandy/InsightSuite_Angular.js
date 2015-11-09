'use strict';

describe('MainController', function () {
    var companySwitchFactory, fiService, menuService, $scope, $controller;
    beforeEach(module('fi.common'));

    beforeEach(function () {
        companySwitchFactory = jasmine.createSpyObj('companySwitchFactory', ['watch']);
        fiService = jasmine.createSpyObj('fiService', ['companyId']);
        menuService = {};
    });

    beforeEach(inject(function (_$rootScope_) {
        $scope = _$rootScope_.$new();
        spyOn($scope, '$watch').and.callThrough();
    }));

    function initializeController() {
        inject(function ($controller) {
            $controller('MainController', {
                companySwitchFactory: companySwitchFactory,
                fiService: fiService,
                menuService: menuService,
                $scope: $scope
            });
        });
    }

    describe('company id does not exist', function () {
        it('should be initialized', function () {
            initializeController();
            expect($scope.$watch).toHaveBeenCalled();
        });
    });

    describe('company id exists', function () {
        beforeEach(function () {
            fiService.companyId.and.returnValue(34567);
        });

        it('should be initialized', function () {
            initializeController();
            expect($scope.$watch).toHaveBeenCalled();
        });    
    });
});

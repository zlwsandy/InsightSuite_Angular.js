'use strict';

describe('ForbiddenAccessController', function () {
    var $controller, $rootScope, menuService, serverTime;
    
    beforeEach(module('fi.common'));
    
    beforeEach(inject(function (_$controller_, _$rootScope_, _menuService_) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        menuService = _menuService_;
        serverTime = new Date(1);
    }));

    describe('initialization', function () {
        it('should set menuService\'s name and currentYear.', function () {
            var controller;
            var expectedYear = (new Date(1)).getFullYear();

            expect(menuService.name).not.toEqual('silver');
            controller = $controller('ForbiddenAccessController', {
                $scope: $rootScope.$new(),
                menuService: menuService,
                menuConfig: {
                    name: 'silver'
                },
                serverTime: serverTime
            });
            
            expect(controller.config.name).toEqual('silver');
            expect(menuService.name).toEqual('silver');
            expect(controller.currentYear).toEqual(expectedYear);
        });
    });
});

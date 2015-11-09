'use strict';

describe('routeErrorHandler', function () {
    var routeErrorHandler, announceService, companyService, $mdDialog, $state, $rootScope, fiService;
    beforeEach(module('fi.common'));

    beforeEach(module(function ($urlRouterProvider) {
        $urlRouterProvider.deferIntercept();
    }));

    beforeEach(function () {
        companyService = jasmine.createSpyObj('companyService', ['getCompany']);
        fiService = jasmine.createSpyObj('fiService', ['companyId', 'logoff']);

        module(function ($provide) {
            $provide.value('companyService', companyService);
            $provide.value('fiService', fiService);
        });

        inject(function (_routeErrorHandler_, _announceService_, _$mdDialog_, _$state_, _$rootScope_, $q) {
            routeErrorHandler = _routeErrorHandler_;
            announceService = _announceService_;
            $mdDialog = _$mdDialog_;
            $state = _$state_;
            $rootScope = _$rootScope_;

            var deferred = $q.defer();
            companyService.getCompany.and.returnValue(deferred.promise);

            deferred.resolve({
                name: 'First Company'
            });

            $rootScope.$on('$stateChangeError', routeErrorHandler.errorHandler);
        });
    });

    describe('on $stateChangeError', function () {
        var event;
        beforeEach(function () {
            spyOn($state, 'transitionTo');
        });

        it('should do nothing if company cookie is positive', function () {
            var capturedEvent;
            fiService.companyId.and.returnValue(78);

            $rootScope.$on('$stateChangeError', function (event) {
                capturedEvent = event;
            });
            $rootScope.$broadcast('$stateChangeError');

            expect(capturedEvent.defaultPrevented).toEqual(false);
            expect(fiService.companyId).toHaveBeenCalled();
            expect(fiService.logoff).not.toHaveBeenCalled();
            expect($state.transitionTo).not.toHaveBeenCalled();
        });

        it('should do $state.transitionTo for non-positive company cookie value', function () {
            var capturedEvent;
            fiService.companyId.and.returnValue(-1);

            $rootScope.$on('$stateChangeError', function (event) {
                capturedEvent = event;
            });
            $rootScope.$broadcast('$stateChangeError');

            expect(capturedEvent.defaultPrevented).toEqual(true);
            expect(fiService.companyId).toHaveBeenCalled();
            expect(fiService.logoff).not.toHaveBeenCalled();
            expect($state.transitionTo).toHaveBeenCalledWith('loginAdminCompany');
        });

        it('should logoff for undefined company cookie value', function () {
            var capturedEvent;
            fiService.companyId.and.returnValue(undefined);

            $rootScope.$on('$stateChangeError', function (event) {
                capturedEvent = event;
            });

            $rootScope.$broadcast('$stateChangeError');

            expect(capturedEvent.defaultPrevented).toEqual(true);
            expect(fiService.companyId).toHaveBeenCalled();
            expect(fiService.logoff).toHaveBeenCalled();
            expect($state.transitionTo).not.toHaveBeenCalled();
        });

        it('should do $state.transitionTo for non-positive company cookie value', function () {
            var toState, toParams, fromState, fromParams, error = 'not admin';
            var capturedEvent;
            
            fiService.companyId.and.returnValue(10);

            $rootScope.$on('$stateChangeError', function (event) {
                capturedEvent = event;
            });
            $rootScope.$broadcast('$stateChangeError', toState, toParams, fromState, fromParams, error);

            expect(capturedEvent.defaultPrevented).toEqual(true);
            expect(fiService.companyId).toHaveBeenCalled();
            expect(fiService.logoff).not.toHaveBeenCalled();
            expect($state.transitionTo).toHaveBeenCalledWith('403');
        });
    });
});

'use strict';

describe('companySwitchFactory', function () {
    var companySwitchFactory, announceService, companyService, $mdDialog, $state, $rootScope, fiService;
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

        inject(function (_companySwitchFactory_, _announceService_, _$mdDialog_, _$state_, _$rootScope_, $q) {
            companySwitchFactory = _companySwitchFactory_;
            announceService = _announceService_;
            $mdDialog = _$mdDialog_;
            $state = _$state_;
            $rootScope = _$rootScope_;

            var deferred = $q.defer();
            companyService.getCompany.and.returnValue(deferred.promise);

            deferred.resolve({
                name: 'First Company'
            });
        });
    });


    describe('administer a company that has valid companyid ', function (done) {
        beforeEach(function () {
            spyOn($mdDialog, 'cancel').and.callThrough();
            spyOn($state, 'go');
            spyOn(announceService, 'info');
            companySwitchFactory.watch(1).then(done);
            $rootScope.$digest();
        });

        it('should cancel dialogs and change state', function () {
            expect($state.go).toHaveBeenCalledWith('insightsListTab.results');

            expect($mdDialog.cancel).toHaveBeenCalled();
        });

        it('should announce the user is administering a company', function () {
            expect(announceService.info).toHaveBeenCalledWith('ADMINISTERING_NEW_COMPANY', {
                name: 'First Company'
            });
        });
    });

    describe('watch company that does not have a valid id', function (done) {
        beforeEach(function () {
            spyOn($state, 'go');
            companySwitchFactory.watch(-1);
            $rootScope.$digest();
        });

        it('should call forward state loginAdminCompany', function () {
            expect($state.go).toHaveBeenCalledWith('loginAdminCompany');
        });
    });

    describe('watch company that does not have a valid session', function (done) {
        beforeEach(function () {
            spyOn($state, 'go');
            companySwitchFactory.watch(undefined);
            $rootScope.$digest();
        });

        it('should go to root', function () {
            expect(fiService.logoff).toHaveBeenCalled();
        });
    });
});

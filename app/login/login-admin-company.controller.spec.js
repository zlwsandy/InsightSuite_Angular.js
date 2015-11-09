'use strict';

describe('loginAdminCompanyControllerSpec', function () {
    var  fiService, loginService, $state, controller;
    var $q;
    var $rootScope;
    var $controller;

    var company;

    beforeEach(module('mock/company.json'));
    beforeEach(module('fi.login'));

    beforeEach(function () {
        inject(function (_$controller_, _$q_, _$rootScope_, _mockCompany_) {

            $q = _$q_;
            $rootScope = _$rootScope_;
            $controller = _$controller_;
            company = _mockCompany_;
        });
    });

    beforeEach(function () {
        fiService = jasmine.createSpyObj('fiService', ['getCompanyList', 'companyId']);
        loginService = jasmine.createSpyObj('loginService', ['setCompanyToAdmin']);
        $state = jasmine.createSpyObj('$state', ['go']);
    });

    function initializeController() {
        controller = $controller('LoginAdminCompanyController', {
            fiService: fiService,
            loginService: loginService,
            $state: $state,
            $scope : $rootScope
        });
    }

    describe('init - administering company', function () {

        beforeEach(function () {
            fiService.companyId.and.returnValue(1);
        });

        it('a company is administered and forwarded to insight list', function () {
            initializeController();
            expect($state.go).toHaveBeenCalledWith('insightsListTab.results');
        });
    });


    describe('init - not administering company', function () {

        beforeEach(function () {
            fiService.companyId.and.returnValue(null);
        });


        it('get companies and hide loader', function () {

            fiService.getCompanyList.and.returnValue($q.when(company));
            initializeController();

            expect(controller.showProgressLoader).toBe(true);
            expect(controller.companyList).toBe(undefined);

            $rootScope.$digest();

            expect(controller.showProgressLoader).toBe(false);
            expect(controller.companyList).toEqual(jasmine.objectContaining(company));
        });
    });

    describe('Set Company To Admin', function () {

        beforeEach(function () {
            fiService.companyId.and.returnValue(1);
            initializeController();
        });

        it('should set the company data from the login service on rootScope', function () {

            controller.companySelected = company;

            loginService.setCompanyToAdmin.and.returnValue($q.when(company));

            controller.setCompanyToAdmin();

            $rootScope.$digest();

            expect($rootScope.companyData).toEqual(company);
        })
    });
});

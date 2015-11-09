'use strict';

describe('Login Service Specs - ', function () {
    var sut, $httpBackend, $rootScope, utilsService;

    var response =  {
        userId : 1,
        userCompanyId : 6,
        userRole : 'SYSADMIN'
    };

    beforeEach(module('fi.login'));

    beforeEach(function () {
        module(function ($provide) {
            $provide.value("companyService", {
                getCompany : function () {
                    return response;
                }
            });
        })
    });

    beforeEach( inject( function (_loginService_, _$httpBackend_, _$rootScope_) {
        sut = _loginService_;
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
    }));

    it('should set the company to admin', function () {
        var result;

        $httpBackend
            .expectGET('/secure/company!adminCompany.fi?id=6')
            .respond({
                status: true,
                data: response
            });

        sut.setCompanyToAdmin(6).then(function (data) {
            result = data;
        });

        expect(result).toBe(undefined);
        $httpBackend.flush();
        expect(result).toEqual(response);
    });

});

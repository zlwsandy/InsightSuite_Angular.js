'use strict';

describe('companyService', function () {
    var id, missingId, companyService, fiService, $httpBackend;

    id = 1;
    missingId = 999;

    beforeEach(module('fi.common'));

    beforeEach(function () {
        fiService = jasmine.createSpyObj('fiService', ['companyId']);
        module(function ($provide) {
            $provide.value('fiService', fiService);
        });
        
        inject(function (_companyService_, _$httpBackend_) {
            companyService = _companyService_;
            $httpBackend = _$httpBackend_;
            
            $httpBackend
                .whenGET('../api/company/' + id)
                .respond({
                    data: {
                        name: 'First Insight'
                    }
                });
            
            $httpBackend
                .whenGET('../api/company/' + missingId)
                .respond(400, {
                    message: 'Error'
                });
        })
    });

    describe('getCompany', function () {


        it('should return the company when the id is found', function () {
            var company;

            companyService
                .getCompany(id, true)
                .then(function (result) {
                    company = result;
                });

            $httpBackend.flush();

            expect(company).toEqual({
                name: 'First Insight'
            });
        });

        it('should return the error message when the id is not found', function () {
            var error;

            companyService
                .getCompany(missingId, true)
                .catch(function (result) {
                    error = result;
                });

            $httpBackend.flush();

            expect(error).toEqual('Error');
        });
    });

    describe('getLocaleList()', function () {
        it('should return locale list', function () {
            var result;
            var expectedValue = [1, 2, 3];
            var responseValue = {
                status: true,
                data: expectedValue
            };

            fiService.companyId.and.returnValue(id);
            
            $httpBackend
                .expectGET('../api/company/' + id + '/locales')
                .respond(responseValue);
            
            companyService
                .getLocaleList()
                .then(function (x) {
                    result = x;
                });

            expect(result).toBe(undefined);

            $httpBackend.flush();

            expect(result).toEqual(expectedValue);
        });
    });
});

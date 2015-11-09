'use strict';

describe('departmentService', function () {
    var departmentService, fiService, $httpBackend;
    var companyId = 789;

    beforeEach(module('fi.common'));

    beforeEach(module(function ($provide) {
        fiService = jasmine.createSpyObj('fiService', ['companyId']);
        $provide.value('fiService', fiService);
    }));

    beforeEach(inject(function (_departmentService_, _$httpBackend_) {
        departmentService = _departmentService_;
        $httpBackend = _$httpBackend_;
    }));

    beforeEach(function () {
        fiService.companyId.and.returnValue(companyId);
    });

    it('successful response', function() {
        var result;
        var responseValue = {
            status: true,
            data: 'it is a secret'
        };
        
        $httpBackend
            .expectGET('../api/departments/company/' + companyId)
            .respond(responseValue);

        var promise = departmentService.getDepartments();

        promise.then(function (x) {
            result = x;
        });

        expect(result).toBe(undefined);

        $httpBackend.flush();

        expect(result).toBe(responseValue.data);
    });

    it('successful response', function() {
        var result;
        var responseValue = 'it is a secret';
        
        $httpBackend
            .expectGET('../api/departments/company/' + companyId)
            .respond(403, responseValue);
        
        var promise = departmentService.getDepartments();
        
        promise.catch(function (x) {
            result = x;
        });
        
        expect(result).toBe(undefined);
        
        $httpBackend.flush();
        
        expect(result.data).toBe(responseValue);
    });
});

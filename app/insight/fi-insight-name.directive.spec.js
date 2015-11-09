'use strict';

describe('fi-insight-name directive', function () {
    var $scope;
    var $rootScope;
    var $compile;
    var $q;
    var deferred;
    var insightDataService;
    var element;

    beforeEach(module('fi.insight'));

    beforeEach(function () {
        insightDataService = jasmine.createSpyObj('insightDataService', ['getInsights']);

        module(function ($provide) {
            $provide.value('insightDataService', insightDataService);
        });
    });

    beforeEach(inject(function(_$compile_, _$rootScope_, _$q_, $stateParams) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $q = _$q_;
        $stateParams.insightId = '1';
    }));

    beforeEach(inject(function($compile, $rootScope) {
        $scope = $rootScope.$new();
        element = angular.element(
            '<form name="form">' +
                '<input ng-model="model.testVal" name="testVal" fi-insight-name />' +
                '<textarea></textarea>'+
                '</form>'
        );
        $scope.model = { testVal: null };
        $compile(element)($scope);
    }));

    beforeEach(function () {
        deferred = $q.defer();
    });

    it('should be valid when the name is unique', function () {
        var value = 'unique name';
        var response = [];

        $scope.form.testVal.$setValidity('fiInsightName', false);
        expect($scope.form.testVal.$valid).toBe(false);

        insightDataService.getInsights.and.returnValue(deferred.promise);
        deferred.resolve(response);

        $scope.form.testVal.$setViewValue(value);

        $scope.$digest();
        expect($scope.model.testVal).toEqual(value);
        expect($scope.form.testVal.$valid).toBe(true);
    });

    it('should be valid when evaluting against itself', function () {
        var value = 'existing name';
        var response = [{ insightId: 1 }];

        $scope.form.testVal.$setValidity('fiInsightName', false);
        expect($scope.form.testVal.$valid).toBe(false);

        insightDataService.getInsights.and.returnValue(deferred.promise);
        deferred.resolve(response);

        $scope.form.testVal.$setViewValue(value);

        $scope.$digest();
        expect($scope.model.testVal).toEqual(value);
        expect($scope.form.testVal.$valid).toBe(true);
    });

    it('should be invalid when one or more insight is found', function () {
        var value = 'non-unique name';
        var response = ['some insight object'];

        insightDataService.getInsights.and.returnValue(deferred.promise);
        deferred.resolve(response);

        $scope.form.testVal.$setViewValue(value);

        $scope.$digest();
        expect($scope.model.testVal).toEqual(undefined);
        expect($scope.form.testVal.$valid).toBe(false);
    });

     it('should be invalid; bad http request', function () {
         var value = 'non-unique name';
         var response = 'bad';

         insightDataService.getInsights.and.returnValue(deferred.promise);
         deferred.reject(response);

         $scope.form.testVal.$setViewValue(value);

         $scope.$digest();
         expect($scope.model.testVal).toEqual(undefined);
         expect($scope.form.testVal.$valid).toBe(false);
     });
});

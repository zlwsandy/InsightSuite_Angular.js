'use strict';

describe('fi-integer-characters', function () {
    var $scope;
    var $rootScope;
    var $compile;

    beforeEach(module('fi.common'));

    beforeEach(inject(function(_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
    }));

    beforeEach(inject(function($compile, $rootScope) {
        $scope = $rootScope;
        var element = angular.element(
            '<form name="form">' +
                '<input ng-model="model.testVal" name="testVal" fi-integer-validator />' +
                '</form>'
        );
        $scope.model = { testVal: null }
        $compile(element)($scope);
    }));


    it('should be valid', function () {
        var value = '34';
        $scope.form.testVal.$setViewValue(value);
        
        $scope.$digest();
        expect($scope.form.testVal.$valid).toBe(true);
    });

    it('should be invalid non whole number', function () {
        var value = '3.';
        $scope.form.testVal.$setViewValue(value);

        $scope.$digest();
        expect($scope.form.testVal.$valid).toBe(false);

        var value = '.3';
        $scope.form.testVal.$setViewValue(value);

        $scope.$digest();
        expect($scope.form.testVal.$valid).toBe(false);

        var value = '.3.';
        $scope.form.testVal.$setViewValue(value);

        $scope.$digest();
        expect($scope.form.testVal.$valid).toBe(false);
    });
});

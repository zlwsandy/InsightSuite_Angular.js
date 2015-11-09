'use strict';

describe('fi-special-character', function () {
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
                '<input ng-model="model.testVal" name="testVal" fi-special-characters />' +
                '</form>'
        );
        $scope.model = { testVal: null }
        $compile(element)($scope);
    }));

    it('should be valid for empty string', function () {
        var value = '';
        
        $scope.form.testVal.$setViewValue(value);
        
        $scope.$digest();
        expect($scope.model.testVal).toEqual(value);
        expect($scope.form.testVal.$valid).toBe(true);
    });

    it('should be valid', function () {
        var value = 'unique name';

        $scope.form.testVal.$setViewValue(value);
        
        $scope.$digest();
        expect($scope.model.testVal).toEqual(value);
        expect($scope.form.testVal.$valid).toBe(true);
    });

    it('should be invalid', function () {
        var value = ';;';

        $scope.form.testVal.$setViewValue(value);
        
        $scope.$digest();
        expect($scope.model.testVal).not.toEqual(value);
        expect($scope.form.testVal.$valid).toBe(false);
    });
});

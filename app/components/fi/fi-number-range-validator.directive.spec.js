'use strict';

describe('Number Range Validator Directive Specs - ', function () {
    var $scope;
    var $rootScope;
    var $compile;
    var mockFormatter;

    var setFormValue = function (value, formattedUSValue) {
        mockFormatter.formatNumberToUS.and.returnValue(formattedUSValue || value);
        $scope.testForm.testVal.$setViewValue(value);
        $scope.$digest();
    };

    beforeEach(module('fi.common'));

    beforeEach(function () {
        mockFormatter = jasmine.createSpyObj('formatter', ['formatNumberToUS']);
    });

    beforeEach(function () {
        module(function ($provide) {
            $provide.value('formatter', mockFormatter);
        });
    });

    beforeEach(inject(function(_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
    }));

    describe('Min and Max', function () {

        beforeEach(inject(function($compile, $rootScope) {
            $scope = $rootScope;
            var element = angular.element('<form name="testForm"><input ng-model="model.testVal" name="testVal" fi-number-range-validator min="0" max="5" locale-code="en_US"/></form>');
            $compile(element)($scope);
        }));

        it('should be a valid form if the value is within range', function () {

            setFormValue('4');

            expect($scope.testForm.testVal.$valid).toBe(true);
        });

        it('should be an invalid form if the value is above the max', function () {

            setFormValue('8');

            expect($scope.testForm.testVal.$valid).toBe(false);
        });

        it('should be an invalid form if the value is below the min', function () {

            setFormValue('-5');

            expect($scope.testForm.testVal.$valid).toBe(false);
        });

        it('should be a valid form if the value is equal to the min', function () {

            setFormValue('0');

            expect($scope.testForm.testVal.$valid).toBe(true);
        });

        it('should be a valid form if the value is equal to the max', function () {

            setFormValue('5');

            expect($scope.testForm.testVal.$valid).toBe(true);
        });
    });

    describe('Min Only', function () {

        beforeEach(inject(function($compile, $rootScope) {

            $scope = $rootScope;
            var element = angular.element('<form name="testForm"><input ng-model="model.testVal" name="testVal" fi-number-range-validator min="3" locale-code="en_US"/></form>');
            $compile(element)($scope);
        }));

        it('should be a valid form if the value is greater than the min', function () {

            setFormValue('4');

            expect($scope.testForm.testVal.$valid).toBe(true);
        });

        it('should be an invalid form if the value is less than the min', function () {

            setFormValue('2');

            expect($scope.testForm.testVal.$valid).toBe(false);
        });

        it('should be a valid form if the value is equal to the min', function () {

            setFormValue('3');

            expect($scope.testForm.testVal.$valid).toBe(true);
        });
    });

    describe('Max Only', function () {

        beforeEach(inject(function($compile, $rootScope) {
            $scope = $rootScope;
            var element = angular.element('<form name="testForm"><input ng-model="model.testVal" name="testVal" fi-number-range-validator max="3" locale-code="en_US"/></form>');
            $compile(element)($scope);
        }));

        it('should be a valid form if the value is less than the max', function () {

            setFormValue('-5');

            expect($scope.testForm.testVal.$valid).toBe(true);
        });

        it('should be an invalid form if the value is greater than the max', function () {

            setFormValue('4');

            expect($scope.testForm.testVal.$valid).toBe(false);
        });

        it('should be a valid form if the value is equal to the max', function () {

            setFormValue('3');

            expect($scope.testForm.testVal.$valid).toBe(true);
        });
    });

    describe('No Min or Max', function () {

        beforeEach(inject(function($compile, $rootScope) {
            $scope = $rootScope;
            var element = angular.element('<form name="testForm"><input ng-model="model.testVal" name="testVal" fi-number-range-validator locale-code="en_US"/></form>');
            $compile(element)($scope);
        }));

        it('should be a valid form if the number is valid', function () {

            setFormValue('-5');

            expect($scope.testForm.testVal.$valid).toBe(true);
        });
    });

    describe('Invalid Value - ', function () {

        beforeEach(inject(function($compile, $rootScope) {
            $scope = $rootScope;
            var element = angular.element('<form name="testForm"><input ng-model="model.testVal" name="testVal" fi-number-range-validator locale-code="en_US"/></form>');
            $compile(element)($scope);
        }));

        it('should be an invalid form', function () {

            setFormValue('abc');

            expect($scope.testForm.testVal.$valid).toBe(false);
        });
    });

    describe('Different Locale - ', function () {

        beforeEach(inject(function($compile, $rootScope) {
            $scope = $rootScope;
            var element = angular.element('<form name="testForm"><input ng-model="model.testVal" name="testVal" fi-number-range-validator min="0" max="5" locale-code="fr_FR"/></form>');
            $compile(element)($scope);
        }));

        it('should be a valid form if the given number is valid for the locale', function () {

            setFormValue('2,50', '2.50');

            expect($scope.testForm.testVal.$valid).toBe(true);
        });
    });
});

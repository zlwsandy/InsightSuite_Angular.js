'use strict';

describe('Locale Number Validator Directive Specs - ', function () {
    var $scope;
    var $rootScope;
    var $compile;
    var mockLocaleService;
    var mockLocales;

    var setFormValue = function (value) {
        $scope.testForm.testVal.$setViewValue(value);
        $scope.$digest();
    };

    beforeEach(module('mock/locales.json'));
    beforeEach(module('fi.common'));

    beforeEach(function () {
        mockLocaleService = jasmine.createSpyObj('localeService', ['findLocale']);
    });

    beforeEach(function () {
        module(function ($provide) {
            $provide.value('localeService', mockLocaleService);
        });
    });

    beforeEach(inject(function (_$compile_, _$rootScope_, _mockLocales_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        mockLocales = _mockLocales_;
        $scope = $rootScope.$new();
    }));

    describe('en_US', function () {

        beforeEach(inject(function ($compile, $rootScope) {
            $scope = $rootScope;
            mockLocaleService.findLocale.and.returnValue(mockLocales.en_US);
            var element = angular.element('<form name="testForm"><input ng-model="model.testVal" name="testVal" fi-locale-number-validator locale-code="en_US"/></form>');
            $compile(element)($scope);
        }));

        it('should be a valid form if the value is a valid whole number with no grouping', function () {

            setFormValue('4');

            expect($scope.testForm.testVal.$valid).toBe(true);
        });

        it('should be a valid form if the value is a valid fractional number with no grouping', function () {

            setFormValue('4.09');

            expect($scope.testForm.testVal.$valid).toBe(true);
        });

        it('should be a valid form if the value is a valid whole number with grouping', function () {

            setFormValue('4,000,000');

            expect($scope.testForm.testVal.$valid).toBe(true);
        });

        it('should be a valid form if the value is a valid fractional number with grouping', function () {

            setFormValue('4,000,000.09');

            expect($scope.testForm.testVal.$valid).toBe(true);
        });

        it('should be a valid form if the value is a valid fractional number with grouping', function () {

            setFormValue('4,000,000.9');

            expect($scope.testForm.testVal.$valid).toBe(true);
        });


        it('should be an invalid form if the value is an invalid fractional number with no grouping', function () {

            setFormValue('4,09');

            expect($scope.testForm.testVal.$valid).toBe(false);
        });

        it('should be an invalid form if the value is an invalid whole number with grouping', function () {

            setFormValue('4.000.000');

            expect($scope.testForm.testVal.$valid).toBe(false);
        });

        it('should be an invalid form if the value is an invalid fractional number with grouping', function () {

            setFormValue('4.000,000,09');

            expect($scope.testForm.testVal.$valid).toBe(false);
        });

        it('should consider letters invalid', function () {

            setFormValue('abc');

            expect($scope.testForm.testVal.$valid).toBe(false);
        });
    });

    describe('fr_FR', function () {

        beforeEach(inject(function ($compile, $rootScope) {
            $scope = $rootScope;
            mockLocaleService.findLocale.and.returnValue(mockLocales.fr_FR);

            var element = angular.element('<form name="testForm"><input ng-model="model.testVal" name="testVal" fi-locale-number-validator locale-code="fr_FR"/></form>');
            $compile(element)($scope);
        }));

        it('should be a valid form if the value is a valid whole number with no grouping', function () {

            setFormValue('4');

            expect($scope.testForm.testVal.$valid).toBe(true);
        });

        it('should be a valid form if the value is a valid fractional number with no grouping', function () {

            setFormValue('4,09');

            expect($scope.testForm.testVal.$valid).toBe(true);
        });

        it('should be a valid form if the value is a valid fractional number with no grouping', function () {

            setFormValue('4,9');

            expect($scope.testForm.testVal.$valid).toBe(true);
        });

        it('should be a valid form if the value is a valid whole number with grouping', function () {

            setFormValue('4 000 000');

            expect($scope.testForm.testVal.$valid).toBe(true);
        });

        it('should be a valid form if the value is a valid fractional number with grouping', function () {

            setFormValue('4 000 000,09');

            expect($scope.testForm.testVal.$valid).toBe(true);
        });

        it('should be a valid form if the value is a valid fractional number with grouping', function () {

            setFormValue('4 000 000,9');

            expect($scope.testForm.testVal.$valid).toBe(true);
        });

        it('should be an invalid form if the value is an invalid fractional number with no grouping', function () {

            setFormValue('4.09');

            expect($scope.testForm.testVal.$valid).toBe(false);
        });

        it('should be an invalid form if the value is an invalid whole number with grouping', function () {

            setFormValue('4.000.000');

            expect($scope.testForm.testVal.$valid).toBe(false);
        });

        it('should be an invalid form if the value is an invalid fractional number with grouping', function () {

            setFormValue('4.000,000,09');

            expect($scope.testForm.testVal.$valid).toBe(false);
        });

        it('should consider letters invalid', function () {

            setFormValue('abc');

            expect($scope.testForm.testVal.$valid).toBe(false);
        });
    });


    describe('es_CO', function () {

        beforeEach(inject(function ($compile, $rootScope) {
            $scope = $rootScope;
            mockLocaleService.findLocale.and.returnValue(mockLocales.es_CO);

            var element = angular.element('<form name="testForm"><input ng-model="model.testVal" name="testVal" fi-locale-number-validator locale-code="es_CO"/></form>');
            $compile(element)($scope);
        }));

        it('should be a valid form if the value is a valid whole number with no grouping', function () {

            setFormValue('4');

            expect($scope.testForm.testVal.$valid).toBe(true);
        });

        it('should be a valid form if the value is a valid fractional number with no grouping', function () {

            setFormValue('4,09');

            expect($scope.testForm.testVal.$valid).toBe(true);
        });

        it('should be a valid form if the value is a valid fractional number with no grouping', function () {

            setFormValue('4,9');

            expect($scope.testForm.testVal.$valid).toBe(true);
        });

        it('should be a valid form if the value is a valid whole number with grouping', function () {

            setFormValue('4.000.000');

            expect($scope.testForm.testVal.$valid).toBe(true);
        });

        it('should be a valid form if the value is a valid fractional number with grouping', function () {

            setFormValue('4.000.000,09');

            expect($scope.testForm.testVal.$valid).toBe(true);
        });

        it('should be a valid form if the value is a valid fractional number with grouping', function () {

            setFormValue('4.000.000,9');

            expect($scope.testForm.testVal.$valid).toBe(true);
        });

        it('should be an invalid form if the value is an invalid fractional number with no grouping', function () {

            setFormValue('4.09');

            expect($scope.testForm.testVal.$valid).toBe(false);
        });

        it('should be an invalid form if the value is an invalid whole number with grouping', function () {

            setFormValue('4,000,000');

            expect($scope.testForm.testVal.$valid).toBe(false);
        });

        it('should be an invalid form if the value is an invalid fractional number with grouping', function () {

            setFormValue('4.000,000,09');

            expect($scope.testForm.testVal.$valid).toBe(false);
        });

        it('should consider letters invalid', function () {

            setFormValue('abc');

            expect($scope.testForm.testVal.$valid).toBe(false);
        });
    });

    describe('zh_CN', function () {

        beforeEach(inject(function ($compile, $rootScope) {
            $scope = $rootScope;
            mockLocaleService.findLocale.and.returnValue(mockLocales.zh_CN);

            var element = angular.element('<form name="testForm"><input ng-model="model.testVal" name="testVal" fi-locale-number-validator locale-code="zh_CN"/></form>');
            $compile(element)($scope);
        }));

        it('should be a valid form if the value is a valid whole number with no grouping', function () {

            setFormValue('4');

            expect($scope.testForm.testVal.$valid).toBe(true);
        });

        it('should be a valid form if the value is a valid fractional number with no grouping', function () {

            setFormValue('4.09');

            expect($scope.testForm.testVal.$valid).toBe(true);
        });

        it('should be a valid form if the value is a valid fractional number with no grouping', function () {

            setFormValue('4.9');

            expect($scope.testForm.testVal.$valid).toBe(true);
        });

        it('should be a valid form if the value is a valid whole number with grouping', function () {

            setFormValue('4,000,000');

            expect($scope.testForm.testVal.$valid).toBe(true);
        });

        it('should be a valid form if the value is a valid fractional number with grouping', function () {

            setFormValue('4,000,000.09');

            expect($scope.testForm.testVal.$valid).toBe(true);
        });

        it('should be a valid form if the value is a valid fractional number with grouping', function () {

            setFormValue('4,000,000.9');

            expect($scope.testForm.testVal.$valid).toBe(true);
        });

        it('should be an invalid form if the value is an invalid fractional number with no grouping', function () {

            setFormValue('4,09');

            expect($scope.testForm.testVal.$valid).toBe(false);
        });

        it('should be an invalid form if the value is an invalid whole number with grouping', function () {

            setFormValue('4.000.000');

            expect($scope.testForm.testVal.$valid).toBe(false);
        });

        it('should be an invalid form if the value is an invalid fractional number with grouping', function () {

            setFormValue('4.000,000,09');

            expect($scope.testForm.testVal.$valid).toBe(false);
        });

        it('should consider letters invalid', function () {

            setFormValue('abc');

            expect($scope.testForm.testVal.$valid).toBe(false);
        });
    });

    describe('No Locale Specified - ', function () {

        beforeEach(inject(function ($compile, $rootScope) {
            $scope = $rootScope;

            var element = angular.element('<form name="testForm"><input ng-model="model.testVal" name="testVal" fi-locale-number-validator/></form>');
            $compile(element)($scope);
        }));

        it('should be an invalid form if no locale is specified', function () {

            setFormValue('4');

            expect($scope.testForm.testVal.$valid).toBe(false);
        });
    });


    describe('Unsupported Locale Specified - ', function () {

        beforeEach(inject(function ($compile, $rootScope) {
            $scope = $rootScope;
            mockLocaleService.findLocale.and.returnValue(null);

            var element = angular.element('<form name="testForm"><input ng-model="model.testVal" name="testVal" fi-locale-number-validator locale-code="pt_BR"/></form>');
            $compile(element)($scope);
        }));

        it('should be an invalid form if the locale is not supported', function () {

            setFormValue('4');

            expect($scope.testForm.testVal.$valid).toBe(false);
        });
    });
});

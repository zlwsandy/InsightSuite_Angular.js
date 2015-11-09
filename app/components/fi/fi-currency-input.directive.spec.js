'use strict';

describe('Fi Currency Input Directive Specs - ', function () {
    var $scope;
    var $rootScope;
    var $compile;
    var mockLocaleService;
    var mockLocales;

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

    describe('fr_FR', function () {

        beforeEach(inject(function ($compile, $rootScope) {
            $scope = $rootScope;
            mockLocaleService.findLocale.and.returnValue(mockLocales.fr_FR);
            var element = angular.element('<form name="testForm"><fi-currency-input required="true" ng-model="model.testVal" name="testVal" locale-code="fr_FR"></fi-currency-input></form>');
            $compile(element)($scope);
            $rootScope.$digest();
        }));

        it('should format the view value according to the given locale', function () {

            $scope.model = {
                testVal : '4.00'
            };
            $scope.$digest();

            expect($scope.testForm.testVal.$viewValue).toEqual('4,00');
        });

        it('should not change the model value', function () {

            $scope.model = {
                testVal : 4.19
            };
            $scope.$digest();

            expect($scope.model.testVal).toEqual(4.19);
        });

        it('should reformat the view value if the model value changes', function () {

            $scope.model = {
                testVal : '4.00'
            };
            $scope.$digest();

            expect($scope.testForm.testVal.$viewValue).toEqual('4,00');

            $scope.model.testVal = '1234.56';

            $scope.$digest();

            expect($scope.testForm.testVal.$viewValue).toEqual('1 234,56')
        });

        it('should accept a null value', function () {
            $scope.model = {
                testVal : null
            };
            $scope.$digest();

            expect($scope.model.testVal).toBe(null);
        });

        it('should accept an empty string value and set it to 0', function () {
            $scope.model = {
                testVal : ''
            };
            $scope.$digest();

            expect($scope.model.testVal).toEqual(0);
        });

        it('should convert a 0.00 string to a number', function () {
            $scope.model = {
                testVal : '0.00'
            };
            $scope.$digest();

            expect($scope.model.testVal).toEqual(0);
        });

        it('should be an invalid form if required is true and no value is set', function () {
            $scope.model = {
                testVal : null
            };

            $scope.$digest();

            expect($scope.testForm.$valid).toBe(false);

        });
    });

    describe('No Locale Provided', function () {

        beforeEach(inject(function ($compile, $rootScope) {
            $scope = $rootScope;
            var element = angular.element('<form name="testForm"><fi-currency-input ng-model="model.testVal" name="testVal"></fi-currency-input></form>');
            $compile(element)($scope);
        }));

        it('should not format the view value if no locale is provided', function () {

            $scope.model = {
                testVal : '4.00'
            };
            $scope.$digest();

            expect($scope.testForm.testVal.$viewValue).toEqual('4.00');
        });


        it('should not reformat the view value if the model value changes and no locale is provided', function () {

            $scope.model = {
                testVal : '4.00'
            };
            $scope.$digest();

            expect($scope.testForm.testVal.$viewValue).toEqual('4.00');

            $scope.model.testVal = '1234.56';

            $scope.$digest();

            expect($scope.testForm.testVal.$viewValue).toEqual('1234.56')
        });
    });

    describe('Unsupported Locale Provided', function () {

        beforeEach(inject(function ($compile, $rootScope) {
            $scope = $rootScope;
            mockLocaleService.findLocale.and.returnValue(null);
            var element = angular.element('<form name="testForm"><fi-currency-input ng-model="model.testVal" name="testVal" locale-code="xx_XX"></fi-currency-input></form>');
            $compile(element)($scope);
        }));

        it('should not format the view value if an unsupported locale is provided', function () {

            $scope.model = {
                testVal : '4.00'
            };
            $scope.$digest();

            expect($scope.testForm.testVal.$viewValue).toEqual('4.00');
        });


        it('should not reformat the view value if the model value changes and an unsupported locale is provided', function () {

            $scope.model = {
                testVal : '4.00'
            };
            $scope.$digest();

            expect($scope.testForm.testVal.$viewValue).toEqual('4.00');

            $scope.model.testVal = '1234.56';

            $scope.$digest();

            expect($scope.testForm.testVal.$viewValue).toEqual('1234.56')
        });
    });

});

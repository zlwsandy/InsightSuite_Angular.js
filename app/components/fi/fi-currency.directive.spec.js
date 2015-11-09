'use strict';

describe('fi-currency directive specs - ', function () {
    var $scope;
    var $compile;
    var $sce;
    var element;
    var sut;
    var localeService;
    var formatter;
    var mockLocales;

    var compileDirective = function (value, selectedLocale, symbolClass, roundAtThreshold) {

        $scope.value = value;
        $scope.selectedLocale = selectedLocale;
        $scope.symbolClass = symbolClass;
        $scope.roundAtThreshold = roundAtThreshold || false;

        element = angular.element('<fi-currency value="{{value}}" round-at-threshold="roundAtThreshold" current-locale="selectedLocale" symbol-class={{symbolClass}}></fi-currency>');

        $compile(element)($scope);

        $scope.$digest();

        sut = element.isolateScope().FiCurrencyController;
    };

    beforeEach(module('mock/locales.json'));
    beforeEach(module('fi.common'));

    beforeEach(function () {
        localeService = jasmine.createSpyObj('localeService', ['findLocale']);
        formatter = jasmine.createSpyObj('formatter', ['formatCurrency', 'formatNumber']);
    });

    beforeEach(function () {

        module(function ($provide) {
            $provide.value('localeService', localeService);
            $provide.value('formatter', formatter);
        });
    });

    beforeEach(inject(function(_$compile_, _$rootScope_, _$sce_, _mockLocales_) {
        $compile = _$compile_;
        $scope = _$rootScope_;
        $sce = _$sce_;
        mockLocales = _mockLocales_;
    }));



    describe('Initialization', function () {

        var value = '200';
        var testSymbolClass = 'testClass';

        beforeEach(function () {
            formatter.formatCurrency.and.returnValue('$200.00');
            localeService.findLocale.and.returnValue(mockLocales.en_US);

            formatter.formatCurrency.calls.reset();
        });

        it('should use the default value when no value is passed', function () {

            compileDirective(undefined, mockLocales.en_US, testSymbolClass);

            expect(sut.value).toBe('');
        });

        it('should call format currency with the given value and the locale code', function () {

            compileDirective(value, mockLocales.en_US, testSymbolClass);

            expect(formatter.formatCurrency).toHaveBeenCalledWith(value, mockLocales.en_US.locale, undefined, false, false);
        });

        it('should add the symbol class to the DOM if it is passed', function () {

            compileDirective(value, mockLocales.en_US, testSymbolClass);

            expect($sce.getTrustedHtml(sut.formatted)).toContain(testSymbolClass);
        });

        it('should not add the symbol class to the DOM if it is passed', function () {

            compileDirective(value, mockLocales.en_US);

            expect($sce.getTrustedHtml(sut.formatted)).not.toContain(testSymbolClass);
        });

        it('should call format currency with a fraction size of undefined and roundAtThreshold of true', function () {

            compileDirective(value, mockLocales.en_US, testSymbolClass, true);

            expect(formatter.formatCurrency).toHaveBeenCalledWith(value, mockLocales.en_US.locale, undefined, false, true);
        });

        it('should call format currency with a fraction size of undefined and roundAtThreshold of false', function () {

            compileDirective('99', mockLocales.en_US, testSymbolClass, false);

            expect(formatter.formatCurrency).toHaveBeenCalledWith('99', mockLocales.en_US.locale, undefined, false, false);
        });
    });

});

'use strict';

describe('Fi Locale Select Directive Specs - ', function () {
    var $scope,
        $compile,
        $httpBackend,
        localeService,
        element,
        sut,
        selectedLocale,
        mockLocaleService = {},
        mockInsightLocaleFactory;

    // Stage test data
    var localesArray = [ {
      "locale" : "en_US",
      "conversionRate" : 1.0000000000,
      "currencyCode" : "USD",
      "gameRunId" : 174,
      "gameRunStatus" : "SETUP"
    }, {
      "locale" : "fr_FR",
      "conversionRate" : 1.0000000000,
      "currencyCode" : "EUR",
      "gameRunId" : 173,
      "gameRunStatus" : "SETUP"
    }];

    var localeServiceData;

    var compileDirective = function (locales, selectedLocale, disabled, visible, resultsStatusOnly) {

        $scope.localesArray = locales;
        $scope.selectedLocale = selectedLocale;
        $scope.disabled = disabled;
        $scope.visible = visible;
        $scope.resultsStatusOnly = resultsStatusOnly;
        $scope.localeChangeMock = jasmine.createSpy('localChangeMock');

        element = angular.element('<fi-locale-select locales="localesArray" current-locale="selectedLocale" change="localeChangeMock()" visible="visible" disabled="disabled" results-status-only="resultsStatusOnly"></fi-locale-select>');

        $compile(element)($scope);
        $scope.$digest();

        sut = element.isolateScope().FiLocaleSelectController;
    };

    beforeEach(module('mock/locales.json'));
    beforeEach(module('fi.common'));

    // The external template file referenced by templateUrl
    beforeEach(module('components/fi/fi-locale-select.directive.html'));

    beforeEach(function () {
        mockInsightLocaleFactory = jasmine.createSpyObj('insightLocaleFactory', ['isInsightLocaleResults']);
        mockLocaleService = jasmine.createSpyObj('localeService', ['getLanguage']);
    });

    beforeEach(function () {
        module(function ($provide) {
            $provide.value('localeService', mockLocaleService);
            $provide.value('insightLocaleFactory', mockInsightLocaleFactory);
        });
    });

    beforeEach(inject(function(_$compile_, _$rootScope_, _$httpBackend_, _mockLocales_) {

        $compile = _$compile_;
        $scope = _$rootScope_;
        $httpBackend = _$httpBackend_;

        mockLocaleService.locales = _mockLocales_;
    }));

    describe('common initialization', function () {

        beforeEach(function () {
            compileDirective(localesArray, localesArray[1], true, true, true);
        });

        it('should have a currently selected locale object', function () {
            expect(sut.currentLocale).toBe(localesArray[1]);
        });

        it('should fetch image URLs when locales have been loaded', function () {
            expect(sut.localeOptions[0].flagImageUrl).toBe(mockLocaleService.locales.en_US.desktopFlagUrl);
        });

    });

    describe('initialization of All Locales - ', function () {

        var resultsLocales;

        beforeEach(function () {

            // Create a new locales array with all statuses RESULTS
            resultsLocales = _.cloneDeep(localesArray);
        });

        it('should NOT add an All Locales option to the first index if results status only flag is true and all locales are not results', function () {
            compileDirective(localesArray, localesArray[0], true, true, true);

            expect(sut.localeOptions.length).toEqual(localesArray.length);
            expect(sut.localeOptions[0].locale.toLowerCase()).not.toEqual('all');
        });

        it('should add an All Locales option to the first index, regardless of status, if results status only flag is false', function () {
            compileDirective(localesArray, localesArray[0], true, true, false);

            expect(sut.localeOptions.length).toEqual(localesArray.length + 1);
            expect(sut.localeOptions[0].locale.toLowerCase()).toEqual('all');
        });

        it('should add an All Locales option to the first index if all locales are results and there is more than one locale', function () {

            mockInsightLocaleFactory.isInsightLocaleResults.and.returnValue(true);
            compileDirective(resultsLocales, resultsLocales[0], false, true, true);

            expect(sut.localeOptions[0].locale.toLowerCase()).toEqual('all');
        });

        it('should not add an All Locales option to the first index if all locales are results and there is only one locale', function () {

            // Create a new locales array with all statuses RESULTS
            var oneLocaleInResults = resultsLocales.slice(0, 1);
            compileDirective(oneLocaleInResults, resultsLocales[0], false, true, true);

            expect(sut.localeOptions[0].locale.toLowerCase()).not.toEqual('all');
        });

    });

    describe('Initialize the selected locale - ', function () {

        it('should set the All Locales option as the selected locale if it is intialized with "all"', function () {
            compileDirective(localesArray, 'all', false, true, false);

            expect(sut.selectedLocale.locale.toLowerCase()).toEqual('all');
        });

        it('should set the selected locale to be the current locale if it is NOT intialized with "all" and it is visible', function () {
            compileDirective(localesArray, localesArray[1], false, true, false);

            expect(sut.selectedLocale.locale).toEqual(localesArray[1].locale);
        });

        it('should set the selected locale to be null if it the locale select is not visible', function () {
            compileDirective(localesArray, localesArray[1], false, false, false);

            expect(sut.selectedLocale).toBe(null);
        });

    });

    describe('change event', function () {
        beforeEach(function () {
            compileDirective(localesArray, localesArray[1], true, true, true);
        });

        it('should call the passed function when a locale is changed', function () {
            spyOn(sut, 'change');

            expect(sut.change).not.toHaveBeenCalled();

            // Call the controller function which executes the callback that was passed into the directive (parent function)
            sut.changeLocale();

            expect(sut.change).toHaveBeenCalled();
        });
    });
});

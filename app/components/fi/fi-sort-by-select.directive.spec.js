'use strict';

describe('Sort By Select Directive Specs', function () {
    var $scope;
    var $compile;
    var $q;
    var element;
    var sut;
    var localeService;
    var fiService = {};
    var companyService = {};
    var changeMock;

    var mockLocales;
    var mockLocale;
    var mockCompany;

    var compileDirective = function (change, defaultValue, currentLocale, insightPricingEnabled, maxGmPricingEnabled) {

        $scope.change = change;
        $scope.defaultValue = defaultValue;
        $scope.currentLocale = currentLocale;
        $scope.insightPricingEnabled = insightPricingEnabled;
        $scope.maxGmPricingEnabled = maxGmPricingEnabled;

        element = angular.element('<fi-sort-by-select default-value="defaultValue" current-locale="currentLocale" insight-pricing-enabled="insightPricingEnabled" max-gm-pricing-enabled="maxGmPricingEnabled" change="change(currentSortBy)"></fi-sort-by-select>');

        $compile(element)($scope);
        $scope.$digest();

        sut = element.isolateScope().FiSortBySelectController;
    };

    beforeEach(module('mock/locales.json'));
    beforeEach(module('mock/company.json'));

    beforeEach(module('fi.common'));

    // The external template file referenced by templateUrl
    beforeEach(module('components/fi/fi-sort-by-select.directive.html'));

    beforeEach(function () {

        module(function ($provide) {
            localeService = jasmine.createSpyObj('localeService', ['isAllLocales', 'findLocale']);
            changeMock = jasmine.createSpy('changeMock');

            $provide.value('localeService', localeService);
        });
    });

    beforeEach(inject(function(_$compile_, _$rootScope_, _$q_, _mockLocales_, _mockCompany_) {

        $compile = _$compile_;
        $scope = _$rootScope_;
        $q = _$q_;
        mockLocales = _mockLocales_;
        mockLocale = mockLocales.en_US;
        mockCompany = _.cloneDeep(_mockCompany_);

        $scope.companyData = mockCompany;
    }));

    describe('Common Initialization', function () {

        var changeMock = jasmine.createSpy('changeMock');
        var defaultValue = 'overallPositive';

        beforeEach(function () {
            localeService.isAllLocales.and.returnValue(true);
        });

        it('should set the selected value to the given default value', function () {

            compileDirective(changeMock, defaultValue, mockLocale, true, true);

            expect(sut.selectedValue.prop).toEqual(defaultValue);
        });

        it('should set the selected value to the first option if no defaultValue is provided', function () {

            compileDirective(changeMock, null, mockLocale, true, true);

            expect(sut.selectedValue.prop).toEqual(sut.options[0].prop);
        });

        it('should set i18n boolean equal to company data in rootscope', function () {

            compileDirective(changeMock, defaultValue, mockLocale, true, true);

            expect(sut.i18nEnabled).toEqual($scope.companyData.i18nEnabled);
        });

        it('should set the selected value to the first option if the default value does not exist as an option', function () {

            compileDirective(changeMock, 'nonexistentOption', mockLocale, true, true);

            expect(sut.selectedValue.prop).toEqual(sut.options[0].prop);
        });
    });

    describe('Sort By Options - Individual Locale', function () {
        beforeEach(function () {
            localeService.isAllLocales.and.returnValue(false);
        });

        it('should add test price to the options if all locales is not selected and i18n is disabled', function () {

            compileDirective(changeMock, null, mockLocale, true, true);
            expect(sut.options[3].prop).toEqual('testPrice');
        });

        it('should not add any gross margin sort options if insight pricing is not enabled', function () {

            compileDirective(changeMock, null, mockLocale, false, false);
            expect(sut.options.length).toEqual(4);
        });

        it('should add model price to the options if insight pricing is enabled, but gm pricing is not enabled', function () {

            compileDirective(changeMock, null, mockLocale, true, false);
            expect(sut.options[4].prop).toEqual('modelPrice');
        });

        it('should add max gm price to the options if insight pricing and gm pricing are enabled', function () {

            compileDirective(changeMock, null, mockLocale, true, true);
            expect(sut.options[4].prop).toEqual('maxGMPrice');
        });

        it('should add gm percentage to the options if insight pricing and gm pricing are enabled', function () {

            compileDirective(changeMock, null, mockLocale, true, true);
            expect(sut.options[5].prop).toEqual('maxGrossMarginPercent');
        });
    });

    describe('Sort By Options - All Locales', function () {

        beforeEach(function () {
            localeService.isAllLocales.and.returnValue(true);
        });

        it('should set the options to the default options only if all locales is selected', function () {
            compileDirective(changeMock, null, mockLocale, true, true);
            expect(sut.options.length).toEqual(3);
        });
    });

    describe('Sorting - ', function () {

        it('should sort by percent test price when total value is selected as the sort option', function () {
            var foundOption = _.find(sut.options, function (option) {
                return option.label.toLowerCase() === 'sort by total value';
            });

            expect(foundOption.prop).toEqual('percentTestPrice');
        });
    });

    describe('Locale Change - ', function () {

        beforeEach(function () {

            $scope.companyData.i18nEnabled = true;
            compileDirective(changeMock, null, mockLocale, true, true);
        });

        it('should call the given change function with the selected value when the sort by is changed', function () {

            var testSort = {
                prop : 'testSort',
                label : 'Test Sort Prop'
            };

            sut.selectedValue = testSort;

            sut.changeSortBy();

            expect(changeMock).toHaveBeenCalledWith(testSort);
        });

    });
});

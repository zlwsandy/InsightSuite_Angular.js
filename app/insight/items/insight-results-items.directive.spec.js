'use strict';

describe('Insight Results Items Directive Spec - ', function () {
    var $scope;
    var $compile;
    var $q;
    var element;
    var sut;
    var localeService;
    var $httpBackend;

    var mockLocales;
    var mockCompany;
    var mockSegments;

    // Stage test data
    var mockItemResults;

    var mockSegment;

    var mockLocale;

    var mockInsightLocaleFactory = {};

    var compileDirective = function (selectedLocale, selectedSegment, pricingEnabled, maxGmEnabled, items, sortBy, viewType) {

        $scope.mockItems = items || _.cloneDeep(mockItemResults);
        $scope.selectedLocale = selectedLocale;
        $scope.selectedSegment = selectedSegment;
        $scope.insight = {
            pricingEnabled : pricingEnabled,
            maxGmEnabled : maxGmEnabled
        };
        $scope.sortBy = sortBy;
        $scope.viewType = viewType || 'list';

        element = angular.element('<insight-results-items items="mockItems" view-type="viewType" sort-by="sortBy" current-segment="selectedSegment" current-locale="selectedLocale" insight="insight"></insight-results-items>');

        $compile(element)($scope);
        $scope.$digest();

        sut = element.isolateScope().InsightResultsItemsController;
    };

    beforeEach(module('mock/locales.json'));
    beforeEach(module('mock/company.json'));
    beforeEach(module('mock/segments.json'));
    beforeEach(module('mock/item-locale-results.json'));
    beforeEach(module('fi.common'));
    beforeEach(module('fi.insight'));

    // The external template file referenced by templateUrl
    beforeEach(module('components/fi/fi-sort-by-select.directive.html'));
    beforeEach(module('insight/items/insight-results-items.directive.html'));
    beforeEach(module('insight/items/insight-results-item.directive.html'));


    beforeEach(function () {

        localeService = jasmine.createSpyObj('localeService', [
            'isAllLocales',
            'findLocale'
        ]);

        module(function ($provide) {
            $provide.value('localeService', localeService);
        });
    });

    beforeEach(inject(function(_$compile_, _$rootScope_, _$q_, _$httpBackend_,
                               _mockLocales_, _mockCompany_, _mockSegments_, _mockItemLocaleResults_) {

        $compile = _$compile_;
        $scope = _$rootScope_;
        $q = _$q_;
        $httpBackend = _$httpBackend_;
        mockLocales = _mockLocales_;
        mockCompany = _mockCompany_;
        mockSegments = _mockSegments_;
        mockItemResults = _mockItemLocaleResults_;

        mockLocale = mockLocales.en_US;
        mockSegment = mockSegments[0];

        $httpBackend
            .whenGET('images/ic_close_24px.svg')
            .respond('');
        $httpBackend.whenGET('/app/images/ic_business_24px.svg').respond(200);

        $scope.companyData = mockCompany;
    }));

    describe('Common Initialization', function () {

        beforeEach(function () {
            compileDirective(mockLocale, mockSegment, false, false, null, 'totalValue');
        });

        it('should have a currently selected locale object', function () {
            expect(sut.currentLocale).toBe(mockLocale);
        });
    });

    describe('Sorting', function () {

        beforeEach(function () {
            compileDirective(mockLocale, mockSegment, true, null, null, 'totalValue');
        });

        it('should sort the items list in descending order when the sort by changes', function () {

            $scope.sortBy = 'percentTestPrice';

            expect(sut.items[0].percentTestPrice).toEqual(1.25398);
        });

        it('should preserve previous sort when the sort by changes to a property that does not exist', function () {

            // The compile directive function initializes with totalValue sort, so the list is already sorted by that
            //  when we get to this test
            $scope.sortBy = 'nonexistentProp';

            expect(sut.items[0].percentTestPrice).toEqual(1.25398);
        });

        it('should sort negative numbers in descending order', function () {

            $scope.sortBy = 'grossMarginDeltaBasisPoints';

            expect(sut.items[0].grossMarginDeltaBasisPoints).toEqual(-3000);
        });


        it('should sort by item number as a secondary sort when primary is equal', function () {

            $scope.sortBy = 'maxGMPrice';

            expect(sut.items[0].number).toEqual('566036');
        });
    });

    describe('View Type', function () {

        beforeEach(function () {
            // Last parameter is the view type (here 'print')
            compileDirective(mockLocale, mockSegment, false, false, null, 'totalValue', 'print');
        });

        it('should return false if view type is not list', function () {

            expect(sut.isListView()).toBe(false);
        });

        it('should return true if view type is set to list', function () {

            sut.showListView();

            expect(sut.isListView()).toBe(true);
        });
    });
});

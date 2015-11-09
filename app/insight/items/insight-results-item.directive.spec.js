'use strict';

describe('Insight Results Item Directive Specs', function () {
    var $scope;
    var $compile;
    var $state;
    var imageBrowseDialog;
    var element;
    var sut;
    var localeService = {};

    var mockLocales;
    var mockItemLocaleResults;

    // Stage test data
    var mockItem;
    var mockInsightId = 123;

    var mockLocale;

    var compileDirective = function (selectedLocale, pricingEnabled, maxGmEnabled, item, sortBy) {

        $scope.mockItem = item || mockItem;
        $scope.selectedLocale = selectedLocale;
        $scope.insight = {
            insightId : mockInsightId,
            pricingEnabled : pricingEnabled,
            maxGrossMargin : maxGmEnabled
        };
        $scope.sortBy = sortBy;

        element = angular.element('<insight-results-item item="mockItem" sort-by="sortBy" current-locale="selectedLocale" insight="insight"></insight-results-item>');

        $compile(element)($scope);
        $scope.$digest();

        sut = element.isolateScope().InsightResultsItemController;
    };

    beforeEach(module('mock/locales.json'));
    beforeEach(module('mock/item-locale-results.json'));
    beforeEach(module('fi.common'));
    beforeEach(module('fi.insight'));

    // The external template file referenced by templateUrl
    beforeEach(module('components/fi/fi-sort-by-select.directive.html'));
    beforeEach(module('insight/items/insight-results-item.directive.html'));

    beforeEach(function () {

        module(function ($provide) {
            localeService.findLocale = jasmine.createSpy('localeFactory findLocale');

            localeService.isAllLocales = jasmine.createSpy('localeService isAllLocales');
            $state = jasmine.createSpyObj('$state', ['go']);
            imageBrowseDialog = jasmine.createSpyObj('imageBrowseDialog', ['show']);

            $provide.value('localeService', localeService);
            $provide.value('$state', $state);
            $provide.value('imageBrowseDialog', imageBrowseDialog);
        });
    });

    beforeEach(inject(function(_$compile_, _$rootScope_, _mockLocales_, _mockItemLocaleResults_) {

        $compile = _$compile_;
        $scope = _$rootScope_;
        mockLocales = _mockLocales_;
        mockLocale = mockLocales.en_US;
        mockItemLocaleResults = _mockItemLocaleResults_;
        mockItem = mockItemLocaleResults[0];

        localeService.findLocale.and.returnValue(mockLocales.en_US);
    }));

    describe('Common Initialization', function () {

        beforeEach(function () {
            compileDirective(mockLocale, false, false);
        });

        it('should have a currently selected locale object', function () {
            expect(sut.currentLocale).toBe(mockLocale);
        });
    });

    describe('Show Model Price', function () {

        beforeEach(function () {
            compileDirective(mockLocale, false, false);
        });

        it('should not show model price if all locales is true', function () {
            localeService.isAllLocales.and.returnValue(true);

            expect(sut.showModelPrice()).toBe(false);
        });

        it('should not show model price if all locales is false but pricing is not enabled', function () {

            compileDirective(mockLocale, false, false);

            expect(sut.showModelPrice()).toBe(false);
        });

        it('should not show model price if all locales is false and pricing is null', function () {

            compileDirective(mockLocale, null, false);

            expect(sut.showModelPrice()).toBe(false);
        });


        it('should not show model price if all locales is false and pricing is undefined', function () {

            compileDirective(mockLocale, undefined, false);

            expect(sut.showModelPrice()).toBe(false);
        });

        it('should not show model price if all locales is false, pricing is enabled and max gm pricing is enabled', function () {
            spyOn(sut, 'isAllLocales').and.returnValue(false);

            compileDirective(mockLocale, true, true);

            expect(sut.showModelPrice()).toBe(false);
        });

        it('should show model price if all locales is false, pricing is enabled and max gm pricing is not enabled', function () {
            compileDirective(mockLocale, true, false);

            localeService.isAllLocales.and.returnValue(true);

            expect(sut.showModelPrice()).toBe(false);
        });

        it('should show model price if all locales is false, pricing is enabled and max gm pricing is null', function () {
            compileDirective(mockLocale, true, null);

            localeService.isAllLocales.and.returnValue(true);

            expect(sut.showModelPrice()).toBe(false);
        });

        it('should show model price if all locales is false, pricing is enabled and max gm pricing is undefined', function () {
            compileDirective(mockLocale, true, undefined);

            localeService.isAllLocales.and.returnValue(true);

            expect(sut.showModelPrice()).toBe(false);
        });
    });


    describe('Show Max GM Price', function () {

        beforeEach(function () {
            compileDirective(mockLocale, false, false);
        });

        it('should not show max gm price if all locales is true', function () {
            localeService.isAllLocales.and.returnValue(true);

            expect(sut.showMaxGmPrice()).toBe(false);
        });

        it('should not show max gm price if all locales is false but pricing is not enabled', function () {
            compileDirective(mockLocale, false, false);

            expect(sut.showMaxGmPrice()).toBe(false);
        });

        it('should not show max gm price if all locales is false and pricing enabled is null', function () {
            compileDirective(mockLocale, null, false);

            expect(sut.showMaxGmPrice()).toBe(false);
        });

        it('should not show max gm price if all locales is false and pricing enabled is undefined', function () {
            compileDirective(mockLocale, undefined, false);

            expect(sut.showMaxGmPrice()).toBe(false);
        });

        it('should not show max gm price if all locales is false, pricing is enabled and max gm pricing is not enabled', function () {
            compileDirective(mockLocale, true, false);

            expect(sut.showMaxGmPrice()).toBe(false);
        });

        it('should not show max gm price if all locales is false, pricing is enabled and max gm pricing is null', function () {
            compileDirective(mockLocale, true, null);

            expect(sut.showMaxGmPrice()).toBe(false);
        });

        it('should not show max gm price if all locales is false, pricing is enabled and max gm pricing is undefined', function () {
            compileDirective(mockLocale, true, undefined);

            expect(sut.showMaxGmPrice()).toBe(false);
        });

        it('should show max gm price if all locales is false, pricing is enabled and max gm pricing is enabled', function () {
            compileDirective(mockLocale, true, true);

            localeService.isAllLocales.and.returnValue(true);

            expect(sut.showMaxGmPrice()).toBe(false);
        });
    });

    describe('Show Gross Margin Delta Basis Points', function () {

        beforeEach(function () {
            compileDirective(mockLocale, false, false);
        });

        it('should not show gm delta basis points if all locales is true', function () {

            localeService.isAllLocales.and.returnValue(true);

            expect(sut.showGrossMarginDeltaBasisPoints()).toBe(false);
        });

        it('should not show gm delta basis points if all locales is false but pricing is not enabled', function () {
            compileDirective(mockLocale, false, false);

            localeService.isAllLocales.and.returnValue(false);

            expect(sut.showGrossMarginDeltaBasisPoints()).toBe(false);
        });

        it('should not show gm delta basis points if all locales is false but pricing is null', function () {
            compileDirective(mockLocale, null, false);

            expect(sut.showGrossMarginDeltaBasisPoints()).toBe(false);
        });

        it('should not show gm delta basis points if all locales is false but pricing is undefined', function () {
            compileDirective(mockLocale, undefined, false);

            expect(sut.showGrossMarginDeltaBasisPoints()).toBe(false);
        });

        it('should not show gm delta basis points if all locales is false, pricing is enabled and max gm pricing is not enabled', function () {
            compileDirective(mockLocale, true, false);

            expect(sut.showGrossMarginDeltaBasisPoints()).toBe(false);
        });

        it('should not show gm delta basis points if all locales is false, pricing is enabled and max gm pricing is null', function () {
            compileDirective(mockLocale, true, null);

            localeService.isAllLocales.and.returnValue(false);

            expect(sut.showGrossMarginDeltaBasisPoints()).toBe(false);
        });

        it('should not show gm delta basis points if all locales is false, pricing is enabled and max gm pricing is undefined', function () {
            compileDirective(mockLocale, true, undefined);

            localeService.isAllLocales.and.returnValue(false);

            expect(sut.showGrossMarginDeltaBasisPoints()).toBe(false);
        });

        it('should show gm delta basis points if all locales is false, pricing is enabled and max gm pricing is enabled', function () {
            compileDirective(mockLocale, true, true);

            localeService.isAllLocales.and.returnValue(true);

            expect(sut.showGrossMarginDeltaBasisPoints()).toBe(false);
        });
    });

    describe('Total Value Precision', function () {
        beforeEach(function () {
            compileDirective(mockLocale, true, null);
        });

        it('should show the total value with 1 decimal place if All Locales is selected', function () {
            localeService.isAllLocales.and.returnValue(true);

            expect(sut.getTotalValuePrecision()).toEqual(1);
        });

        it('should show the total value with 0 decimal places if All Locales is not selected', function () {
            localeService.isAllLocales.and.returnValue(false);

            expect(sut.getTotalValuePrecision()).toEqual(0);
        });
    });

    describe('View Item Detail', function () {
        beforeEach(function () {
            compileDirective(mockLocale, true, null);
        });

        it('should navigate to itemDetail if the image thumbnail was not clicked', function () {
            var evt = {
                target : {
                    className : 'test'
                }
            };
            sut.viewItemDetail(evt);

            expect($state.go).toHaveBeenCalledWith('insightTabNoActionbarWithLocale.itemDetail', {
                gameItemId : mockItem.gameItemId,
                insightId : mockInsightId,
                locale : mockLocale.locale
            }, {reload : true});
        });

        it('should navigate to itemDetail if an invalid event is passed', function () {
            sut.viewItemDetail(null);

            expect($state.go).toHaveBeenCalledWith('insightTabNoActionbarWithLocale.itemDetail', {
                gameItemId : mockItem.gameItemId,
                insightId : mockInsightId,
                locale : mockLocale.locale
            }, {reload : true});
        });

        it('should not navigate to itemDetail if the image thumbnail was clicked', function () {
            var evt = {
                target : {
                    className : 'item-thumbnail'
                }
            };
            sut.viewItemDetail(evt);

            expect($state.go).not.toHaveBeenCalled();
        });

        it('should show the image browse dialog if the image thumbnail was clicked', function () {
            var evt = {
                target : {
                    className : 'item-thumbnail'
                }
            };
            sut.viewItemDetail(evt);

            expect(imageBrowseDialog.show).toHaveBeenCalled();
        });
    });
});

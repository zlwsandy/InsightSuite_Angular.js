'use strict';

describe('Insight Segments Controller Specs - ', function () {

    var $state;
    var $q;
    var localeService;
    var insightLocaleFactory;
    var insightDataService;
    var sut;
    var $rootScope;
    var imageBrowseDialog;
    var $stateParams;
    var defaultLocaleCode = 'en_US';
    var defaultInsightId = 1045;

    var mockInsight;

    var mockLocale;

    var mockItemSegmentResults;
    var mockSegments;

    var getSuccessfulPromise = function (data) {
        return $q(function (resolve) {
            resolve(data);
        });
    };

    var createController = function (isAllLocales, noLocale) {
        inject(function (_$rootScope_, $controller, _$stateParams_, _$q_, _mockSegments_,
                         _mockItemSegmentResults_, _mockInsight_) {
            $rootScope = _$rootScope_;
            $stateParams = _$stateParams_;
            $q = _$q_;
            mockSegments = _mockSegments_;
            mockItemSegmentResults = _mockItemSegmentResults_;
            mockInsight = _mockInsight_;
            mockLocale = mockInsight.gameRunLocaleList[2];

            $stateParams.locale = defaultLocaleCode;
            $stateParams.insightId = defaultInsightId;

            localeService.isAllLocales.and.returnValue(isAllLocales);
            localeService.findLocale.and.returnValue(noLocale ? null : mockLocale);

            insightDataService.getInsightItemSegments.and.returnValue(getSuccessfulPromise(mockItemSegmentResults));
            insightDataService.getInsightSegments.and.returnValue(getSuccessfulPromise(mockSegments));

            insightLocaleFactory.isInsightLocaleResults.and.returnValue(true);

            sut = $controller('InsightsSegmentsController', {
                $scope: $rootScope.$new(),
                insight : mockInsight
            });

        });
    };



    // Load module under test
    beforeEach(module('mock/item-segment-results.json'));
    beforeEach(module('mock/segments.json'));
    beforeEach(module('mock/insight.json'));
    beforeEach(module('fi.common'));
    beforeEach(module('fi.insight'));

    // Setup spies
    beforeEach(function () {

        insightDataService = jasmine.createSpyObj('insightDataService', ['getInsightItemSegments', 'getInsightSegments']);
        localeService = jasmine.createSpyObj('localeService', ['isAllLocales', 'findLocale']);
        insightLocaleFactory = jasmine.createSpyObj('insightLocaleFactory', ['isInsightLocaleResults']);
        imageBrowseDialog = jasmine.createSpyObj('imageBrowseDialog', ['show']);

        $state = {
            'go' : jasmine.createSpy('$state go')
        };
    });

    // Setup mock injection using $provide.value
    beforeEach(function () {
        module(function ($provide) {
            $provide.value("insightDataService", insightDataService);
            $provide.value("$state", $state);
            $provide.value("insight", mockInsight);
            $provide.value("isAdmin", true);
            $provide.value("localeService", localeService);
            $provide.value("insightLocaleFactory", insightLocaleFactory);
            $provide.value("imageBrowseDialog", imageBrowseDialog);
        })
    });


    describe('initialization', function () {

        beforeEach(function () {
            createController(false);
            $rootScope.$digest();
        });

        it('should set the segments to the value returned from the insight data service', function () {
            expect(sut.segments).toEqual(mockSegments);
        });
    });

    describe('Common Initialization, Results Locale - ', function () {

        beforeEach(function () {
            insightLocaleFactory.isInsightLocaleResults.and.returnValue(true);
            createController(false);
            $rootScope.$digest();
        });

        it('should set the current locale to be the locale returned from findLocales in the locale service', function () {

            expect(sut.currentLocale).toEqual(mockLocale);
        });

        it('should not show the please select locale message if All Locales is not selected', function () {

            expect(sut.showPleaseSelectLocaleMsg).toBe(false);
        });

        it('should set the items with segments since the locale is in results.', function () {
            expect(sut.allItems).toEqual(mockItemSegmentResults);
        })
    });

    describe('Initialization All Locales - ', function () {

        beforeEach(function () {
            createController(true);
            $rootScope.$digest();
        });

        it('should show the please select locale message if All Locales is selected', function () {

            expect(sut.showPleaseSelectLocaleMsg).toBe(true);
        });
    });

    describe('Locale Change - ', function () {

        beforeEach(function () {
            createController(false);

            $state.go.calls.reset();
        });

        it('should refresh the state with the new locale when the locale changes', function () {

            var newLocale = {
                insightId : 1045,
                locale : 'fr_FR'
            };

            sut.localeChange(newLocale);

            expect($state.go.calls.argsFor(0)[0]).toEqual('insightTabWithLocale.segments');
            expect($state.go.calls.argsFor(0)[1]).toEqual(newLocale);
        });
    });

    describe('Get Cell Color',function(){
        beforeEach(function(){
            createController(false);
        });
        it(' should display different color based on receiced value',function(){
            var index = 5;
            sut.getCellColor(index);
            expect(sut.getCellColor(index)).toEqual('total-value-5');
        })
    });

    describe('get Total Value Display',function(){
        beforeEach(function(){
            createController(false);
        });
        it('should display specific information in the first cell',function(){
            var index = 0;
            expect(sut.getTotalValueDisplay(mockSegments[0], index)).toEqual('Not Available');
            expect(sut.getTotalValueDisplay(mockSegments[1], index)).toEqual('Generating...');
        })
    });

    describe(' Common testing-',function(){
        beforeEach(function(){
            createController(false);
        });
        it('should be undefined if segment status is not results-',function(){
            var index = 5;
            expect(sut.toggleSort(index, mockSegments[0])).toBeUndefined();
        });
    });

    describe('Show Image Browser', function () {
        beforeEach(function(){
            createController(false);
        });

        it('should show the image browser dialog', function () {
            sut.showImageBrowseDialog({
                itemImages : []
            });

            expect(imageBrowseDialog.show).toHaveBeenCalled();
        });

        it('should not show the image browser dialog if no item is passed', function () {
            sut.showImageBrowseDialog();

            expect(imageBrowseDialog.show).not.toHaveBeenCalled();
        });
    });

    describe('Toggle Sort All', function () {

        beforeEach(function(){
            createController(false);
        });

        it('should set the previous sort to the current sort', function () {
            spyOn(sut, 'changeOrder');
            spyOn(sut, 'getSort');

            sut.currentSort = 'test';

            sut.toggleSortAll();

            expect(sut.previousSort).toEqual('test');
        });

        it('should set the current sort to all', function () {
            spyOn(sut, 'changeOrder');
            spyOn(sut, 'getSort');

            sut.toggleSortAll();

            expect(sut.currentSort).toEqual('all');
        });
    });

    describe('Change Order', function () {
        beforeEach(function(){
            createController(false);
        });

        it('should set the sort order to desc if the current and previous sort are equal and current sort is asc', function () {

            sut.currentSort = 'test';
            sut.previousSort = 'test';
            sut.status = 'asc';

            sut.changeOrder();

            expect(sut.status).toEqual('desc');
        });

        it('should set the sort order to asc if the current and previous sort are equal and current sort is desc', function () {

            sut.currentSort = 'test';
            sut.previousSort = 'test';
            sut.status = 'desc';

            sut.changeOrder();

            expect(sut.status).toEqual('asc');
        });

        it('should not toggle the sort order if the current and previous sort are not equal', function () {

            sut.currentSort = 'current';
            sut.previousSort = 'prev';
            sut.status = 'asc';

            sut.changeOrder();

            expect(sut.status).toEqual('asc');
        });
    });

    describe('Add Segments', function () {

        beforeEach(function(){
            createController(false);
        });

        it('should navigate to the segments tab', function () {
            sut.addSegments();

            expect($state.go).toHaveBeenCalledWith('insightTabNoActionbarWithLocale.manageSegments', {
                insightId : defaultInsightId,
                locale : mockLocale.locale
            });
        });
    });

    describe('Sorting', function () {

        beforeEach(function () {
            createController(false);
        });

        it('should sort in descending order by default', function () {

            sut.allItems = mockItemSegmentResults;

            var sorted = sut.getSort();

            expect(sorted[0].percentTestPrice >= sorted[1].percentTestPrice).toBe(true);
        });

        it('should sort in ascending order if status is ascending', function () {

            sut.allItems = mockItemSegmentResults;
            sut.status = 'asc';

            var sorted = sut.getSort();

            expect(sorted[0].percentTestPrice <= sorted[1].percentTestPrice).toBe(true);
        });

        it('should sort by item number if percent test price is equal', function () {

            sut.allItems = mockItemSegmentResults;

            var sorted = sut.getSort();

            expect(sorted[0].number).toBeLessThan(sorted[1].number);
        });

        it('should sort segment game items in descending order by default', function () {
            spyOn(sut, 'changeOrder');

            $rootScope.$digest();

            var sorted = sut.toggleSort(1, mockItemSegmentResults[0].segmentGameItems[0]);

            expect(sorted[0].percentTestPrice >= sorted[1].percentTestPrice).toBe(true);
        });

        it('should sort segment game items in descending order by default', function () {
            spyOn(sut, 'changeOrder');

            $rootScope.$digest();
            sut.status = 'asc';

            var sorted = sut.toggleSort(1, mockItemSegmentResults[0].segmentGameItems[0]);

            expect(sorted[0].percentTestPrice <= sorted[1].percentTestPrice).toBe(true);
        })
    });

    describe('No Locale', function () {
        beforeEach(function () {
            localeService.findLocale.and.returnValue(null);
            createController(false, true);
        });

        it('should', function () {
            expect(sut.showPleaseSelectLocaleMsg).toBe(true);
        })
    });
});

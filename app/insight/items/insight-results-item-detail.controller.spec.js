'use strict';

describe('Insight Results Item Detail Controller Specs - ', function () {
    var sut;
    var $rootScope;
    var insightLocaleFactory;
    var localeService;
    var itemCommentsDialog;
    var $state;
    var insightDataService;
    var isAdmin;
    var $q;
    var FiConstants;
    var mockLocales;
    var mockLocale;
    var mockInsightTabFactory = {};
    var mockSegments;
    var mockItemLocales;
    var mockItemSegment;
    var mockItemTopWords;

    var mockComments = [];
    var mockInsightId = 123;
    var mockCompany = {};

    var getSuccessfulPromise = function (data) {
        return $q(function (resolve) {
            resolve(data);
        });
    };

    beforeEach(module('mock/locales.json'));
    beforeEach(module('mock/segments.json'));
    beforeEach(module('mock/item-locale-results.json'));
    beforeEach(module('mock/item-details-segment-results.json'));
    beforeEach(module('mock/item-top-words.json'));


    // load module under test
    beforeEach(module('fi.constants'));
    beforeEach(module('fi.insight'));

    // Setup spies
    beforeEach(function () {

        insightLocaleFactory = jasmine.createSpyObj('insightLocaleFactory', ['isInsightLocaleResults']);
        localeService = jasmine.createSpyObj('localeService', ['isAllLocales', 'findLocale','getFlagImageUrl']);
        itemCommentsDialog = jasmine.createSpyObj('itemCommentsDialog', ['show']);
        insightDataService = jasmine.createSpyObj('insightDataService', ['getInsightItemLocales','getInsightSegments','getInsightItemResultsSegments']);


        $state = {
            'go' : jasmine.createSpy('$state go')
        };
    });

    // Setup mock injection using $provide.value
    beforeEach(function () {
        module(function ($provide) {
            $provide.value("$state", $state);
            $provide.value("insight", {
                insightId : mockInsightId
            });
            $provide.value("insightItem", {});
            $provide.value("insightItemLocales", mockItemLocales);
            $provide.value("insightItemTopWords", mockItemTopWords);
            $provide.value("insightItemComments", mockComments);
            $provide.value("insightLocaleFactory", insightLocaleFactory);
            $provide.value("localeService", localeService);
            $provide.value("itemCommentsDialog", itemCommentsDialog);
            $provide.value('insightDataService', insightDataService);
            $provide.value('isAdmin', isAdmin);
            $provide.value('insightTabFactory', mockInsightTabFactory);
            $provide.value('company', mockCompany);

        })
    });

    // inject controller
    var createController = function (segmentData, topWords) {
        inject(function (_$rootScope_, $controller, _FiConstants_, _$q_, _mockLocales_, _mockSegments_, _mockItemLocaleResults_, _mockItemDetailsSegmentResults_, _mockItemTopWords_) {
            $rootScope = _$rootScope_;
            FiConstants = _FiConstants_;
            mockLocales = _mockLocales_;
            mockSegments = _mockSegments_;
            mockItemLocales = _mockItemLocaleResults_;
            mockItemSegment = _.cloneDeep(_mockItemDetailsSegmentResults_);
            if (!topWords) {
                topWords = _mockItemTopWords_;
            }
            mockItemTopWords = _.cloneDeep(topWords);

            mockLocale = mockLocales.fr_FR;

            $q = _$q_;

            insightDataService.getInsightSegments.and.returnValue(getSuccessfulPromise(segmentData));
            localeService.findLocale.and.returnValue(mockLocale);

            sut = $controller('InsightResultsItemDetailController', {
                $scope: $rootScope.$new(),
                insightItemSegments : mockItemSegment,
                insightItemTopWords : mockItemTopWords,
                isAdmin: isAdmin
            });
        });
    };

    describe('Initialization - ', function () {

        it('should set the current locale to what is returned from the locale service', function () {
            createController();
            expect(sut.currentLocale).toEqual(mockLocale);
        });

        it('should default the view type to list', function () {
            createController();
            expect(sut.viewType).toEqual(FiConstants.VIEW_TYPE.LIST);
        });

        it('should have segments data ', function () {
            createController(mockSegments);
            $rootScope.$digest();
            expect(sut.segments).toBeDefined;
        });

        it('should return empty array if no segments data return', function (){
            createController();
            $rootScope.$digest();
            expect(sut.segments).toEqual([]);
        });

        it('should default the isLocaleHasSegments to true', function () {
            createController(mockSegments);
            $rootScope.$digest();
            expect(sut.isLocaleHasSegments).toBe(true);
        });

        it('should default the isLocaleHasSegments to false if no segments Data', function () {
            createController([]);
            $rootScope.$digest();
            expect(sut.isLocaleHasSegments).toBe(false);
        })
    });

    describe('Close - ', function () {
        beforeEach(function (){
            createController();
        });
        it('should navigate to the item detail state', function () {

            sut.close();

            expect($state.go).toHaveBeenCalledWith('insightTabWithLocale.items', {
                insightId : mockInsightId,
                locale : mockLocale.locale
            });
        });
    });

    describe('Show Item Comments - ', function () {
        beforeEach(function (){
            createController();
        });
        it('should call show on the dialog service', function () {

            sut.showItemCommentsDialog();

            expect(itemCommentsDialog.show).toHaveBeenCalled();
        });
    });

    describe('Select Tab - ', function () {
        beforeEach(function (){
            createController();
        });
        it('should not hide the ticket price curve when the current tab is the Demand Curve tab', function () {

            sut.selectedTabIndex = 0;
            sut.showTicketPriceCurve = true;

            sut.selectTab();

            expect(sut.showTicketPriceCurve).toBe(true);
        });

        it('should hide the ticket price curve when the current tab is not the Demand Curve tab', function () {

            sut.selectedTabIndex = 1;
            sut.showTicketPriceCurve = true;

            sut.selectTab();

            expect(sut.showTicketPriceCurve).toBe(false);
        });
    });

    describe('Get Item Locales Information - ', function () {
        beforeEach(function (){
            createController();
        });
        it('should put the current locale as the first item in the array', function () {
            sut.currentLocale = mockLocales.fr_FR;
            $rootScope.$digest();
            expect(sut.itemLocalesResults[0].gameRunLocale).toEqual('fr_FR');
        })

        it('should sort rest of locales alphabetically', function () {
            sut.currentLocale = mockLocales.fr_FR;
            $rootScope.$digest();
            expect(sut.itemLocalesResults[1].gameRunLocale).toEqual('en_US');
            expect(sut.itemLocalesResults[2].gameRunLocale).toEqual('zh_CN');
        });
        it('should find the item is tested ', function () {
            sut.currentLocale = mockLocales.fr_FR;
            $rootScope.$digest();
            expect(sut.itemLocalesResults[2].isItemNotTested).toBe(true);
        });
        it('should find item is referenced item ', function () {
            sut.currentLocale = mockLocales.fr_FR;
            $rootScope.$digest();
            expect(sut.itemLocalesResults[2].isReferenceItem).toBe(true);
        })
    });

    describe('Get Item Segment Information - ',function (){
        beforeEach(function (){
            createController(mockSegments);
        });
        it('should put all respondents as the first segment in the array', function () {
            sut.currentLocale = mockLocales.fr_FR;
            $rootScope.$digest();
            expect(sut.itemSegmentsResults[0].gameRunName).toEqual('All Respondents');
        });
        it('should sort rest of segments by segment name ascending',function () {
            sut.currentLocale = mockLocales.fr_FR;
            $rootScope.$digest();
            expect(sut.itemSegmentsResults[1].gameRunName).toEqual('Male');
            expect(sut.itemSegmentsResults[2].gameRunName).toEqual('Female');
            expect(sut.itemSegmentsResults[3].gameRunName).toEqual('Female');
        });
        it('should return data for display segment info or not',function () {
            sut.currentLocale = mockLocales.fr_FR;
            $rootScope.$digest();
            expect(sut.itemSegmentsResults[0].showItemData).toBe(true);
            expect(sut.itemSegmentsResults[1].showItemData).toBe(true);
            expect(sut.itemSegmentsResults[2].showItemData).toBe(true);
        })
    });

    describe('Get Item Comments Top Words - ', function () {
        beforeEach(function (){
            createController();
        });
        it('should change value to negative - ', function () {
            $rootScope.$digest();
            expect(sut.positiveWords[0]).toEqual(15);
            expect(sut.negativeWords[0]).toEqual(2);
        })
    })

    describe('Is All Respondents', function () {

        beforeEach(function (){
            createController();
        });

        it('should return true if the selected segment is equal to the locale', function () {

            mockInsightTabFactory.selectedSegment = mockLocale;

            expect(sut.isAllRespondents()).toBe(true);
        });

        it('should return false if the selected segment is not equal to the locale', function () {

            mockInsightTabFactory.selectedSegment = {
                gameRunId : 123
            };

            expect(sut.isAllRespondents()).toBe(false);
        });

        it('should return false if the selected segment is falsy', function () {

            mockInsightTabFactory.selectedSegment = undefined;

            expect(sut.isAllRespondents()).toBe(false);
        });
    });

    describe('Show Locales Tab', function () {

        beforeEach(function (){
            createController();
        });

        it('should return true if all respondents is selected and there is more than one locale', function () {

            // Note the default injection for insightItemLocales is above in the mocks, which is more than one locale
            spyOn(sut, 'isAllRespondents').and.returnValue(true);

            expect(sut.showLocalesTab()).toBe(true);
        });

        it('should return false if all respondents is selected and there is not more than one locale', function () {

            // Note the default injection for insightItemLocales is above in the mocks, which is more than one locale
            spyOn(sut, 'isAllRespondents').and.returnValue(true);

            sut.itemLocalesResults = [];

            expect(sut.showLocalesTab()).toBe(false);
        });

        it('should return false if all respondents is not selected', function () {

            // Note the default injection for insightItemLocales is above in the mocks, which is more than one locale
            spyOn(sut, 'isAllRespondents').and.returnValue(false);

            expect(sut.showLocalesTab()).toBe(false);
        });
    });

    describe('Show Demand Curve Tab', function () {

        beforeEach(function (){
            createController();
        });

        it('should return true if insight pricing is enabled', function () {

            sut.insight.pricingEnabled = true;

            expect(sut.showDemandCurveTab()).toBe(true);
        });

        it('should return false if insight pricing is not enabled', function () {

            sut.insight.pricingEnabled = false;

            expect(sut.showDemandCurveTab()).toBe(false);
        });
    });

    describe('show/hide top word bar chart', function () {
        beforeEach(function (){
            createController();
        });
        it('should return true if there are top words', function () {
            expect(sut.hasTopWords).toBe(true);
        })
    })
    describe('no top words', function () {
        beforeEach(function (){
            createController(undefined, []);
        });
        it('should return false if there are no top words', function () {
            expect(sut.hasTopWords).toBe(false);
        })
    })
});

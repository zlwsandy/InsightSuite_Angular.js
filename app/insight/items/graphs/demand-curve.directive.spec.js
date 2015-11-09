'use strict';

describe('DemandCurveDirective Specs - ', function () {

    var sut;
    var element;
    var $compile;
    var $scope;
    var mockFormatter;
    var mockLocales;
    var localeService;
    var $q;

    var mockItem = {
        'createTime' : 1412605661000,
        'itemId' : 87,
        'gameItemId' : 385,
        'name' : '0',
        'number' : '1',
        'reference' : 'LOW',
        'itemImages' : [ {
            'itemImageId' : 1886,
            'primary' : true,
            'status' : 'RESULTS',
            'name' : '0.jpeg',
            'thumbnailUrl' : 'thumbnail',
            'fullsizeUrl' : 'fullsize'
        } , {
            'itemImageId' : 1887,
            'primary' : false,
            'status' : 'RESULTS',
            'name' : '1.jpeg',
            'thumbnailUrl' : 'thumbnail',
            'fullsizeUrl' : 'fullsize'
        }],
        "testPrice" : 10.00,
        'promotionalPrice' : null,
        'unitCost' : 4.00,
        'description' : 'Jeans n At',
        'totalValue' : 1.0,
        'percentTestPrice' :.958,
        'maxGMPrice' : 9999.00,
        'modelPrice' : 1111.00,
        'maxGrossMarginPercent' : 0.0,
        'grossMarginDeltaBasisPoints' : -6000.0,
        'overallPositive' : 0.0,
        'overallNegative' : 0.0,
        "demandCurve" : {
            "curveId" : 898,
            "gameItemId" : 850,
            "curveData" : {
                "175.0" : 0.0,
                "75.0" : 25.0,
                "25.0" : 0.0
            }
        }
    };
    var currency = 20;
    var compileDirective = function (item, insightPricingEnabled, maxGmPricingEnabled, currentLocale) {

        $scope.item = _.cloneDeep(item);
        $scope.insightPricingEnabled = insightPricingEnabled;
        $scope.maxGmPricingEnabled = maxGmPricingEnabled;
        $scope.currentLocale = currentLocale || mockLocales.en_US;

        element = angular.element('<demand-curve item="item" current-locale="currentLocale" insight-pricing-enabled="insightPricingEnabled" max-gm-pricing-enabled="maxGmPricingEnabled"></demand-curve>');

        $compile(element)($scope);
        $scope.$digest();

        sut = element.isolateScope().DemandCurveController;
    };

    beforeEach(module('mock/locales.json'));
    beforeEach(module('fi.insight'));

    beforeEach(function () {
        mockFormatter = jasmine.createSpyObj('formatter', [
           'formatCurrency'
        ]);
        localeService = jasmine.createSpyObj('localeService', ['findLocale']);
    });

    beforeEach(function () {
        module(function ($provide) {
            $provide.value("formatter", mockFormatter);
            $provide.value('localeService', localeService);
        });
    });

    beforeEach(inject(function(_$compile_, _$rootScope_, _$q_, _mockLocales_) {

        $compile = _$compile_;
        $scope = _$rootScope_;
        $q = _$q_;
        mockLocales = _mockLocales_;

        localeService.findLocale.and.returnValue($q.when(mockLocales.en_US));
        mockFormatter.formatCurrency.and.returnValue($q.when(currency));
    }));

    describe('Initialization with valid curve data - ', function () {
        beforeEach(function () {
            compileDirective(mockItem, mockLocales.en_US);
        });

        it('should create a nested array of x,y coordinates based on the items demand curve data, ' +
            'sorted by the x-axis with all x-axis values converted to integers', function () {
            var chartData = sut.chartConfig.series[0].data;

            expect(chartData).toEqual([[25, 0], [75, 25], [175, 0]]);
        });
    });


    describe('Initialization with no item - ', function () {

        beforeEach(function () {
            compileDirective();
        });

        it('should set the chartData to an empty array', function () {
            var chartData = sut.chartConfig.series[0].data;

            expect(chartData).toEqual([]);
        });
    });


    describe('Initialization with item but no demandCurve property - ', function () {

        beforeEach(function () {
            var item = _.cloneDeep(mockItem);
            item.demandCurve = undefined;
            compileDirective(item);
        });

        it('should set the chartData to an empty array', function () {
            var chartData = sut.chartConfig.series[0].data;

            expect(chartData).toEqual([]);
        });
    });

    describe('Initialization with item and demandCurve property, but no curveData - ', function () {

        beforeEach(function () {
            var item = _.cloneDeep(mockItem);
            item.demandCurve.curveData = undefined;
            compileDirective(item);
        });

        it('should set the chartData to an empty array', function () {
            var chartData = sut.chartConfig.series[0].data;

            expect(chartData).toEqual([]);
        });
    });

    describe('Initialization with undefined data - ', function () {

        beforeEach(function () {
            var item = _.cloneDeep(mockItem);
            item.demandCurve.curveData['75.0'] = undefined;
            compileDirective(item);
        });

        it('should set undefined values to zero', function () {
            var chartData = sut.chartConfig.series[0].data;

            expect(chartData).toEqual([[25, 0], [75, 0], [175, 0]]);
        });
    });

    describe('Initialization with insight with no pricing enabled - ', function () {

        beforeEach(function () {
            compileDirective(mockItem, false, false);
        });

        it('should not add any pricing plotlines', function () {
            var totalPlotlines = sut.chartConfig.xAxis.plotLines;

            expect(totalPlotlines).not.toBeDefined();
        });
    });

    describe('Initialization with insight with pricing enabled, but max GM pricing disabled - ', function () {

        beforeEach(function () {
            compileDirective(mockItem, true, false);
        });

        it('should add an additional plotline for the model price', function () {
            var plotLine = sut.chartConfig.xAxis.plotLines[1];

            expect(plotLine.value).toEqual(mockItem.modelPrice);
        });
    });

    describe('Initialization with insight with pricing enabled and max GM pricing enabled - ', function () {

        beforeEach(function () {
            compileDirective(mockItem, true, true);
        });

        it('should add an additional plotline for the max gm price', function () {
            var plotLine = sut.chartConfig.xAxis.plotLines[1];

            expect(plotLine.value).toEqual(mockItem.maxGMPrice);
        });
    });
});

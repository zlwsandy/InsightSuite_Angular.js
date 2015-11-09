'use strict';

describe('Ticket Price Curve Directive Specs - ', function () {

    var sut;
    var element;
    var $compile;
    var $scope;
    var mockFormatter;
    var mockLocales;
    var $q;
    var localeService;

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

        $scope.item = item;
        $scope.insightPricingEnabled = insightPricingEnabled;
        $scope.maxGmPricingEnabled = maxGmPricingEnabled;
        $scope.currentLocale = currentLocale || mockLocales.en_US;

        element = angular.element('<ticket-price-curve item="item" current-locale="currentLocale" insight-pricing-enabled="insightPricingEnabled" max-gm-pricing-enabled="maxGmPricingEnabled"></ticket-price-curve>');

        $compile(element)($scope);
        $scope.$digest();

        sut = element.isolateScope().TicketPriceCurveController;
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

    beforeEach(inject(function(_$compile_, _$rootScope_, _mockLocales_, _$q_) {

        $compile = _$compile_;
        $scope = _$rootScope_;
        mockLocales = _mockLocales_;
        $q = _$q_;

        localeService.findLocale.and.returnValue($q.when(mockLocales.en_US));
        mockFormatter.formatCurrency.and.returnValue($q.when(currency));
    }));

    describe('Initialization with valid curve data - ', function () {

        beforeEach(function () {
            compileDirective(mockItem, mockLocales.en_US);
        });

        it('should add two additional pricing plotlines', function () {
            var totalPlotlines = sut.chartConfig.xAxis.plotLines;

            expect(totalPlotlines.length).toEqual(2);
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
});

'use strict';

describe('Sentiment Bar Chart Directive Spec - ', function () {
    var $scope;
    var $compile;
    var element;
    var sut;
    var $httpBackend;

    var en_US = {
            "locale" : "en_US",
            "numberFormat" : {
                "currencyCode" : "USD",
                "currencySymbol" : "$",
                "currencyDecimalSeparator" : ".",
                "currencyFractionDigits" : 2,
                "currencySpaceBetweenAmountAndSymbol" : false,
                "currencySymbolFirst" : true,
                "groupingSeparator" : ","
            },
            "desktopFlagUrl" : "/app/images/flags/flag.us.png"
        };
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
            },
            "sentimentPercentages" : [1,0,0,0,0,0]
        };

    var compileDirective = function (item, currentLocale) {

        $scope.item = item;
        $scope.currentLocale = currentLocale || en_US;

        element = angular.element('<sentiment-bar-chart item="item" current-locale="currentLocale" ></sentiment-bar-chart>');

        $compile(element)($scope);
        $scope.$digest();

        sut = element.isolateScope().sentimentBarChartController;
    };

    beforeEach(module('fi.insight'));

    beforeEach(module('insight/items/sentiments/sentiment-bar-chart.directive.html'));

    beforeEach(inject(function(_$compile_, _$rootScope_, _$httpBackend_) {

        $compile = _$compile_;
        $scope = _$rootScope_;
        $httpBackend = _$httpBackend_;

        $httpBackend
        .whenGET('images/icon-sentiment-loveit.svg')
        .respond('');

    $httpBackend
        .whenGET('images/icon-sentiment-hateit.svg')
        .respond('');

    $scope.$digest();

    }));

    describe('Initialization  - ', function () {

        beforeEach(function () {
            compileDirective(mockItem, en_US);
        });

        it('should initialize data', function () {
            compileDirective(mockItem, en_US);
            expect(sut).toBeDefined();
        });
    });
    describe('Get width for different catagories -  ', function () {

        beforeEach(function () {
            compileDirective(mockItem, en_US);
        });

        it('should display different width based on its percentage', function () {
            compileDirective(mockItem, en_US);
            var title = 'love'
            expect(sut.getWidth(title)).toEqual({width : '0%'});
        });
    });

});

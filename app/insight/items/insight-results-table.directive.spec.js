'use strict';

describe('Results table directive Spec - ', function () {
    var $scope;
    var $compile;
    var element;
    var sut;

    var mockItemLocales = [{
        createTime: 1435779277000,
        flagImageUrl: "/app/images/flags/32/flag.us.png",
        gameItemId: 947,
        gameRunId: 181,
        gameRunLocale: "en_US",
        gameRunName: "Multi-Locale Insight with Results",
        gameRunStatus: "RESULTS",
        itemId: 421,
        itemImages: null,
        maxGMPrice: 32.09,
        maxGrossMarginPercent: 0.71,
        modelPrice: 22.56,
        name: "TOP FRILLY",
        number: "566036",
        overallNegative: 0,
        overallPositive: 0.75,
        percentTestPrice: 1.25398,
        promotionalPrice: 13,
        reference: null,
        testPrice: 17.99,
        totalValue: 10,
        unitCost: 6
    },{
        createTime: 1435779277000,
        flagImageUrl: "/app/images/flags/32/flag.us.png",
        gameItemId: 947,
        gameRunId: 181,
        gameRunLocale: "en_US",
        gameRunName: "Multi-Locale Insight with Results",
        gameRunStatus: "HIDDEN",
        itemId: 421,
        itemImages: null,
        maxGMPrice: 32.09,
        maxGrossMarginPercent: 0.71,
        modelPrice: 22.56,
        name: "TOP FRILLY",
        number: "566036",
        overallNegative: 0,
        overallPositive: 0.75,
        percentTestPrice: 1.25398,
        promotionalPrice: 13,
        reference: null,
        testPrice: 17.99,
        totalValue: 10,
        unitCost: 6
    }
    ];
    
    var mockItem = {
            'createTime' : 1412605661000,
            'itemId' : 87,
            'gameItemId' : 385,
            'name' : '0',
            'number' : '1',
            'reference' : 'LOW',
            'gameRunStatus': 'SETUP',
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

    
    var compileDirective = function (item, insightPricingEnabled, itemResults, maxGmPricingEnabled) {

        $scope.item = item;
        $scope.insightPricingEnabled = insightPricingEnabled;
        $scope.maxGmPricingEnabled = maxGmPricingEnabled;
        $scope.itemLocales = itemResults;
        
        element = angular.element('<insight-results-table  item="insightResultsItemDetailController.item" insight-pricing-enabled="insightResultsItemDetailController.insight.pricingEnabled" max-gm-pricing-enabled="insightResultsItemDetailController.insight.maxGrossMargin" item-results="insightResultsItemDetailController.itemResults"> </insight-results-table>');

        $compile(element)($scope);
        $scope.$digest();

        sut = element.isolateScope().insightResultsTableController;
    };

    beforeEach(module('fi.insight'));
    
    beforeEach(module('insight/items/insight-results-table.directive.html'));
    
    beforeEach(inject(function(_$compile_, _$rootScope_) {

        $compile = _$compile_;
        $scope = _$rootScope_;

    $scope.$digest();

    }));
    
    describe('Initialization  - ', function () {

        beforeEach(function () {
            compileDirective(mockItemLocales, mockItem);
        });

        it('should initialize data', function () {
            expect(sut).toBeDefined();
        });
    });

});

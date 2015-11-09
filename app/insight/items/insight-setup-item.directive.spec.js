'use strict';

describe('insightSetupItemDirective specs - ', function () {
    var $scope, $compile, $state, element, sut;

    // Stage test data
    var testItem = {
        'createTime': 1432747982000,
        'description': 'Item 1 Description',
        'itemId': 417,
        'itemImages': [{
            'fullsizeUrl': '/secure/imageviewer.iv?f=%2F2014%2F158%2F1402131274847',
            'itemImageId': 184,
            'name': '1.jpeg',
            'primary': true,
            'status': 'COMPLETE',
            'thumbnailUrl': '/secure/imageviewer.iv?f=%2F2014%2F158%2F1402131274850'
        }],
        "testPrice": 110,
        'name': 'Item 1',
        'number': 'item-1',
        'promotionalPrice': 100,
        'unitCost': 50
    };

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
        "gameRunId" : 1,
        "desktopFlagUrl" : "/app/images/flags/flag.us.png"
    };

    beforeEach(module('fi.insight'));
    beforeEach(module('insight/items/insight-setup-item.directive.html'));

    beforeEach(function () {
        $state = {
            'go' : jasmine.createSpy('$state go'),
            current : {
                data : '',
                name : ''
            }
        };
    });

    beforeEach(function () {
        module(function ($provide) {
            $provide.value("$state", $state);
        })
    });

    beforeEach(inject(function(_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $scope = _$rootScope_;
    }));

    var compileDirective = function (item, currentLocale) {

        $scope.testItem = item;
        $scope.currency = 'USD';
        $scope.currentLocale = currentLocale;

        element = angular.element('<insight-setup-item item="testItem" locale="currentLocale" currency="{{currency}}" ></insight-setup-item>');

        $compile(element)($scope);
        $scope.$digest();

        sut = element.isolateScope().InsightSetupItemController;
    };

    describe('common initialization', function () {

        it('should have an insight item', function () {
            compileDirective(testItem, en_US);
            expect(sut.item).toBe(testItem);
        });

    });

    describe('select item', function () {

        it('should transition to the item edit detail view', function () {
            var stateParams = {gameRunId : sut.locale.gameRunId, itemId : sut.item.itemId};

            compileDirective(testItem, en_US);
            sut.selectItem();

            expect($state.go).toHaveBeenCalledWith('insightTabWithLocale.itemEdit', stateParams);
        });

    });

});

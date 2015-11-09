'use strict';

describe('insightSetupItemsDirective specs - ', function () {
    var $scope;
    var $compile;
    var element;
    var sut;

    // Stage test data
    var testItems = [
        {
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
        },
        {
            'createTime': 1432747982000,
            'description': 'Item 2 Description',
            'itemId': 418,
            'itemImages': [{
                'fullsizeUrl': '/secure/imageviewer.iv?f=%2F2014%2F158%2F1402131274847',
                'itemImageId': 185,
                'name': '2.jpeg',
                'primary': true,
                'status': 'COMPLETE',
                'thumbnailUrl': '/secure/imageviewer.iv?f=%2F2014%2F158%2F1402131274850'
            }],
            "testPrice": 110,
            'name': 'Item 2',
            'number': 'item-2',
            'promotionalPrice': 100,
            'unitCost': 50
        }
    ];

    var insightTestData = {
        'createTime': 1429560789000,
        'insightId': 1045,
        'name': 'Test Insight Name',
        'department': {
            'departmentId': 310,
            'name': 'Mens'
        },
        'gameRunLocaleList': [{
            'locale': 'en_US',
            'conversionRate': 1.0000000000,
            'currencyCode': 'USD',
            'gameRunId': 5755,
            'gameRunStatus': 'SETUP'
        }],
        'objective': 'test locale tabs',
        'pricingEnabled': false
    };

    var testLocale = {
        "locale": "en_US",
        "conversionRate": 1.0000000000,
        "currencyCode": "USD",
        "gameRunId": 174,
        "gameRunStatus": "SETUP"
    };

    var compileDirective = function (items, locale, noItems, noLocale) {

        $scope.items = angular.copy(items);
        $scope.insight = insightTestData;
        $scope.currentLocale = locale;
        $scope.showNoItemsMsg = noItems;
        $scope.showPleaseSelectLocaleMsg = noLocale;

        element = angular.element('<insight-setup-items items="items" current-locale="currentLocale" insight="insight" show-no-items-msg="showNoItemsMsg" show-please-select-locale-msg="showPleaseSelectLocaleMsg"></insight-setup-items>');

        $compile(element)($scope);
        $scope.$digest();

        sut = element.isolateScope().InsightSetupItemsController;
    };

    beforeEach(module('fi.insight'));
    beforeEach(module('insight/items/insight-setup-items.directive.html'));
    beforeEach(module('insight/items/insight-setup-item.directive.html'));

    beforeEach(inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $scope = _$rootScope_;
    }));

    describe('common initialization', function () {

        it('should have a list of insight items', function () {
            compileDirective(testItems, testLocale, true, false);
            expect(angular.equals(testItems, sut.items)).toEqual(true);
        });

        it('should show the no items message ', function () {
            compileDirective(testItems, testLocale, true, false);
            expect(sut.showNoItemsMsg).toBe(true);
        });

        it('should show the select locale message ', function () {
            compileDirective(testItems, testLocale, false, true);
            expect(sut.showPleaseSelectLocaleMsg).toBe(true);
        });

    });

});

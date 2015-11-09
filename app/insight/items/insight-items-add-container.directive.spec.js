'use strict';

describe('insightItemAddContainerDirective', function () {
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
                'status': 'RESULTS',
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
                'status': 'RESULTS',
                'thumbnailUrl': '/secure/imageviewer.iv?f=%2F2014%2F158%2F1402131274850'
            }],
            "testPrice": 110,
            'name': 'Item 2',
            'number': 'item-2',
            'promotionalPrice': 100,
            'unitCost': 50
        }
    ];

    var compileDirective = function (data) {

        $scope.items = data;
        $scope.currency = 'USD';
        $scope.primaryMessage = 'added to insight';
        $scope.dismissMock = jasmine.createSpy('dismissMock');
        $scope.dismissAllMock = jasmine.createSpy('dismissAllMock');
        $scope.addMock = jasmine.createSpy('addMock');

        element = angular.element('<insight-items-add-container items="items" currency="{{currency}}" highlight-color="background-error" text-color="red-text" on-dismiss="dismissMock" on-dismiss-all="dismissAllMock" on-add="addMock"></insight-items-add-container>');

        $compile(element)($scope);
        $scope.$digest();

        sut = element.isolateScope().InsightItemsAddContainerController;
    };

    beforeEach(module('fi.insight'));

    // The external template file referenced by templateUrl
    beforeEach(module('insight/items/insight-items-add-container.directive.html'));
    beforeEach(module('insight/items/insight-item-add.directive.html'));


    beforeEach(inject(function(_$compile_, _$rootScope_) {

        $compile = _$compile_;
        $scope = _$rootScope_;

    }));

    describe('common initialization', function () {

        it('should have an insight item', function () {
            compileDirective(testItems);
            expect(sut.items).toEqual(testItems);
        });

    });


    describe('dismiss event', function () {
        beforeEach(function () {
            compileDirective(testItems);
        });

        it('should call the passed function when dismiss action is triggered', function () {
            spyOn(sut, 'dismissCallback');

            expect(sut.dismissCallback).not.toHaveBeenCalled();

            sut.dismiss();

            expect(sut.dismissCallback).toHaveBeenCalled();
        });
    });

    describe('dismiss all event', function () {
        beforeEach(function () {
            compileDirective(testItems);
        });

        it('should call the passed function when dismiss all action is triggered', function () {
            spyOn(sut, 'dismissAllCallback');

            expect(sut.dismissAllCallback).not.toHaveBeenCalled();

            sut.dismissAll();

            expect(sut.dismissAllCallback).toHaveBeenCalled();
        });
    });

    describe('add event', function () {
        beforeEach(function () {
            compileDirective(testItems);
        });

        it('should call the passed function when add action is triggered', function () {
            spyOn(sut, 'addCallback');

            expect(sut.addCallback).not.toHaveBeenCalled();

            sut.add();

            expect(sut.addCallback).toHaveBeenCalled();
        });
    });
});

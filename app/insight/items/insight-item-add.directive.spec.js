'use strict';

describe('insightItemAddDirective', function () {
    var $scope, $compile, element, sut, mockItems;

    var compileDirective = function (item) {

        $scope.testItem = item;
        $scope.currency = 'USD';
        $scope.dismissMock = jasmine.createSpy('dismissMock');
        $scope.addMock = jasmine.createSpy('addMock');

        element = angular.element('<insight-item-add item="testItem" currency="{{currency}}" on-dismiss="dismissMock" on-add="addMock"></insight-item-add>');

        $compile(element)($scope);
        $scope.$digest();

        sut = element.isolateScope().InsightItemAddController;
    };

    beforeEach(module('mock/item-locale-setup.json'));
    beforeEach(module('fi.insight'));

    // The external template file referenced by templateUrl
    beforeEach(module('insight/items/insight-item-add.directive.html'));


    beforeEach(inject(function(_$compile_, _$rootScope_, _mockItemLocaleSetup_) {

        $compile = _$compile_;
        $scope = _$rootScope_;
        mockItems = _mockItemLocaleSetup_;

    }));

    describe('Item Images - ', function () {

        it('should display default image when an item does not have any images', function () {
            compileDirective(mockItems[0]);
            expect(sut.item.displayImage).toEqual({ thumbnailUrl: 'images/noimages-item.png', name: 'No Image' });
        });

        it('should display the primary image when an item has a primary image', function () {
            compileDirective(mockItems[1]);
            expect(sut.item.displayImage).toEqual(mockItems[1].itemImages[1]);
        });

        it('should display the first image when an item has images but does not have a primary image', function () {
            compileDirective(mockItems[2]);
            expect(sut.item.displayImage).toEqual(mockItems[2].itemImages[0]);
        });
    });

    describe('dismiss event', function () {
        beforeEach(function () {
            compileDirective(mockItems[1]);
        });

        it('should call the passed function when dismiss action is triggered', function () {
            spyOn(sut, 'dismissCallback');

            expect(sut.dismissCallback).not.toHaveBeenCalled();

            // Call the controller function which executes the callback that was passed into the directive (parent function)
            sut.dismiss();

            expect(sut.dismissCallback).toHaveBeenCalled();
        });
    });

    describe('add event', function () {
        beforeEach(function () {
            compileDirective(mockItems[1]);
        });

        it('should call the passed function when add action is triggered', function () {
            spyOn(sut, 'addCallback');

            expect(sut.addCallback).not.toHaveBeenCalled();

            // Call the controller function which executes the callback that was passed into the directive (parent function)
            sut.add();

            expect(sut.addCallback).toHaveBeenCalled();
        });
    });
});

'use strict';

describe('scrollContainerDirective', function () {
    var $rootScope;
    var $compile;
    var element;
    var $httpBackend;
    var isolateScope;

    var itemDetails = [
        'item1',
        'item2'
    ];

    beforeEach(module('fi.common'));

    beforeEach(module('components/utils/scrollContainer.directive.html'));

    beforeEach(module(function ($provide) {
        // template fails to load without this
        var $cookies = {};
        $cookies.cid = 90;
        $provide.value('$cookies', $cookies);
    }));

    beforeEach(inject(function(_$compile_, _$rootScope_, _$httpBackend_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;

        // Mock requests for images (md-icon is issuing an async request for these images and it fails the test with
        //  Unexpected request : GET ....
        $httpBackend
            .whenGET('images/ic_forward_24px.svg')
            .respond('');

        $httpBackend
            .whenGET('images/ic_backward_24px.svg')
            .respond('');

        $rootScope.itemDetails = itemDetails;

        element = $compile('<scroll-container item-details="itemDetails"></scroll-container>')($rootScope);
        $rootScope.$digest();

        isolateScope = element.isolateScope();
    }));

    it('should set itemDetails on the isolate scope', function() {
        expect(isolateScope.itemDetails).toEqual(itemDetails);
    });

    it('should call scrollLeft with a negative value if the direction is left', function () {
        spyOn(isolateScope, 'handleScroll');

        isolateScope.scroll('left');

        var handleScrollArgs = isolateScope.handleScroll.calls.argsFor(0);

        expect(handleScrollArgs).toBeLessThan(0);
    });

    it('should call scrollLeft with a positive value if the direction is right', function () {
        spyOn(isolateScope, 'handleScroll');

        isolateScope.scroll('right');

        var handleScrollArgs = isolateScope.handleScroll.calls.argsFor(0);

        expect(handleScrollArgs).toBeGreaterThan(0);
    });
});

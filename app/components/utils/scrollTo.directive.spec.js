'use strict';

describe('scrollTo Directive - ', function () {
    var $rootScope, $compile, element, sut;

    beforeEach(module('fi.common'));

    beforeEach(inject(function(_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;

        element = $compile('<div fi-scroll-to scroll-target="#elementId" scroll-container=".parent-container"></div>')($rootScope);
        $rootScope.$digest();

        sut = element.scope();

    }));

    it('should compile the element', function() {
        expect(element).toBeDefined();
    });

});

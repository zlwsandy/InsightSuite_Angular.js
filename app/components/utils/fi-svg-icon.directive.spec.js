'use strict';

describe('SVG Icon Directive - ', function () {
    var $rootScope, $compile, element, sut;

    beforeEach(module('fi.common'));

    beforeEach(inject(function(_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;

        element = $compile('<fi-svg-icon icon="star" css-class="indicator-icon blue" svg-height="75" svg-width="75"></fi-svg-icon>')($rootScope);
        $rootScope.$digest();

        sut = element.scope();

    }));

    it('should compile the element and render the proper svg output', function() {
        expect(element).toBeDefined();
        expect(element.html()).toBe('<svg width="75" height="75" viewBox="-100 -2 125 125" class="indicator-icon blue"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>')
    });

});

'use strict';

describe('fiLocaleDirective', function () {
    var $rootScope;
    var $compile;

    beforeEach(module('fi.common'));
    beforeEach(inject(function(_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    it('test with locale en_US', function() {
        var element = $compile('<fi-locale locale="en_US"></fi-locale>')($rootScope);
        $rootScope.$digest();
        expect(element.html()).toContain('en_US');
    });

    it('test with locale default', function() {
        var element = $compile('<fi-locale locale="default"></fi-locale>')($rootScope);
        $rootScope.$digest();
        expect(element.html()).not.toContain('default');
        expect(element.html()).toContain('All Locales');
    });
});

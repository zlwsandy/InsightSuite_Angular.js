'use strict';

describe('IE Tab Inkbar Spec -', function () {
    var $scope,
        $compile,
        $timeout,
        elm,
        sut;

    var compileDirective = function () {
        var html = [
        '<md-tabs>',
            '<md-tab label="Upload Items" ie-tab-inkbar></md-tab>',
            '<md-tab label="Browse Items" ie-tab-inkbar></md-tab>',
        '</md-tabs>'
        ];

        elm = angular.element(html.join(''));

        $scope.$apply(function () {
            $compile(elm)($scope);
        });
    };

    beforeEach(module('fi.common'));

    beforeEach(inject(function(_$compile_, _$rootScope_, _$timeout_) {
        $compile = _$compile_;
        $scope = _$rootScope_.$new();
        $timeout = _$timeout_;
    }));

    describe('Inkbar Styles', function () {
        var inkBar = undefined;

        beforeEach(function () {
            compileDirective();
        });

        afterEach(function () {
            jasmine.clock().uninstall();
        });

        it('should be initialized', function () {

            $timeout.flush();

            inkBar = elm.find('md-ink-bar');

            expect(inkBar.attr('style')).toEqual('left:0px; right:0px;');
        });

    });
});

'use strict';

describe('FiSticky Spec -', function () {
    var $scope,
        $compile,
        element;

    var compileDirective = function () {
        var html = [
        '<div fi-sticky fi-sticky-top="200" fi-sticky-container="ui-scroll-wrapper">',
            '<ul>',
                '<li class="active">',
                    '<a id="generalLink" href="#general">General</a>',
                '</li>',
                '<li>',
                    '<a id="localesLink" href="#locales">Locales</a>',
                '</li>',
                '<li>',
                    '<a id="pricingLink" href="#pricing">Pricing</a>',
                '</li>',
            '</ul>',
        '</div>'
        ];
        element = angular.element(html.join(''));

        $compile(element)($scope);
        $scope.$apply();
    };

    beforeEach(module('fi.common'));

    beforeEach(inject(function(_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $scope = _$rootScope_;

        compileDirective();
    }));

    describe('Init -', function () {

        it('should currectly set sticky wrapper', function () {

            var span = element.find('span');

            expect(span[0].getAttribute('style')).toEqual('display: ; height: 0px; margin: ; width: 0px;')
        });
    })
});

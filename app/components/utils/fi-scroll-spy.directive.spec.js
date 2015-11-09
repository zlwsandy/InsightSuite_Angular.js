'use strict';

describe('FiScrollSpy Spec -', function () {
    var $scope,
        $compile,
        $timeout,
        element;

    var compileDirective = function () {
        var html = [
        '<div fi-scroll-spy>',
            '<li class="active">',
                '<a id="generalLink" href="#general" class="active">General</a>',
            '</li>',
            '<li class="active">',
                '<a id="localesLink" href="#locales" class="active">Locales</a>',
            '</li>',
            '<div id="general"></div>',
            '<div id="locales"></div>',
        '</div>'
        ];
        element = angular.element(html.join(''));

        $compile(element)($scope);
        $scope.$apply();
    };

    beforeEach(module('fi.common'));

    beforeEach(inject(function(_$compile_, _$rootScope_, _$timeout_) {
        $compile = _$compile_;
        $scope = _$rootScope_;
        $timeout = _$timeout_;

        compileDirective();
    }));

    describe('Init -', function () {

        afterEach(function () {
            jasmine.clock().uninstall();
        });

        it('should currectly set achor to active', function () {
            $timeout.flush();

            var a = element.find('a');

            element.triggerHandler('scroll');

            expect(a[0].getAttribute('class')).toEqual('active');
        });
    })
});

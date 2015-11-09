'use strict';

describe('Focus Directive Spec -', function () {
    var $scope, $compile, elm, sut;

    var compileDirective = function (bool) {
        elm = angular.element('<input focus="focus"/>');

        $scope.$apply(function () {
            $scope.focus = bool;
            $compile(elm)($scope);
        });

        sut = elm.isolateScope();
    }

    beforeEach(module('fi.common'));

    beforeEach(inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $scope = _$rootScope_;
    }));

    describe('element gets focus', function () {

        it('should set focus', function () {
            compileDirective(true);

            expect(sut.focus).toBeTruthy();
        });

        it('should not set focus', function () {
            compileDirective(false);

            expect(sut.focus).toBeFalsy();
        });

    });
});

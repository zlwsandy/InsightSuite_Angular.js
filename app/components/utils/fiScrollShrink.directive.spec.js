'use strict';

describe('Fi Scroll Shrink Directive Specs', function () {
    var $scope;
    var $compile;
    var $httpBackend;
    var element;
    var sut;


    var compileDirective = function () {

        element = angular.element('<div fi-scroll-shrink></div>');

        $compile(element)($scope);
        $scope.$digest();

        sut = element.scope();
    };

    beforeEach(module('fi.common'));

    beforeEach(inject(function(_$compile_, _$rootScope_, _$httpBackend_) {
        $compile = _$compile_;
        $scope = _$rootScope_;
        $httpBackend = _$httpBackend_;

        compileDirective();
    }));

    describe('Initialization', function () {

        it('should correctly instantiate the directive', function () {

            expect(sut).toBeDefined();
        });

    });

});

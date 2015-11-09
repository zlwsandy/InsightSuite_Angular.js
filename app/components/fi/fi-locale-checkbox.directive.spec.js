'use strict';

describe('fi locale checkbox spec -', function () {
    var sut,
        elm,
        $compile,
        $scope,
        $httpBackend,
        testLocale = {
            en_US: {
                locale: 'en_US',
                desktopFlagUrl: 'testFlag'
            }
        };

    beforeEach(module('fi.common'));
    beforeEach(module('components/fi/fi-locale-checkbox.directive.html'));

    var compileDirective = function () {
        elm = angular.element('<fi-locale-checkbox locale="testLocale"></fi-locale-checkbox>');

        $scope.$apply(function () {
            $scope.testLocale = testLocale;
            $compile(elm)($scope);
        });

        sut = elm.isolateScope().fiLocaleCheckboxController;
    };

    beforeEach(inject(function(_$compile_, _$rootScope_, _$httpBackend_) {
        $compile = _$compile_;
        $scope = _$rootScope_;
        $httpBackend = _$httpBackend_;

        $httpBackend.whenGET('images/ic_check_24px.svg').respond(200);
    }));

    describe('fi locale checkbox attributes -', function () {

        it('should set locale', function () {
            compileDirective();

            expect(sut.locale).toEqual(testLocale);
        });
    });
});

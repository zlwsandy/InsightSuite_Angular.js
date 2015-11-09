'use strict';

describe('ToastController Specs -', function () {

    var sut;
    var $rootScope;
    var $mdToast;

    var mockContent = {
      content : 'Test Content'
    };

    // Load module under test
    beforeEach(module('fi.common'));

    // Setup spies
    beforeEach(function () {
        $mdToast = jasmine.createSpyObj('$mdToast', ['hide']);
    });

    // Setup mock injection using $provide.value
    beforeEach(function () {
        module(function ($provide) {
            $provide.value("content", mockContent);
            $provide.value("$mdToast", $mdToast);
        })
    });

    beforeEach(function () {

        inject(function (_$rootScope_, $controller) {

            $rootScope = _$rootScope_;

            sut = $controller('ToastController', {
                $scope: $rootScope.$new()
            });
        });
    });

    describe('Initialization -', function () {

        it('should set the injected content to the controller instance', function () {
            expect(sut.content).toEqual(mockContent);
        });
    });

    describe('Hide -', function () {

        it('should hide the toast when dismiss is called', function () {
            sut.dismissToast();

            expect($mdToast.hide).toHaveBeenCalled();
        });
    });
});

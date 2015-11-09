'use strict';

describe('message box spec -', function () {
    var $scope,
        $compile,
        $httpBackend,
        elm,
        sut,
        style = {
            'error': {
                color: 'message-error',
                svg: 'images/ic_close_24px.svg'
            },
            'success': {
                color: 'message-success',
                svg: 'images/ic_check_24px.svg'
            },
            'warn': {
                color: 'message-warn',
                svg: 'images/ic_warning_24px.svg'
            }
        };

    beforeEach(module('fi.common'));
    beforeEach(module('components/utils/message-box.directive.html'));

    var compileDirective = function (type, error, errorOptions) {

        elm = angular.element('<message-box type="{{msgType}}" error="msgError" error-options="msgErrorOptions"></message-box>');

        $scope.$apply(function () {
            $scope.msgType = type;
            $scope.msgError = error;
            $scope.msgErrorOptions = errorOptions;
            $compile(elm)($scope);
        });

        sut = elm.isolateScope().messageBoxController;
    };

    beforeEach(inject(function(_$compile_, _$rootScope_, _$httpBackend_) {
        $compile = _$compile_;
        $scope = _$rootScope_;
        $httpBackend = _$httpBackend_;

        $httpBackend.whenGET('images/ic_close_24px.svg').respond(200);
        $httpBackend.whenGET('images/ic_check_24px.svg').respond(200);
        $httpBackend.whenGET('images/ic_warning_24px.svg').respond(200);
    }));

    describe('message box -', function () {
        it('should return the message for type error', function () {
            var type = 'error',
                error = 'Error message',
                errorOptions = { numOfSpace: 5 };


            compileDirective(type, error, errorOptions);

            expect(sut.type).toEqual(type);
            expect(sut.error).toEqual(error);
            expect(sut.errorOptions).toEqual(errorOptions);
            expect(sut.style).toEqual(style.error);
        });

        it('should return the message for type success', function () {
            var type = 'success',
                error = 'Success message',
                errorOptions = { numOfSpace: 5 };

            compileDirective(type, error, errorOptions);

            expect(sut.type).toEqual(type);
            expect(sut.error).toEqual(error);
            expect(sut.errorOptions).toEqual(errorOptions);
            expect(sut.style).toEqual(style.success);
        });

        it('should return the message for type warn', function () {
            var type = 'warn',
                error = 'warn message',
                errorOptions = { numOfSpace: 5 };

            compileDirective(type, error, errorOptions);

            expect(sut.type).toEqual(type);
            expect(sut.error).toEqual(error);
            expect(sut.errorOptions).toEqual(errorOptions);
            expect(sut.style).toEqual(style.warn);
        });

        it('should erase the error message when closed', function () {
            var type = 'error',
                message = 'Error message',
                errorOptions = { numOfSpace: 5 };

            compileDirective(type, message, errorOptions);

            sut.closeMessage();

            expect(sut.error).toEqual(null);
        });
    });
});

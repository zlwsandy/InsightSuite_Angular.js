'use strict';

describe('confirm exit spec -', function () {
    var $scope,
        $compile,
        $state,
        $cookies = { cid: 1 },
        elm,
        sut,
        insightEditCancelDialogService;

    var compileDirective = function (bit) {
        elm = angular.element('<div confirm-exit="bit"></div>');

        $scope.$apply(function () {
            $scope.bit = bit;
            $compile(elm)($scope);
        });

        sut = elm.isolateScope().confirmExitController;
    };

    beforeEach(module('fi.common'));

    beforeEach(function () {
        insightEditCancelDialogService = jasmine.createSpyObj('insightEditCancelDialogService', ['show']);
    });

    beforeEach(function () {
        module(function ($provide) {
            $provide.value('insightEditCancelDialogService', insightEditCancelDialogService);
            $provide.value('$cookies', $cookies);
        });
    });

    beforeEach(inject(function(_$compile_, _$rootScope_, _$state_, $q) {
        $compile = _$compile_;
        $scope = _$rootScope_;
        $state = _$state_;

        insightEditCancelDialogService.show.and.returnValue($q.when());

    }));

    describe('confirmation pop up on form exit', function () {

        beforeEach(function () {
            spyOn($state, 'go');
        });

        it('should call dialog and go to state', function () {
            compileDirective(true);

            $scope.$broadcast('$stateChangeStart', {name: 'test'}, ['test']);

            $scope.$apply();

            expect(insightEditCancelDialogService.show).toHaveBeenCalled();
            expect($state.go).toHaveBeenCalledWith('test', ['test']);
        });

        it('should not call dialog or go to state', function () {
            compileDirective(false);

            $scope.$broadcast('$stateChangeStart', {name: 'test'}, ['test']);

            $scope.$apply();

            expect(insightEditCancelDialogService.show).not.toHaveBeenCalled();
            expect($state.go).not.toHaveBeenCalledWith('test', ['test']);
        });

        it('should not call dialog or go to state if the company id cookie is set to 0', function () {
            $cookies.cid = 0;
            compileDirective(false);

            $scope.$broadcast('$stateChangeStart', {name: 'test'}, ['test']);

            $scope.$apply();

            expect(insightEditCancelDialogService.show).not.toHaveBeenCalled();
            expect($state.go).not.toHaveBeenCalledWith('test', ['test']);
        });

        it('should not call dialog or go to state if the company id cookie is undefined', function () {
            $cookies.cid = undefined;
            compileDirective(false);

            $scope.$broadcast('$stateChangeStart', {name: 'test'}, ['test']);

            $scope.$apply();

            expect(insightEditCancelDialogService.show).not.toHaveBeenCalled();
            expect($state.go).not.toHaveBeenCalledWith('test', ['test']);
        });
    });
});

'use strict';

describe('price control spec -', function () {
    var $scope,
        $rootScope,
        $compile,
        isolateScope,
        elm,
        sut;

    beforeEach(module('fi.insight'));
    beforeEach(module('insight/settings/fi-price-control.directive.html'));

    var compileDirective = function (min, max, model, enabled, label) {
        $scope = $rootScope;
        elm = angular.element('<fi-price-control label="{{txtLabel}}" min="minNum" max="maxNum" ng-model="modelNum" enabled="enabled"></fi-price-control>');

        $scope.$apply(function () {
            $scope.txtLabel = label || 'Testing';
            $scope.minNum = min;
            $scope.maxNum = max;
            $scope.modelNum = model;
            $scope.enabled = enabled;
            $compile(elm)($scope);
        });

        isolateScope = elm.isolateScope();
        sut = elm.isolateScope().fiPriceControlController;
    };

    beforeEach(inject(function(_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
    }));

    describe('price control attributes -', function () {
        it('should set the model, min, and max', function () {
            compileDirective(0, 10, 5, true);

            expect(sut.min).toEqual(0);
            expect(sut.max).toEqual(10);
            expect(sut.localModel).toEqual(5);
            expect(sut.enabled).toEqual(true);
        });

        it('should set the min with a non zero value', function () {
            compileDirective(1, 10, 5, true);

            expect(sut.min).toEqual(1);
        });

        it('should set min and max to 0 and 99 for non number', function () {
            compileDirective('n', 'n', 5);

            var getMax = sut.getMax('n'),
                getMin = sut.getMin('n');

            expect(getMax).toEqual(99);
            expect(getMin).toEqual(0);
        });

        it('should set the enabled to false', function () {
            compileDirective(0, 10, 5, false);

            expect(sut.enabled).toEqual(false);
        });

        it('should set the model to 0', function () {
            compileDirective(0, 5, undefined, true);

            expect(sut.localModel).toEqual(0);
        });
    });

    describe('price control controls -', function () {
        it('should increment the model', function () {
            compileDirective(0, 10, 5, true);

            expect(sut.localModel).toEqual(5);

            isolateScope.increment();

            expect(sut.localModel).toEqual(6);
        });

        it('should decrement the model', function () {
            compileDirective(0, 10, 5, true);

            expect(sut.localModel).toEqual(5);

            isolateScope.decrement();

            expect(sut.localModel).toEqual(4);
        });
    });

    describe('price control helpers - ', function () {
        it('should call getMax', function () {
            compileDirective(0, 10, 5);

            spyOn(sut, 'getMax').and.callThrough();

            sut.getMax(10);

            expect(sut.getMax).toHaveBeenCalledWith(10);
        });

        it('should call maxDisabled', function () {
            compileDirective(0, 10, 5);

            spyOn(sut, 'maxDisabled').and.callThrough();

            sut.maxDisabled();

            expect(sut.maxDisabled).toHaveBeenCalled();
        });

        it('should call getMin', function () {
            compileDirective(0, 10, 5);

            spyOn(sut, 'getMin').and.callThrough();

            sut.getMin(0);

            expect(sut.getMin).toHaveBeenCalledWith(0);
        });

        it('should call minDisabled', function () {
            compileDirective(0, 10, 5);

            spyOn(sut, 'minDisabled').and.callThrough();

            sut.minDisabled();

            expect(sut.minDisabled).toHaveBeenCalled();
        });
    });

    describe('price control validity', function () {

        it('should cause a whole number error', function () {
            compileDirective(5, 10, true, 'n');

            expect(sut.error).toEqual('ERROR_WHOLE_NUMBER');
        });

        it('should cause a less than 0 error', function () {
            compileDirective(5, 10, -1, true);

            expect(sut.error).toEqual('ERROR_WHOLE_NUMBER');
        });

        it('should cause a min value error', function () {
            compileDirective(5, 10, 4, true);

            expect(sut.error).toEqual('ERROR_LESS_THAN_NEXT_MARKDOWN');
        });

        it('should cause a greater than 100 error', function () {
            compileDirective(5, 10, 101, true);

            expect(sut.error).toEqual('ERROR_GREATER_THAN_100');
        });

        it('should cause a max value error', function () {
            compileDirective(0, 5, 10, true);

            expect(sut.error).toEqual('ERROR_GREATER_THAN_PREV_MARKDOWN');
        });

        it('should cause a max value clearance error', function () {
            compileDirective(0, 5, 10, true, 'Clearance');

            expect(sut.error).toEqual('ERROR_CLEARANCE_GREATER_THEN_ALL_MARKDOWNS');
        });

        it('should not case min or max value error', function () {
            compileDirective(0, 10, 5, true);

            expect(sut.error).toEqual(null);
        });
    });
});

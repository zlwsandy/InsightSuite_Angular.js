'use strict';

describe('utilsService', function () {
    var utilsService, $q, $rootScope;

    beforeEach(module('fi.common'));

    beforeEach(inject(function (_$q_, _$rootScope_, _utilsService_) {
        $q = _$q_;
        $rootScope = _$rootScope_;
        utilsService = _utilsService_;
    }));

    describe('promise is resolved with', function () {
        var def;

        beforeEach(function () {
            def = $q.defer();
        });

        it('status = true', function () {
            var trueStatus = {
                status: true,
                data: 'resolved'
            };

            var httpResponse = {
                data: trueStatus
            };

            var promise = utilsService.transformHttpPromise(def.promise);
            var result;

            promise
                .then(function (data) {
                    result = data;
                });

            expect(result).toBe(undefined);

            def.resolve(httpResponse);
            $rootScope.$digest();

            expect(result).toBe(trueStatus.data);
        });

        it('status = false', function () {
            var falseStatus = {
                status: false,
                message: 'false resolved'
            };

            var httpResponse = {
                data: falseStatus
            };

            var promise = utilsService.transformHttpPromise(def.promise);
            var result;

            promise
                .catch(function (data) {
                    result = data;
                });

            expect(result).toBe(undefined);

            def.resolve(httpResponse);
            $rootScope.$digest();

            expect(result).toEqual(falseStatus.message);
        });
    });

    describe('promise is rejected with', function () {
        var def;

        beforeEach(function () {
            def = $q.defer();
        });

        it('status = false', function () {
            var falseStatus = {
                status: false,
                message: 'false rejected'
            };

            var promise = utilsService.transformHttpPromise(def.promise);
            var result;

            promise
                .catch(function (data) {
                    result = data;
                });

            expect(result).toBe(undefined);

            def.reject(falseStatus);
            $rootScope.$digest();

            expect(result).toEqual(falseStatus);
        });

        it('no status', function () {
            var error = 'something real bad happened';
            
            var promise = utilsService.transformHttpPromise(def.promise);
            var result;
            
            promise
                .catch(function (data) {
                    result = data;
                });
            
            expect(result).toBe(undefined);

            def.reject(error);
            $rootScope.$digest();
            
            expect(result).toEqual(error);
        });
    });
});

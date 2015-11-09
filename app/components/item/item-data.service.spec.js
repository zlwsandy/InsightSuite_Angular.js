'use strict';

describe('Item data specs - ', function () {
    var $rootScope, $httpBackend, sut,
        errMsg = 'Error msg',
        gameRun = {
            gameRunId: 1
        },
        returnData = [{
            description: 'testing',
            itemId: 1,
            name: 'test'
        }, {
            description: 'testing again',
            itemId: 2,
            name: 'test again'
        }];

    beforeEach(module('fi.common'));

    beforeEach(inject(function (_itemDataService_, _$httpBackend_, _$rootScope_) {
        sut = _itemDataService_;
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('items Upload tests - ', function () {
        var data = {};

        it('should send a file and get a list of uploaded items and their status', function () {

            $httpBackend
                .expectPOST('/api/insightlocale/1/itemimport', data)
                .respond({ status: true, data: returnData });

            var result,
                promiseReturn = sut.itemsUpload(data, gameRun);
            promiseReturn.then(function (res) {
                result = res;
            });

            $httpBackend.flush();

            expect(result).toEqual(returnData);
        });

        it('should respond to a status of false and return an error message', function () {

            $httpBackend
                .expectPOST('/api/insightlocale/1/itemimport', data)
                .respond({ status: false, data: returnData, message: errMsg });

            var result,
                error,
                promiseReturn = sut.itemsUpload(data, gameRun);
            promiseReturn.then(function (res) {
                result = res;
            }, function (err) {
                error = err;
            });

            $httpBackend.flush();

            expect(error).toEqual(errMsg);
        });
    });

    describe('create items tests - ', function () {

        it('should should send an item and return a list of items', function () {
            $httpBackend
                .expectPOST('/api/insightlocale/1/items/add', returnData)
                .respond({ status: true, data: returnData });

            var result,
                promiseReturn = sut.createItems(returnData, gameRun);
            promiseReturn.then(function (res) {
                result = res;
            });

            $httpBackend.flush();

            expect(result).toEqual(returnData);
        });

        it('should respond to a status of false and return an error message', function () {
            $httpBackend
                .expectPOST('/api/insightlocale/1/items/add', returnData)
                .respond({ status: false, data: returnData, message: errMsg });

            var result,
                error,
                promiseReturn = sut.createItems(returnData, gameRun);
            promiseReturn.then(function (res) {
                result = res;
            }, function (err) {
                error = err;
            });

            $httpBackend.flush();

            expect(error).toEqual(errMsg);
        });
    });


    describe('unlink item image tests - ', function () {
        it('should send a imageId to unlink from a given item', function () {
            var returnVal;
            $httpBackend
                .expectPUT('/api/item/0/image/unlink/1')
                .respond({status: true, data: []});

            sut.unlinkImage({itemId: 0}, {itemImageId: 1})
                .then(function (val) {
                    returnVal = val;
                });

            $httpBackend.flush();

            expect(returnVal).toEqual([]);
        });
    });

    describe('set primary item image tests - ', function () {
        it('should send a imageId to unlink from a given item', function () {
            var returnVal;
            $httpBackend
                .expectPUT('/api/item/0/image/setprimary/1')
                .respond({status: true, data: []});

            sut.setPrimaryImage({itemId: 0}, {itemImageId: 1})
                .then(function (val) {
                    returnVal = val;
                });

            $httpBackend.flush();

            expect(returnVal).toEqual([]);
        });
    });
});

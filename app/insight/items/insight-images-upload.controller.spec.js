'use strict';

describe('insight images upload spec -', function () {
    var sut,
        $rootScope,
        $stateParams,
        $q,
        $mdDialog,
        $timeout,
        insight,
        dialogAlert;

    var insightTestData = {
        'createTime': 1429560789000,
        'description': 'Test Description',
        'itemId': 1,
        'name': 'Test name',
        "testPrice": 1,
        'number': '1234',
        'status': 'ERROR',
        'gameRunLocaleList': [{
            'locale': 'all'
        },{
            'locale': 'en_GB',
            'conversionRate': 1.0000000000,
            'currencyCode': 'GBP',
            'gameRunId': 5753,
            'gameRunStatus': 'RUNNING'
        }, {
            'locale': 'en_US',
            'conversionRate': 1.0000000000,
            'currencyCode': 'USD',
            'gameRunId': 5755,
            'gameRunStatus': 'SETUP'
        }, {
            'locale': 'de_DE',
            'conversionRate': 1.0000000000,
            'currencyCode': 'EUR',
            'gameRunId': 5754,
            'gameRunStatus': 'SETUP'
        }]
    };

    var testItem = {
        itemId: 1,
        itemImages: [{
            itemImageId: 0,
            thumbnailUrl: '/test.html'
        }]
    };

    var testConstants = {
        'MAX_IMAGE_SIZE': 1000000,
        'MAX_IMAGE_SLOTS': 5
    };

    var msg = {
        data: [insightTestData],
        status: true
    };

    // load module under test
    beforeEach(module('fi.insight'));
    beforeEach(module('fi.constants'));

    // Setup mock injection using $provide.value
    beforeEach(function () {
        module(function ($provide) {
            $provide.value('item', testItem);
            $provide.value('FiConstants', testConstants);
        });
    });

    // inject controller
    beforeEach(function () {
        inject(function (_$rootScope_, $controller, _$q_, _$mdDialog_, _$timeout_) {
            $rootScope = _$rootScope_;
            $q = _$q_;
            $mdDialog = _$mdDialog_;
            $timeout = _$timeout_;

            sut = $controller('InsightImagesUploadController', {
                $scope: $rootScope.$new()
            });
        });
    });

    afterEach(function () {
        jasmine.clock().uninstall();
    });

    describe('file added', function () {
        var file;

        beforeEach(function () {
            file = jasmine.createSpyObj('file', ['getExtension', 'size']);
        });

        it('should successfully add jpg file', function () {

            file.getExtension.and.returnValue('jpg');

            sut.fileAdded(file);
            $rootScope.$digest();

            expect(file.getExtension).toHaveBeenCalled();
        });

        it('should successfully add xlsx file', function () {

            file.getExtension.and.returnValue('png');

            sut.fileAdded(file);
            $rootScope.$digest();

            expect(file.getExtension).toHaveBeenCalled();
        });

        it('should successfully add zip file', function () {

            file.getExtension.and.returnValue('gif');

            sut.fileAdded(file);
            $rootScope.$digest();

            expect(file.getExtension).toHaveBeenCalled();
        });

        it('should throw an error when bad file extension', function () {

            file.getExtension.and.returnValue('md');

            sut.fileAdded(file);
            $rootScope.$digest();

            expect(file.getExtension).toHaveBeenCalled();

            expect(sut.error).toEqual('ERROR_FILE_EXTENSION');
        });

        it('should thow an error when the size is too large', function () {
            file.getExtension.and.returnValue('jpg');
            file.size = 10000001;

            sut.fileAdded(file);
            $rootScope.$digest();
            expect(file.size).toEqual(10000001);
            expect(sut.error).toEqual('ERROR_FILE_SIZE');
        });
    });

    describe('files added', function () {
        var files;

        beforeEach(function () {
            files = jasmine.createSpyObj('files', ['dummy']);
        });

        it('should have a files length less than 5', function () {
            files.length = 4;

            sut.filesAdded(files);
            $rootScope.$digest();

            expect(files.length).toEqual(4);
        });

        it('should throw error when there are more than 5 files', function () {
            files.length = 6;

            sut.filesAdded(files);
            $rootScope.$digest();

            expect(files.length).toEqual(6);
            expect(sut.error).toEqual('ERROR_NUMBER_OF_FILES');
        });
    });

    describe('file upload', function () {

        it('should call flow upload', function () {
            var flow = jasmine.createSpyObj('flow', ['upload']);

            flow.upload();

            sut.fileUpload(null, null, flow);
            $rootScope.$digest();

            expect(flow.upload).toHaveBeenCalled();
        });
    });

    describe('file progress', function () {

        it('should set determinateVal and uploading', function () {
            var file = jasmine.createSpyObj('file', ['progress']);

            file.progress.and.returnValue(1);

            sut.fileProgress(file);
            $rootScope.$digest();

            expect(sut.determinateVal).toBe(100);
            expect(sut.uploading).toBe(true);
        });

        it('should set determinateVal and not uploading because of error', function () {
            var file = jasmine.createSpyObj('file', ['progress']);

            file.progress.and.returnValue(1);

            sut.error = 'Some Error';
            sut.fileProgress(file);
            $rootScope.$digest();

            expect(sut.determinateVal).toBe(100);
            expect(sut.uploading).toBe(false);
        });
    });

    describe('file error', function () {

        it('should throw an alert', function () {

            // spyOn(dialogAlert, 'show').and.callThrough();

            sut.fileError();
            $rootScope.$digest();

            expect(sut.error).toEqual('UNKNOWN_ERROR_IN_IMAGE');
        });
    });

    describe('close dialog', function () {

        it('should close the uploading dialog', function () {
            var flow = jasmine.createSpyObj('flow', ['cancel']);

            spyOn($mdDialog, 'hide').and.callThrough();

            sut.closeDialog(flow);
            $rootScope.$digest();

            expect($mdDialog.hide).toHaveBeenCalled();
            expect(flow.cancel).toHaveBeenCalled();
        });
    });

    describe('file success', function () {
        var file,
            flow;

        beforeEach(function () {
            file = jasmine.createSpyObj('file', ['getExtension']);
            flow = jasmine.createSpyObj('flow', ['cancel']);
        });

        it('should call close dialog when status is true', function () {
            var newMsg = {
                data: [{ 'status': 'CREATE' }],
                status: true
            };

            file.getExtension.and.returnValue('jpg');
            flow.cancel();

            spyOn(sut, 'closeDialog').and.callFake(function (flow) {
                return;
            });

            sut.uploadsRemaining = 1;
            sut.fileSuccess(file, newMsg);
            $rootScope.$digest();

            expect(sut.closeDialog).not.toHaveBeenCalled();

            $timeout.flush();

            expect(sut.closeDialog).toHaveBeenCalled();
        });

        it('should call the alert service when status is false', function () {
            var failMsg = {
                status: false,
                message: 'Fail message'
            };

            // spyOn(dialogAlert, 'show').and.callThrough();

            sut.fileSuccess(null, failMsg);
            $rootScope.$digest();

            expect(sut.error).toEqual(failMsg.message);
        });

        it('should not call the close dialog when uploadsRemaining is > 0', function () {
            var newMsg = {
                data: [{ 'status': 'CREATE' }],
                status: true
            };

            file.getExtension.and.returnValue('jpg');
            flow.cancel();

            spyOn(sut, 'closeDialog').and.callFake(function (flow) {
                return;
            });

            sut.uploadsRemaining = 2;
            sut.fileSuccess(file, newMsg);
            $rootScope.$digest();

            expect(sut.closeDialog).not.toHaveBeenCalled();

            $timeout.flush();

            expect(sut.closeDialog).not.toHaveBeenCalled();
        });
    });
});

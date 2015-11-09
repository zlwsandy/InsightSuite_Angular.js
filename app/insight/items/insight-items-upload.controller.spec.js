'use strict';

describe('insightSetupItemsUploadController Specs - ', function () {
    var sut,
        $rootScope,
        $stateParams,
        $q,
        $mdDialog,
        $timeout,
        insight,
        dialogAlert,
        insightDataService,
        announceService;

    var mockItem = {
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

    var mockItems = [
        {
            'itemId' : 114,
            'gameItemId' : null,
            'name' : 'no images for me',
            'number' : '123',
            'gameRunLocaleList': [{
                'locale': 'en_US',
                'conversionRate': 1.0000000000,
                'currencyCode': 'USD',
                'gameRunId': 5755,
                'gameRunStatus': 'SETUP'
            }],
            'itemImages': []
        },
        {
            'itemId' : 115,
            'gameItemId' : null,
            'name' : 'no images for me either',
            'number' : '1234',
            'gameRunLocaleList': [{
                'locale': 'en_US',
                'conversionRate': 1.0000000000,
                'currencyCode': 'USD',
                'gameRunId': 5755,
                'gameRunStatus': 'SETUP'
            }],
            'itemImages': []
        }
    ];

    var mockItemWithImage = [{
        'itemId' : 114,
        'gameItemId' : null,
        'name' : 'I have image',
        'number' : '123',
        'reference' : null,
        'itemImages' : [ {
            'itemImageId' : 788,
            'primary' : true,
            'status' : 'COMPLETE',
            'name' : '7.jpeg',
            'thumbnailUrl' : '/secure/imageviewer.iv?f=%2F2014%2F217%2F1407257557519'
        }]
    }];

    var currentLocale = {
        'locale': 'en_US',
        'conversionRate': 1.0000000000,
        'currencyCode': 'USD',
        'gameRunId': 5755,
        'gameRunStatus': 'SETUP'
    };

    var msg = {
        data: [mockItem],
        status: true
    };

    // load module under test
    beforeEach(module('fi.insight'));

    // setup spies
    beforeEach(function () {
        insightDataService = jasmine.createSpyObj('insightDataService', [
            'getEligibleAddItems'
        ]);
        announceService = jasmine.createSpyObj('announceService', [
            'error'
        ]);
    });

    // Setup mock injection using $provide.value
    beforeEach(function () {
        module(function ($provide) {
            $provide.value('currentLocale', currentLocale);
            $provide.value('insightDataService', insightDataService);
            $provide.value('announceService', announceService);
        });
    });

    // inject controller
    var createController = function (items, success, tab) {
        inject(function (_$rootScope_, $controller, _$q_, _$mdDialog_, _$timeout_, _dialogAlert_) {
            $rootScope = _$rootScope_;
            $q = _$q_;
            $mdDialog = _$mdDialog_;
            $timeout = _$timeout_;
            dialogAlert = _dialogAlert_;

            if (success) {
                insightDataService.getEligibleAddItems.and.returnValue($q.when(items));
            } else {
                insightDataService.getEligibleAddItems.and.returnValue($q.reject());
            }

            sut = $controller('InsightSetupItemsUploadController', {
                $scope: $rootScope.$new()
            });

            sut.selectedTabIndex = tab;
        });
    };

    afterEach(function () {
        jasmine.clock().uninstall();
    });

    describe('add file', function () {
        var file;

        beforeEach(function () {
            createController(mockItem, true, 0);
            file = jasmine.createSpyObj('file', ['getExtension']);
        });

        it('should successfully add xls file', function () {

            file.getExtension.and.returnValue('xls');

            sut.fileAdded(file);
            $rootScope.$digest();

            expect(file.getExtension).toHaveBeenCalled();
        });

        it('should successfully add xlsx file', function () {

            file.getExtension.and.returnValue('xlsx');

            sut.fileAdded(file);
            $rootScope.$digest();

            expect(file.getExtension).toHaveBeenCalled();
        });

        it('should successfully add zip file', function () {

            file.getExtension.and.returnValue('zip');

            sut.fileAdded(file);
            $rootScope.$digest();

            expect(file.getExtension).toHaveBeenCalled();
        });

        it('should throw an alert', function () {

            spyOn($mdDialog, 'alert').and.callThrough();

            file.getExtension.and.returnValue('md');

            sut.fileAdded(file);
            $rootScope.$digest();

            expect(file.getExtension).toHaveBeenCalled();

            expect($mdDialog.alert).toHaveBeenCalled();
        });
    });

    describe('file upload', function () {

        it('should call flow upload', function () {
            createController(mockItem, true, 0);
            var flow = jasmine.createSpyObj('flow', ['upload']);

            flow.upload();

            sut.fileUpload(null, null, flow);
            $rootScope.$digest();

            expect(flow.upload).toHaveBeenCalled();
        });
    });

    describe('file progress', function () {

        it('should set determinateVale and uploading', function () {
            createController(mockItem, true, 0);
            var file = jasmine.createSpyObj('file', ['progress']);

            file.progress.and.returnValue(1);

            sut.fileProgress(file);
            $rootScope.$digest();

            expect(sut.determinateVal).toBe(100);
            expect(sut.uploading).toBe(true);
        });
    });

    describe('file error', function () {

        it('should throw an alert', function () {
            createController(mockItem, true , 0);
            spyOn(dialogAlert, 'show').and.callThrough();

            sut.fileError();
            $rootScope.$digest();

            expect(dialogAlert.show).toHaveBeenCalled();
        });
    });

    describe('close dialog', function () {

        it('should close the uploading dialog', function () {
            createController(mockItem, true, 0);
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
            createController(mockItem, true, 0);
            file = jasmine.createSpyObj('file', ['getExtension']);
            flow = jasmine.createSpyObj('flow', ['cancel']);
        });

        it('should call close dialog when status is true', function () {
            var newMsg = {
                data: [{ 'status': 'CREATE' }],
                status: true
            };

            file.getExtension.and.returnValue('xlsx');
            flow.cancel();

            spyOn(sut, 'closeDialog').and.callFake(function (flow) {
                return;
            });

            sut.fileSuccess(file, newMsg);
            $rootScope.$digest();

            expect(sut.closeDialog).not.toHaveBeenCalled();

            $timeout.flush();

            expect(sut.closeDialog).toHaveBeenCalled();
        });

        it('should show the zip message when status is true and file extension is zip', function () {
            var newMsg = {
                data: [{ 'status': 'CREATE' }],
                status: true
            };

            file.getExtension.and.returnValue('zip');

            sut.fileSuccess(file, newMsg);
            $rootScope.$digest();

            expect(sut.showZipMsg).toBe(false);

            $timeout.flush();

            expect(sut.showZipMsg).toBe(true);
            expect(sut.uploading).toBe(false);
        });

        it('should call alert service when status is true but insight status is "ERROR"', function () {
            spyOn(dialogAlert, 'show').and.callThrough();

            sut.fileSuccess(null, msg);
            $rootScope.$digest();

            expect(dialogAlert.show).toHaveBeenCalled();
        });

        it('should call the alert service when status is false', function () {
            var failMsg = {
                status: false,
                message: 'Fail message'
            };

            spyOn(dialogAlert, 'show').and.callThrough();

            sut.fileSuccess(null, failMsg);
            $rootScope.$digest();

            expect(dialogAlert.show).toHaveBeenCalled();
        });
    });

    describe('Retrieve recent items - ', function () {

        it('should call getEligibleAddItems', function () {
            createController(mockItems, true, 1);
            expect(insightDataService.getEligibleAddItems).toHaveBeenCalledWith(sut.gameRun.gameRunId);
        })

        it('should get a collection of items if they exist', function () {
            createController(mockItems, true, 1);
            $rootScope.$digest();
            expect(sut.recentItems).toBe(mockItems);
        });

        it('should display the items if they exist', function () {
            createController(mockItems, true, 1);
            expect(sut.showProgressLoader).toBe(true);
            $rootScope.$digest();
            expect(sut.showProgressLoader).toBe(false);
            expect(sut.showNoItemsMessage()).toBe(false);
        });

        it('should default to an empty array if no items exist', function () {
            createController(null, true, 1);
            $rootScope.$digest();
            expect(sut.recentItems.length).toBe(0);
        });

        it('should display a message if no items exist', function () {
            createController(null, true, 1);
            expect(sut.showProgressLoader).toBe(true);
            $rootScope.$digest();
            expect(sut.showProgressLoader).toBe(false);
            expect(sut.showNoItemsMessage()).toBe(true);
        });

        it('should display a toast if there is an error retrieving items', function () {
            createController(mockItems, false, 1);
            $rootScope.$digest();
            expect(announceService.error).toHaveBeenCalled();
        });

    });

    describe('Set action button states - ', function () {

        it('should show the download template button when the upload items tab is selected ', function () {
            createController(mockItem, true, 0);
            expect(sut.isDownloadTemplateVisible()).toBe(true);
        });

        it('should hide the download template button when the upload items tab is not selected ', function () {
            createController(mockItem, true, 1);
            expect(sut.isDownloadTemplateVisible()).toBe(false);
        });

        it('should hide the download template button when a file is uploading ', function () {
            createController(mockItem, true, 1);
            sut.uploading = true;
            expect(sut.isDownloadTemplateVisible()).toBe(false);
        });

        it('should hide the download template button when a zip file is processing ', function () {
            createController(mockItem, true, 1);
            sut.showZipMsg = true;
            expect(sut.isDownloadTemplateVisible()).toBe(false);
        });

        it('should show the browse all items button when the browse items tab is selected ', function () {
            createController(mockItem, true, 1);
            expect(sut.isBrowseItemsVisible()).toBe(true);
        });

        it('should hide the browse all items button when the browse items tab is not selected ', function () {
            createController(mockItem, true, 0);
            expect(sut.isBrowseItemsVisible()).toBe(false);
        });

    });

});

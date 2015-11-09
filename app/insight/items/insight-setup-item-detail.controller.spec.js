'use strict';

describe('InsightSetupItemDetailController specs - ', function () {
    var sut, scope, $rootScope, $state, $stateParams, $q, $mdDialog, $controller, $provide,
        companyService, insightDataService, dialogAlert, localeService,
        fiService, announceService, formatter, itemDataService, insightEditCancelDialogService;

    var mockInsight = {
        'insightId' : 171,
        'name' : 'mock insight test',
        'gameRunLocaleList' : [ {
            'locale' : 'en_US',
            'currencyCode' : 'USD',
            'gameRunId' : 212,
            'gameRunStatus' : 'SETUP'
        }, {
            'locale' : 'fr_FR',
            'currencyCode' : 'EUR',
            'gameRunId' : 211,
            'gameRunStatus' : 'PREVIEW'
        }]
    };

    var mockItem = {
        'itemId' : 475,
        'gameItemId' : null,
        'name' : 'They call me item',
        'reference' : null,
        "testPrice" : 1999999.99,
        'promotionalPrice' : 999999999.99,
        'unitCost' : 999999999.99,
        'description' : 'Item Description'
    };

    var mockReferenceItems = [
        { name: 'TEST_ITEM', value: null },
        { name: 'HIGH', value: 'HIGH' },
        { name: 'LOW', value: 'LOW' }
    ];

    var mockLocale = {
        'locale' : 'en_US',
        'currencyCode' : 'USD',
        'gameRunId' : 212,
        'gameRunStatus' : 'SETUP'
    };

    var mockLocaleNotInSetup = {
        'locale' : 'fr_FR',
        'currencyCode' : 'EUR',
        'gameRunId' : 211,
        'gameRunStatus' : 'PREVIEW'
    };

    var testConstants = {
        'MAX_IMAGE_SIZE': 1000000,
        'MAX_IMAGE_SLOTS': 5
    };


    // load module under test
    beforeEach(module('fi.insight'));

    // setup spies
    beforeEach(function () {
        companyService = jasmine.createSpyObj('companyService', [
            'getCompany'
        ]);
        insightDataService = jasmine.createSpyObj('insightDataService', [
            'updateInsightItem',
            'removeInsightItem'
        ]);
        localeService = jasmine.createSpyObj('localeService', [
            'findLocale',
            'getFlagImageUrl'
        ]);
        fiService = jasmine.createSpyObj('fiService', [
            'companyId'
        ]);
        dialogAlert = jasmine.createSpyObj('dialogAlert', [
            'show'
        ]);
        announceService = jasmine.createSpyObj('announceService', [
            'error',
            'info'
        ]);
        $state = {
            'go' : jasmine.createSpy('$state go')
        };
        $stateParams = {
            'go' : jasmine.createSpy('$state go')
        };
        formatter = jasmine.createSpyObj('formatter', [
            'formatCurrency',
            'getNumberFormatDisplay'
        ]);
        insightEditCancelDialogService = {
            show: function() { return null; } // dummy fn for spying on
        };
    });

    // Setup mock injection using $provide.value
    beforeEach(function () {
        module(function (_$provide_) {
            $provide = _$provide_;

            $provide.value("$state", $state);
            $provide.value("$stateParams", $stateParams);
            $provide.value("insight", mockInsight);
            $provide.value("insightItem", mockItem);
            $provide.value("companyService", companyService);
            $provide.value("insightDataService", insightDataService);
            $provide.value("localeService", localeService);
            $provide.value("fiService", fiService);
            $provide.value("dialogAlert", dialogAlert);
            $provide.value("announceService", announceService);
            $provide.value("FiConstants", testConstants);
            $provide.value("formatter", formatter);
            $provide.value("insightEditCancelDialogService", insightEditCancelDialogService);
        });
    });

    beforeEach(function () {
        inject(function (_$rootScope_, _$controller_, _$q_, _$mdDialog_) {

            $rootScope = _$rootScope_;
            $q = _$q_;
            $mdDialog = _$mdDialog_;
            $controller = _$controller_;
        });
    });

    var createController = function (locale, i18nEnabled) {
        companyService.getCompany.and.returnValue($q.when({
            i18nEnabled : i18nEnabled
        }));

        localeService.findLocale.and.returnValue(angular.copy(locale));
        dialogAlert.show.and.callThrough();

        $stateParams.locale = locale.locale;

        scope = $rootScope.$new();

        sut = $controller('InsightSetupItemDetailController', {
            $scope: scope
        });
    };

    describe('Initialization - ', function () {

        beforeEach(function () {
            createController(mockLocale, true);
        });

        it('should set the current locale', function () {
            expect(sut.currentLocale).toEqual(mockInsight.gameRunLocaleList[0]);
            return true;
        });

        it('should create a copy of the item being edited', function () {
            expect(angular.equals(sut.localItem, sut.original)).toBe(true);
        });

        it('should set the reference item object based on the insight item', function () {
            expect(sut.referenceItem).toEqual(mockReferenceItems[0]);
        });

    });

    describe('Reference Item Change - ', function () {

        beforeEach(function () {
            createController(mockLocale, true);
        });

        it('should set the reference item object based on the insight item value', function () {
            expect(sut.referenceItem).toEqual(mockReferenceItems[0]);
            // change the reference value on the item
            sut.localItem.reference = mockReferenceItems[1].value;
            // call change event
            sut.changeReferenceItem();
            expect(sut.referenceItem).toEqual(mockReferenceItems[1]);
        });

    });

    describe('Insight Status - Setup', function () {

        beforeEach(function () {
            createController(mockLocale, true);
        });

        it('should enable the save and remove when status is SETUP', function () {
            expect(sut.currentLocale.gameRunStatus).toBe('SETUP');
            expect(sut.isActionDisabled()).toBe(false);
        });

        it('should enable the save and remove when status is SUMMARY_SETUP', function () {
            sut.currentLocale.gameRunStatus = 'SUMMARY_SETUP';
            expect(sut.currentLocale.gameRunStatus).toBe('SUMMARY_SETUP');
            expect(sut.isActionDisabled()).toBe(false);
        });

    });

    describe('Insight Status - Not Setup', function () {

        beforeEach(function () {
            createController(mockLocaleNotInSetup, true);
        });

        it('should disable the save and remove when status is not SETUP', function () {
            expect(sut.currentLocale.gameRunStatus).not.toBe('SUMMARY_SETUP');
            expect(sut.isActionDisabled()).toBe(true);
        });

        it('should transition to the insight items list when status is not setup', function () {
            expect(sut.currentLocale.gameRunStatus).not.toBe('SUMMARY_SETUP');
            sut.close();
            expect($state.go).toHaveBeenCalledWith('insightTabWithLocale.items');
        });

    });

    describe('Close Item Detail View - ', function () {

        beforeEach(function () {
            createController(mockLocale, true);
        });

        it('should transition to the insight items list when no changes have been made', function () {
            sut.close();
            expect($state.go).toHaveBeenCalledWith('insightTabWithLocale.items');
        });

        it('should show a dialog when changes have been made', function () {
            spyOn(insightEditCancelDialogService, 'show').and.returnValue($q.when({}));

            sut.localItem.itemName = 'changed';
            expect(angular.equals(sut.original, sut.localItem)).not.toBe(true);

            sut.close();
            expect(insightEditCancelDialogService.show).toHaveBeenCalled();
        });

    });

    describe('Save Item Success - ', function () {

        beforeEach(function () {
            createController(mockLocale, true);
            insightDataService.updateInsightItem.and.returnValue($q.when(mockItem));
            scope.itemForm = {
                $setPristine: jasmine.createSpy('$setPristine')
            };
        });

        it('should call updateInsightItem', function () {
            sut.save();

            expect(insightDataService.updateInsightItem)
                .toHaveBeenCalledWith(sut.insight, sut.localItem, sut.currentLocale.locale);
        });

        it('should update the original item and reset the form', function () {
            sut.save();
            $rootScope.$digest();

            expect(sut.original).toBe(mockItem);
            expect(scope.itemForm.$setPristine).toHaveBeenCalled();
        });

        it('should display a toast when changes have been saved', function () {
            sut.save();
            $rootScope.$digest();

            expect(announceService.info).toHaveBeenCalledWith('SAVED_CHANGES');
        });

    });

    describe('Save Item Failure - ', function () {

        beforeEach(function () {
            createController(mockLocale, true);
            scope.itemForm = {
                $setPristine: jasmine.createSpy('$setPristine')
            };
        });

        it('should show alert dialog because item is in an insight in preview', function () {
            insightDataService.updateInsightItem.and.returnValue($q.reject('ERROR_CANNOT_EDIT_ITEM_FROM_PENDING_INSIGHT'));
            spyOn($mdDialog, 'alert').and.callThrough();

            sut.save();
            $rootScope.$digest();

            expect(dialogAlert.show).toHaveBeenCalled();
        });

        it('should log an error when the server returns any other error', function () {
            insightDataService.updateInsightItem.and.returnValue($q.reject());

            sut.save();
            $rootScope.$digest();

            expect(announceService.error).toHaveBeenCalled();
        });

    });

    describe('Remove Item - ', function () {
        beforeEach(function () {
            createController(mockLocale, true);
        });

        it('should call removeInsightItem', function () {
            insightDataService.removeInsightItem.and.returnValue($q.when());
            sut.remove();
            $rootScope.$digest();

            expect(insightDataService.removeInsightItem)
                .toHaveBeenCalledWith(sut.currentLocale, sut.original);
        });

        it('should show a toast when an item is removed', function () {
            insightDataService.removeInsightItem.and.returnValue($q.when());

            sut.remove();
            $rootScope.$digest();

            expect(announceService.info).toHaveBeenCalledWith('REMOVED_ITEM_FROM_GAMERUN', jasmine.objectContaining({
                insightName: mockInsight.name
            }));
        });

        it('should show a toast when an error occurs', function () {
            insightDataService.removeInsightItem.and.returnValue($q.reject());

            sut.remove();
            $rootScope.$digest();

            expect(announceService.error).toHaveBeenCalled();
        });
    });


    describe('Show Image Upload - ', function () {

        var itemImage = {
            itemImageId: 154109,
            primary: true,
            status: "COMPLETE",
            name: "a",
            fullsizeUrl: "path/imageA.jpg"
        };

        it('images are undefined ', function () {
            createController(mockLocale, true);
            $rootScope.$digest();
            expect(sut.showImageUpload()).toBe(false);
        });

        describe('a item with images', function() {
            beforeEach(function () {
                mockItem['itemImages'] = [itemImage];
                $provide.value("insightItem", mockItem);
            });

            it('images can be added to item ', function () {
                createController(mockLocale, true);
                sut.currentLocale.gameRunStatus = 'SETUP';
                $rootScope.$digest();
                expect(sut.showImageUpload()).toBe(true);
            });
        });

        describe('item with max amount of images', function() {
            beforeEach(function () {
                mockItem['itemImages'] = [itemImage, itemImage, itemImage, itemImage, itemImage];
                $provide.value("insightItem", mockItem);
            });

            it('images cant be added to the item' , function () {
                createController(mockLocale, true);
                $rootScope.$digest();
                expect(sut.showImageUpload()).toBe(false);
            });
        });

        describe('add item dialog', function () {
            it('should prompt the upload dialog', function () {

                spyOn($mdDialog, 'show');

                createController(mockLocale, true);
                sut.addImage();

                expect($mdDialog.show).toHaveBeenCalled();
            });
        });

        describe('Status Checks - ', function () {

            beforeEach(function () {
                mockItem['itemImages'] = [itemImage];
                $provide.value("insightItem", mockItem);
            });

            it('should show image upload when status is SETUP', function () {
                createController(mockLocale, true);
                expect(sut.currentLocale.gameRunStatus).toBe('SETUP');
                expect(sut.showImageUpload()).toBe(true);
            });

            it('should show image upload when status is SUMMARY_SETUP', function () {
                createController(mockLocale, true);
                sut.currentLocale.gameRunStatus = 'SUMMARY_SETUP';
                expect(sut.currentLocale.gameRunStatus).toBe('SUMMARY_SETUP');
                expect(sut.showImageUpload()).toBe(true);
            });

            it('should hide image upload when status is not SETUP', function () {
                createController(mockLocaleNotInSetup, true);
                expect(sut.currentLocale.gameRunStatus).not.toBe('SETUP');
                expect(sut.showImageUpload()).toBe(false);
            });

            it('should show image overflow for SETUP', function () {
                createController(mockLocale, true);
                sut.currentLocale.gameRunStatus = 'SETUP';
                expect(sut.currentLocale.gameRunStatus).toBe('SETUP');
                expect(sut.enableImageOverflowMenu()).toBe(true);
            });

            it('should show image overflow for DENIED', function () {
                createController(mockLocale, true);
                sut.currentLocale.gameRunStatus = 'DENIED';
                expect(sut.currentLocale.gameRunStatus).toBe('DENIED');
                expect(sut.enableImageOverflowMenu()).toBe(true);
            });
        });
    });

    describe('Unlink item image - ', function () {
        beforeEach(function () {
            var itemImage = {
                itemImageId: 154109,
                primary: true,
                status: "COMPLETE",
                name: "a",
                fullsizeUrl: "path/imageA.jpg"
            };

            mockItem['itemImages'] = [itemImage];

            itemDataService =  jasmine.createSpyObj('itemDataService', ['unlinkImage']);
            itemDataService.unlinkImage.and.returnValue($q.when([]));

            $provide.value("insightItem", mockItem);
            $provide.value('itemDataService', itemDataService);
        });

        it('should unlink item successfully', function () {
            createController(mockLocale, true);

            expect(sut.original.itemImages.length).not.toBe(0);
            sut.unlinkImage('image');
            $rootScope.$digest();

            expect(sut.original.itemImages.length).toBe(0);
        });
    });

    describe('Unlink item image - ', function () {
        beforeEach(function () {
            var itemImage = {
                itemImageId: 154109,
                primary: true,
                status: "COMPLETE",
                name: "a",
                fullsizeUrl: "path/imageA.jpg"
            };

            mockItem['itemImages'] = [itemImage];

            itemDataService =  jasmine.createSpyObj('itemDataService', ['setPrimaryImage']);
            itemDataService.setPrimaryImage.and.returnValue($q.when([itemImage, itemImage]));

            $provide.value("insightItem", mockItem);
            $provide.value('itemDataService', itemDataService);
        });

        it('should unlink item successfully', function () {
            createController(mockLocale, true);

            expect(sut.original.itemImages.length).toBe(1);
            sut.setPrimaryImage('image');
            $rootScope.$digest();

            expect(sut.original.itemImages.length).toBe(2);
        });
    });
});

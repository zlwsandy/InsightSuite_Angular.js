'use strict';

describe('Insight Items Controller Spec', function () {
    var fiService;
    var insightDataService;
    var announceService;
    var insightLocaleFactory;
    var localeService;
    var sut;
    var $rootScope;
    var $stateParams;
    var $state;
    var $q;
    var $mdDialog;
    var itemDataService;
    var mockLocales;
    var mockLocale;
    var defaultLocaleCode = 'en_US';

    var insightTabFactory = {};

    var currentUser = {
        userRole: 'SYSADMIN'
    };

    var insightId;

    var mockInsight;

    var itemTestData = [{
        itemId: 21,
        name: 'testItem21'
    }, {
        itemId: 22,
        name: 'testItem22'
    }];

    var allLocalesItemTestData = [{
        itemId: 25,
        totalValue: 5.45,
        percentTestPrice: 0.45,
        expectedPercentTestPrice: 5.45045
    }, {
        itemId: 26,
        totalValue: 10,
        percentTestPrice: 1.99,
        expectedPercentTestPrice: 10.00199
    }, {
        itemId: 27,
        totalValue: 10,
        /* No percentTestPrice returned, should still be set later. */
        expectedPercentTestPrice: 10
    }];

    var uploadedTestData = {
        create: [{ itemId: 0, name: '0' }],
        itemsExistForLocaleInInsight: [{ itemId: 0, name: '0' }],
        itemsExistForLocaleInOtherInsights: [{ itemId: 0, name: '0' }],
        itemsExistForOtherLocale: [{ itemId: 0, name: '0' }],
        itemsExistForOtherLocaleInInsight: [{ itemId: 0, name: '0' }]
    };

    // Load module under test
    beforeEach(module('mock/locales.json'));
    beforeEach(module('mock/insight.json'));
    beforeEach(module('fi.insight'));

    // Setup spies
    beforeEach(function () {
        insightDataService = jasmine.createSpyObj('insightDataService', ['getInsightItems', 'getInsightItemsForAllLocales', 'getInsightSegments', 'updateInsightItem']);
        insightLocaleFactory = jasmine.createSpyObj('insightLocaleFactory', ['isInsightLocaleResults']);
        localeService = jasmine.createSpyObj('localeService', ['findLocale', 'isAllLocales']);
        itemDataService = jasmine.createSpyObj('itemDataService', ['itemsUpload', 'createItems']);

        $state = {
            'go' : jasmine.createSpy('$state go')
        };
    });

    // Setup mock injection using $provide.value
    beforeEach(function () {
        module(function ($provide) {
            $provide.value("insightDataService", insightDataService);
            $provide.value("$state", $state);
            $provide.value("isAdmin", true);
            $provide.value("insightLocaleFactory", insightLocaleFactory);
            $provide.value("localeService", localeService);
            $provide.value("itemDataService", itemDataService);
            $provide.value("insightTabFactory", insightTabFactory);
        });
    });

    var createController = function (locale, itemData) {
        inject(function (_$rootScope_, $controller, _$stateParams_, _$q_, _announceService_, _$mdDialog_,
                         _mockLocales_, _mockInsight_) {
            $rootScope = _$rootScope_;
            $stateParams = _$stateParams_;
            $q = _$q_;
            announceService = _announceService_;
            $mdDialog = _$mdDialog_;
            mockLocales = _mockLocales_;
            mockLocale = mockLocales.en_US;
            mockInsight = _mockInsight_;

            $stateParams.locale = locale;
            $stateParams.insightId = mockInsight.insightId;

            if (locale === 'all') {
                localeService.isAllLocales.and.returnValue(true);
                localeService.findLocale.and.returnValue({
                    locale : locale
                });
            } else {
                localeService.findLocale.and.returnValue(mockLocales[locale]);
            }

            insightDataService.getInsightItems.and.returnValue($q.when(itemData));
            insightDataService.getInsightItemsForAllLocales.and.returnValue($q.when(allLocalesItemTestData));
            insightDataService.updateInsightItem.and.returnValue($q.when([]));

            itemDataService.createItems.and.returnValue($q.when(itemTestData));
            itemDataService.itemsUpload.and.returnValue($q.when(itemTestData));

            sut = $controller('InsightItemsController', {
                $scope: $rootScope.$new(),
                insight: mockInsight
            });
        });
    };

    describe('initialization', function () {

        it('should set the items to the value returned from the insight data service', function () {
            createController(defaultLocaleCode, itemTestData);
            $rootScope.$digest();
            expect(sut.items).toEqual(itemTestData);
        });

        it('should return no items form the insight data service', function () {
            createController(defaultLocaleCode, []);
            $rootScope.$digest();
            expect(sut.items).toEqual([]);
        });

    });

    describe('multi-locales multi-items', function () {

        describe('locale', function () {

            it('should initialize the current locale to the locale from the state params', function () {
                createController(defaultLocaleCode);
                expect(sut.currentLocale.locale).toBe(defaultLocaleCode);
            });

            it('should initialize the current locale to all locales from the state params', function () {
                createController('all');
                $rootScope.$digest();
                expect(sut.currentLocale.locale).toBe('all');
                expect(sut.items.length).toEqual(allLocalesItemTestData.length);
                sut.items.forEach(function (item) {
                    expect(item.percentTestPrice).toEqual(item.expectedPercentTestPrice);
                });
            });
        });

        describe('Hide All', function () {
            beforeEach(function () {
                createController(defaultLocaleCode, itemTestData);
            });

            it('should hide all message indicators', function () {
                sut.hideAll();

                expect(sut.showNotEnoughInfoSegmentMsg).toBe(false);
                expect(sut.showProcessingSegmentMsg).toBe(false);
                expect(sut.showNoItemsMsg).toBe(false);
            });
        });

    });

    describe('show results', function () {
        beforeEach(function () {
            createController(defaultLocaleCode, itemTestData);
        });

        it('should return true', function () {
            sut.showResults();
            expect(insightLocaleFactory.isInsightLocaleResults).toHaveBeenCalled();
            expect(localeService.isAllLocales).toHaveBeenCalled();
        });
    });

    describe('uploaded items', function () {
        var testItem = {itemId: 0, itemName: '0'};

        it('should add emitted items to added Items array when create array is populated with multi-locale and set no items message to false', function () {

            createController(defaultLocaleCode, itemTestData);

            $rootScope.$emit('insightItem:uploadResult', uploadedTestData);
            $rootScope.$digest();

            expect(sut.addedItems.create).toBe(uploadedTestData.create);
            expect(sut.addedItems.itemsExistForOtherLocaleInInsight).toBe(uploadedTestData.itemsExistForOtherLocaleInInsight);
            expect(sut.addedItems.itemsExistForLocaleInInsight).toBe(uploadedTestData.itemsExistForLocaleInInsight);
            expect(sut.addedItems.itemsExistForLocaleInOtherInsights).toBe(uploadedTestData.itemsExistForLocaleInOtherInsights);
            expect(sut.addedItems.itemsExistForOtherLocale).toBe(uploadedTestData.itemsExistForOtherLocale);

            expect(sut.showNoItemsMsg).toBe(false);
        });

        it('should add emitted items to added Items array when create array is populated with single locale and set no items message to false', function () {
            createController(defaultLocaleCode, itemTestData);

            sut.locales = [{ gameRunId: 1 }];
            $rootScope.$emit('insightItem:uploadResult', uploadedTestData);
            $rootScope.$digest();

            expect(sut.addedItems.create).toBe(uploadedTestData.create);
            expect(sut.addedItems.itemsExistForOtherLocaleInInsight).toBe(uploadedTestData.itemsExistForOtherLocaleInInsight);
            expect(sut.addedItems.itemsExistForLocaleInInsight).toBe(uploadedTestData.itemsExistForLocaleInInsight);
            expect(sut.addedItems.itemsExistForLocaleInOtherInsights).toBe(uploadedTestData.itemsExistForLocaleInOtherInsights);
            expect(sut.addedItems.itemsExistForOtherLocale).toBe(uploadedTestData.itemsExistForOtherLocale);

            expect(sut.showNoItemsMsg).toBe(false);
        });

        it('should add emitted items to added Items array when item exists in same insight but other locale array is populated and set no items message to false', function () {
            createController(defaultLocaleCode, itemTestData);

            var uploadedNoCreateData = {
                create: [],
                itemsExistForLocaleInInsight: [{ itemId: 0, name: '0' }],
                itemsExistForLocaleInOtherInsights: [{ itemId: 0, name: '0' }],
                itemsExistForOtherLocale: [{ itemId: 0, name: '0' }],
                itemsExistForOtherLocaleInInsight: [{ itemId: 0, name: '0' }]
            };

            $rootScope.$emit('insightItem:uploadResult', uploadedNoCreateData);
            $rootScope.$digest();

            expect(sut.addedItems.create).toBe(uploadedNoCreateData.create);
            expect(sut.addedItems.itemsExistForOtherLocaleInInsight).toBe(uploadedNoCreateData.itemsExistForOtherLocaleInInsight);
            expect(sut.addedItems.itemsExistForLocaleInInsight).toBe(uploadedNoCreateData.itemsExistForLocaleInInsight);
            expect(sut.addedItems.itemsExistForLocaleInOtherInsights).toBe(uploadedNoCreateData.itemsExistForLocaleInOtherInsights);
            expect(sut.addedItems.itemsExistForOtherLocale).toBe(uploadedNoCreateData.itemsExistForOtherLocale);

            expect(sut.showNoItemsMsg).toBe(false);
        });

        it('should add emitted items to added Items array when item exists in same locale but other insights and no items message should be false', function () {
            createController(defaultLocaleCode, itemTestData);

            var uploadedNoCreateData = {
                create: [],
                itemsExistForLocaleInInsight: [{ itemId: 0, name: '0' }],
                itemsExistForLocaleInOtherInsights: [{ itemId: 0, name: '0' }],
                itemsExistForOtherLocale: [{ itemId: 0, name: '0' }],
                itemsExistForOtherLocaleInInsight: []
            };

            $rootScope.$emit('insightItem:uploadResult', uploadedNoCreateData);
            $rootScope.$digest();

            expect(sut.addedItems.create).toBe(uploadedNoCreateData.create);
            expect(sut.addedItems.itemsExistForOtherLocaleInInsight).toBe(uploadedNoCreateData.itemsExistForOtherLocaleInInsight);
            expect(sut.addedItems.itemsExistForLocaleInInsight).toBe(uploadedNoCreateData.itemsExistForLocaleInInsight);
            expect(sut.addedItems.itemsExistForLocaleInOtherInsights).toBe(uploadedNoCreateData.itemsExistForLocaleInOtherInsights);
            expect(sut.addedItems.itemsExistForOtherLocale).toBe(uploadedNoCreateData.itemsExistForOtherLocale);

            expect(sut.showNoItemsMsg).toBe(false);
        });

        it('should reset the no items message when there are no items in the addItems list', function () {
            createController(defaultLocaleCode, []);

            var uploadedNoData = {
                create: [],
                itemsExistForLocaleInInsight: [],
                itemsExistForLocaleInOtherInsights: [],
                itemsExistForOtherLocale: [],
                itemsExistForOtherLocaleInInsight: []
            };

            $rootScope.$emit('insightItem:uploadResult', uploadedNoData);
            $rootScope.$digest();

            expect(sut.showNoItemsMsg).toBe(true);
        });

        it('should dismiss previously added items that were not dismissed by the user', function () {
            sut.addedItems = uploadedTestData;
            spyOn(sut, 'dismissAll');
            $rootScope.$emit('insightItem:uploadResult', uploadedTestData);
            $rootScope.$digest();

            expect(sut.dismissAll).toHaveBeenCalled();
        });

        it('should dismiss and add an item', function () {
            sut.addedItems = uploadedTestData;
            spyOn(sut, 'addItem');
            spyOn(sut, 'removeItem');

            sut.dismiss('create', uploadedTestData);
            $rootScope.$digest();

            expect(sut.addItem).toHaveBeenCalledWith(uploadedTestData);
            expect(sut.removeItem).toHaveBeenCalledWith('create', uploadedTestData);
        });

        it('should dismiss and remove an item', function () {
            spyOn(sut, 'removeItem');
            sut.dismiss('itemsExistForOtherLocale', uploadedTestData);
            $rootScope.$digest();

            expect(sut.removeItem).toHaveBeenCalledWith('itemsExistForOtherLocale', uploadedTestData);
        });

        it('should add an item', function () {
            sut.addItem(testItem);
            $rootScope.$digest();

            expect(sut.items).toContain(testItem);
        });

        it('should add and remove an item when the yes button is selected', function () {
            sut.addedItems = uploadedTestData;
            spyOn(sut, 'removeItem');
            sut.add('itemsExistForOtherLocale', testItem);
            $rootScope.$digest();

            expect(sut.removeItem).toHaveBeenCalled();
            expect(sut.addedItems).not.toContain(testItem);
        });

        it('should add and remove all items when the yes to all button is selected', function () {
            sut.addedItems = uploadedTestData;
            spyOn(sut, 'removeItem');
            sut.addAll('itemsExistForOtherLocale');
            $rootScope.$digest();

            expect(sut.removeItem).toHaveBeenCalled();
            expect(sut.addedItems).not.toContain(testItem);
        });

        it('should remove an item but keep it in the addedItems array', function () {
            sut.addedItems = uploadedTestData;
            sut.removeItem('itemsExistForOtherLocale', testItem);
            $rootScope.$digest();

            expect(sut.addedItems).not.toContain(testItem);
        });

        it('should remove an item but remove it from the addedItems array', function () {
            sut.addedItems = uploadedTestData;
            sut.addedItems.itemsExistForOtherLocale.push(testItem);

            sut.removeItem('itemsExistForOtherLocale', testItem);
            $rootScope.$digest();

            expect(sut.addedItems).not.toContain(testItem);
        });

        it('should dismiss all and add an item', function () {
            sut.addedItems = uploadedTestData;
            spyOn(sut, 'addItem');
            sut.dismissAll('create');
            $rootScope.$digest();

            expect(sut.addItem).toHaveBeenCalled();
            expect(sut.addedItems.create).toBe(uploadedTestData.create);
        });

        it('should dismiss all and remove an item', function () {
            sut.addedItems = uploadedTestData;
            spyOn(sut, 'removeItem');
            sut.dismissAll('itemsExistForOtherLocale');
            $rootScope.$digest();

            expect(sut.removeItem).toHaveBeenCalled();
            expect(sut.addedItems.itemsExistForOtherLocale).toBe(uploadedTestData.itemsExistForOtherLocale);
        });

    });

    describe('Watchers', function () {
        beforeEach(function () {
            createController(defaultLocaleCode, itemTestData);
        });

        it('should set the view type on the controller when the tab factory view type changes', function () {

            insightTabFactory.selectedViewType = 'newViewType1';
            $rootScope.$digest();

            insightTabFactory.selectedViewType = 'newViewType2';
            $rootScope.$digest();

            expect(sut.viewType).toEqual('newViewType2');
        });

        it('should set the view type on the tab factory when the controller view type changes', function () {

            sut.viewType = 'newViewType1';
            $rootScope.$digest();

            sut.viewType = 'newViewType2';
            $rootScope.$digest();

            expect(insightTabFactory.selectedViewType).toEqual('newViewType2');
        });
    });
});

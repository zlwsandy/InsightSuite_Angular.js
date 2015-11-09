'use strict';

describe('insightDataService', function () {
    var $httpBackend, insightDataService, fiService;

    var RESPONSE = {};
    var insightTransformer = {};
    var insightItemTransformer = {};

    var companyId = 70987;

    var fakeInsight = {
        name: 'test',
        objective: 'test',
        pricingEnabled: false,
        gameRunLocaleList: Array[0],
        department: {},
        priceScaling: {
            clearancePercentage: 5,
            markDownCadence: [
                100,
                75,
                50,
                25,
                0,
                0
            ]
        },
        pricingOption: {
            minimumSellThroughPercent: 0
        }
    };

    var fakeInsightTransposed = {
        name: 'test',
        objective: 'test',
        pricingEnabled: false,
        gameRunLocaleList: Array[0],
        department: {},
        priceScaling: {
            clearancePercentage: 0.05,
            markDownCadence: [
                1,
                0.75,
                0.50,
                0.25,
                null,
                null
            ]
        },
        pricingOption: {
            minimumSellThroughPercent: 0
        }
    };

    beforeEach(module('fi.insight'));
    beforeEach(module('fi.constants'));

    beforeEach(module(function ($provide) {
        fiService = jasmine.createSpyObj('fiService', ['companyId']);
        fiService.companyId.and.returnValue(101);

        $provide.value('fiService', fiService);
        $provide.value('insightTransformer', insightTransformer);
        $provide.value('insightItemTransformer', insightItemTransformer);
    }));

    beforeEach(inject(function (_insightDataService_, _$httpBackend_) {
        insightDataService = _insightDataService_;
        $httpBackend = _$httpBackend_;
    }));

    describe('createInsight', function () {
        it('should create the insight', function () {
            $httpBackend
                .expectPOST('../api/insight', fakeInsightTransposed)
                .respond(RESPONSE);
            insightDataService.createInsight(fakeInsight);
            $httpBackend.flush();
        });
    });

    describe('getInsightById', function () {
        it('should get the insight', function () {
            $httpBackend
                .expectGET('../api/insight/100')
                .respond(RESPONSE);
            insightDataService.getInsightById(100);
            $httpBackend.flush();
        });
    });

    describe('getInsights', function () {
        describe('without options', function () {
            it('should get the insights without any query parameters', function () {
                $httpBackend
                    .expectGET('../api/insights/company/101')
                    .respond(RESPONSE);
                insightDataService.getInsights();
            });
        });

        describe('with options', function () {
            it('should filter by a single status', function () {
                $httpBackend
                    .expectGET('../api/insights/company/101?filter=status::SETUP')
                    .respond(RESPONSE);

                insightDataService.getInsights({
                    status: 'SETUP'
                });
            });

            it('should ignore undefined property values', function () {
                $httpBackend
                    .expectGET('../api/insights/company/101?filter=status::SETUP')
                    .respond(RESPONSE);

                insightDataService.getInsights({
                    status: 'SETUP',
                    locale: undefined
                });
            });

            it('should filter by multiple query parameters', function () {
                $httpBackend
                    .expectGET('../api/insights/company/101?filter=status::SETUP%7Clocale::en_US%7Cdept::42')
                    .respond(RESPONSE);

                insightDataService.getInsights({
                    status: 'SETUP',
                    locale: 'en_US',
                    dept: '42'
                });
            });

            it('should escape special characters', function () {
                $httpBackend
                    .expectGET('../api/insights/company/101?filter=status::SETUP%7CnameLike::%5C%7C')
                    .respond(RESPONSE);

                insightDataService.getInsights({
                    status: 'SETUP',
                    nameLike: '|'
                });
            });

        });

        afterEach(function () {
            $httpBackend.flush();
        });
    });

    describe('getInsightItems', function () {
        it('should return list', function () {
            var gameRunId = 790;
            var list = [1, 2, 3];
            var result;

            $httpBackend
                .expectGET('../api/gamerun/' + gameRunId + '/items')
                .respond({
                    status: true,
                    data: angular.fromJson(list)
                });

            insightDataService
                .getInsightItems(gameRunId)
                .then(function (data) {
                    result = data;
                });

            expect(result).toBe(undefined);
            $httpBackend.flush();
            expect(result).toEqual(list);
        });
    });

    describe('getInsightItemsForAllLocales', function () {
        it('should return list', function () {
            var insightId = 790;
            var list = [1, 2, 3];
            var result;

            $httpBackend
                .expectGET('../api/insight/' + insightId + '/items')
                .respond({
                    status: true,
                    data: list
                });

            insightDataService
                .getInsightItemsForAllLocales(insightId)
                .then(function (data) {
                    result = data;
                });

            expect(result).toBe(undefined);
            $httpBackend.flush();
            expect(result).toEqual(list);
        });
    });

    describe('updateInsight', function () {
        var insightId, insight, filteredInsight;

        insightId = 790;
        insight = {
            insightId: insightId,
            gameRunLocaleList: [{}, {}],
            priceScaling: {
                markDownCadence: [100, 75, 50, 25]
            },
            pricingOption: {}
        };

        it('should send selected game run locales and not modify the insight', function () {
            var myInsight = angular.copy(insight);

            $httpBackend
                .expectPUT('../api/insight/' + insightId, filteredInsight)
                .respond(insight);

            insightDataService
                .updateInsight(myInsight);

            $httpBackend.flush();

            expect(myInsight).toEqual(jasmine.objectContaining(insight));   // the insight should not be modified
        });
    });

    describe('updateInsightItem', function () {
        var insight, insightItem;

        insight = {
            insightId: 1,
            gameRunLocaleList: [{
                locale: 'en_US'
            }]
        };

        insightItem = {
            itemId: '9'
        };

        it('should update item insight', function () {
            $httpBackend
                .expectPUT('../api/insight/' + insight.insightId + '/' + insight.gameRunLocaleList[0].locale + '/item/' + insightItem.itemId)
                .respond(insightItem);

            insightDataService
                .updateInsightItem(insight, insightItem);

            expect(insightItem).toEqual(insightItem);
        });

        it('should reject undefined insight argument', inject(function ($rootScope) {
            var isRejected = false;

            insightDataService
                .updateInsightItem(undefined, insightItem)
                .catch(function () {
                    isRejected = true;
                });

            $rootScope.$digest();

            expect(isRejected).toBe(true);
        }));

        it('should reject undefined insightItem argument', inject(function ($rootScope) {
            var isRejected = false;

            insightDataService
                .updateInsightItem(insight, undefined)
                .catch(function () {
                    isRejected = true;
                });

            $rootScope.$digest();

            expect(isRejected).toBe(true);
        }));

        it('should reject undefined insight id', inject(function ($rootScope) {
            var isRejected, insightWithoutId;

            isRejected = false;
            insightWithoutId = angular.copy(insight);
            insightWithoutId.insightId = void 0;

            insightDataService
                .updateInsightItem(insightWithoutId, insightItem)
                .catch(function () {
                    isRejected = true;
                });

            $rootScope.$digest();

            expect(isRejected).toBe(true);
        }));

        it('should reject undefined item id', inject(function ($rootScope) {
            var isRejected, insightItemWithoutId;

            isRejected = false;
            insightItemWithoutId = angular.copy(insightItem);
            insightItemWithoutId.itemId = void 0;

            insightDataService
                .updateInsightItem(insight, insightItemWithoutId)
                .catch(function () {
                    isRejected = true;
                });

            $rootScope.$digest();

            expect(isRejected).toBe(true);
        }));

        it('should reject undefined game run locales', inject(function ($rootScope) {
            var isRejected, insightWithoutGameRunLocales;

            isRejected = false;
            insightWithoutGameRunLocales = angular.copy(insight);
            insightWithoutGameRunLocales.gameRunLocaleList = void 0;

            insightDataService
                .updateInsightItem(insightWithoutGameRunLocales, insightItem)
                .catch(function () {
                    isRejected = true;
                });

            $rootScope.$digest();

            expect(isRejected).toBe(true);
        }));

        it('should reject empty game run locales', inject(function ($rootScope) {
            var isRejected, insightWithEmptyGameRunLocales;

            isRejected = false;
            insightWithEmptyGameRunLocales = angular.copy(insight);
            insightWithEmptyGameRunLocales.gameRunLocaleList = [];

            insightDataService
                .updateInsightItem(insightWithEmptyGameRunLocales, insightItem)
                .catch(function () {
                    isRejected = true;
                });

            $rootScope.$digest();

            expect(isRejected).toBe(true);
        }));
    });

    describe('removeInsightItem', function () {
        var gameRunLocale, item;

        gameRunLocale = { gameRunId: 1 };
        item = {};

        it('should remove an item from an insight', function () {
            $httpBackend
                .expectPUT('../api/gamerun/' + gameRunLocale.gameRunId + '/items/remove', [item])
                .respond('201');

            insightDataService.removeInsightItem(gameRunLocale, item);
            $httpBackend.flush();
        });
    });

    describe('moveToPreview', function () {
        it('should move a game run status to preview', function () {
            var gameRunId = 12345;

            $httpBackend
                .expectPUT('../api/gamerun/' + gameRunId + '/status/pending?ignoreMinAmountReferenceItemsRequired=false')
                .respond('201');

            insightDataService.moveToPreview(gameRunId);
            $httpBackend.flush();
        });
    });

    describe('list insights should be', function () {
        it('successful', function () {
            var result;
            var dataValue = [1, 2, 3];

            fiService.companyId.and.returnValue(companyId);
            $httpBackend
                .expectGET('../api/insights/company/' + companyId)
                .respond({
                    status: true,
                    data: dataValue
                });

            insightDataService
                .getInsights()
                .then(function (x) {
                    result = x;
                });

            expect(result).toBe(undefined);
            $httpBackend.flush();
            expect(result).toEqual(dataValue);
        });

        it('successful with name parameter', function () {
            var result;
            var dataValue = [1, 2, 3];

            fiService.companyId.and.returnValue(companyId);
            $httpBackend
                .expectGET('../api/insights/company/' + companyId + '?filter=param1::param1%7Cparam2::param2%7Cname::name+param')
                .respond({
                    status: true,
                    data: dataValue
                });

            insightDataService
                .getInsights({
                    param1: 'param1',
                    param2: 'param2',
                    name: 'name param'
                })
                .then(function (x) {
                    result = x;
                });

            expect(result).toBe(undefined);
            $httpBackend.flush();
            expect(result).toEqual(dataValue);
        });

        it('unsuccessful', function () {
            var result;
            var responseValue = {
                status: false,
                message: [1, 2, 3]
            };

            fiService.companyId.and.returnValue(companyId);
            $httpBackend
                .expectGET('../api/insights/company/' + companyId)
                .respond(responseValue);

            insightDataService
                .getInsights()
                .catch(function (x) {
                    result = x;
                });

            expect(result).toBe(undefined);
            $httpBackend.flush();
            expect(result).toEqual(responseValue.message);
        });
    });

    describe('insight creation should be', function () {
        it('successful', function () {
            var result;

            $httpBackend
                .expectPOST('../api/insight', fakeInsightTransposed)
                .respond({
                    status: true,
                    data: fakeInsightTransposed
                });

            insightDataService
                .createInsight(fakeInsight)
                .then(function (x) {
                    result = x;
                });

            expect(result).toBe(undefined);
            $httpBackend.flush();
            expect(result).toEqual(fakeInsightTransposed);

        });

        it('unsuccessful', function () {
            var result;
            var responseValue = {
                status: false,
                message: 'bad'
            };

            $httpBackend
                .expectPOST('../api/insight')
                .respond(responseValue);

            insightDataService
                .createInsight(fakeInsight)
                .catch(function (x) {
                    result = x;
                });

            expect(result).toBe(undefined);
            $httpBackend.flush();
            expect(result).toEqual(responseValue.message);
        });

        it('unsuccessful with bad http response', function () {
            var result;

            $httpBackend
                .expectPOST('../api/insight')
                .respond(401, 'bad');

            insightDataService
                .createInsight(fakeInsight)
                .catch(function (x) {
                    result = x;
                });

            expect(result).toBe(undefined);
            $httpBackend.flush();
            expect(result.data).toEqual('bad');
        });
    });

    describe('Update Insight Item Ticket Price', function () {

        it('should update item insight ticket price', function () {
            var gameItemId = 123;
            var ticketPrice = 55;

            $httpBackend
                .expectPUT('../api/gameitem/' + gameItemId + '/ticketprice')
                .respond({});

            insightDataService.updateInsightItemTicketPrice(gameItemId, ticketPrice);

            $httpBackend.flush();
        });

        it('should not attempt to update item insight ticket price if gameItemId is undefined', function () {
            var gameItemId;
            var ticketPrice = 55;

            insightDataService.updateInsightItemTicketPrice(gameItemId, ticketPrice);

            $httpBackend.verifyNoOutstandingExpectation();
        });

        it('should not attempt to update item insight ticket price if gameItemId is not a number', function () {
            var gameItemId = 'abc';
            var ticketPrice = 55;

            insightDataService.updateInsightItemTicketPrice(gameItemId, ticketPrice);

            $httpBackend.verifyNoOutstandingExpectation();
        });

        it('should not attempt to update item insight ticket price if ticketPrice is not a number', function () {
            var gameItemId = 123;
            var ticketPrice = 'abc';

            insightDataService.updateInsightItemTicketPrice(gameItemId, ticketPrice);

            $httpBackend.verifyNoOutstandingExpectation();
        });

        it('should be unsuccessful if there is a bad http response', function () {
            var result;
            var gameItemId = 123;
            var ticketPrice = 55;

            $httpBackend
                .expectPUT('../api/gameitem/' + gameItemId + '/ticketprice')
                .respond(401, 'bad');

            insightDataService
                .updateInsightItemTicketPrice(gameItemId, ticketPrice)
                .catch(function (x) {
                    result = x;
                });

            expect(result).toBe(undefined);
            $httpBackend.flush();
            expect(result.data).toEqual('bad');
        });
    });

    describe('getEligibleAddItems', function () {
        it('should return list of items', function () {
            var list = [{
                itemId: 1,
                primaryImage: { thumbnailUrl: 'images/noimages-item.png', status: 'NO_IMAGE' }
            }];
            var returnVal;

            $httpBackend
                .expectGET('/api/gamerun/456/possibleItems')
                .respond({
                    status: true,
                    data: list
                });

            insightDataService.getEligibleAddItems(456).then(function (val) {
                returnVal = val;
            });
            $httpBackend.flush();

            expect(returnVal).toEqual(list);

        });
    });
});

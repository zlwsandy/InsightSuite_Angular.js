'use strict';

describe('Insight Transformer Specs - ', function () {
    var sut, localeService;

    var mockInsights = [{
        createTime : 1435165304000,
        gameRunId : 200,
        name : 'Mock Insight 1',
        gameRunStatus : 'RESULTS',
        locale : 'en_US',
        insightId : 100,
        gameType : 'WWYP',
        completionDate : 1435165887000,
        collectionStartDate : 1335165887000
    }, {
        createTime : 1435165304000,
        gameRunId : 201,
        name : 'Mock Insight 2',
        gameRunStatus : 'SETUP',
        locale : null,
        insightId : 101,
        gameType : 'WWYP'
    }];

    var mockInsight = mockInsights[0];

    var mockLocale = {
        numberFormat: {
            currencyCode: 'USD'
        }
    };

    beforeEach(module('fi.insight'));

    // inject mocks
    beforeEach(function () {

        module(function ($provide) {
            localeService = jasmine.createSpyObj('localeService', ['getLanguage', 'findLocale'])

            $provide.value('localeService', localeService);
        })
    });

    beforeEach(inject(function(insightTransformer) {
        localeService.findLocale.and.returnValue(mockLocale);
        localeService.getLanguage.and.returnValue('en');
        sut = insightTransformer;
    }));

    describe('Initialize - ', function () {
        it('should return a result if a single insight object is passed in', function () {
            var transformedResult = sut(mockInsight);
            expect(transformedResult.createTimeConverted).toBeDefined();
        });

        it('should return a result if an array of insight objects is passed in', function () {
            var transformedResults = sut(mockInsights);
            expect(transformedResults[0].createTimeConverted).toBeDefined();
        });
    });

    describe('Convert Date Time - ', function () {

        it('should set the create time to a date object', function () {
            var transformedResults = sut(mockInsights);
            expect(transformedResults[0].createTimeConverted).toBeDefined();
        });

        it('should set the completion date to a date object if it exists', function () {
            // the first insight has a completion date
            var transformedResults = sut(_.take(mockInsights));
            expect(transformedResults[0].completionDateConverted).toBeDefined();
        });

        it('should not set the completion date to a date object if it does not exist', function () {
            // the second insight does not have a completion date
            var transformedResults = sut(_.at(mockInsights, 1));
            expect(transformedResults[0].completionDateConverted).not.toBeDefined();
        });

        it('should set the collection start date to a date object if it exists', function () {
            // the first insight has a completion date
            var transformedResults = sut(_.take(mockInsights));
            expect(transformedResults[0].collectionStartDateConverted).toBeDefined();
        });

        it('should not set the completion date to a date object if it does not exist', function () {
            // the second insight does not have a completion date
            var transformedResults = sut(_.at(mockInsights, 1));
            expect(transformedResults[0].collectionStartDateConverted).not.toBeDefined();
        });
    });

    describe('Property totalAvailable - ', function () {
        it('should be retained', function () {
            var totalAvailable = 5;
            var insights = mockInsights.slice();
            var transformedResults;
            
            insights.totalAvailable = totalAvailable;
            transformedResults = sut(insights);
            
            expect(transformedResults.totalAvailable).toBeDefined();
            expect(transformedResults.totalAvailable).toBe(totalAvailable);
        });
    });

    describe('Locale Data - ', function () {
        it('should not add locale data if the insight locale is null', function () {
            var transformedResults = sut(_.at(mockInsights, 1));
            expect(transformedResults[0].language).not.toBeDefined();
            expect(transformedResults[0].currency).not.toBeDefined();
        });

        it('should add locale data if the insight locale is not null', function () {
            var transformedResults = sut(_.take(mockInsights));
            expect(transformedResults[0].language).toBeDefined();
            expect(transformedResults[0].currency).toBeDefined();
        });
    })
});

'use strict';

describe('InsightLocaleFactory Specs - ', function () {
    var sut;

    var mockLocales;
    var mockLocale;
    var localeService = {};

    beforeEach(module('mock/locales.json'));
    beforeEach(module('fi.insight'));

    // Setup spies
    beforeEach(function () {
        localeService = {
            isAllLocales: jasmine.createSpy('localeService isAllLocales'),
            allLocales: {
                localeCode : 'all'
            }
        };
    });

    // Setup mock injection using $provide.value
    beforeEach(function () {
        module(function ($provide) {
            $provide.value("localeService", localeService);
        });
    });


    beforeEach(inject(function (_insightLocaleFactory_, _mockLocales_) {
        mockLocales = _mockLocales_;
        mockLocale = mockLocales.en_US;  // use the US locale
        sut = _insightLocaleFactory_;
    }));

    describe('Locale Results', function () {

        it('should return true if the locale is in a results status', function () {

            expect(sut.isInsightLocaleResults(mockLocale)).toBe(true);
        });

        it('should return false if the locale is not in a results status', function () {

            expect(sut.isInsightLocaleResults(mockLocales.es_CO)).toBe(false);
        });

        it('should return false if the locale is null', function () {

            expect(sut.isInsightLocaleResults(null)).toBe(false);
        });

        it('should return false if the locale status is undefined', function () {

            // Clone the mock locale so we don't affect any other tests
            var locale = _.cloneDeep(mockLocale);
            locale.gameRunStatus = undefined;

            expect(sut.isInsightLocaleResults(null)).toBe(false);
        });

        it('should return true if the locale is in a results status, ignoring case', function () {

            // Clone the mock locale so we don't affect any other tests
            var locale = _.cloneDeep(mockLocale);
            locale.gameRunStatus = 'ResUltS';

            expect(sut.isInsightLocaleResults(locale)).toBe(true);
        });

        it('should return true if the locale is in a summary results status, ignoring case', function () {

            // Clone the mock locale so we don't affect any other tests
            var locale = _.cloneDeep(mockLocale);
            locale.gameRunStatus = 'summARy_ReSulTs';

            expect(sut.isInsightLocaleResults(locale)).toBe(true);
        });

        it('should return true if the locale is in a hidden status, ignoring case', function () {

            // Clone the mock locale so we don't affect any other tests
            var locale = _.cloneDeep(mockLocale);
            locale.gameRunStatus = 'hIDdeN';

            expect(sut.isInsightLocaleResults(locale)).toBe(true);
        });
    });

    describe('Locale Setup', function () {

        it('should return false if the locale is not in a setup status', function () {

            var locale = _.cloneDeep(mockLocale);
            locale.gameRunStatus = 'summARy_ReSulTs';

            expect(sut.isInsightLocaleInSetup(locale)).toBe(false);
        });

        it('should return false if the locale is null', function () {

            expect(sut.isInsightLocaleInSetup(null)).toBe(false);
        });

        it('should return false if the locale status is undefined', function () {

            // Clone the mock locale so we don't affect any other tests
            var setupLocale = _.cloneDeep(mockLocale);
            setupLocale.gameRunStatus = undefined;

            expect(sut.isInsightLocaleInSetup(setupLocale)).toBe(false);
        });

        it('should return true if the locale is in a setup status, ignoring case', function () {

            // Clone the mock locale so we don't affect any other tests
            var setupLocale = _.cloneDeep(mockLocale);
            setupLocale.gameRunStatus = 'SeTuP';

            expect(sut.isInsightLocaleInSetup(setupLocale)).toBe(true);
        });

        it('should return true if the locale is in a denied status, ignoring case', function () {

            // Clone the mock locale so we don't affect any other tests
            var setupLocale = _.cloneDeep(mockLocale);
            setupLocale.gameRunStatus = 'dENieD';

            expect(sut.isInsightLocaleInSetup(setupLocale)).toBe(true);
        });

        it('should return true if the locale is in a summary_setup, ignoring case', function () {

            // Clone the mock locale so we don't affect any other tests
            var setupLocale = _.cloneDeep(mockLocale);
            setupLocale.gameRunStatus = 'summARy_setUp';

            expect(sut.isInsightLocaleInSetup(setupLocale)).toBe(true);
        });
    });

    describe('Find Insight Locale', function () {

        it('should find the locale if the given locale code exists in the given list', function () {

            expect(sut.findInsightLocale('en_US', mockLocales)).toEqual(mockLocales.en_US);
        });

        it('should return undefined if the given locale code does not exist in the given list', function () {

            expect(sut.findInsightLocale('xx_XX', mockLocales)).not.toBeDefined();
        });

        it('should return undefined if no locale list is provided for search', function () {

            expect(sut.findInsightLocale('xx_XX')).not.toBeDefined();
        });

        it('should return undefined if an empty list is provided for search', function () {

            expect(sut.findInsightLocale('xx_XX', [])).not.toBeDefined();
        });

        describe('All Locales', function () {
            it('should return undefined if the locale list does not have all results locales', function () {

                localeService.isAllLocales.and.returnValue(true);

                expect(sut.findInsightLocale('all', mockLocales)).not.toBeDefined();
            });

            it('should return the sole results locale if the list contains only one locale which is in results status', function () {

                localeService.isAllLocales.and.returnValue(true);

                var resultsLocales = [mockLocales.en_US];

                expect(sut.findInsightLocale('all', resultsLocales)).toEqual(mockLocales.en_US);
            });


            it('should return an All Locales object if the list contains all locales in results status and has more than one', function () {

                localeService.isAllLocales.and.returnValue(true);

                var resultsLocales = [mockLocales.en_US, mockLocales.zh_CN];

                expect(sut.findInsightLocale('all', resultsLocales)).toEqual(localeService.allLocales);
            });
        });

    });

});

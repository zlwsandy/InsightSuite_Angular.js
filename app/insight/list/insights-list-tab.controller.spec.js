'use strict';

describe('Insights List Tab Controller Specs - ', function () {
    var $rootScope, $scope, $state, company, isAdmin, sut, localeSelection, insightListService;

    var mockResultsState = {
        name: 'insightsListTab.results',
        url: '/results',
        data: {
            insightsListTab: 'results'
        }
    };

    var mockAllLocales = {locale: 'all'};

    var mockLocales = [
        {
            'locale': 'en_GB',
            'conversionRate': 1.0000000000,
            'currencyCode': 'GBP',
            'gameRunId': 5753,
            'gameRunStatus': 'RUNNING'
        },
        {
            'locale': 'en_US',
            'conversionRate': 1.0000000000,
            'currencyCode': 'USD',
            'gameRunId': 5755,
            'gameRunStatus': 'SETUP'
        },
        {
            'locale': 'de_DE',
            'conversionRate': 1.0000000000,
            'currencyCode': 'EUR',
            'gameRunId': 5754,
            'gameRunStatus': 'SETUP'
        }
    ];

    // helper function
    var getTab = function (tabName) {
        return _.find(sut.tabList, function (tab) {
            return tab.name === tabName;
        });
    };

    beforeEach(module('fi.insight'));

    // setup spies
    beforeEach(function () {
        insightListService = jasmine.createSpyObj('insightListService', ['fetchUpdatedLocaleList', 'fetchUpdatedSearchStringList']);

        localeSelection = {
            locale: undefined
        };
        $state = {
            'go' : jasmine.createSpy('$state go'),
            current : {
                data : {},
                name : ''
            }
        };
    });

    // inject mocks
    beforeEach(function () {
        module(function ($provide) {
            $provide.value('$state', $state);
            $provide.value('company', mockCompany);
            $provide.value('localeSelection', localeSelection);
            $provide.value('insightListService', insightListService);
        });
    });

    // create controller under test
    var createController = function (isAdmin, locales) {
        inject(function (_$rootScope_, $controller) {
            $rootScope = _$rootScope_;

            sut = $controller('InsightsListTabController', {
                $scope: ($scope = $rootScope.$new()),
                isAdmin: isAdmin,
                locales: locales
            });

            $rootScope.insightsListTabController = sut;
        });
    };

    describe('Initialization - ', function () {

        beforeEach(function () {
            createController(true, mockLocales);
        });

        it('should have a list containing 4 tabs', function () {
            expect(sut.tabList.length).toBe(4);
        });

        it('should set the company', function () {
            expect(sut.company).toBe(mockCompany);
        });

        it('should set the admin value', function () {
            expect(sut.isAdmin).toBe(true);
        });

    });

    describe('Update status -', function () {

        it('should return the current status', function () {
            $state.current.data.status = 'SUMMARY_SETUP';
            createController(true, mockLocales);

            expect(sut.updateStatus()).toBe('SUMMARY_SETUP');
        });
    });

    describe('Selected Tab -', function () {

        it('should get the tab name based on the current $state', function () {
            $state.current = mockResultsState;
            createController(true, mockLocales);
            expect(sut.selectedTab()).toBe(mockResultsState.data.insightsListTab);
        });

    });

    describe('Open Tab -', function () {

        it('should transition to a new $state if a valid tab is selected', function () {
            createController(true, mockLocales);
            $rootScope.$digest();
            expect(insightListService.fetchUpdatedSearchStringList).not.toHaveBeenCalled();

            sut.openTab(getTab('results'));

            expect(sut.searchString).toBe('');
            expect(sut.showSearchInput).toBeFalsy();
            expect(sut.skipWatch).toBe(1);
            expect($state.go).toHaveBeenCalledWith('insightsListTab.results');

            $rootScope.$digest();
            expect(insightListService.fetchUpdatedSearchStringList).not.toHaveBeenCalled();
        });

        it('should transition to a new $state if a valid tab is selected and search string was empty', function () {
            createController(true, mockLocales);
            sut.searchString = '';
            $rootScope.$digest();

            sut.openTab(getTab('results'));

            expect(sut.searchString).toBe('');
            expect(sut.showSearchInput).toBeFalsy();
            expect(sut.skipWatch).toBe(0);
            expect($state.go).toHaveBeenCalledWith('insightsListTab.results');

            $rootScope.$digest();
            expect(insightListService.fetchUpdatedSearchStringList).toHaveBeenCalledWith('');
        });
    });

    describe('Locale Selection - ', function () {

        it('should set the list of locales, sorted in ascending alphabetic order', function () {
            createController(true, mockLocales);
            expect(sut.locales[0]).toBe(mockLocales[2]);
            expect(sut.locales[1]).toBe(mockLocales[0]);
            expect(sut.locales[2]).toBe(mockLocales[1]);
        });

        it('should show the locale selection when the company has internationalization enabled and there is more than one locale', function () {
            createController(true, mockLocales);
            expect(sut.isLocaleSelectVisible()).toBe(true);
        });

        it('should hide the locale selection when the company has internationalization disabled', function () {
            sut.company.i18nEnabled = false;
            createController(true, mockLocales);

            expect(sut.isLocaleSelectVisible()).toBe(false);
        });

        it('should hide the locale selection when the company has internationalization enabled and there is ONLY ONE locale', function () {
            sut.company.i18nEnabled = false;
            createController(true, _.filter(mockLocales, 'locale', 'en_US'));

            expect(sut.isLocaleSelectVisible()).toBe(false);
        });

        it('should set the current locale to the only locale if the company has internationalization enabled and there is ONLY ONE locale', function () {
            sut.company.i18nEnabled = true;
            createController(true, _.filter(mockLocales, 'locale', 'en_US'));

            expect(sut.currentLocale).toBe(_.find(mockLocales, 'locale', 'en_US'));
        });

        it('should set the current locale to All Locales if the company has internationalization enabled and there is more than one locale', function () {
            sut.company.i18nEnabled = true;
            createController(true, mockLocales);

            expect(sut.currentLocale).toBe('all');
        });

        it('should set the current locale to the company default locale if the company has internationalization disabled', function () {
            sut.company.i18nEnabled = false;
            createController(true, _.filter(mockLocales, 'locale', 'en_US'));

            expect(sut.currentLocale.locale).toBe(mockCompany.defaultLocale);
        });


        it('should set the current locale to a new value when the locale changes', function () {
            createController(true, mockLocales);
            sut.localeChange(mockLocales[2]);
            expect(sut.currentLocale).toBe(mockLocales[2]);
        });

        it('should set the current locale to "all" when the locale changes', function () {
            createController(true, mockLocales);
            sut.localeChange(mockAllLocales);
            expect(sut.currentLocale).toBe(mockAllLocales);
        });

    });

    describe('Add New Insight', function () {

        it('should go to the create new insight page', function () {
            createController(true, mockLocales);
            sut.addNewInsight();
            expect($state.go).toHaveBeenCalledWith('insightTabNoActionbar.newInsight', { insightId: 0 });
        });
    });

    describe('Search input', function () {

        beforeEach(function () {
            createController(true, mockLocales);
        });

        it('should set the showInput to true and false and dimIcon to false', function () {
            sut.searchBtnClick();

            expect(sut.showSearchInput).toBeTruthy();
            expect(sut.dimIcon).toBeFalsy();

            sut.searchBtnClick();

            expect(sut.showSearchInput).toBeFalsy();
            expect(sut.dimIcon).toBeFalsy();
        });

        it('should keep showSearchInput to true and set dimIcon true', function () {
            sut.searchBtnClick();

            expect(sut.showSearchInput).toBeTruthy();

            sut.searchString = 'Test';
            sut.searchBtnClick();

            expect(sut.showSearchInput).toBeTruthy();
            expect(sut.dimIcon).toBeTruthy();
        });
    });

});

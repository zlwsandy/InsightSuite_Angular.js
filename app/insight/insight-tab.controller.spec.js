'use strict';

describe('InsightTabControllerSpecs', function () {
    var insightDataService, insightLocaleFactory, localeService,
        sut, $scope, $state, items, survey, games, $stateParams, $q, $mdDialog, $rootScope;

    var mockInsightTabFactory = {};
    var FiConstants;
    var $window;
    var $timeout;

    var url = '';

    var mockInsightData;
    var mockInsight;

    var mockSegments;

    var itemTestData = [{
        itemId: 21
    }, {
        itemId: 22
    }];

    var allLocalesItemTestData = [{
        itemId: 25
    }, {
        itemId: 26
    }];

    items = {
        name: 'items',
        state: 'insightTabWithLocale.items'
    };

    survey = {
        name: 'survey',
        state: 'insightTab.survey'
    };

    games = {
        name: 'games',
        state: 'insightTab.games'
    };

    var mockLocales;
    var mockLocale;
    var mockCompany;

    beforeEach(module('mock/locales.json'));
    beforeEach(module('mock/insight.json'));
    beforeEach(module('mock/company.json'));
    beforeEach(module('mock/segments.json'));
    beforeEach(module('fi.constants'));
    beforeEach(module('fi.insight'));

    // Setup spies
    beforeEach(function () {
        insightDataService = jasmine.createSpyObj('insightDataService', [
            'getInsightItems',
            'getInsightById',
            'getInsightItemsForAllLocales',
            'getInsightSegments',
            'updateInsightItem'
        ]);

        insightLocaleFactory = jasmine.createSpyObj('insightLocaleFactory', [
            'isInsightLocaleResults',
            'isInsightLocaleInSetup',
            'findInsightLocale'
        ]);

        localeService = jasmine.createSpyObj('localeService', [
            'isAllLocales',
            'findLocale'
        ]);

        $state = {
            'go' : jasmine.createSpy('$state go'),
            current : {
                data : {
                    insightTab: '',
                    state: ''
                },
                name : ''
            }
        };

        $stateParams = {
            locale : null
        };

        $window = {
            print : jasmine.createSpy('window print')
        };
    });

    // Setup mock injection using $provide.value
    beforeEach(function () {
        module(function ($provide) {
            $provide.value("insightDataService", insightDataService);
            $provide.value("$stateParams", $stateParams);
            $provide.value("isAdmin", true);
            $provide.value("isSysAdmin", true);
            $provide.value("insightLocaleFactory", insightLocaleFactory);
            $provide.value("localeService", localeService);
            $provide.value("insightTabFactory", mockInsightTabFactory);
            $provide.value("$window", $window);
        });
    });

    /**
     * Creates controller with various params
     * @param controllerParam - Object of possible values:
     *
     *  localeCode
     *  i18nEnabled
     *  state
     *  insightData
     */
    var createController = function (controllerParams) {

        controllerParams = controllerParams || {};

        inject(function (_$rootScope_, $controller, _$q_, _$mdDialog_, _FiConstants_, _$timeout_,
                         _mockLocales_, _mockInsight_, _mockSegments_, _mockCompany_) {
            $rootScope = _$rootScope_;
            $scope = _$rootScope_.$new();
            $q = _$q_;
            $mdDialog = _$mdDialog_;
            FiConstants = _FiConstants_;
            $timeout = _$timeout_;
            mockLocales = _mockLocales_;
            mockLocale = mockLocales[controllerParams.localeCode];
            mockInsight = _mockInsight_;
            mockSegments = _.cloneDeep(_mockSegments_);
            mockCompany = _.cloneDeep(_mockCompany_);

            insightDataService.getInsightItems.and.returnValue($q.when(itemTestData));
            insightDataService.getInsightItemsForAllLocales.and.returnValue($q.when(allLocalesItemTestData));
            insightDataService.updateInsightItem.and.returnValue($q.when([]));
            insightDataService.getInsightSegments.and.returnValue($q.when(mockSegments));
            localeService.findLocale.and.returnValue(mockLocale);

            insightLocaleFactory.findInsightLocale.and.returnValue(mockLocale);

            $stateParams.locale = controllerParams.localeCode;

            mockCompany.i18nEnabled = controllerParams.i18nEnabled;

            _$rootScope_.companyData = mockCompany;

            sut = $controller('InsightTabController', {
                $scope: $scope,
                $state: controllerParams.state || $state,
                insight: controllerParams.insightData || mockInsight
            });
        });

    };

    /**
     * Get a tab by tab name
     *
     * @param tabName
     */
    var getTab = function (tabName) {
        return _.find(sut.tabList, function (tab) {
            return tab.name.toLowerCase() === tabName;
        });
    };

    describe('No Locale', function () {

        beforeEach(function () {

            localeService.isAllLocales.and.returnValue(false);
            insightLocaleFactory.isInsightLocaleResults.and.returnValue(false);

            createController(null);
        });

        it('should not attempt to get segments if the locale is null', function () {
            expect(insightDataService.getInsightSegments).not.toHaveBeenCalled();
        });

        it('should hide the segment select if the current locale is not All Locales', function () {
            expect(sut.isSegmentSelectVisible()).toBe(false);
        });

        it('should not show the select if no locale is selected', function () {

            expect(sut.isSegmentSelectVisible()).toBe(false);
        });
    });

    describe('All Locales', function () {

        beforeEach(function () {
            localeService.isAllLocales.and.returnValue(true);
            insightLocaleFactory.isInsightLocaleResults.and.returnValue(false);

            createController({
                localeCode : 'all'
            });
        });

        it('should not attempt to get segments if the locale is all locales', function () {
            expect(insightDataService.getInsightSegments).not.toHaveBeenCalled();
        });

        it('should show the segment select if the current locale is All Locales', function () {
            expect(sut.isSegmentSelectVisible()).toBe(true);
        });

        it('should disable the segment select if the current locale is All Locales', function () {
            expect(sut.isSegmentSelectDisabled()).toBe(true);
        });

        it('should disable the select if the current locale is All', function () {
            expect(sut.isSegmentSelectDisabled()).toBe(true);
        });
    });

    describe('Current State', function () {
        beforeEach(function () {
            createController({
                localeCode : 'all'
            });
            spyOn(sut, 'getCurrentState').and.returnValue('insightTabWithLocale.items');
        });

        it('should return true if the current state matches the state property passed', function () {
            expect(sut.isState({
                name : 'insight items',
                state : 'insightTabWithLocale.items'
            })).toBe(true);
        });

        it('should return false if the current state does not match the state property passed', function () {
            expect(sut.isState({
                name : 'insight items',
                state : 'insightTab.games'
            })).toBe(false);
        });
    });

    describe('Determine Locale', function () {

        beforeEach(function () {
            localeService.isAllLocales.and.returnValue(false);
            insightLocaleFactory.isInsightLocaleResults.and.returnValue(true);

            createController({
                localeCode : 'en_US'
            });
        });

        it('should not change the insights gameRunLocaleList when invoked', function () {
            sut.determineLocale();

            expect(mockInsight.gameRunLocaleList[0].locale).toEqual('en_GB');
        });

        it('should return the first locale in alphabetical order from the insights gameRunLocaleList', function () {
            expect(sut.determineLocale()).toEqual('en_US');
        });
    });


    describe('Specified Locale - Results', function () {

        beforeEach(function () {
            localeService.isAllLocales.and.returnValue(false);
            insightLocaleFactory.isInsightLocaleResults.and.returnValue(true);
            createController({
                localeCode : 'en_US'
            });
        });

        describe('initialization', function () {

            beforeEach(function () {
                $scope.$digest();
            });

            it('should get the segments for the selected locale if the locale is all locales', function () {

                expect(insightDataService.getInsightSegments).toHaveBeenCalled();
            });

            it('should set the segments on the controller instance', function () {

                expect(sut.segments).toEqual(mockSegments);
            });

            it('should show the select if the current locale is Results', function () {

                expect(sut.isSegmentSelectVisible()).toBe(true);
            });
        });
    });

    describe('Specified Locale - Not Results', function () {

        beforeEach(function () {
            localeService.isAllLocales.and.returnValue(false);
            insightLocaleFactory.isInsightLocaleResults.and.returnValue(false);

            createController({
                localeCode : 'en_US'
            });
        });

        describe('initialization', function () {

            beforeEach(function () {
                $scope.$digest();
            });

            it('should get the segments for the selected locale', function () {

                expect(insightDataService.getInsightSegments).toHaveBeenCalled();
            });

            it('should set the segments on the controller instance', function () {

                expect(sut.segments).toEqual(mockSegments);
            });

            it('should set current locale to what is returned from locale service', function () {
                expect(sut.currentLocale).toEqual(mockLocales.en_US);
            });

            // NOTE: commenting this out because segments need to be disabled for this particular story.
            //       Uncomment when segments is introduced to the application.
            // it('should show the Segments tab if the locale is all locales', function () {

            //     var segmentsTabObj = getTab('segments');

            //     expect(segmentsTabObj.visible).toBe(true);
            // });

            it('should enable the select if the current locale is not All Locales', function () {
                expect(sut.isSegmentSelectDisabled()).toBe(false);
            });

            it('should not show the select if the current locale is not All Locales and is not results', function () {
                expect(sut.isSegmentSelectDisabled()).toBe(false);
            });
        });
    });

    describe('Toolbar Change Listeners', function () {

        beforeEach(function () {
            localeService.isAllLocales.and.returnValue(false);
            insightLocaleFactory.isInsightLocaleResults.and.returnValue(false);
            localeService.findLocale.and.returnValue(mockLocales.en_US);
            createController({
                localeCode : 'en_US'
            });
        });

        describe('Locale Change', function () {

            it('should change state when the locale is changed', function () {

                sut.localeChange('fr_FR');

                expect($state.go).toHaveBeenCalled();
            });

            it('should not change state if locale is changed to a nonexistent value', function () {

                sut.localeChange(undefined);

                expect($state.go).not.toHaveBeenCalled();
            });
        });

        describe('Segment Change', function () {
            it('should set the segment on the insight tab factory when it changes', function () {
                var newSegment = 'segmentTest';

                sut.segmentChange(newSegment);

                expect(mockInsightTabFactory.selectedSegment).toEqual(newSegment);
            });
        });

        describe('Add Item Change', function () {
            it('should prompt the upload dialog', function () {

                spyOn($mdDialog, 'show');

                sut.addItem();

                expect($mdDialog.show).toHaveBeenCalled();
            });
        });
    });

    describe('Disable Controls', function () {
        beforeEach(function () {
            createController({
                localeCode : 'en_US'
            });
        });

        it('should disable the segment select if the current locale is all locales', function () {

            spyOn(sut, 'getCurrentState').and.returnValue('insightTab.itemTab');
            localeService.isAllLocales.and.returnValue(true);
            insightLocaleFactory.isInsightLocaleResults.and.returnValue(false);

            expect(sut.isSegmentSelectDisabled()).toBe(true);
        });

        it('should hide the toolbar if all controls inside are hidden', function () {

            spyOn(sut, 'getCurrentState').and.returnValue('insightTab.itemTab');
            spyOn(sut, 'isLocaleSelectVisible').and.returnValue(false);
            spyOn(sut, 'isSegmentSelectVisible').and.returnValue(false);
            spyOn(sut, 'isAddItemVisible').and.returnValue(false);

            localeService.isAllLocales.and.returnValue(false);
            insightLocaleFactory.isInsightLocaleResults.and.returnValue(false);

            expect(sut.showToolbar()).toBe(false);
        });
    });

    describe('Hide Controls', function () {

        beforeEach(function () {
            createController({
                localeCode : 'en_US',
                i18nEnabled : true
            });
            localeService.findLocale.and.returnValue(mockLocales.en_US);
        });

        it('should hide the locale select if the current state is settings', function () {

            spyOn(sut, 'getCurrentState').and.returnValue('insightTabNoActionbar.settings');
            localeService.isAllLocales.and.returnValue(false);
            insightLocaleFactory.isInsightLocaleResults.and.returnValue(false);

            expect(sut.isLocaleSelectVisible()).toBe(false);
        });

        it('should hide the segment select if the current state is segments', function () {

            spyOn(sut, 'getCurrentState').and.returnValue('insightTabWithLocale.segments');
            localeService.isAllLocales.and.returnValue(false);
            insightLocaleFactory.isInsightLocaleResults.and.returnValue(false);

            expect(sut.isSegmentSelectVisible()).toBe(false);
        });

        it('should show the segment select if the current state is not one that hides it and All Locales is selected', function () {

            spyOn(sut, 'getCurrentState').and.returnValue('insightTabWithLocale.items');
            localeService.isAllLocales.and.returnValue(true);
            insightLocaleFactory.isInsightLocaleResults.and.returnValue(false);

            expect(sut.isSegmentSelectVisible()).toBe(true);
        });

        it('should show the segment select if the current state is not one that hides it and a results Locale is selected', function () {

            spyOn(sut, 'getCurrentState').and.returnValue('insightTabWithLocale.items');
            localeService.isAllLocales.and.returnValue(false);
            insightLocaleFactory.isInsightLocaleResults.and.returnValue(true);

            expect(sut.isSegmentSelectVisible()).toBe(true);
        });

        it('should hide the add item button if the current state is segments', function () {

            spyOn(sut, 'getCurrentState').and.returnValue('insightTabWithLocale.segments');
            localeService.isAllLocales.and.returnValue(false);
            insightLocaleFactory.isInsightLocaleResults.and.returnValue(false);

            expect(sut.isAddItemVisible()).toBe(false);
        });

        it('should hide the add item button if the current state is games', function () {

            spyOn(sut, 'getCurrentState').and.returnValue('insightTab.games');
            localeService.isAllLocales.and.returnValue(false);
            insightLocaleFactory.isInsightLocaleResults.and.returnValue(false);

            expect(sut.isAddItemVisible()).toBe(false);
        });

        it('should hide the add item button if the current state is settings', function () {

            spyOn(sut, 'getCurrentState').and.returnValue('insightTabNoActionbar.settings');
            localeService.isAllLocales.and.returnValue(false);
            insightLocaleFactory.isInsightLocaleResults.and.returnValue(false);

            expect(sut.isAddItemVisible()).toBe(false);
        });

        it('should show the add item button if the current state is not one that hides it and All Locales is not selected', function () {

            spyOn(sut, 'getCurrentState').and.returnValue('insightTabWithLocale.items');
            localeService.isAllLocales.and.returnValue(false);
            insightLocaleFactory.isInsightLocaleInSetup.and.returnValue(true);
            expect(sut.isAddItemVisible()).toBe(true);
        });

        it('should hide the add item button if the current state is not one that hides it and All Locales is selected', function () {

            spyOn(sut, 'getCurrentState').and.returnValue('insightTabWithLocale.items');
            localeService.isAllLocales.and.returnValue(true);
            expect(sut.isAddItemVisible()).toBe(false);
        });

        it('should show the add item button if the current state is not one that hides it and the insight locale is in setup', function () {

            spyOn(sut, 'getCurrentState').and.returnValue('insightTabWithLocale.items');
            insightLocaleFactory.isInsightLocaleInSetup.and.returnValue(true);
            expect(sut.isAddItemVisible()).toBe(true);
        });

        it('should hide the add item button if the current state is not one that hides it and the insight locale is not in setup', function () {

            spyOn(sut, 'getCurrentState').and.returnValue('insightTabWithLocale.items');
            insightLocaleFactory.isInsightLocaleInSetup.and.returnValue(false);
            expect(sut.isAddItemVisible()).toBe(false);
        });

        it('should show settings tab if the rest of the tabs are not in the current state', function () {
            spyOn(sut, 'getCurrentState').and.returnValue('insightTab.settings');
            expect(sut.isSettingsVisible()).toBe(true);
        });

        it('should not show settings tab if one of the other tabs is selected', function () {
            spyOn(sut, 'getCurrentState').and.returnValue('insightTabWithLocale.items');
            expect(sut.isSettingsVisible()).toBe(false);
        });
    });

    describe('Tab Options / Navigation', function () {

        beforeEach(function () {
            localeService.isAllLocales.and.returnValue(false);
            insightLocaleFactory.isInsightLocaleResults.and.returnValue(false);
            createController({
                localeCode : 'en_US',
                i18nEnabled : true
            });
        });

        it('gets length of tab options', function () {
            expect(sut.tabList.length).toBe(4);
        });


        describe('openTab', function () {

            describe('items', function () {
                beforeEach(function () {
                    sut.openTab(items);
                });

                it('should transition to the items tab on the insight tab', function () {
                    expect($state.go).toHaveBeenCalled();
                    expect($state.go.calls.mostRecent().args[0]).toEqual('insightTabWithLocale.items');
                });
            });

            describe('items with null locale', function () {
                beforeEach(function () {
                    insightDataService.currentInsight = {
                        gameRunLocaleList: [{ locale: null }]
                    };
                    sut.openTab(items);
                });

                it('should transition to the items tab on the insight tab', function () {
                    expect($state.go).toHaveBeenCalled();
                    expect($state.go.calls.mostRecent().args[0]).toEqual('insightTabWithLocale.items');
                });
            });

            describe('survey', function () {
                beforeEach(function () {
                    sut.openTab(survey);
                });

                it('should transition to the survey tab on the insight tab', function () {
                    expect($state.go.calls.mostRecent().args[0]).toEqual('insightTab.survey');
                });
            });

            describe('games', function () {
                beforeEach(function () {
                    sut.openTab(games);
                });

                it('should transition to the games tab on the insight tab', function () {
                    expect($state.go.calls.mostRecent().args[0]).toEqual('insightTab.games');
                });
            });
        });
    });

    describe('Update Insight Watcher', function () {
        createController({
            localeCode : 'en_US',
            i18nEnabled : true
        });

        it('should update the local insight when the updateInsight is emitted', function () {
            $scope.$emit('insightUpdated', {insight : 'test'});

            expect(sut.insight).toEqual({insight : 'test'});
        });
    });

    describe('Select Option', function () {

        describe(' - Print - ', function () {

            beforeEach(function () {
                createController({
                    localeCode : 'en_US'
                });
            });

            it('should call print if the selected menu item is print', function () {

                spyOn(sut, 'print');
                var printIndex = _.findIndex(sut.menuOptions, function (option) {
                    return option.value.toLowerCase() === 'print';
                });
                sut.selectOption(printIndex);

                expect(sut.print).toHaveBeenCalled();
            });
        });

        describe(' - Admin Options Hide - ', function () {
            beforeEach(function () {

                localeService.isAllLocales.and.returnValue(false);
                createController({
                    localeCode : 'en_US'
                });

                spyOn(sut, 'getCurrentState').and.returnValue('insightTabWithLocale.items');

            });

            it('should call hide if the selected menu item is hide', function () {

                spyOn(sut, 'hide');
                var hideIndex = _.findIndex(sut.menuOptions, function (option) {
                    return option.value.toLowerCase() === 'hide';
                });
                sut.selectOption(hideIndex);

                expect(sut.hide).toHaveBeenCalled();
            });
        });

        describe(' - Admin Options Show - ', function () {
            beforeEach(function () {

                localeService.isAllLocales.and.returnValue(false);
                createController({
                    localeCode : 'fr_FR'
                });

                spyOn(sut, 'getCurrentState').and.returnValue('insightTabWithLocale.items');

            });

            it('should call show if the selected menu item is show', function () {

                spyOn(sut, 'show');
                var showIndex = _.findIndex(sut.menuOptions, function (option) {
                    return option.value.toLowerCase() === 'show';
                });
                sut.selectOption(showIndex);

                expect(sut.show).toHaveBeenCalled();
            });
        });

        describe(' - SysAdmin Options Re-Run - ', function () {
            beforeEach(function () {

                localeService.isAllLocales.and.returnValue(false);
                createController({
                    localeCode : 'fr_FR'
                });

                spyOn(sut, 'getCurrentState').and.returnValue('insightTabWithLocale.items');

            });

            it('should call rerun if the selected menu item is rerun', function () {

                spyOn(sut, 'rerun');
                var rerunIndex = _.findIndex(sut.menuOptions, function (option) {
                    return option.value.toLowerCase() === 'rerun';
                });
                sut.selectOption(rerunIndex);

                expect(sut.rerun).toHaveBeenCalled();
            });
        });

        describe(' - Download Comments - ', function () {


            describe(' - All Locales - ', function () {

                beforeEach(function () {

                    localeService.isAllLocales.and.returnValue(true);
                    createController({
                        localeCode : 'all'
                    });

                    spyOn(sut, 'getCurrentState').and.returnValue('insightTabWithLocale.items');

                });

                it('Download comments option should be disabled for all locales', function () {

                    spyOn(sut, 'downloadComments');
                    var downloadCommentsIndex = _.findIndex(sut.menuOptions, function (option) {
                        if (option.value.toLowerCase() === 'downloadcomments') {
                            expect(option.disable).toBe(true);
                        }
                    });
                });
            });

            describe(' - Not All Locales - ', function () {

                beforeEach(function () {

                    localeService.isAllLocales.and.returnValue(false);
                    createController({
                        localeCode : 'all'
                    });

                    spyOn(sut, 'getCurrentState').and.returnValue('insightTabWithLocale.items');

                });

                it('Download comments option should be enabled for specific locales', function () {

                    spyOn(sut, 'downloadComments');
                    var downloadCommentsIndex = _.findIndex(sut.menuOptions, function (option) {
                        if (option.value.toLowerCase() === 'downloadcomments') {
                            expect(option.disable).toBe(false);
                            return true;
                        }
                    });

                    sut.selectOption(downloadCommentsIndex);

                    expect(sut.downloadComments).toHaveBeenCalled();

                });
            });

        });


    });

    describe('New Insight', function () {

        describe('no insight passed', function () {
            beforeEach(function () {
                var tempState = {
                    'go' : jasmine.createSpy('$state go'),
                    current : {
                        data : {
                            insightTab: '',
                            state: 'create'
                        },
                        name : ''
                    }
                };
                createController({
                    localeCode : 'all',
                    i18nEnabled : false,
                    state : tempState,
                    insightData : {}
                });
            });

            it('should keep vm.locales to []', function () {
                expect(sut.locales).toEqual([]);
            });

            it('should set isCreate to true', function () {
                expect(sut.isCreate).toBeTruthy();
            });

            it('should disable the tab', function () {
                expect(sut.isDisabledTab('segments')).toBeTruthy();
            });

            it('should disable the tab', function () {
                expect(sut.isDisabledTab('settings')).toBeFalsy();
            });
        });

    });

    describe('Manage Segments', function () {

        beforeEach(function () {
            localeService.isAllLocales.and.returnValue(false);
        });

        it('should have a Manage Segments option as the last option if the locale is in results status', function () {

            insightLocaleFactory.isInsightLocaleResults.and.returnValue(true);
            createController({
                localeCode : 'en_US'
            });

            $scope.$digest();

            expect(sut.segments[sut.segments.length - 1].gameRunId).toEqual(0);
        });


        it('should not have a Manage Segments option as the last option if the locale is not in results status', function () {

            insightLocaleFactory.isInsightLocaleResults.and.returnValue(false);
            createController({
                localeCode : 'en_US'
            });

            $scope.$digest();

            expect(sut.segments[sut.segments.length - 1].gameRunId).not.toEqual(0);
        });
    });

    describe('enable ptc export', function () {

        beforeEach(function () {
            localeService.isAllLocales.and.returnValue(false);
        });

        it('should set ptcExportLabel.disabled to false.', function () {

            insightLocaleFactory.isInsightLocaleResults.and.returnValue(true);
            createController({
                localeCode : 'en_US'
            });

            $scope.$digest();
            expect(sut.ptcExportLabel.disable).toEqual(true);

            $rootScope.$broadcast('PTC_EXPORT_TOGGLE', true);
            expect(sut.ptcExportLabel.disable).toEqual(false);
            expect(sut.menuOptions).toEqual([]);
            $rootScope.$broadcast('PTC_EXPORT_TOGGLE', true);

            // test that timeout hack will restore the list
            $timeout.flush();
            expect(sut.menuOptions).not.toEqual([]);
        });
    });
});

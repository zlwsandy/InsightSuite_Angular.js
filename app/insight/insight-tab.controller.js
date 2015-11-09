(function () {
    'use strict';

    /* @ngInject */
    function InsightTabController($filter, $state, insight, isAdmin, isSysAdmin, $stateParams, $mdDialog, $translate, $scope,
                                  $rootScope, localeService, insightLocaleFactory, insightTabFactory, insightDataService,
                                  announceService, _, $timeout, $window, FiConstants, gameRunStatusValue, dialogAlertService) {

        var vm = this;

        var allRespondentsSegment = {
            name : $translate.instant('ALL_RESPONDENTS'),
            gameRunName : $translate.instant('ALL_RESPONDENTS')
        };

        var itemsTab = {
            name: 'items',
            state: 'insightTabWithLocale.items',
            svgSrc: 'images/ic_view_list_48px.svg',
            translate: 'SETUP_ITEMS',
            visible : true
        };

        var segmentsTab = {
            name: 'segments',
            state: 'insightTabWithLocale.segments',
            svgSrc: 'images/ic_question_answer_48px.svg',
            translate: 'SETUP_SEGMENTS',
            visible : true
        };

        var settingsTab = {
            name: 'settings',
            state: 'insightTabNoActionbar.settings',
            svgSrc: 'images/ic_question_answer_48px.svg',
            translate: 'SETUP_SETTINGS',
            visible : true
        };

        //var survey = {
        //    name: 'survey',
        //    state: 'insightTab.survey',
        //    svgSrc: 'images/ic_question_answer_48px.svg',
        //    translate: 'SETUP_SURVEY'
        //};

        var gamesTab = {
            name: 'games',
            state: 'insightTab.games',
            svgSrc: 'images/ic_games_48px.svg',
            translate: 'SETUP_GAMES',
            visible : false
        };

        vm.isAdmin = isAdmin;
        vm.isSysAdmin = isSysAdmin;

        vm.locales = [];
        if (!_.isEmpty(insight)) {
            vm.insight = insight;
            vm.locales = insight.gameRunLocaleList;
        }

        vm.segments = insightTabFactory.segments;

        vm.showNoItemsMsg = false;
        vm.showPleaseSelectLocaleMsg = false;
        vm.showProgressLoader = true;
        vm.showNotEnoughInfoSegmentMsg = false;
        vm.showProcessingSegmentMsg = false;

        vm.menuOptions = [];

        vm.tabList = [itemsTab, segmentsTab, settingsTab, gamesTab];

        function getSegmentsByLocale(localeCode) {

            insightDataService.getInsightSegments(vm.insight.insightId, localeCode).then(buildSegmentsOptions)
                .catch(announceService.error);
        }

        function buildSegmentsOptions(segments) {

            var segmentOptions = segments || [];
            segmentOptions.unshift(allRespondentsSegment);

            if (insightLocaleFactory.isInsightLocaleResults(vm.currentLocale)) {
                segmentOptions.push({
                    gameRunId : 0,
                    name : $translate.instant('MANAGE_SEGMENTS'),
                    imageUrl : 'images/ic_settings_24px.svg',
                    groupStart : true
                });
            }
            insightTabFactory.segments = segmentOptions || [];
            vm.segments = insightTabFactory.segments;

            vm.segmentChange(allRespondentsSegment);
        }

        function buildOptionsMenuList() {
            vm.menuOptions.push({
                value : FiConstants.MENU_OPTIONS.PRINT_OPTION_VALUE,
                label : $translate.instant('PRINT')
            });

            vm.downloadCommentsLabel = {
                value : FiConstants.MENU_OPTIONS.DOWNLOAD_COMMENTS_OPTION_VALUE,
                label : $translate.instant('DOWNLOAD_COMMENTS'),
                disable: localeService.isAllLocales(vm.currentLocale)
            };
            vm.menuOptions.push(vm.downloadCommentsLabel);

            vm.ptcExportLabel = {
                value : FiConstants.MENU_OPTIONS.EXPORT_FLEXPLM_OPTION_VALUE,
                label : $translate.instant('EXPORT_FLEXPLM_ITEMS'),
                disable : true
            };
            if (vm.showPtcExport) {
                vm.menuOptions.push(vm.ptcExportLabel);
            }

            if (!localeService.isAllLocales(vm.currentLocale) && !vm.isState(settingsTab)) {


                if (vm.isSysAdmin && vm.currentLocale && gameRunStatusValue.isInResultsGroup(vm.currentLocale)) {
                    vm.menuOptions.push({
                        value: FiConstants.MENU_OPTIONS.RERUN_OPTION_VALUE,
                        label : $translate.instant('RERUN_ANALYTICS')
                    });
                }

                if (vm.isAdmin && vm.currentLocale && gameRunStatusValue.isHidden(vm.currentLocale)) {
                    vm.menuOptions.push({
                        value: FiConstants.MENU_OPTIONS.SHOW_OPTION_VALUE,
                        label : $translate.instant('SHOW_LOCALE')
                    });
                }

                if (vm.isAdmin && vm.currentLocale &&
                    gameRunStatusValue.isInResultsGroup(vm.currentLocale) &&
                    !gameRunStatusValue.isHidden(vm.currentLocale)) {
                    vm.menuOptions.push({
                        value: FiConstants.MENU_OPTIONS.HIDE_OPTION_VALUE,
                        label : $translate.instant('HIDE_LOCALE')
                    });
                }
            }

        }

        /**
         * Converts the longs from the service into readable format for display
         */
        function setInsightDates() {
            // Completed Date
            if (insightLocaleFactory.isInsightLocaleResults(vm.currentLocale)) {
                vm.completedDate = new Date(vm.currentLocale.gameRunCompletedDate);
            } else {
                vm.completedDate = null;
            }
        }

        function setAllRespondentsInfo() {
            allRespondentsSegment.gameRunId = vm.currentLocale ? vm.currentLocale.gameRunId : undefined;
        }

        function init() {

            vm.i18nEnabled = $rootScope.companyData.i18nEnabled;
            vm.showPtcExport = $rootScope.companyData.vendorIntegrationType === 'PTC_FLEXPLM';

            var localeCode = $stateParams.locale;

            vm.currentLocale = insightLocaleFactory.findInsightLocale(localeCode, vm.locales);

            buildOptionsMenuList();

            setAllRespondentsInfo();

            setInsightDates();

            // Default to list
            insightTabFactory.selectedViewType = FiConstants.VIEW_TYPE.LIST;

            if (vm.currentLocale) {

                if (!localeService.isAllLocales(localeCode)) {

                    // Get all the segments for the locale
                    getSegmentsByLocale(localeCode);
                } else {
                    buildSegmentsOptions();
                }
            } else {
                vm.showPleaseSelectLocaleMsg = true;
                vm.showProgressLoader = false;

                // Clear segments list.
                insightTabFactory.segments = [];
            }

            // Listen for any updates to the insight so that the local insight can be updated
            $scope.$on('insightUpdated', function (event, insight) {
                vm.insight = insight;
            });

            $scope.$on('PTC_EXPORT_TOGGLE', function (event, toggle) {
                vm.ptcExportLabel.disable = !toggle;

                // hack to get md-menu-item & ng-disabled to play together
                var orig = vm.menuOptions;
                vm.menuOptions = [];
                if (orig.length > 0) {
                    $timeout(function () {
                        vm.menuOptions = orig;
                    }, 0);
                }
            });

            // get the settings page type, create or edit
            vm.isCreate = $state.current.data.state === 'create';
        }

        vm.openMenu = function ($mdOpenMenu, ev) {
            $mdOpenMenu(ev);
        };

        vm.isDisabledTab = function (tabName) {
            if (vm.isCreate && tabName !== settingsTab.name) {
                return true;
            }

            return false;
        };

        vm.selectOption = function (index) {
            var selectedOption = vm.menuOptions[index];
            if (selectedOption.value.toLowerCase() === FiConstants.MENU_OPTIONS.PRINT_OPTION_VALUE) {
                vm.print();
            } else if (selectedOption.value.toLowerCase() === FiConstants.MENU_OPTIONS.HIDE_OPTION_VALUE) {
                vm.hide();
            } else if (selectedOption.value.toLowerCase() === FiConstants.MENU_OPTIONS.SHOW_OPTION_VALUE) {
                vm.show();
            } else if (selectedOption.value.toLowerCase() === FiConstants.MENU_OPTIONS.RERUN_OPTION_VALUE) {
                vm.rerun();
            } else if (selectedOption.value.toLowerCase() === FiConstants.MENU_OPTIONS.EXPORT_FLEXPLM_OPTION_VALUE) {
                vm.exportFlexPLMItems();
            } else if (selectedOption.value.toLowerCase() === FiConstants.MENU_OPTIONS.DOWNLOAD_COMMENTS_OPTION_VALUE) {
                vm.downloadComments();
            }
        };

        vm.getCurrentState = function () {
            return $state.current.name;
        };

        vm.selectedTab = function () {
            return $state.current.data.insightTab;
        };

        /**
        * checks to see if all elements in the action bar should be disabled or hidden
        * (e.g. locale select, segments, add new item)
        *
        */
        vm.disableAll = function () {
            return $state.current.data.disableActions || false;
        };

        vm.isState = function (view) {
            return vm.getCurrentState() === view.state;
        };

        vm.determineLocale = function () {

            if (vm.currentLocale) {
                return vm.currentLocale.locale;
            }

            var gameRuns = _.cloneDeep(vm.insight.gameRunLocaleList);
            gameRuns = $filter('orderBy')(gameRuns, 'locale');

            var locale = gameRuns[0].locale;
            if (locale === null) {
                locale = 'empty';
            }

            return locale;
        };

        vm.openTab = function (tabOption) {

            var newTabState = tabOption.state;

            tabOption.insightId = vm.insight.insightId;
            tabOption.locale = vm.determineLocale();

            if (newTabState === segmentsTab.state) {
                vm.segmentChange(allRespondentsSegment);
            }

            $state.go(tabOption.state, tabOption, {
                reload : true
            });
        };

        // Event handler for the fi-locale-select directive
        vm.localeChange = function (current) {
            if (vm.currentLocale && angular.isDefined(current)) {

                // Go to the current state with the new locale
                $state.go(vm.getCurrentState(), {
                    insightId: $stateParams.insightId,
                    locale: current.locale
                }, {
                    reload : true
                });
            }
        };

        /**
         * Click handler for adding items to insight
         *
         * @param event
         */
        vm.addItem = function () {
            $mdDialog.show({
                locals: {
                    insightId: $stateParams.insightId,
                    locale: $stateParams.locale,
                    currentLocale: vm.currentLocale
                },
                controller: 'InsightSetupItemsUploadController',
                controllerAs: 'insightSetupItemsUploadController',
                bindToController: true,
                preserveScope: true,
                templateUrl: 'insight/items/insight-items-upload.html'
            });
        };

        vm.getSegments = function () {
            return insightTabFactory.segments;
        };

        vm.getCurrentLocale = function () {
            return insightTabFactory.selectedLocale;
        };

        vm.isLocaleSelectDisabled = function () {
            return vm.disableAll() || vm.locales.length <= 1;
        };

        vm.isSegmentSelectDisabled = function () {
            return vm.disableAll() || vm.isState(segmentsTab) || localeService.isAllLocales(vm.currentLocale);
        };

        vm.isAddItemDisabled = function () {
            return vm.disableAll();
        };

        vm.showToolbar = function () {
            return vm.isLocaleSelectVisible() ||
                    vm.isSegmentSelectVisible() ||
                    vm.isAddItemVisible();
        };

        vm.isLocaleSelectVisible = function () {
            return !vm.isState(settingsTab) &&
                !vm.showPleaseSelectLocaleMsg &&
                vm.i18nEnabled;
        };

        vm.isSegmentSelectVisible = function () {

            return !vm.isState(settingsTab) &&
                (localeService.isAllLocales(vm.currentLocale) || insightLocaleFactory.isInsightLocaleResults(vm.currentLocale));
        };

        vm.isAddItemVisible = function () {
            return !vm.isState(settingsTab) &&
                !vm.isState(segmentsTab) &&
                !vm.isState(gamesTab) &&
                (!localeService.isAllLocales(vm.currentLocale) && insightLocaleFactory.isInsightLocaleInSetup(vm.currentLocale));
        };

        vm.isSettingsVisible = function () {
            return !vm.isState(segmentsTab) &&
                !vm.isState(gamesTab) &&
                !vm.isState(itemsTab);
        };

        vm.isOptionsMenuVisible = function () {
            return vm.isState(itemsTab) &&
                (insightLocaleFactory.isInsightLocaleResults(vm.currentLocale) || localeService.isAllLocales(vm.currentLocale));
        };

        vm.showCompletedDateOnPrint = function () {
            return !localeService.isAllLocales(vm.currentLocale);
        };

        // Event handler for the fi-segment-select directive
        vm.segmentChange = function (currentSegment) {
            insightTabFactory.selectedSegment = currentSegment;
            vm.currentSegment = currentSegment;
        };

        vm.print = function () {

            $window.open($state.href('print.itemSummaryReport', {
                insightId : vm.insight.insightId,
                locale : vm.currentLocale.locale,
                segmentId : localeService.isAllLocales(vm.currentLocale) ? 'all' : vm.currentSegment.gameRunId
            }, {
                absolute: true,
                reload: true
            }), '_blank');
        };

        vm.hide = function () {
            insightDataService.hideLocale(vm.currentLocale.gameRunId)
            .then(function () {
                $state.go($state.current.name, $state.params, { reload: true });
            })
            .catch(announceService.error);
        };

        vm.show = function () {
            insightDataService.showLocale(vm.currentLocale.gameRunId)
            .then(function () {
                $state.go($state.current.name, $state.params, { reload: true });
            })
            .catch(announceService.error);
        };

        vm.rerun = function () {
            insightDataService.rerunAnalytics(vm.currentLocale.gameRunId)
            .then(function () {
                dialogAlertService.show('RERUN_TITLE', 'RERUN_SUCCESS', function () {
                    $state.go('insightsListTab.results');
                });
            })
            .catch(announceService.error);
        };

        vm.exportFlexPLMItems = function () {
            if (!vm.ptcExportLabel.disable) {
                insightDataService.exportFlexPLMItems(vm.currentLocale.gameRunId);
            }
        };

        vm.downloadComments = function () {
            if (!vm.downloadCommentsLabel.disable) {
                // Make sure to request comments for the current segment if one is selected
                var grId = (vm.currentSegment && vm.currentSegment.name === allRespondentsSegment.name) ?
                     vm.currentLocale.gameRunId : vm.currentSegment.gameRunId;
                insightDataService.downloadComments(grId);
            }
        };

        init();
    }

    angular
        .module('fi.insight')
        .controller('InsightTabController', InsightTabController);
}());

(function () {
    'use strict';

    /* @ngInject */
    function InsightsListTabController($scope, $state, company, isAdmin, locales, _, localeSelection, insightListService) {
        var vm = this, ALL_LOCALES_OPTION = 'all';
        vm.company = company;
        vm.isAdmin = isAdmin;
        vm.locales = locales;
        vm.skipWatch = 0;

        var resultsTab = {
            name: 'results',
            state: 'insightsListTab.results',
            translate: 'SUMMARY_RESULTS',
            visible: true
        };

        var progressTab = {
            name: 'progress',
            state: 'insightsListTab.inProgress',
            translate: 'SUMMARY_PROGRESS',
            visible: true
        };

        var previewTab = {
            name: 'preview',
            state: 'insightsListTab.inPreview',
            translate: 'SUMMARY_PREVIEW',
            visible: true
        };

        var setupTab = {
            name: 'setup',
            state: 'insightsListTab.inSetup',
            translate: 'SUMMARY_SETUP',
            visible: true
        };

        vm.tabList = [resultsTab, progressTab, previewTab, setupTab];

        vm.updateStatus = function () {
            return $state.current.data.status;
        };

        vm.selectedTab = function () {
            return $state.current.data.insightsListTab;
        };

        vm.openTab = function (tab) {
            // prevent a double click
            if (tab.name !== vm.selectedTab()) {
                if (vm.searchString !== '') {
                    vm.searchString = '';
                    vm.skipWatch = 1;
                }

                vm.showSearchInput = false;
            }
            return $state.go(tab.state);
        };

        vm.localeChange = function (locale) {
            vm.currentLocale = locale;
            updateLocaleSelection();
        };

        vm.isLocaleSelectVisible = function () {
            return company.i18nEnabled && vm.locales.length > 1;
        };

        vm.searchBtnClick = function () {

            if (vm.searchString) {
                vm.showSearchInput = true;
                vm.dimIcon = true;
            } else {
                vm.showSearchInput = !vm.showSearchInput;
                vm.dimIcon = false;
            }
        };

        vm.addNewInsight = function () {
            $state.go('insightTabNoActionbar.newInsight', { insightId: 0 });
        };

        function updateLocaleSelection() {
            var localeName = vm.currentLocale.locale;
            if (localeName === ALL_LOCALES_OPTION) {
                localeName = undefined;
            }
            localeSelection.locale = localeName;
        }

        function init() {
            // Sort by locale code ascending
            vm.locales = _.sortBy(locales, 'locale');

            // Default to all locales option if internationalization enabled and there is more than one locale
            vm.currentLocale = vm.isLocaleSelectVisible() ? ALL_LOCALES_OPTION : _.first(vm.locales);
            updateLocaleSelection();
        }

        function createListUpdate(fn) {
            return function (newVal, oldVal) {
                // when switching tabs, do not invoke fn because it is assumed new state tab will
                if (vm.skipWatch > 0) {
                    vm.skipWatch--;
                    return;
                }

                if (angular.isUndefined(newVal) && angular.isUndefined(oldVal)) {
                    return;
                }

                fn(newVal);
            };
        }

        // if locale changes then build new insight list
        $scope.$watch(function () {
            return localeSelection.locale;
        }, createListUpdate(insightListService.fetchUpdatedLocaleList));


        // if search string changes then build new insight list
        $scope.$watch(function () {
            return vm.searchString;
        }, createListUpdate(insightListService.fetchUpdatedSearchStringList));

        init();
    }

    angular
        .module('fi.insight')
        .controller('InsightsListTabController', InsightsListTabController);
}());

(function () {
    'use strict';

    /* @ngInject */
    function InsightListService(insightDataService) {
        var vm = this;

        vm.totalInsightsSelected = {value: 0};
        vm.currentStatus = {value: 0};
        vm.insights = {
            data: [],
            busy: false
        };

        vm.totalFetched = 0;
        vm.totalAvailable = undefined;

        vm.requestNumber = 0;
        vm.options = {};

        function getStatus() {
            return vm.options.status;
        }

        function changeStatus(status) {
            vm.options.status = status;
        }

        function getLocale() {
            return vm.options.locale;
        }

        function changeLocale(locale) {
            vm.options.locale = locale === 'all' ? -1 : locale;
        }

        function getSearchStr() {
            return vm.options.nameLike;
        }

        function changeSearchStr(searchStr) {
            vm.options.nameLike = searchStr;
        }

        function reset() {
            vm.insights.data = [];
            vm.insights.busy = false;
            vm.options = {
                status: undefined,
                start: 0,
                limit: 20
            };

            vm.totalAvailable = undefined;
            vm.totalFetched = 0;
        }

        function fetch() {
            var requestNumber;
            if (vm.insights.busy) {
                return;
            }

            if (vm.totalFetched && vm.totalAvailable) {
                // stop fetching, no more to get!
                if (vm.totalFetched >= vm.totalAvailable) {
                    return;
                }

                vm.options.limit = Math.min(vm.totalAvailable - vm.totalFetched, 20);
                vm.options.start = vm.totalFetched;
            }

            vm.requestNumber = requestNumber = vm.requestNumber + 1;
            vm.insights.busy = true;
            return insightDataService
                .getInsights(vm.options)
                .then(function (data) {
                    // apply fetch if it was the last one
                    if (requestNumber === vm.requestNumber) {
                        vm.insights.data.push.apply(vm.insights.data, data);

                        vm.totalAvailable = data.totalAvailable;
                        vm.totalFetched = vm.totalFetched + data.length;
                    }

                    return vm.insights;
                })
                .finally(function () {
                    if (requestNumber === vm.requestNumber) {
                        vm.insights.busy = false;
                    }
                });
        }

        // just happens that fetch can currently be invoked directly for loadMore
        vm.loadMore = fetch;

        vm.fetchNewList = function (status, locale, searchStr) {
            reset();
            changeStatus(status);
            changeLocale(locale);
            changeSearchStr(searchStr);

            return fetch();
        };

        vm.fetchUpdatedSearchStringList = function (searchStr) {
            var status = getStatus();
            var locale = getLocale();

            vm.fetchNewList(status, locale, searchStr);
        };

        vm.fetchUpdatedLocaleList = function (locale) {
            var status = getStatus();
            var searchStr = getSearchStr();

            vm.fetchNewList(status, locale, searchStr);
        };

    }

    angular
        .module('fi.insight')
        .service('insightListService', InsightListService);
}());

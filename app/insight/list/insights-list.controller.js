(function () {
    'use strict';

    /* @ngInject */
    function InsightsListController(company, isAdmin, insights, insightListService, insightDataService, $scope, $state, localeSelection,
                        announceService, gameRunStatusValue, $window, _, FiConstants) {

        var vm = this;
        vm.company = company;
        vm.isAdmin = isAdmin;
        vm.status = $state.current.data.status;
        vm.currentLocale = localeSelection.locale;
        vm.insights = insights;

        vm.showResults = function () {
            return gameRunStatusValue.isSummaryResults(vm.status);
        };

        // Check to see if user is an admin, it's a StyleOpt insight, and it's in Results or Hidden status
        vm.isStyleOptResults = function (insight) {
            return isAdmin && insight.gameType === FiConstants.GAME_TYPE.STYLE_OPT &&
                (gameRunStatusValue.hasResults(insight) || gameRunStatusValue.isHidden(insight));
        };

        vm.navigateToInsight = function (evt, currentInsight) {
            if (evt && evt.target && !evt.target.classList.contains('action-button')) {
                insightDataService.currentInsight = angular.copy(currentInsight);

                if (vm.isStyleOptResults(currentInsight)) {
                    $window.location.href = '/secure/results!list.fi?id=' + currentInsight.insightId;
                } else {
                    $state.go('insightTabWithLocale.items', {
                        insightId: currentInsight.insightId,
                        locale: _.isNull(currentInsight.locale) ? 'empty' : currentInsight.locale
                    });
                }
            }
        };

        vm.load = insightListService.loadMore;


        $scope.$watch(function () {
            return localeSelection.locale;
        }, function (newLocale, oldLocale) {
            if (newLocale !== oldLocale) {
                vm.currentLocale = newLocale;
            }
        });

        function removeInsight(ev, insight) {
            for (var i = 0; i < vm.insights.data.length; i++) {
                if (vm.insights.data[i].gameRunId === insight.gameRunId) {
                    vm.insights.data.splice(i, 1);
                }
            }
        }

        $scope.$on('removeInsight', removeInsight);
    }

    angular
        .module('fi.insight')
        .controller('InsightsListController', InsightsListController);
}());

(function () {
    'use strict';

    function insightListCard() {
        return {
            restrict: 'E',
            controller: InsightListCardController,
            controllerAs: 'InsightListCardController',
            bindToController: true,
            templateUrl: 'insight/list/insight-list-card.directive.html',
            scope: {
                insight: '='
            }
        };
    }
    /* @ngInject */
    function InsightListCardController(gameRunStatusValue, FiConstants, insightItemsMoveToPreviewDialog, _) {
        var vm = this;

        vm.gameRunStatusValue = gameRunStatusValue;

        vm.isStyleOpt = function (insight) {
            return insight.gameType === FiConstants.GAME_TYPE.STYLE_OPT;
        };

        vm.moveToPreview = insightItemsMoveToPreviewDialog.show;

        vm.showLanguageCurrency = function () {
            return (!vm.isStyleOpt(vm.insight) && !(_.isUndefined(vm.insight.language) || _.isUndefined(vm.insight.currency)));
        };

        function init() {
            var complete = vm.insight.completionPercentage;

            if (angular.isNumber(complete)) {
                if (complete <= 105) {
                    complete = complete.toFixed(0);
                } else {
                    complete = (complete / 100).toFixed(1);
                }
                vm.insight.completionPercentageStr = complete;
            }
        }

        init();
    }

    angular
        .module('fi.insight')
        .directive('insightListCard', insightListCard);

})();

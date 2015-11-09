/**
 * @name InsightSetupItem
 * @restrict E
 * @module fi.insight
 *
 * @description Displays an insight setup item.  Intended to be used as an item in a list.
 *
 * @param {item=} item : the insight item to display
 * @param {locale=} locale : the locale for the insight item
 * @param {currency@} currency : string currency code for display
 *
 *
 * @usage
 *   <insight-setup-item
 *      item="someController.item"
 *      locale="someController.locale"
 *      currency="{{someController.currency}}">
 *   <insight-setup-item>
 */
(function () {
    'use strict';

    function InsightSetupItem() {
        return {
            restrict: 'E',
            templateUrl: 'insight/items/insight-setup-item.directive.html',
            controller: InsightSetupItemController,
            controllerAs: 'InsightSetupItemController',
            bindToController: true,
            scope: {
                item: '=',
                locale: '=',
                currency: '@'
            }
        };
    }
    /* @ngInject */
    function InsightSetupItemController($translate, $scope, $state) {
        var vm = this;

        /**
         * Navigates to view/edit the details of an item
         */
        vm.selectItem = function () {
            $state.go('insightTabWithLocale.itemEdit', {
                gameRunId : vm.locale.gameRunId,
                itemId : vm.item.itemId
            });
        };

    }

    angular
        .module('fi.insight')
        .directive('insightSetupItem', InsightSetupItem);

}());

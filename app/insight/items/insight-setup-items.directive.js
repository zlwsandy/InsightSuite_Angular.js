/**
 * @name InsightSetupItems
 * @restrict E
 * @module fi.insight
 *
 * @description Container component.  It Displays a list of insight setup items for a locale.
 *
 * @param {items=} items : an array of items to display in the list
 * @param {insight=} insight: the insight which these items belong to
 * @param {currentLocale=} currentLocale : the currently selected locale
 * @param {insight=} insight: the insight which these items belong to
 * @param {showNoItemsMsg=} showNoItemsMsg : a boolean indicating whether to show the No Items message
 * @param {showPleaseSelectLocaleMsg=} showPleaseSelectLocaleMsg : a boolean indicating whether to show the Select a Locale message
 *
 *
 * @usage
 *   <insight-setup-items
 *      items="someController.items"
 *      insight="insightItemsController.insight"
 *      current-locale="someController.currentLocale"
 *      show-no-items-msg="someController.showNoItemsMsg"
 *      show-please-select-locale-msg="someController.showPleaseSelectLocaleMsg">
 *   </insight-setup-items>
 */
(function () {
    'use strict';

    /* @ngInject */
    function InsightSetupItems() {
        return {
            restrict: 'E',
            templateUrl : 'insight/items/insight-setup-items.directive.html',
            controller: InsightSetupItemsController,
            controllerAs: 'InsightSetupItemsController',
            bindToController: true,
            scope: {
                items: '=',
                insight: '=',
                currentLocale: '=',
                showNoItemsMsg: '=',
                showPleaseSelectLocaleMsg: '='
            }
        };
    }
    /* @ngInject */
    function InsightSetupItemsController() {

    }

    angular
        .module('fi.insight')
        .directive('insightSetupItems', InsightSetupItems);
}());

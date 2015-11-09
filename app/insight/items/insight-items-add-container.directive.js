/**
 * @name InsightItemAddContainer
 * @restrict E
 * @module fi.insight
 *
 * @description Container component.  It displays a notification row indicating the number of items added.
 * It provides an action to dismiss the notification (remove it), resulting in an event notifying the dismissal and the items.
 * It provides an action to expand and display the list of items, with the dismiss action provided for each individual item.
 *
 * @param {items=} items : an array of items to display in the list
 * @param {currency@} currency : the currency for the items that will be displayed (children)
 * @param {primaryMessage@} primary-message : the notification message to display
 * @param {highlightColor@} highlight-color : a css class name to use for the background color of this container and its items
 * @param {textColor@} text-color : a css class name to use for the text color of the message
 * @param {addCallback@} on-add : the method to call when an item is to be added to the insight locale
 * @param {dismissCallback@} on-dismiss : the method to call when an individual item notification is to be dismissed
 * @param {dismissAllCallback@} on-dismiss-all : the method to call when all items are to be dismissed
 *
 *
 * @usage
 *   <insight-item-add-container
 *      items="someController.items"
 *      currency="{{someController.currency}}"
 *      primary-message="{{someController.primaryMessage}}"
 *      highlight-color="highlightColor"
 *      text-color="textColor"
 *      on-add="someController.add()"
 *      on-dismiss="someController.dismiss('listPropertyName', item)"
 *      on-dismiss-all="someController.dismissAll('listPropertyName')">
 *   </insight-item-add-container>
 *
 */
(function () {
    'use strict';

    function InsightItemsAddContainer() {
        return {
            restrict: 'E',
            templateUrl: 'insight/items/insight-items-add-container.directive.html',
            controller: InsightItemsAddContainerController,
            controllerAs: 'InsightItemsAddContainerController',
            bindToController: true,
            scope: {
                items: '=',
                currency: '@',
                primaryMessage: '@',
                highlightColor: '@',
                textColor: '@',
                showAdd: '@',
                addCallback: '&onAdd',
                addAllCallback: '&onAddAll',
                dismissCallback: '&onDismiss',
                dismissAllCallback: '&onDismissAll'
            }
        };

    }

    /* @ngInject */
    function InsightItemsAddContainerController() {
        var vm = this;

        vm.collapsed = true;

        /**
         * Dismiss an individual item notification.
         * This is passing through from the list item that this container is displaying.
         *
         * @param item
         */
        vm.dismiss = function (item) {
            vm.dismissCallback({item : item});
        };

        /**
         * Add an item
         * This is passing through from the list item that this container is displaying.
         *
         * @param item
         */
        vm.add = function (item) {
            vm.addCallback({item : item});
        };

        /**
         * Update all items in this conntainer
         */
        vm.addAll = function () {
            vm.addAllCallback();
        };

        /**
         * Dismiss notifications for all items in this container
         */
        vm.dismissAll = function () {
            vm.dismissAllCallback();
        };

    }

    angular
        .module('fi.insight')
        .directive('insightItemsAddContainer', InsightItemsAddContainer);

}());

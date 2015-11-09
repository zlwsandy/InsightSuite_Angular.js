/**
 * @name InsightItemAdd
 * @restrict E
 * @module fi.insight
 *
 * @description Displays an insight item notification with actions.  Intended to be used as an item in a list.
 *
 * @param {item=} item : the insight item to display
 * @param {currency@} currency code : string currency code to display
 * @param {dismissCallback&} on-dismiss : the callback function to execute when the dismiss button is clicked
 * @param {addItemCallback&} on-add : the callback function to execute when the add button is clicked
 *
 * @usage
 *      <insight-item-add
 *          item="someController.item"
 *          currency="{{someController.currency}}"
 *          on-dismiss="someController.handleDismiss(paramName)"
 *          on-add="someController.handleAdd(paramName)">
 *      </insight-item-add>
 *
 */
(function () {
    'use strict';

    function InsightItemAdd() {
        return {
            restrict: 'E',
            templateUrl: 'insight/items/insight-item-add.directive.html',
            controller: InsightItemAddController,
            controllerAs: 'InsightItemAddController',
            bindToController: true,
            replace: true,
            scope: {
                item: '=',
                currency: '@',
                showAdd: '@',
                dismissCallback: '&onDismiss',
                addCallback: '&onAdd'
            }
        };
    }

    /* @ngInject */
    function InsightItemAddController($translate, _) {
        var vm = this;

        vm.itemImage = {};

        if (vm.item.itemImages.length > 0) {
            // every item should have a primary image set after running through item transformer.  just adding the or condition for safety.
            vm.item.displayImage = _.find(vm.item.itemImages, 'primary') || vm.item.itemImages[0];
        } else {
            vm.item.displayImage = { thumbnailUrl: 'images/noimages-item.png' };
            $translate('NO_IMAGE').then(function (noImage) {
                vm.item.displayImage.name = noImage;
            });
        }

        vm.dismiss = function () {
            vm.dismissCallback({item : vm.item});
        };

        vm.add = function () {
            vm.addCallback({item : vm.item});
        };
    }

    angular
        .module('fi.insight')
        .directive('insightItemAdd', InsightItemAdd);

}());

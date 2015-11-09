/**
 * @name        FiPriceControl
 * @restrict    EA
 * @module      fi.insight
 *
 * @description
 *
 * @param {string}  label   : label for price control
 * @param {string}  name    : name for the forms input
 * @param {int}     min     : minimum number to have in control
 * @param {int}     max     : maximum number to have in control
 * @param {int}     ngModel : number being passed to and from calling controller
 * @param {bool}    enabled : enable the control
 *
 * @usage
 *      <fi-price-control label="{{'LABEL' | translate}}" name="ctrl.name" min="ctrl.min" max="ctrl.max" ng-model="ctrl.model" enabled="true"></fi-price-control>
 */
(function () {
    'use strict';

    function FiPriceControlController() {
        var vm = this;

        vm.error = null;

        if (vm.localModel === undefined) {
            vm.localModel = 0;
        }

        vm.getMax = function (maxVal) {
            return isNaN(maxVal) ? 99 : parseInt(maxVal, 10);
        };

        vm.maxDisabled = function () {
            return !vm.enabled ? true : vm.localModel >= vm.getMax(vm.max);
        };

        vm.getMin = function (minVal) {
            if (isNaN(minVal)) {
                return 0;
            } else {
                minVal = parseInt(minVal, 10);
                return minVal === 0 ? 0 : minVal;
            }
        };

        vm.minDisabled = function () {
            return !vm.enabled ? true : vm.localModel <= vm.getMin(vm.min);
        };
    }

    function FiPriceControlLink(scope, elems, attrs, ngModelCtrl) {
        var fiPriceControlController = scope.fiPriceControlController;

        scope.increment = function () {
            fiPriceControlController.localModel++;
            ngModelCtrl.$setViewValue(fiPriceControlController.localModel);
        };

        scope.decrement = function () {
            fiPriceControlController.localModel--;
            ngModelCtrl.$setViewValue(fiPriceControlController.localModel);
        };

        function resetValidation() {
            fiPriceControlController.localModel = parseInt(fiPriceControlController.localModel, 10);
            fiPriceControlController.error = null;
            ngModelCtrl.$setValidity('error-whole-number', true);
            ngModelCtrl.$setValidity('error-greater-than-100', true);
            ngModelCtrl.$setValidity('error-clearance-greater-than-markdowns', true);
            ngModelCtrl.$setValidity('error-greater-than-prev-markdown', true);
            ngModelCtrl.$setValidity('error-less-than-next-markdown', true);
        }

        /**
         * Checks the validity of each price control element
         * when either the max, min, or model change.
         */
        function checkValidity() {
            if (!fiPriceControlController.enabled) {
                resetValidation();
                return;
            }

            var regex = new RegExp(/^\d+$/);
            var minVal = fiPriceControlController.getMin(fiPriceControlController.min),
                maxVal = fiPriceControlController.getMax(fiPriceControlController.max);

            // check if its numeric and integer
            if (!regex.test(fiPriceControlController.localModel)) {

                fiPriceControlController.error = 'ERROR_WHOLE_NUMBER';
                ngModelCtrl.$setValidity('error-whole-number', false);

            } else if (fiPriceControlController.localModel >= 100) {

                fiPriceControlController.localModel = parseInt(fiPriceControlController.localModel, 10);

                fiPriceControlController.error = 'ERROR_GREATER_THAN_100';
                ngModelCtrl.$setValidity('error-greater-than-100', false);

            } else if (fiPriceControlController.localModel > maxVal) {

                fiPriceControlController.localModel = parseInt(fiPriceControlController.localModel, 10);

                if (fiPriceControlController.label === 'Clearance') {

                    fiPriceControlController.error = 'ERROR_CLEARANCE_GREATER_THEN_ALL_MARKDOWNS';
                    ngModelCtrl.$setValidity('error-clearance-greater-than-markdowns', false);

                } else {

                    fiPriceControlController.error = 'ERROR_GREATER_THAN_PREV_MARKDOWN';
                    ngModelCtrl.$setValidity('error-greater-than-prev-markdown', false);

                }

            } else if (fiPriceControlController.localModel < minVal) {

                fiPriceControlController.localModel = parseInt(fiPriceControlController.localModel, 10);

                fiPriceControlController.error = 'ERROR_LESS_THAN_NEXT_MARKDOWN';
                ngModelCtrl.$setValidity('error-less-than-next-markdown', false);

            } else {
                resetValidation();
            }
        }

        var WATCHERS = ['fiPriceControlController.localModel',
                        'fiPriceControlController.min',
                        'fiPriceControlController.max'];

        scope.$watchGroup(WATCHERS, checkValidity);
    }

    /* @ngInject */
    function FiPriceControl() {
        return {
            restrict: 'EA',
            require: 'ngModel',
            scope: {
                label: '@',
                name: '@',
                min: '=',
                max: '=',
                localModel: '=ngModel',
                enabled: '='
            },
            templateUrl: 'insight/settings/fi-price-control.directive.html',
            controller: FiPriceControlController,
            controllerAs: 'fiPriceControlController',
            bindToController: true,
            link: FiPriceControlLink
        };
    }

    angular
        .module('fi.insight')
        .directive('fiPriceControl', FiPriceControl);
}());

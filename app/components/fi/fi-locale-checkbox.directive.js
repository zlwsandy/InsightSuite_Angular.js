/**
 * @name        FiLocaleCheckbox
 * @restrict    EA
 * @module      fi.common
 *
 * @description Outputs a custom checkbox with locale flag.
 *
 * @param {object} locale : locale object.
 *
 * @usage
 *      <fi-locale-checkbox locale="exampleController.locale"></fi-locale-checkbox>
 */
(function () {
    'use strict';

    function FiLocaleCheckboxController() {
    }

    /* @ngInject */
    function FiLocaleCheckbox() {
        return {
            restrict: 'EA',
            scope: {
                locale: '='
            },
            templateUrl: 'components/fi/fi-locale-checkbox.directive.html',
            controller: FiLocaleCheckboxController,
            controllerAs: 'fiLocaleCheckboxController',
            bindToController: true
        };
    }

    angular
        .module('fi.common')
        .directive('fiLocaleCheckbox', FiLocaleCheckbox);
}());

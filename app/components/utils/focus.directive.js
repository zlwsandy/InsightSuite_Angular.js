/**
 * @name        Focus
 * @restrict    A
 * @module      fi.common
 *
 * @description Focus the element
 *
 * @param {boolean} focus : if true focus the element that this attribute is on
 *
 * @usage
 *      <input type="text" focus="true"/>
 */
(function () {
    'use strict';

    function linkFunction(scope, element) {
        scope.$watch('focus', function (value) {
            if (value) {
                element[0].focus();
            }
        });
    }

    /* @ngInject */
    function Focus() {
        return {
            restrict: 'A',
            scope: {
                focus: '='
            },
            link: linkFunction
        };
    }

    angular
        .module('fi.common')
        .directive('focus', Focus);
}());

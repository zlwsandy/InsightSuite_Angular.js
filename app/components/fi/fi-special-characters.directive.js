(function () {
    'use strict';

    /* @ngInject */
    function FiSpecialCharacters() {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$validators['fi-special-characters'] = function (modelValue, viewValue) {
                    return angular.isUndefined(viewValue) || viewValue.length === 0 || /[<>;]/.test(viewValue) === false;
                };
            }
        };
    }

    angular
        .module('fi.common')
        .directive('fiSpecialCharacters', FiSpecialCharacters);
}());

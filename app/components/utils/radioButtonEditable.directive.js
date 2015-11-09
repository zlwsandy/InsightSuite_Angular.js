(function () {
    'use strict';

    /* ngInject */
    function radioButtonEditable() {
        var directive = {
            restrict: 'EA',
            required: '^ngModel',
            scope: {
                value: '=ngModel',
                editableIndex: '=',
                index: '='
            },
            transclude: true,
            templateUrl: 'components/utils/radioButtonEditable.directive.html'
        };

        return directive;
    }

    angular
        .module('fi.common')
        .directive('radioButtonEditable', radioButtonEditable);
}());

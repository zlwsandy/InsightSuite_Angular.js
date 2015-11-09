(function () {
    'use strict';

    /* ngInject */
    function textboxEditable() {
        var directive = {
            restrict: 'EA',
            required: '^ngModel',
            scope: {
                value: '=ngModel',
                editableIndex: '=',
                index: '='
            },
            transclude: true,
            templateUrl: 'components/utils/textboxEditable.directive.html'
        };

        return directive;
    }

    angular
        .module('fi.common')
        .directive('textboxEditable', textboxEditable);
}());

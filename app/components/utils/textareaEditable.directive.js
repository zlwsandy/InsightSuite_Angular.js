(function () {
    'use strict';

    /* ngInject */
    function textareaEditable() {
        var directive = {
            restrict: 'EA',
            required: '^ngModel',
            scope: {
                value: '=ngModel',
                editableIndex: '=',
                index: '='
            },
            transclude: true,
            templateUrl: 'components/utils/textareaEditable.directive.html'
        };

        return directive;
    }

    angular
        .module('fi.common')
        .directive('textareaEditable', textareaEditable);
}());

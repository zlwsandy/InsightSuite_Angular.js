(function () {
    'use strict';

    /* @ngInject */
    function fiIntegerValidator() {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$validators['fi-integer-validator'] = function (modelValue, viewValue) {

                    var INTEGER_REGEXP = /^\-?\d+$/;

                    if (ctrl.$isEmpty(modelValue)) {
                        // consider empty models to be valid
                        return true;
                    }

                    if (INTEGER_REGEXP.test(viewValue.trim())) {
                        // it is valid
                        return true;
                    }

                    // it is invalid
                    return false;
                };
            }
        };
    }

    angular
        .module('fi.common')
        .directive('fiIntegerValidator', fiIntegerValidator);

}());

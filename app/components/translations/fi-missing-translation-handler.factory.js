(function () {
    'use strict';

    /* @ngInject */
    function FiMissingTranslationHandler() {
        return function () {
            return 'NO_LABEL';
        };
    }

    angular.module('fi.common').factory('fiMissingTranslationHandler', FiMissingTranslationHandler);
})();

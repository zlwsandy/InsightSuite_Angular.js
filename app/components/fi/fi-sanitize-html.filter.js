(function () {
    'use strict';

    /* @ngInject */
    function sanitizeHTML($sce) {
        return function (htmlCode) {
            return $sce.trustAsHtml(htmlCode);
        };
    }

    angular
        .module('fi.common')
        .filter('sanitizeHTML', sanitizeHTML);
}());

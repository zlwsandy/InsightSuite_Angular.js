(function () {
    'use strict';

    /* @ngInject */
    function fiLocaleController($scope) {
        $scope.isDefault = $scope.locale === 'default';
    }

    function fiLocale() {

        return {
            restrict: 'E',
            template: '<span>{{isDefault ? (\'ALL_LOCALES\' | translate) : locale}}</span>',
            controller: fiLocaleController,
            scope: {
                locale: '@'
            }
        };
    }

    angular
        .module('fi.common')
        .directive('fiLocale', fiLocale);
}());

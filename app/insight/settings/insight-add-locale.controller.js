(function () {
    'use strict';

    /* @ngInject */
    function InsightAddLocaleController($scope, $filter, $mdDialog, insightLocales, unavailableLocales, localeService, companyService, _) {
        var vm = this;

        vm.addBtnDisabled = true;
        vm.showProgressLoader = true;

        companyService.getLocaleList().then(function (localeList) {
            vm.locales = $filter('orderBy')(localeList, 'language');

            vm.localesArray = _.filter(vm.locales, function (locale) {
                if ((!_.isUndefined(unavailableLocales) && unavailableLocales && unavailableLocales.length === 0) || !_.includes(locale.locale, unavailableLocales)) {
                    locale.selected = false;
                    locale.disabled = _.includes(insightLocales, locale.locale);
                    locale.language = localeService.getLanguage(locale.locale);
                    locale.flagImageUrl = localeService.getFlagImageUrl(locale.locale);
                    return locale;
                }
            });

            vm.showProgressLoader = false;
            vm.originalLocalesArray = angular.copy(vm.localesArray);
        });

        $scope.$watch('insightAddLocaleController.localesArray', function () {
            if (!_.every(vm.localesArray, {'selected': false})) {
                vm.addBtnDisabled = false;
            } else {
                vm.addBtnDisabled = true;
            }
        }, true);

        vm.close = function () {
            $mdDialog.cancel();
        };

        vm.add = function () {
            vm.localesSelected = _.filter(vm.localesArray, {'selected': true});

            $mdDialog.hide(vm.localesSelected);
        };
    }

    angular
        .module('fi.insight')
        .controller('InsightAddLocaleController', InsightAddLocaleController);
}());

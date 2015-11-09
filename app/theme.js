(function () {
    'use strict';

    var app = angular.module('fi.wave');


    //Configuration for custom Theme
    app.config(/* @ngInject */ function ($mdThemingProvider) {

        var fiBlue = $mdThemingProvider.extendPalette('blue', {
            '800': '003399'
        });

        var fiGrey = $mdThemingProvider.extendPalette('grey', {
            '500': 'CCCCCC',
            '700': '333333'
        });

        var fiOrange = $mdThemingProvider.extendPalette('orange', {
            '500': 'FF9100',
            '800': 'FF6600'
        });

        $mdThemingProvider.definePalette('fiBlue', fiBlue);
        $mdThemingProvider.definePalette('fiGrey', fiGrey);
        $mdThemingProvider.definePalette('fiOrange', fiOrange);

        $mdThemingProvider.theme('default')
            .primaryPalette('fiBlue')
            .accentPalette('fiOrange', {
                'hue-3': 'A100'
            })
            .backgroundPalette('fiGrey');

        $mdThemingProvider.theme('altTheme')
            .primaryPalette('fiGrey')
            .accentPalette('fiOrange')
            .backgroundPalette('fiGrey', {
                'default': '200'
            });

        $mdThemingProvider.theme('tabsTheme')
            .primaryPalette('fiGrey', {
                'default': '900'
            })
            .accentPalette('fiOrange');

        $mdThemingProvider.theme('dialogTheme')
            .primaryPalette('fiGrey', {
                'default': '700'
            })
            .accentPalette('fiOrange')
            .backgroundPalette('fiGrey');
    });

}());

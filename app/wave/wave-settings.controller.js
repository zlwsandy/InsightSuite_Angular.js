(function () {
    'use strict';

    /* @ngInject */
    function WaveSettingsController(waveService, announceService, $mdDialog) {
        var vm = this;
        var wave;

        function init() {
            vm.waveCopyLinkLocaleList = [];
            var newWave = waveService.getCurrentWave();

            waveService
                .getWave(newWave.waveId)
                .then(function (result) {
                    var data = result.data;
                    if (data.status) {
                        wave = data.data;
                        var waveLocales = wave.locales.slice(0);
                        waveLocales.sort();

                        var localeList = [vm.createLocaleInfo()];
                        for (var i = 0; i < waveLocales.length; i++) {
                            localeList.push(vm.createLocaleInfo(waveLocales[i]));
                        }
                        vm.waveCopyLinkLocaleList = localeList;
                    } else {
                        announceService.error('WAVE_LOAD_FAILURE');
                    }
                })
                .catch(function () {
                    announceService.error('WAVE_LOAD_FAILURE');
                });
        }

        this.createLocaleInfo = function (locale) {
            var isLocale = locale !== undefined;
            var linkType;

            if (!isLocale) {
                locale = 'default';
                linkType = 'choose';
            }

            return {
                name: locale,
                isLocale: isLocale,
                linkType: linkType
            };
        };

        this.waveUrl = function (localeInfo) {
            var result;

            var linkType = localeInfo.linkType;
            if (linkType === 'choose') {
                result = waveService.waveFullUrlSelectLocale(wave);
            } else if (linkType === 'localeOnly') {
                result = waveService.waveFullUrlForLocale(wave, localeInfo.name);
            } else if (linkType === 'localeWithChoice') {
                result = waveService.waveFullUrlForLocale(wave, localeInfo.name, true);
            }

            return result;
        };

        this.announce = function () {
            announceService.info('URL_COPIED', {
                waveName: wave.name
            });
        };

        this.close = function () {
            $mdDialog.cancel();
        };

        init();
    }

    angular
        .module('fi.wave')
        .controller('WaveSettingsController', WaveSettingsController);
}());

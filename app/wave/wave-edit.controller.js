(function () {
    'use strict';

    /* @ngInject */
    function WaveEditController(waveService, announceService, $mdDialog, $anchorScroll, $translate) {
        var vm = this;

        function findIndexByWave(waves, wave) {
            var index, i;

            for (i = 0; i < waves.length; i += 1) {
                if (wave.waveId === waves[i].waveId) {
                    index = i;
                    break;
                }
            }
            return index;
        }

        function showAdvanced(ev, wave, waves) {
            $anchorScroll();
            waveService.setCurrentWave(wave);
            $mdDialog.show({
                    controller: 'WaveEditDialogController',
                    templateUrl: 'wave/wave-edit.html',
                    targetEvent: ev
                })
                .then(function (updatedWave) {
                    var index = findIndexByWave(waves, updatedWave);

                    waves[index] = updatedWave;
                });
        }

        function showSettings(ev, wave) {
            $anchorScroll();
            waveService.setCurrentWave(wave);
            $mdDialog.show({
                templateUrl: 'wave/wave-settings.html',
                targetEvent: ev
            });
        }

        function showCannotDeleteDialog(ev, wave) {
            var titleLabel = $translate.instant('DELETE_WAVE_WARNING_TITLE');
            var contentLabel = $translate.instant('DELETE_WAVE_WARNING_CONTENT', { waveName: wave.name });
            var okButtonLabel = $translate.instant('DELETE_WAVE_WARNING_BUTTON');

            $anchorScroll();

            $mdDialog.show(
                $mdDialog.alert()
                .title(titleLabel)
                .content(contentLabel)
                .ariaLabel(contentLabel)
                .ok(okButtonLabel)
                .targetEvent(ev)
            );
        }

        function showDeleteConfirmDialog(ev, wave) {
            var titleLabel = $translate.instant('DELETE_WAVE_CONFIRM_TITLE');
            var contentLabel = $translate.instant('DELETE_WAVE_CONFIRM_CONTENT', { waveName: wave.name });
            var okButtonLabel = $translate.instant('DELETE_WAVE_CONFIRM_BUTTON');
            var cancelButtonLabel = $translate.instant('CANCEL');

            $anchorScroll();

            var confirm = $mdDialog.confirm()
            .title(titleLabel)
            .content(contentLabel)
            .ariaLabel(contentLabel)
            .ok(okButtonLabel)
            .cancel(cancelButtonLabel)
            .targetEvent(ev);

            $mdDialog.show(confirm).then(function () {
                deleteWave(wave);
            });
        }

        function deleteWave(wave) {
            waveService
            .deleteWave(wave)
            .then(function () {
                announceService.info('WAVE_DELETE_SUCCESS', {
                    waveName: wave.name
                });
            })
            .catch(announceService.error);
        }

        function showDeleteDialog(ev, wave) {
            if (wave.canBeDeleted) {
                showDeleteConfirmDialog(ev, wave);
            } else {
                showCannotDeleteDialog(ev, wave);
            }
        }

        vm.showAdvanced = showAdvanced;
        vm.showSettings = showSettings;
        vm.showDeleteDialog = showDeleteDialog;
        vm.deleteWave = deleteWave;
    }

    angular
        .module('fi.wave')
        .controller('WaveEditController', WaveEditController);
}());

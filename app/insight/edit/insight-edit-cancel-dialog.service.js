(function () {
    'use strict';

    /* @ngInject */
    function InsightEditCancelDialogService($mdDialog, $translate) {
        var vm, CANCEL, INSIGHT_EDIT_CANCEL_DIALOG_TITLE, DISCARD_CHANGES, STAY_ON_PAGE, text;

        function showDialog(evt, translations) {
            var dialog = $mdDialog
                .confirm()
                .title(translations[CANCEL])
                .content(translations[INSIGHT_EDIT_CANCEL_DIALOG_TITLE])
                .ok(translations[DISCARD_CHANGES])
                .cancel(translations[STAY_ON_PAGE]);

            return $mdDialog.show(dialog);
        }

        vm = this;
        CANCEL = 'CANCEL';
        INSIGHT_EDIT_CANCEL_DIALOG_TITLE = 'DISCARD_CHANGES_MESSAGE';
        DISCARD_CHANGES = 'DISCARD_CHANGES';
        STAY_ON_PAGE = 'STAY_ON_PAGE';
        text = [
            CANCEL,
            INSIGHT_EDIT_CANCEL_DIALOG_TITLE,
            DISCARD_CHANGES,
            STAY_ON_PAGE
        ];
        vm.show = function (evt) {
            return $translate(text).then(function (translations) {
                return showDialog(evt, translations);
            });
        };
    }

    angular
        .module('fi.insight')
        .service('insightEditCancelDialogService', InsightEditCancelDialogService);
}());

(function () {
    'use strict';

    /* @ngInject */
    function InsightItemsMoveToPreviewDialog(_, announceService, fiService, companyService, insightDataService, $mdDialog, $translate, $rootScope) {
        var vm, MOVE_TO_PREVIEW_MESSAGE, ERROR_NOT_ENOUGH_REFERENCE_ITEMS, YES, NO;

        function buildInterpolateParams(insight) {
            return companyService
                .getCompany(fiService.companyId(), true)
                .then(function (company) {
                    return {
                        insightName: insight.name,
                        gameRunId: insight.gameRunId,
                        il8n: company.i18nEnabled,
                        insightLocale: insight.locale
                    };
                });
        }

        function showDialog(evt, translations, title) {
            var dialog = $mdDialog
                .confirm()
                .title(translations[title])
                .ok(translations[YES])
                .cancel(translations[NO])
                .targetEvent(evt);
            return $mdDialog.show(dialog);
        }

        function moveToPreview(insight, ignoreRefItemsCheck) {
            return insightDataService.moveToPreview(insight.gameRunId, ignoreRefItemsCheck);
        }

        function removeInsight(insight) {
            $rootScope.$broadcast('removeInsight', insight);
        }

        vm = this;
        MOVE_TO_PREVIEW_MESSAGE = 'MOVE_TO_PREVIEW_MESSAGE';
        ERROR_NOT_ENOUGH_REFERENCE_ITEMS = 'ERROR_NOT_ENOUGH_REFERENCE_ITEMS';
        YES = 'YES';
        NO = 'NO';
        vm.show = function (evt, insight, message, ignoreRefItemsCheck) {

            return buildInterpolateParams(insight)
                .then(function (interpolateParams) {

                    message = (_.isUndefined(message)) ? MOVE_TO_PREVIEW_MESSAGE : ERROR_NOT_ENOUGH_REFERENCE_ITEMS;
                    ignoreRefItemsCheck = (_.isUndefined(ignoreRefItemsCheck)) ? false : ignoreRefItemsCheck;

                    return $translate([message, YES, NO], interpolateParams)
                        .then(function (translations) {

                            // Move to Review is a part of the showDialog promise chain, so anything that acts on the
                            //  response of moveToReview must be dependent on that promise, not the outer showDialog
                            //  promise
                            showDialog(evt, translations, message).then(function () {

                                moveToPreview(insight, ignoreRefItemsCheck).then(function () {

                                    removeInsight(insight);

                                    announceService.info('MOVED_TO_PREVIEW_ANNOUNCEMENT', interpolateParams);

                                }, function (err) {
                                    if (err === 'ERROR_NOT_ENOUGH_REFERENCE_ITEMS') {
                                        //Recall the show function, but swap out message on the dialog and change the ignoreRefItemsCheck to true.
                                        //That param is passed to server and when true will not do the check on the serverside.
                                        vm.show(evt, insight, ERROR_NOT_ENOUGH_REFERENCE_ITEMS, true);
                                    } else {
                                        announceService.error(err, interpolateParams);
                                    }
                                });
                            });
                        });
                });
        };
    }

    angular
        .module('fi.insight')
        .service('insightItemsMoveToPreviewDialog', InsightItemsMoveToPreviewDialog);
}());

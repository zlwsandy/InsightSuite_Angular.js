(function () {
    'use strict';

    var gameRunStatusValue, GAMERUNSTATUS;

    GAMERUNSTATUS = 'gameRunStatus';

    function is(value) {
        return function (candidate) {
            if (!candidate) {
                return false;
            }

            if (!angular.isString(candidate)) {
                candidate = candidate[GAMERUNSTATUS] || '';
            }

            candidate = candidate.toUpperCase();
            if (angular.isArray(value)) {
                return value.some(function (val) {
                    return val === candidate;
                });
            } else {
                return value === candidate;
            }
        };
    }

    gameRunStatusValue = {
        isInSetup: is('SETUP'),
        isInPreview: is('PREVIEW'),
        isInProgress: is('RUNNING'),
        hasResults: is('RESULTS'),
        isHidden: is('HIDDEN'),
        isSummarySetup: is('SUMMARY_SETUP'),
        isSummaryResults: is('SUMMARY_RESULTS'),
        isSummaryProgress: is('SUMMARY_PROGRESS'),
        isProcessing: is('PROCESSING'),

        isInSetupGroup: is(['SUMMARY_SETUP', 'SETUP', 'DENIED']),
        isInPreviewGroup: is(['PREVIEW', 'SUMMARY_PREVIEW']),
        isInProgressGroup: is(['SUMMARY_PROGRESS', 'RUNNING', 'ENDING', 'PENDING_ANALYSIS', 'PROCESSING', 'PROCESSING_ERROR']),
        isInResultsGroup: is(['SUMMARY_RESULTS', 'RESULTS', 'HIDDEN'])
    };

    angular
        .module('fi.common')
        .value('gameRunStatusValue', gameRunStatusValue);
}());

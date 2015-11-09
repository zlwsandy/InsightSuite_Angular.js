(function () {
    'use strict';

    /* @ngInject */
    function InsightSetupItemsUploadController($rootScope, $mdDialog, $translate,
            $timeout, currentLocale, dialogAlert, _, insightDataService, announceService) {
        var vm = this;

        vm.selectedTabIndex = 0;
        vm.gameRun = currentLocale;

        // Uploading Items
        vm.determinateVal = 0.0;
        vm.uploading = false;
        vm.showZipMsg = false;
        vm.showProgressLoader = false;

        // Browsing Items
        vm.recentItems = [];

        function init() {
            vm.showProgressLoader = true;

            insightDataService.getEligibleAddItems(vm.gameRun.gameRunId).then(function (result) {
                vm.recentItems = result || [];
                vm.showProgressLoader = false;
            }).catch(announceService.error);
        }

        vm.showNoItemsMessage = function () {
            return _.isEmpty(vm.recentItems) && !vm.showProgressLoader;
        };

        vm.isBrowseItemsVisible = function () {
            return vm.selectedTabIndex === 1;
        };

        vm.isDownloadTemplateVisible = function () {
            return (!vm.uploading &&
                    !vm.showZipMsg &&
                    vm.selectedTabIndex === 0);
        };

        /**
         * Close the upload dialog
         */
        vm.closeDialog = function ($flow) {
            $flow.cancel();
            $mdDialog.hide();
        };

        /**
         * Success handler for file uploading
         *
         * @param $file
         * @param $message
         * @param $flow
         */
        vm.fileSuccess = function ($file, $message, $flow) {
            var msg = angular.fromJson($message);
            var emitItems = function () {
                if ($file.getExtension().toLowerCase() === 'zip') {
                    $timeout(function () {
                        vm.showZipMsg = true;
                        vm.uploading = false;
                    }, 500);
                } else {
                    $rootScope.$emit('insightItem:uploadResult', emitData);
                    $timeout(function () {
                        vm.closeDialog($flow);
                    }, 500);
                }
            };

            // if the status is true emit the data to the items list
            // else show the error message
            if (msg.status === true) {
                var create = _.filter(msg.data, 'status', 'CREATE'),
                    itemsExistForOtherLocaleInInsight = _.filter(msg.data, 'status', 'ADD_ITEM_LOCALE'),
                    errors = _.filter(msg.data, 'status', 'ERROR'),
                    itemsExistForLocaleInInsight = _.filter(msg.data, 'status', 'INSIGHT_LOCALE_ALREADY_EXISTS'),
                    itemsExistForLocaleInOtherInsights = _.filter(msg.data, 'status', 'ITEM_LOCALE_ALREADY_EXISTS'),
                    itemsExistForOtherLocale = _.filter(msg.data, 'status', 'ITEM_EXISTS_IN_OTHER_LOCALES_ONLY'),
                    emitData = {
                        create: create,
                        itemsExistForOtherLocaleInInsight: itemsExistForOtherLocaleInInsight,
                        itemsExistForLocaleInInsight: itemsExistForLocaleInInsight,
                        itemsExistForLocaleInOtherInsights: itemsExistForLocaleInOtherInsights,
                        itemsExistForOtherLocale: itemsExistForOtherLocale
                    };

                // Catch for server validation errors
                if (errors.length > 0) {
                    dialogAlert.show(errors[0].status).then(emitItems);
                } else {
                    emitItems();
                }


            } else {
                var dialogMsg = msg.message;
                dialogAlert.show(dialogMsg);
            }
        };

        /**
         * File added handler for file uploading.  Checks for accepted
         * file extensions and throws an alert if it is not xls or xlsx
         *
         * @param $file
         * @param $event
         * @returns {boolean}
         */
        vm.fileAdded = function ($file) {
            var acceptableExts = ['xls', 'xlsx', 'zip'],
                ext = $file.getExtension().toLowerCase();

            if (acceptableExts.indexOf(ext) === -1) {
                dialogAlert.show('ERROR_ONLY_XLS_AND_ZIP_SUPPORTED');
                return false;
            }
        };

        /**
         * Kicks off the upload of the file once a file is added
         * either by selection or drag and drop
         *
         * @param  $files
         * @param  $event
         * @param  $flow
         */
        vm.fileUpload = function ($files, $event, $flow) {
            $flow.upload();
        };

        /**
         * Updates the determinate value and sets uploading to true during
         * file upload
         *
         * @param $file
         */
        vm.fileProgress = function ($file) {
            vm.determinateVal = $file.progress() * 100;

            vm.uploading = vm.determinateVal !== 0.0;
        };

        /**
         * Error handler for errors during uploading.
         * Throws error alert when it is called
         */
        vm.fileError = function () {
            dialogAlert.show('UNKNOWN_ERROR_IN_EXCEL');
        };

        init();
    }

    angular
        .module('fi.insight')
        .controller('InsightSetupItemsUploadController', InsightSetupItemsUploadController);
}());

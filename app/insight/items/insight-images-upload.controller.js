(function () {
    'use strict';

    /* @ngInject */
    function InsightImagesUploadController($rootScope, $mdDialog, $translate, $timeout, item, FiConstants) {
        var vm = this;

        vm.determinateVal = 0.0;
        vm.uploading = false;
        vm.error = null;
        vm.item = item;
        vm.numberOfFiles = 0;
        vm.uploadsRemaining = 0;
        vm.remainingImageSlots = (FiConstants.MAX_IMAGE_SLOTS - vm.item.itemImages.length);

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

            // if the status is true emit the data to the items list
            // else show the error message
            if (msg.status === true) {
                vm.item.itemImages[5 - vm.remainingImageSlots] = msg.data;

                //Update the remaining images
                vm.remainingImageSlots--;
                vm.uploadsRemaining--;

                if (vm.uploadsRemaining === 0) {
                    $timeout(function () {
                        vm.closeDialog($flow);
                    }, 500);
                }
            } else {
                vm.error = msg.message;
                vm.uploading = false;
            }
        };

        /**
         * File added handler for file uploading.  Checks for accepted
         * file extensions and throws an alert if it is not jpg, gif, or png.
         *
         * @param $file
         * @param $event
         * @returns {boolean}
         */
        vm.fileAdded = function ($file) {
            var acceptableExts = ['jpg', 'jpeg', 'png', 'gif'],
                ext = $file.getExtension().toLowerCase();

            // clear error message
            vm.error = null;

            // check if it's one of the listed file extensions
            if (acceptableExts.indexOf(ext) === -1) {
                vm.error = 'ERROR_FILE_EXTENSION';

                return false;
            }

            // check the size of the image
            if ($file.size > FiConstants.MAX_IMAGE_SIZE) {
                vm.error = 'ERROR_FILE_SIZE';

                return false;
            }
        };

        /**
         * Files added handler for file uploading.  Checks the array of files
         * length to determine whether that amount of images can be uploaded.
         *
         * @param $files
         * @return {boolean}
         */
        vm.filesAdded = function ($files) {
            // can only upload 5 images total for insight
            // so check that against already added images
            if ($files.length > vm.remainingImageSlots) {
                vm.error = 'ERROR_NUMBER_OF_FILES';
                vm.errorOptions = { numOfSpaces: vm.remainingImageSlots };

                return false;
            }
            vm.numberOfFiles = $files.length;
            vm.uploadsRemaining = $files.length;
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

            vm.uploading = vm.determinateVal !== 0.0 && !vm.error;
        };

        /**
         * Error handler for errors during uploading.
         * Throws error alert when it is called
         */
        vm.fileError = function () {
            vm.error = 'UNKNOWN_ERROR_IN_IMAGE';
        };
    }

    angular
        .module('fi.insight')
        .controller('InsightImagesUploadController', InsightImagesUploadController);
}());

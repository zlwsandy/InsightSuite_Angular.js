(function () {
    'use strict';

    /* @ngInject */
    function ImageBrowseDialogController(_, images, $mdDialog) {

        var vm = this;

        vm.images = images || [];

        // Sort the images so that the primary image is first
        vm.images = _.sortBy(vm.images, function (image) {
            return image.primary ? -1 : 1;
        });

        /**
         * Default the current image to the first one
         */
        vm.current = 0;

        /**
         * Fired when the previous arrow is clicked.  If the current index is the first one, then
         * cycle back to the last one
         */
        vm.previous = function () {
            if (vm.images.length > 0) {
                vm.current = vm.current === 0 ? vm.images.length - 1 : vm.current - 1;
            }
        };

        /**
         * Fired when the next arrow is clicked.  If the current index is the last one, then
         * cycle back to the first one
         */
        vm.next = function () {
            if (vm.images.length > 0) {
                vm.current = vm.current === vm.images.length - 1 ? 0 : vm.current + 1;
            }
        };

        /**
         * Returns the URL for the image at the current index.  If there are no images provided, then
         * function returns undefined
         *
         * @returns fullSizeUrl
         */
        vm.getCurrentImage = function () {
            if (vm.images.length === 0) {
                return undefined;
            }

            return vm.images[vm.current].fullsizeUrl;
        };

        /**
         * Closes the dialog
         */
        vm.close = function () {
            $mdDialog.hide('close');
        };

        /**
         * Only show navigation (arrows and pagination container) if more than one image
         *
         * @returns {*boolean}
         */
        vm.showNavigation = function () {
            return vm.images && vm.images.length > 1;
        };
    }

    angular
        .module('fi.insight')
        .controller('ImageBrowseDialogController', ImageBrowseDialogController);
}());

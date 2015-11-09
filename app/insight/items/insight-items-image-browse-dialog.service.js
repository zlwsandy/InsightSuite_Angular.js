(function () {
    'use strict';

    /* @ngInject */
    function ImageBrowseDialog($mdDialog) {

        var vm = this;

        /**
         * Show the dialog, allowing navigation through the given list of item images
         * If only one image is specified, navigation controls are hidden
         *
         * @param itemImages
         * @returns {Promise}
         */
        vm.show = function (itemImages) {

            return $mdDialog.show({
                templateUrl: 'insight/items/insight-items-image-browse-dialog.html',
                controller : 'ImageBrowseDialogController',
                controllerAs : 'imageBrowseDialogController',
                locals : {
                    images : itemImages
                }
            });
        };
    }

    angular
        .module('fi.insight')
        .service('imageBrowseDialog', ImageBrowseDialog);
}());

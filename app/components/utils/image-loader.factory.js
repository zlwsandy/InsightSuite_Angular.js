(function () {
    'use strict';

    /* @ngInject */
    function ImageLoaderFactory(_) {

        var FULLSIZE_IMAGE_URL_PROP = 'fullsizeUrl';

        /**
         * Pre-load full size images so they are cached by the browser
         *
         * @param List of images
         * @return The number of images loaded
         */
        function loadFullsizeImages(images) {

            var img;
            var totalImages = 0;

            _.forEach(images, function (image) {
                if (image.hasOwnProperty(FULLSIZE_IMAGE_URL_PROP)) {
                    img = new Image();
                    img.src = image[FULLSIZE_IMAGE_URL_PROP];
                }
            });

            return totalImages;
        }

        /**
         * Pre-load full size images for a list of items
         *
         * @param items - List of items
         */
        function loadFullsizeImagesByItems(items) {

            _.forEach(items, function (item) {
                api.loadFullsizeImages(item.itemImages);
            });
        }

        var api = {
            loadFullsizeImages : loadFullsizeImages,
            loadFullsizeImagesByItems : loadFullsizeImagesByItems
        };

        return api;
    }

    angular
        .module('fi.common')
        .service('imageLoader', ImageLoaderFactory);
}());

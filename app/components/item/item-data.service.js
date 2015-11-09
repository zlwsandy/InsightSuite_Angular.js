(function () {
    'use strict';

    /* @ngInject */
    function ItemDataService(utilsService, $http) {

        function itemsUpload(file, gameRun) {
            var url = '/api/insightlocale/' + gameRun.gameRunId + '/itemimport';
            var data = new FormData();
            var config = {
                transformRequest: angular.identity,
                // Manually setting ‘Content-Type’: multipart/form-data will fail to fill in the boundary parameter of the request.
                headers: {'Content-Type': undefined}
            };

            data.append('file', file);

            return $http.post(url, data, config)
                .then(utilsService.transformHttpPromise);
        }

        /**
         * Sends a list of new items to the backend from the upload item.
         *
         * @param items
         * @param gameRun
         * @return itemlist     list of all the items (not just added items)
         */
        function createItems(items, gameRun) {
            return $http
                .post('/api/insightlocale/' + gameRun.gameRunId + '/items/add', items)
                .then(utilsService.transformHttpPromise);
        }

        /**
         * Remove image from the item.
         *
         * @param item
         * @param image
         * @return itemlist     list of all the images for the item
         */
        function unlinkImage(item, image) {
            return $http
                .put('/api/item/' + item.itemId + '/image/unlink/' + image.itemImageId)
                .then(utilsService.transformHttpPromise);
        }

        /**
         * Set image as the primary for the item.
         *
         * @param item
         * @param image
         * @return itemlist     list of all the images for the item
         */
        function setPrimaryImage(item, image) {
            return $http
                .put('/api/item/' + item.itemId + '/image/setprimary/' + image.itemImageId)
                .then(utilsService.transformHttpPromise);
        }

        return {
            itemsUpload: itemsUpload,
            createItems: createItems,
            unlinkImage: unlinkImage,
            setPrimaryImage: setPrimaryImage
        };
    }

    angular
        .module('fi.common')
        .factory('itemDataService', ItemDataService);
}());

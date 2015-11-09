(function () {
    'use strict';

    /* @ngInject */
    function InsightItemTransformer(_, FiConstants, localeService) {
        var NO_IMAGE = {
            thumbnailUrl: FiConstants.NO_IMAGE_PATH,
            status: FiConstants.NO_IMAGE_STATUS
        };

        function isPrimary(itemImage) {
            return !!itemImage.primary;
        }

        /**
         * processImages sets the primary image on the item and sorts the
         * item's images so that the primary image is first.
         **/
        function parseResults(item) {
            item.itemImages = _.sortBy(item.itemImages, _.negate(isPrimary));
            item.primaryImage = _.find(item.itemImages, isPrimary) || NO_IMAGE;

            item.flagImageUrl = localeService.getFlagImageUrl(item.gameRunLocale);

            return item;
        }

        return function (results) {
            return (_.isArray(results)) ? _.map(results, parseResults) : parseResults(results);
        };
    }

    angular
        .module('fi.insight')
        .factory('insightItemTransformer', InsightItemTransformer);
}());

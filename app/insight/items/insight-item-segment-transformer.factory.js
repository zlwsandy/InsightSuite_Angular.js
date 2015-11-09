(function () {
    'use strict';

    /* @ngInject */
    function insightItemSegmentTransformer(_, insightItemTransformer, segmentTransformer) {

        function transformResponse(item) {

            // Use the item transformer to transform the item individually
            item = insightItemTransformer(item);

            // Add isGenerating to all segments
            item.segmentGameItems = segmentTransformer(item.segmentGameItems);

            return item;
        }

        return function (results) {

            results = angular.fromJson(results);

            if (_.isArray(results)) {
                return _.map(results, transformResponse);
            }

            return transformResponse(results);
        };
    }

    angular
        .module('fi.insight')
        .factory('insightItemSegmentTransformer', insightItemSegmentTransformer);
}());

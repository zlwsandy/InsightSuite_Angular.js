(function () {
    'use strict';

    /* @ngInject */
    function SegmentTransformer(_, gameRunStatusValue) {

        function transformResponse(segment) {

            // Get the gamerun status and transform to lowercase for comparison purposes
            var status = segment.gameRunStatus.toLowerCase();

            segment.isGenerating = (gameRunStatusValue.isInPreview(segment) || status === 'pending_analysis' || status === 'processing');

            return segment;
        }

        return function (results) {

            results = angular.fromJson(results);

            // Map over each result
            var transformedResults = _.map(results, transformResponse);
            return _.sortByAll(transformedResults, [
                function (result) {
                    if (result.gameRunName) {
                        // Convert gameRunName to lowercase for case-insensitive search
                        return result.gameRunName ? result.gameRunName.toLowerCase() : '';
                    } else {
                        // Convert name to lowercase for case-insensitive search
                        return result.name ? result.name.toLowerCase() : '';
                    }
                },
                'gameRunId'
            ]);
        };
    }

    angular
        .module('fi.insight')
        .factory('segmentTransformer', SegmentTransformer);
}());

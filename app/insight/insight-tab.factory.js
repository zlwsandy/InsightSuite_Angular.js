(function () {
    'use strict';

    /* @ngInject */
    function InsightTabFactory() {

        var selectedSegment;
        var segments;
        var selectedViewType;

        return {
            segments : segments,
            selectedSegment: selectedSegment,
            selectedViewType : selectedViewType
        };
    }

    angular
        .module('fi.insight')
        .factory('insightTabFactory', InsightTabFactory);
}());

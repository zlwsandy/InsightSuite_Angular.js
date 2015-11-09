(function () {
    'use strict';

    function insightResultsTable() {
        return {
            restrict: 'E',
            templateUrl: 'insight/items/insight-results-table.directive.html',
            controller: insightResultsTableController,
            controllerAs: 'insightResultsTableController',
            bindToController: true,
            scope: {
                item : '=',
                insightPricingEnabled : '=',
                maxGmPricingEnabled : '=',
                itemResults: '=',
                resultsType: '=',
                selectedSegment: '='
            }
        };
    }

    function insightResultsTableController() {}
    angular.module('fi.insight')
    .directive('insightResultsTable', insightResultsTable);
}());

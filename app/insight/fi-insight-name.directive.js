(function () {
    'use strict';

    /* @ngInject */
    function fiInsightName(insightDataService, $stateParams, $q) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$asyncValidators.fiInsightName = function (modelValue) {

                    return insightDataService
                        .getInsights({ name: modelValue })
                        .then(function (insights) {
                            var isValid = false;

                            if (insights.length === 0) {
                                isValid = true; // valid because no results were found
                            } else if (insights[0].insightId === Number($stateParams.insightId)) {
                                isValid = true; // valid because updating same insight
                            } else {
                                isValid = false;
                            }

                            return isValid ? $q.when() : $q.reject();
                        });
                };
            }
        };
    }

    angular
        .module('fi.insight')
        .directive('fiInsightName', fiInsightName);
}());

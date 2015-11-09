(function () {
    'use strict';

    /* @ngInject */
    function WaveInsightService($http) {

        function getInsights(waveId) {
            return $http.get('../api/wave/' + waveId + '/baskets');
        }

        return {
            getInsights: getInsights
        };

    }

    angular
        .module('fi.wave')
        .factory('waveInsightService', WaveInsightService);
}());

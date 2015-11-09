(function () {
    'use strict';

    /* @ngInject */
    function WaveLinkService(waveService, $http, $rootScope) {

        function removeLinks(wave, links) {
            function updateWave(result) {
                if (result.status) {
                    $rootScope.$broadcast('linksRemoved');
                    waveService.checkWaveForUpdates(wave);
                }
            }

            return $http.put('../api/wave/' + wave.waveId + '/gamelinks/remove', links).success(updateWave);
        }

        function getLinks(waveId) {
            return $http.get('../api/wave/' + waveId + '/gamelinks');
        }

        return {
            getLinks: getLinks,
            removeLinks: removeLinks
        };
    }

    angular
        .module('fi.wave')
        .factory('waveLinkService', WaveLinkService);
}());

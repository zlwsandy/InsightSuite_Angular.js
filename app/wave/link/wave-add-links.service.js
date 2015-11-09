(function () {
    'use strict';

    /* @ngInject */
    function WaveAddLinksService(waveService, $http, $rootScope) {

        function getPossibleLinks(waveId) {
            return $http.get('../api/wave/' + waveId + '/possiblelinks');
        }

        function getPossibleLocales(waveId) {
            return $http.get('../api/wave/' + waveId + '/possiblelocales');
        }

        function getPossibleTargets(waveId) {
            return $http.get('../api/wave/' + waveId + '/possibletargets');
        }

        function addGameLinksToWave(wave, links) {
            var linkIds = [];

            function updateWave(result) {
                if (result.status) {
                    $rootScope.$broadcast('linksAdded', result.data.gameLinkList);
                    waveService.checkWaveForUpdates(wave);
                }
            }

            for (var i = 0; i < links.length; i++) {
                if (links[i].selectedFlag) {
                    linkIds.push(links[i].gamePageId);
                }
            }

            return $http.put('../api/wave/' + wave.waveId + '/gamelinks/add', linkIds).success(updateWave);
        }

        var service = {
            getPossibleLinks: getPossibleLinks,
            getPossibleLocales: getPossibleLocales,
            getPossibleTargets: getPossibleTargets,
            addGameLinksToWave: addGameLinksToWave
        };

        return service;
    }

    var app = angular.module('fi.wave');
    app.factory('waveAddLinksService', WaveAddLinksService);

}());

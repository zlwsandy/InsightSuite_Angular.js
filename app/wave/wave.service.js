(function () {
    'use strict';

    /* @ngInject */
    function waveService(fiService, $http, $q, $rootScope) {

        var currentWaveId = '';
        var currentWave = {};
        var locales = [];
        var totalAvailable;
        var companiesStart = {};

        function validateResponse(response) {
            return (response.data.status) ? response.data.data : $q.reject(response.data.message);
        }

        function waveBaseUrl(wave) {
            return fiService.gameplayBaseUrl() + '/wp/' + wave.urlDir;
        }

        function waveFullUrl(wave) {
            return fiService.gameplayBaseUrl() + '/wp/' + wave.urlDir + '/' + wave.urlName;
        }

        function waveFullUrlForLocale(wave, locale, allowLocaleSwitch) {
            var result = fiService.gameplayBaseUrl() + '/wp/' + wave.urlDir + '/' + wave.urlName + '?locale=' + locale;

            if (allowLocaleSwitch) {
                result = result + '&waveDir=' + wave.urlDir + '&waveName=' + wave.urlName;
            }

            return result;
        }

        function waveFullUrlSelectLocale(wave) {
            return fiService.gameplayBaseUrl() + '/wp/' + wave.urlDir + '/' + wave.urlName + '?selectloc=1';
        }

        function getCurrentWaveId() {
            return currentWaveId;
        }

        function getCurrentWave() {
            return currentWave;
        }

        function setCurrentWave(wave) {
            currentWave = angular.copy(wave);
            currentWaveId = wave && wave.waveId ? wave.waveId : null;
        }

        function broadcastCurrentWave(wave) {
            $rootScope.$broadcast('updateLink', wave);
        }

        function getWaves(company, options) {
            var config;

            options = options || {};
            config = {
                params: {
                    start: options.start || 0,
                    limit: options.limit || 20,
                    filter: 'onlyLive::' + !!options.onlyLive
                }
            };

            if (!company || !company.id) {
                return $q.when([]);
            }

            return $http.get('../api/waves/company/' + company.id, config)
                .success(function () {
                    totalAvailable = undefined;
                    companiesStart = {};
                }).then(validateResponse);
        }

        function editWave(wave) {
            return $http
                .put('../api/wave/' + wave.waveId, {
                    name: wave.name
                })
                .then(validateResponse);
        }

        function createWave(wave) {
            var data = {
                name: wave.waveName,
                urlName: wave.wavePath,
                company: {
                    id: wave.company.id
                }
            };

            return $http
                .post('../api/wave', data)
                .then(validateResponse);
        }

        function deleteWave(wave) {

            function validateDeleteWaveResponse(response) {
                if (response.data.status) {
                    $rootScope.$broadcast('deleteWaveBroadcast', wave);
                    return response.data.data;
                } else {
                    return $q.reject(response.data.message);
                }
            }

            return $http
                .delete('../api/wave/' + wave.waveId)
                .then(validateDeleteWaveResponse);
        }

        function loadMoreWaves(waveController) {
            var start = 0;
            var limit = 20;

            var busy = false;

            waveController.infiniteScroll = {
                load: function () {
                    var self = this;
                    var companyId = waveController.company.id;
                    var companyStart = self.getCompanyStart(companyId);

                    //If companyStart is the same as totalAvailable then don't allow a request because there will most likely be no new results returned.
                    if (busy || (typeof totalAvailable !== 'undefined' && companyStart >= totalAvailable)) {
                        return;
                    }

                    busy = true;

                    $http.get('../api/waves/company/' + companyId, {
                        params: {
                            start: companyStart,
                            limit: limit,
                            filter: 'onlyLive::' + waveController.onlyLive
                        }
                    }).success(function (result) {
                        // Create an array of wave ids
                        var waveIds = waveController.waves.map(function (wave) {
                            return wave.waveId;
                        });

                        // Create an array of results whose ids are not found in the waveIds array
                        var newWaves = result.data.filter(function (val) {
                            return (waveIds.indexOf(val.waveId) === -1);
                        });

                        // Concatenate and assign newWaves to the existing waves
                        waveController.waves = waveController.waves.concat(newWaves);

                        totalAvailable = result.totalAvailable;
                        self.setCompanyStart(companyId, result.data.length);
                        busy = false;
                    }).error(function () {
                        busy = false;
                    });
                },

                getCompanyStart: function (companyId) {
                    if (!companiesStart.hasOwnProperty(companyId)) {
                        companiesStart[companyId] = (waveController.waves !== 'undefined') ? waveController.waves.length : start;
                    }
                    return companiesStart[companyId];
                },

                setCompanyStart: function (companyId, totalWavesLoaded) {
                    companiesStart[companyId] += totalWavesLoaded;
                }
            };
        }

        function getWave(waveId) {
            return $http.get('../api/wave/' + waveId);
        }

        function checkWaveForUpdates(wave) {
            return getWave(wave.waveId)
                .success(function (data) {
                    // compare wave & data.data with angular.equals so that $$hashkey is ignored
                    if (data.status && !angular.equals(wave, data.data)) {
                        $rootScope.$broadcast('waveChange', data.data);
                    }
                });
        }

        function getLocaleList() {
            return locales;
        }

        function setLocaleList(list) {
            locales = list.sort();
        }

        return {
            getCurrentWaveId: getCurrentWaveId,
            getCurrentWave: getCurrentWave,
            setCurrentWave: setCurrentWave,
            broadcastCurrentWave: broadcastCurrentWave,
            getWaves: getWaves,
            editWave: editWave,
            createWave: createWave,
            deleteWave: deleteWave,
            loadMoreWaves: loadMoreWaves,
            waveBaseUrl: waveBaseUrl,
            waveFullUrl: waveFullUrl,
            waveFullUrlForLocale: waveFullUrlForLocale,
            waveFullUrlSelectLocale: waveFullUrlSelectLocale,
            checkWaveForUpdates: checkWaveForUpdates,
            getWave: getWave,
            getLocaleList: getLocaleList,
            setLocaleList: setLocaleList
        };
    }

    angular
        .module('fi.wave')
        .factory('waveService', waveService);
}());

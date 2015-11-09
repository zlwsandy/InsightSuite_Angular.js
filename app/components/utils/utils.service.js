(function () {
    'use strict';

    /* @ngInject */
    function utilsService($q) {
        function transformHttpPromise(promise) {
            var deferred = $q.defer();

            promise = $q.when(promise);

            promise
                .then(function (data) {
                    var result = data.data;

                    if (result.status) {
                        if (result.totalAvailable) {
                            if (!result.data) {
                                result.data = [];
                            }

                            if (angular.isArray(result.data)) {
                                result.data.totalAvailable = result.totalAvailable;
                            }
                        }

                        deferred.resolve(result.data);
                    } else {
                        deferred.reject(result.message);
                    }
                })
                .catch (function (data) {
                    deferred.reject(data);
                });

            return deferred.promise;
        }

        return {
            transformHttpPromise: transformHttpPromise
        };
    }

    angular
        .module('fi.common')
        .factory('utilsService', utilsService);
}());

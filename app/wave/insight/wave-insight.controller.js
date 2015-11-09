(function () {
    'use strict';

    /* @ngInject */
    function WaveInsightController(waveService, waveInsightService, $scope, $rootScope) {
        var vm = this;

        // FIXME: Get rid of $rootScope to handle loading data for this tab
        var unRegUpdateListener = $rootScope.$on('updateLink', function (e, gamePage) {
            vm.getInsights(gamePage.waveId);
        });

        // FIXME: Be smarter (i.e. don't reload all the data if possible)
        var unRegLinksAddedListener = $rootScope.$on('linksAdded', function () {
            vm.getInsights(waveService.getCurrentWaveId());
        });

        var unRegLinksRemovedListener = $rootScope.$on('linksRemoved', function () {
            vm.getInsights(waveService.getCurrentWaveId());
        });


        vm.getInsights = function (waveId) {
            waveInsightService.getInsights(waveId)
                .then(function (result) {
                    vm.insights = result.data.data;
                });

        };

        $scope.$on('$destroy', function () {
            // Unregister the listeners when the controller is destroy
            unRegUpdateListener();
            unRegLinksAddedListener();
            unRegLinksRemovedListener();
        });

    }

    angular
        .module('fi.wave')
        .controller('WaveInsightController', WaveInsightController);
}());

(function () {
    'use strict';

    /* @ngInject */
    function WaveAddLinksController(waveService, waveAddLinksService, announceService, $mdDialog, $log) {
        var vm = this;
        vm.possibleLinks = [];
        vm.possibleLocales = [];
        vm.possibleTargets = [];
        vm.selectedBasketName = '';
        vm.selectedLocale = 'All';
        vm.selectedTarget = 'All';

        vm.allSelectedFlag = false;
        vm.numSelected = 0;
        vm.showFilterDiv = true;
        vm.showProgressLoader = true;

        var waveId = waveService.getCurrentWaveId();

        //////////

        function activatePossibleLinks() {
            return getPossibleLinks().then(function () {
            });
        }

        function getPossibleLinksSuccess(results) {
            vm.showProgressLoader = false;
            vm.possibleLinks = results.data.data;
            return vm.possibleLinks;
        }

        function getPossibleLinksFailure(reason) {
            $log.debug('getPossibleLinksFailure:' + JSON.stringify(reason));
        }

        function getPossibleLinks() {
            return waveAddLinksService
                .getPossibleLinks(waveId)
                .then(getPossibleLinksSuccess)
                .catch(getPossibleLinksFailure);
        }

        //////////

        function activatePossibleLocales() {
            return getPossibleLocales().then(function () {
            });
        }

        function getPossibleLocalesSuccess(results) {
            vm.possibleLocales = results.data.data;
            return vm.possibleLocales;
        }

        function getPossibleLocalesFailure(reason) {
            $log.debug('getPossibleLocalesFailure:' + JSON.stringify(reason));
        }

        function getPossibleLocales() {
            return waveAddLinksService
                .getPossibleLocales(waveId)
                .then(getPossibleLocalesSuccess)
                .catch(getPossibleLocalesFailure);
        }

        //////////

        function activatePossibleTargets() {
            return getPossibleTargets().then(function () {
            });
        }

        function getPossibleTargetsSuccess(results) {
            vm.possibleTargets = results.data.data;
            return vm.possibleTargets;
        }

        function getPossibleTargetsFailure(reason) {
            $log.log('getPossibleTargetsFailure:' + JSON.stringify(reason));
        }

        function getPossibleTargets() {
            return waveAddLinksService
                .getPossibleTargets(waveId)
                .then(getPossibleTargetsSuccess)
                .catch(getPossibleTargetsFailure);
        }

        //////////

        function basketFilter(link) {
            return (angular.isUndefined(vm.selectedBasketName) ||
                (link.basketName.toLowerCase().indexOf(vm.selectedBasketName.toLowerCase()) !== -1));
        }


        function localeFilter(link) {
            return (vm.selectedLocale === 'All' || vm.selectedLocale === link.locale);
        }

        function targetFilter(link) {
            return (vm.selectedTarget === 'All' || vm.selectedTarget === link.targetType);
        }

        //////////

        function clickAllCheckbox(links) {
            var numSelected = 0;
            for (var i = 0; i < links.length; i++) {
                if (basketFilter(links[i]) && localeFilter(links[i]) && targetFilter(links[i])) {
                    links[i].selectedFlag = vm.allSelectedFlag;
                    numSelected++;
                }
            }
            if (vm.allSelectedFlag) {
                vm.numSelected = numSelected;
                vm.showFilterDiv = false;
            } else {
                vm.numSelected = 0;
                vm.showFilterDiv = true;
            }
        }

        function clickGameLinkCheckbox(val, links) {
            if (val === true) {
                vm.numSelected++;
                vm.showFilterDiv = false;
            } else {
                vm.numSelected--;
                if (vm.numSelected === 0) {
                    vm.showFilterDiv = true;
                }
            }
            if (vm.numSelected === links.length) {
                vm.allSelectedFlag = true;
            } else {
                vm.allSelectedFlag = false;
            }
        }

        //////////

        function addGameLinksToWave(links) {
            var wave = waveService.getCurrentWave();
            waveAddLinksService.addGameLinksToWave(wave, links)
                .then(function (results) {
                    announceService.info('ADD_LINKS_SUCCESS', {
                        numLinks: results.data.data.numLinksAdded,
                        waveName: wave.name
                    });
                });
            $mdDialog.hide();
        }

        function closeDialog() {
            $mdDialog.cancel();
        }

        //////////

        vm.basketFilter = basketFilter;
        vm.localeFilter = localeFilter;
        vm.targetFilter = targetFilter;
        vm.clickGameLinkCheckbox = clickGameLinkCheckbox;
        vm.clickAllCheckbox = clickAllCheckbox;
        vm.addGameLinksToWave = addGameLinksToWave;
        vm.closeDialog = closeDialog;

        activatePossibleLinks();
        activatePossibleLocales();
        activatePossibleTargets();
    }

    angular
        .module('fi.wave')
        .controller('WaveAddLinksController', WaveAddLinksController);

}());

(function () {
    'use strict';

    /* @ngInject */
    function WaveLinkController(waveLinkService, waveService, fiService, announceService, $mdDialog, $anchorScroll, $scope, $rootScope, $log) {
        var vm = this;
        vm.filteredList = [];
        vm.numSelected = 0;
        vm.showProgressLoader = true;

        function setLinks(links) {
            vm.links = links;
            vm.selectAll = false;

            resetLocaleSelectDropdown(links);
            resetCheckboxCounter();
        }

        function resetLocaleSelectDropdown(links) {
            var locales = getLocaleSetFromLinks(links);
            waveService.setLocaleList(locales);
        }

        function resetCheckboxCounter() {
            // Reset counters
            vm.selectAll = false;
            vm.numSelected = 0;
        }

        function getLocaleSetFromLinks(links) {
            var list = [];
            var locale;
            for (var i = 0; i < links.length; i++) {
                locale = links[i].locale;

                if (list.indexOf(locale) === -1) {
                    list.push(locale);
                }
            }

            return list;
        }

        vm.countLinks = function (link) {
            if (link.select) {
                vm.numSelected += 1;
            } else {
                vm.selectAll = false;
                vm.numSelected -= 1;
            }

            vm.checkSelectAll();
        };

        vm.checkSelectAll = function () {
            vm.selectAll = !(vm.filteredLinks.some(function (link) {
                return !link.select;
            }));
        };

        vm.countLinksSelectAll = function (links) {
            if (vm.selectAll) {
                vm.numSelected = links.length;
            } else {
                vm.numSelected = 0;
            }
        };

        vm.checkAll = function () {
            angular.forEach(vm.filteredLinks, function (link) {
                link.select = !vm.selectAll;
            });
        };

        function uncheckAll() {
            angular.forEach(vm.links, function (link) {
                link.select = false;
            });
            resetCheckboxCounter();
        }

        vm.showAdvanced = function (ev) {
            $anchorScroll();
            $mdDialog.show({
                templateUrl: 'wave/link/wave-add-links.html',
                targetEvent: ev
            });
        };

        /**
         * Remove a specific game link from a wave (using the delete button the game link's row)
         */
        vm.removeLink = function (link) {
            waveLinkService.removeLinks(waveService.getCurrentWave(), [link.gamePageId])
                .then(function () {
                    // Remove it from the list
                    var idx = vm.links.indexOf(link);
                    vm.links.splice(idx, 1);
                    if (link.select) {
                        vm.numSelected -= 1;
                    }

                    var isResetFilterDropdown = !(vm.links.some(function (li) {
                        return li.locale === link.locale;
                    }));

                    if (isResetFilterDropdown) {
                        resetLocaleSelectDropdown(vm.links);
                    }
                })
                .catch(function () {
                    // TODO: Display message to user
                    $log.log('error removing link from wave!');
                });
        };

        /**
         * Remove the specified game links from a wave (using the checkboxes)
         */
        vm.removeSelectedLinks = function (links) {
            var linkIds = [];
            var remItems = [];
            for (var i = 0; i < links.length; i++) {
                if (links[i].select) {
                    linkIds.push(links[i].gamePageId);
                    remItems.push(links[i]);
                }
            }
            if (linkIds.length === 0) {
                return;
            }
            waveLinkService.removeLinks(waveService.getCurrentWave(), linkIds)
                .then(function () {
                    // Remove it from the list
                    for (var i = 0; i < remItems.length; i++) {
                        vm.links.splice(vm.links.indexOf(remItems[i]), 1);
                    }

                    resetLocaleSelectDropdown(vm.links);
                    resetCheckboxCounter();
                })
                .catch(function () {
                    // TODO: Display message to user
                    $log.log('error removing link from wave!');
                });
        };

        var unRegLocaleFilterChangeListner = $rootScope.$on('localeFilterChange', uncheckAll);

        var unRegUpdateLinkListner = $rootScope.$on('updateLink', function (e, wave) {
            vm.links = [];
            vm.showProgressLoader = true;
            waveLinkService.getLinks(wave.waveId)
                .success(function (result) {
                    vm.showProgressLoader = false;
                    vm.numSelected = 0;
                    setLinks(result.data);
                });
        });

        var unRegLinksAddedListner = $rootScope.$on('linksAdded', function (e, links) {
            setLinks(links);
        });

        vm.copyLink = function (link) {
            return link.basketName + ',' + fiService.gameplayBaseUrl() + '/gp/' + link.gameLink;
        };

        vm.copySelectedLink = function (links) {

            var linkStr = '';
            if (vm.numSelected > 0) {
                angular.forEach(links, function (l) {
                    if (l.select) {
                        linkStr += vm.copyLink(l) + '\n';
                    }
                });
            }
            return linkStr;

        };

        vm.announceSelectedLinkCopy = function () {
            if (vm.numSelected > 0) {
                announceService.info('LINKS_URL_COPIED', {
                    numLinks: vm.numSelected
                });
            }
        };

        $scope.$on('$destroy', function () {
            // Unregister the listeners when the controller is destroyed
            unRegLocaleFilterChangeListner();
            unRegUpdateLinkListner();
            unRegLinksAddedListner();
        });

    }

    angular
        .module('fi.wave')
        .controller('WaveLinkController', WaveLinkController);
}());

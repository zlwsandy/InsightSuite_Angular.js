(function () {
    'use strict';

    /* @ngInject */
    function MenuSideNavController(fiService, $window, $state) {
        var vm, insights, waves, complianceDocs, other, logoff;

        vm = this;

        insights = {
            name: 'Insights',
            value: 'insights',
            activeStates: ['insightsListTab'],
            translate: 'MENU_INSIGHTS',
            click: angular.bind(vm, $state.go, 'insightsListTab.results')
        };

        waves = {
            name: 'Waves',
            value: 'waves',
            activeStates: ['waves'],
            translate: 'MENU_WAVES',
            click: angular.bind(vm, $state.go, 'admin.waves.list')
        };

        other = {
            name: 'Other',
            value: 'other',
            activeStates: [],
            translate: 'OTHER',
            click: function () {
                $window.location.href = '/secure/gamerun!list.fi';
            }
        };

        complianceDocs = {
            name: 'Compliance Documents',
            value: 'complianceDocs',
            activeStates: [],
            translate: 'COMPLIANCE_DOCUMENTS',
            click: function () {
                $window.open('http://www.firstinsight.com/compliance-statement');
            }
        };

        logoff = {
            name: 'Sign Off',
            value: 'signoff',
            activeStates: [],
            translate: 'SIGNOFF',
            click: function () {
                fiService.logoff();
            }
        };

        vm.isActiveMenu = function (activeStates) {
            return activeStates.some(function (activeState) {
                return $state.includes(activeState);
            });
        };

        fiService
            .isAdmin()
            .then(function () {
                vm.menuList = [insights, waves, other, logoff];
                vm.menuFooterList = [complianceDocs];
            })
            .catch(function () {
                vm.menuList = [insights, logoff];
            });
    }

    angular
        .module('fi.common')
        .controller('MenuSideNavController', MenuSideNavController);
}());

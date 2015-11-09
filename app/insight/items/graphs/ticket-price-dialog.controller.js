(function () {
    'use strict';

    /* @ngInject */
    function TicketPriceDialogController(currentLocale, $mdDialog, ticketPrice, testPrice, formatter) {

        var vm = this;

        vm.ticketPrice = ticketPrice;
        vm.testPrice = testPrice || 0;
        vm.currentLocale = currentLocale;

        vm.minAllowable = 0.01;
        vm.maxAllowable = vm.testPrice * 2;

        vm.validationParams = {
            min : formatter.formatCurrency(vm.minAllowable, currentLocale.locale),
            max : formatter.formatCurrency(vm.maxAllowable, currentLocale.locale),
            format : formatter.getNumberFormatDisplay(currentLocale.locale)
        };

        vm.close = function (action) {
            $mdDialog.hide({
                action : action,
                ticketPrice : vm.ticketPrice
            });
        };
    }

    angular
        .module('fi.insight')
        .controller('TicketPriceDialogController', TicketPriceDialogController);
}());

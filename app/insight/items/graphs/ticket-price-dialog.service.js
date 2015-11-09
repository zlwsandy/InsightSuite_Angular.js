(function () {
    'use strict';

    /* @ngInject */
    function TicketPriceDialog($mdDialog) {

        var vm = this;

        vm.show = function (currentLocale, ticketPrice, testPrice) {
            return $mdDialog.show({
                templateUrl: 'insight/items/graphs/ticket-price-dialog.html',
                controller : 'TicketPriceDialogController',
                controllerAs : 'ticketPriceDialogController',
                locals : {
                    currentLocale : currentLocale,
                    ticketPrice : ticketPrice,
                    testPrice : testPrice
                }
            });
        };
    }

    angular
        .module('fi.insight')
        .service('ticketPriceDialog', TicketPriceDialog);
}());

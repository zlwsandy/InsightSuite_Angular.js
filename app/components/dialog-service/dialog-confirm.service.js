(function () {
    'use strict';

    /* @ngInject */
    function DialogConfirmService($mdDialog) {

        var vm = this;

        var DEFAULT_BUTTONS = [
            {
                translateKey : 'OK',
                className : 'btn-positive-action'
            },
            {
                translateKey : 'CANCEL',
                className : 'btn-text-action'
            }
        ];

        /**
         * Show the Confirm Dialog
         *
         * @param title - Title of Dialog.  Will show across dialog header
         * @param message - Message of Confirm Dialog
         * @param buttons - Optional array of buttons.  If buttons are not passed, then the dialog will default to show
         *  two buttons:  OK and Cancel
         * @returns {*|void|Promise} - Promise that will resolve to the index of the clicked button (i.e. 0, 1, 2)
         */
        vm.show = function (title, message, buttons) {
            return $mdDialog.show({
                templateUrl: 'components/dialog-service/dialog-confirm.html',
                controller : function (title, message, $mdDialog) {

                    // If buttons are passed, then set those.  Otherwise, use the default buttons
                    if (buttons && buttons.length > 0) {
                        this.buttons = buttons;
                    } else {
                        this.buttons = DEFAULT_BUTTONS;
                    }

                    this.title = title;
                    this.message = message;

                    // Called when a button is clicked on the dialog.  Converts to string here because for some reason
                    //  type coercion (and then inversion?) is done on the value for 0, resulting in a value of 'true'
                    //  passed to the resolve
                    // Handling null/undefined because the X in the dialog header will also call this with no index
                    this.handleClick = function (index) {
                        if (index !== null && index !== undefined) {
                            index = index.toString();
                        }
                        $mdDialog.hide(index);
                    };
                },
                controllerAs : 'dialogConfirmServiceController',
                locals : {
                    title : title,
                    message : message
                }
            });
        };

    }

    angular
        .module('fi.common')
        .service('dialogConfirmService', DialogConfirmService);
}());

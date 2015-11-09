/**
 * @name        MessageBox
 * @restrict    EA
 * @module      fi.common
 *
 * @description Creates a message box from the specified type and error message.
 *
 * @param {string} type         : specifies the type of message box to display
 * @param {string} error        : is the error string the message box will display
 * @param {object} errroOptions : object that has a key/value pair for variable replacement in translation file
 *
 * @usage
 *     <message-box type="error" error="someController.error" error-options="someController.errorOptions"></message-box>
 */
(function () {
    'use strict';

    function MessageBoxController() {
        var vm = this;

        /**
         * Picks the css class (color) and svg to show in message box
         *
         * @param  {string} type it can either be 'error', 'success', or 'warn'
         * @return {object}      object that contains color and svg
         */
        function messagePicker(type) {
            var style = {
                'error': function () {
                    return { color: 'message-error', svg: 'images/ic_close_24px.svg' };
                },
                'success': function () {
                    return { color: 'message-success', svg: 'images/ic_check_24px.svg' };
                },
                'warn': function () {
                    return { color: 'message-warn', svg: 'images/ic_warning_24px.svg' };
                }
            };
            return style[type]();
        }

        vm.style = messagePicker(vm.type);

        vm.closeMessage = function () {
            vm.error = null;
        };
    }

    /* @ngInject */
    function MessageBox() {
        return {
            restrict: 'EA',
            scope: {
                type: '@',
                error: '=',
                errorOptions: '='
            },
            templateUrl: 'components/utils/message-box.directive.html',
            controller: MessageBoxController,
            controllerAs: 'messageBoxController',
            bindToController: true
        };
    }

    angular
        .module('fi.common')
        .directive('messageBox', MessageBox);
}());

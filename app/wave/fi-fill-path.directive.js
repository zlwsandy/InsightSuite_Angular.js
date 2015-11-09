(function () {
    'use strict';

    function fiFillPath() {
        return function (scope, element) {
            var allInputs = element.find('input');
            var waveInput = angular.element(allInputs[0]);
            var wavePath = angular.element(allInputs[1]);
            var spanDummy = element.find('span');
            var pathInputContainer = angular.element(element.find('md-input-container')[1]);

            waveInput.bind('keydown keyup focus', function () {
                if (waveInput.hasClass('ng-valid') || waveInput.val().length === 0) {
                    var waveInputText = waveInput.val().replace(/[\s:\/#?&@%+\\;=$,<>~^{}`[\]|\"_]*/g, '').toLowerCase();
                    spanDummy.html(waveInputText);
                    wavePath.val(waveInputText);
                    scope.createWaveForm.wavePath.$setViewValue(waveInputText);
                    // Change the above to below when switch to Angular >= 1.3.4
                    // scope.createWaveForm.wavePath.$setDirty();

                    // Resize for waveInput
                    wavePath.css('width', (spanDummy[0].offsetWidth + 13) + 'px');
                }
                if (wavePath.val().length === 0 || waveInput.val().length === 0) {
                    pathInputContainer.addClass('md-input-invalid');
                } else {
                    pathInputContainer.removeClass('md-input-invalid');
                }
            });
            // Resize for wavePath
            wavePath.bind('keydown keyup focus', function () {
                spanDummy.html(wavePath.val());
                wavePath.css('width', (spanDummy[0].offsetWidth + 13) + 'px');
                if (wavePath.val().length !== 0) {
                    waveInput.unbind('keydown');
                    waveInput.unbind('keyup');
                    waveInput.unbind('focus');
                }
                var newVal = wavePath.val().replace(/[\s:\/#?&@%+\\;=$,<>~^{}`[\]|\"_]*/g, '').toLowerCase();
                if (newVal !== wavePath.val()) {
                    wavePath.val(newVal);
                }
            });
        };
    }

    angular
        .module('fi.wave')
        .directive('fiFillPath', fiFillPath);
}());

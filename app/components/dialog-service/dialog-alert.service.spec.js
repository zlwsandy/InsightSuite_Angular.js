'use strict';

describe('dialogAlertService', function () {
    var dialogAlertService, $translate, $log, $mdDialog;

    beforeEach(module('fi.common'));

    beforeEach(module('pascalprecht.translate', function ($translateProvider) {
        $translateProvider
            .translations('en', {
                'FOO': 'bar',
                'BAR': 'baz {text}'
            })
            .preferredLanguage('en');
    }));

    beforeEach(inject(function (_dialogAlertService_, _$translate_, _$log_, _$mdDialog_) {
        dialogAlertService = _dialogAlertService_;
        $translate = _$translate_;
        $log = _$log_;
        $mdDialog = _$mdDialog_;
    }));

    describe('show', function () {
        beforeEach(inject(function ($rootScope) {
            spyOn($log, 'info');
            spyOn($mdDialog, 'show');
            spyOn($mdDialog, 'alert').and.callThrough();
        }));

        describe('with data', function () {
            beforeEach(inject(function ($rootScope) {
                dialogAlertService.show('BAR', 'FOO');
                $rootScope.$digest();
            }));

            it('should show the alert dialog', function () {
                expect($mdDialog.show).toHaveBeenCalled();
            });
        });
    });
});

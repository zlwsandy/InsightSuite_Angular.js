'use strict';

describe('Dialog Confirm Specs', function () {
    var dialogConfirmService, $translate, $log, $mdDialog;

    var translate = {
        'FOO': 'bar',
        'BAR': 'baz {text}',
        'TITLE' : 'quux'
    };

    beforeEach(module('fi.common'));

    beforeEach(module('pascalprecht.translate', function ($translateProvider) {
        $translateProvider
            .translations('en', translate)
            .preferredLanguage('en');
    }));

    beforeEach(inject(function (_dialogConfirmService_, _$translate_, _$log_, _$mdDialog_) {
        dialogConfirmService = _dialogConfirmService_;
        $translate = _$translate_;
        $log = _$log_;
        $mdDialog = _$mdDialog_;
    }));

    describe('show', function () {
        beforeEach(inject(function ($rootScope) {
            spyOn($log, 'info');
            spyOn($mdDialog, 'show');
            spyOn($mdDialog, 'confirm').and.callThrough();
        }));

        describe('with data', function () {
            beforeEach(inject(function ($rootScope) {
                dialogConfirmService.show('FOO', 'TITLE');
                $rootScope.$digest();
            }));

            it('should show the confirm dialog', function () {
                expect($mdDialog.show).toHaveBeenCalled();
            });
        });

    });
});

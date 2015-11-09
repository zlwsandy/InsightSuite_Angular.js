'use strict';

describe('dialogAlert', function () {
    var dialogAlert, $translate, $log, $mdDialog;

    beforeEach(module('fi.common'));

    beforeEach(module('pascalprecht.translate', function ($translateProvider) {
        $translateProvider
            .translations('en', {
                'FOO': 'bar',
                'BAR': 'baz {text}'
            })
            .preferredLanguage('en');
    }));

    beforeEach(inject(function (_dialogAlert_, _$translate_, _$log_, _$mdDialog_) {
        dialogAlert = _dialogAlert_;
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

        describe('without data', function () {
            beforeEach(inject(function ($rootScope) {
                dialogAlert.show('FOO');
                $rootScope.$digest();
            }));

            it('should create an alert dialog', function () {
                expect($mdDialog.alert).toHaveBeenCalled();
            });

            it('should log the translated message', function () {
                expect($log.info).toHaveBeenCalledWith('bar');
            });

            it('should show the alert dialog', function () {
                expect($mdDialog.show).toHaveBeenCalled();
            });
        });

        describe('with data', function () {
            beforeEach(inject(function ($rootScope) {
                dialogAlert.show('BAR', { 'text': 'test' });
                $rootScope.$digest();
            }));

            it('should create an alert dialog', function () {
                expect($mdDialog.alert).toHaveBeenCalled();
            });

            it('should log the translated message', function () {
                expect($log.info).toHaveBeenCalledWith('baz test');
            });

            it('should show the alert dialog', function () {
                expect($mdDialog.show).toHaveBeenCalled();
            });
        });
    });
});

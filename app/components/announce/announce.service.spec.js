'use strict';

describe('Announce Service', function () {
    var sut, $translate, $log, $rootScope, $mdToast;

    beforeEach(module('fi.common'));
    beforeEach(module('components/announce/toast.html'));

    beforeEach(module('pascalprecht.translate', function ($translateProvider) {
        $translateProvider
            .translations('en', {
                'FOO': 'bar',
                'BAR': 'baz'
            })
            .useMissingTranslationHandler('fiMissingTranslationHandler')
            .preferredLanguage('en');
    }));

    // Spies
    beforeEach(function () {
        $log = jasmine.createSpyObj('$log', [
            'log',
            'info',
            'error',
            'debug',
            'warn'
        ]);
    });

    // Spies
    beforeEach(function () {
        module(function ($provide) {
            $provide.value("$log", $log);
        })
    });

    beforeEach(inject(function (_announceService_, _$translate_, _$rootScope_, _$mdToast_) {
        sut = _announceService_;
        $translate = _$translate_;
        $rootScope = _$rootScope_;
        $mdToast = _$mdToast_;

        spyOn($mdToast, 'show');
    }));

    describe('log - ', function () {
        it('should call show on $mdToast', function () {
            sut.log('FOO');
            $rootScope.$digest();

            expect($mdToast.show).toHaveBeenCalled()
        });

        it('should call $log.log with the translated text', function () {

            sut.log('FOO');
            $rootScope.$digest();

            expect($log.log).toHaveBeenCalledWith('bar');
        });
    });

    describe('info ', function () {
        it('should call show on $mdToast', function () {
            sut.info('FOO');
            $rootScope.$digest();

            expect($mdToast.show).toHaveBeenCalled()
        });

        it('should call $log.info with the translated text', function () {

            sut.info('FOO');
            $rootScope.$digest();

            expect($log.info).toHaveBeenCalledWith('bar');
        });
    });

    describe('warn ', function () {
        it('should call show on $mdToast', function () {
            sut.warn('FOO');
            $rootScope.$digest();

            expect($mdToast.show).toHaveBeenCalled()
        });

        it('should call $log.warn with the translated text', function () {

            sut.warn('FOO');
            $rootScope.$digest();

            expect($log.warn).toHaveBeenCalledWith('bar');
        });
    });

    describe('error', function () {
        it('should call show on $mdToast', function () {
            sut.error('FOO');
            $rootScope.$digest();

            expect($mdToast.show).toHaveBeenCalled()
        });

        it('should call $log.error with the translated text', function () {

            sut.error('FOO');
            $rootScope.$digest();

            expect($log.error).toHaveBeenCalledWith('bar');
        });

        it('should call $log.error with the "unknown error" translated text', function () {

            sut.error('Bad key');
            $rootScope.$digest();

            expect($log.error).toHaveBeenCalledWith('Your action couldn\'t be completed. Please try again. If the problem persists, please contact your First Insight Account Manager.');
        });
    });

    describe('debug', function () {
        it('should call show on $mdToast', function () {
            sut.debug('FOO');
            $rootScope.$digest();

            expect($mdToast.show).toHaveBeenCalled()
        });

        it('should call $log.debug with the translated text', function () {

            sut.debug('FOO');
            $rootScope.$digest();

            expect($log.debug).toHaveBeenCalledWith('bar');
        });
    });
});

'use strict';

describe('insight add locale spec -', function () {
    var sut,
        localeService,
        companyService,
        $rootScope,
        $mdDialog,
        $q,
        insightLocales = {
            en_US: {
                locale: 'en_US',
                flagImageUrl: 'testFlag'
            }
        },
        insightArray = [{
            locale: 'en_US',
            flagImageUrl: 'testFlag',
            language: 'en',
            selected: false,
            disabled: false
        }],
        unavailableLocales = ['fr_FR'];

    // load module under test
    beforeEach(module('fi.insight'));

    beforeEach(function () {
        localeService = jasmine.createSpyObj('localeService', ['getLanguage', 'getFlagImageUrl']);
        companyService = jasmine.createSpyObj('companyService', ['getLocaleList']);
    });

    beforeEach(function () {
        module(function ($provide) {
            $provide.value('localeService', {
                locales: insightLocales
            });
            $provide.value('insightLocales', insightLocales);
            // $provide.value('unavailableLocales', unavailableLocales);
        });
    });

    // create controller
    var createController = function (testUnavailableLocales) {
        inject(function (_$rootScope_, $controller, _$mdDialog_, _$q_) {
            $rootScope = _$rootScope_;
            $mdDialog = _$mdDialog_;
            $q = _$q_;

            companyService.getLocaleList.and.returnValue($q.when(insightLocales));
            localeService.getLanguage.and.returnValue('en');
            localeService.getFlagImageUrl.and.returnValue('testFlag');

            sut = $controller('InsightAddLocaleController', {
                companyService: companyService,
                localeService: localeService,
                unavailableLocales: testUnavailableLocales,
                $scope: $rootScope.$new()
            });

            // so we can access the watch function
            $rootScope.insightAddLocaleController = sut;
        });
    };

    describe('initialize local variables', function () {

        it('should populate locales, localesArray, originalLocalesArray, and addBtnDisabled', function () {
            createController(unavailableLocales);

            expect(sut.showProgressLoader).toBe(true);

            $rootScope.$apply();

            expect(sut.showProgressLoader).toBe(false);
            expect(sut.locales).toEqual(insightLocales);
            expect(sut.localesArray).toEqual(insightArray);
            expect(sut.originalLocalesArray).toEqual(insightArray);
            expect(sut.addBtnDisabled).toBeTruthy();
        });

        it('should set localesArray, originalLocalesArray to [] with locales = unavailableLocales', function () {
            createController(['en_US']);

            $rootScope.$apply();

            expect(sut.locales).toEqual(insightLocales);
            expect(sut.localesArray).toEqual([]);
            expect(sut.originalLocalesArray).toEqual([]);
            expect(sut.addBtnDisabled).toBeTruthy();
        });

        it('should disable addBtnDisabled', function () {
            createController(unavailableLocales);

            $rootScope.$apply();

            expect(sut.addBtnDisabled).toBeTruthy();

            sut.localesArray[0].selected = true;
            $rootScope.$apply();

            expect(sut.addBtnDisabled).toBeFalsy();
        });

    });

    describe('add locale button', function () {

        it('should filter out only the selected locales and call hide', function () {
            createController(unavailableLocales);
            spyOn($mdDialog, 'hide');

            sut.add();

            expect(sut.localesSelected).toEqual([]);
            expect($mdDialog.hide).toHaveBeenCalled();
        });
    });

    describe('close dialog', function () {

        it('should close the add locale dialog', function () {
            createController(unavailableLocales);
            spyOn($mdDialog, 'cancel');

            sut.close();

            expect($mdDialog.cancel).toHaveBeenCalled();
        });

    });
});

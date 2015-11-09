'use strict';

describe('Locale Service Specs - ', function () {
    var sut, $httpBackend, $rootScope;

    var locales = [
        {
            'locale' : 'en_GB',
            'numberFormat' : {
              'currencyCode' : 'GBP',
              'currencySymbol' : '£',
              'currencyDecimalSeparator' : '.',
              'currencyFractionDigits' : 2,
              'currencySpaceBetweenAmountAndSymbol' : false,
              'currencySymbolFirst' : true,
              'groupingSeparator' : ','
            },
            'desktopFlagUrl' : '/app/images/flags/flag.gb.png',
            'currency' : 'GBP'
        },
        {
            'locale' : 'en_US',
            'numberFormat' : {
              'currencyCode' : 'USD',
              'currencySymbol' : '$',
              'currencyDecimalSeparator' : '.',
              'currencyFractionDigits' : 2,
              'currencySpaceBetweenAmountAndSymbol' : false,
              'currencySymbolFirst' : true,
              'groupingSeparator' : ','
            },
            'desktopFlagUrl' : '/app/images/flags/flag.us.png',
            'currency' : 'USD'
        },
        {
            'locale' : 'fr_FR',
            'numberFormat' : {
              'currencyCode' : 'EUR',
              'currencySymbol' : '€',
              'currencyDecimalSeparator' : ',',
              'currencyFractionDigits' : 2,
              'currencySpaceBetweenAmountAndSymbol' : true,
              'currencySymbolFirst' : false,
              'groupingSeparator' : ' '
            },
            'desktopFlagUrl' : '/app/images/flags/flag.fr.png',
            'currency' : 'EUR'
        }
    ];

    beforeEach(module('fi.common'));

    beforeEach(inject(function (_localeService_, _$httpBackend_, _$rootScope_) {
        sut = _localeService_;
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
    }));

    it('should contain data', function () {
        var resolved;
        var list = [{locale: 'en_US'}];

        $httpBackend
            .expectGET('/api/fi/locales')
            .respond({
                status: true,
                data: list
            });

        $httpBackend.flush();

        sut
            .isInitialized()
            .then(function () {
                resolved = true;
            })
            .catch(function () {
                resolved = false;
            });

        expect(resolved).toBe(undefined);
        $rootScope.$digest();
        expect(resolved).toBe(true);
        expect(sut.locales['en_US']).toEqual(list[0]);
    });

    it('should initialize on api failure', function () {
        var resolved;
        var list = [{locale: 'en_US'}];

        $httpBackend
            .expectGET('/api/fi/locales')
            .respond(401);

        $httpBackend.flush();

        sut
            .isInitialized()
            .then(function () {
                resolved = true;
            })
            .catch(function () {
                resolved = false;
            });

        expect(resolved).toBe(undefined);
        $rootScope.$digest();
        expect(resolved).toBe(false);
    });

    describe('isAllLocales', function () {

        it('should return true for a locale object that represents all locales, ignoring case', function () {
            var isAllLocales = sut.isAllLocales({
                locale : 'AlL'
            });

            expect(isAllLocales).toBe(true);
        });

        it('should return false for a locale object that represents an individual locale', function () {
            var isAllLocales = sut.isAllLocales({
                locale : 'en_US'
            });

            expect(isAllLocales).toBe(false);
        });

        it('should return false for a locale object that does not have a locale property', function () {
            var isAllLocales = sut.isAllLocales({
                value : 'all'
            });

            expect(isAllLocales).toBe(false);
        });

        it('should return true for a locale string that represents all locales, ignoring case', function () {
            var isAllLocales = sut.isAllLocales('aLL');

            expect(isAllLocales).toBe(true);
        });

        it('should return false for a locale string that represents an individual locale', function () {
            var isAllLocales = sut.isAllLocales('en_US');

            expect(isAllLocales).toBe(false);
        });

        it('should return false if the given parameter is falsy', function () {
            var isAllLocales = sut.isAllLocales(null);

            expect(isAllLocales).toBe(false);
        });

        it('should return false if the given parameter is not a string or an object', function () {
            var isAllLocales = sut.isAllLocales([]);

            expect(isAllLocales).toBe(false);
        });
    });

    describe('Find Locales', function () {

        it('should find a locale if it exists in the locale list and is not All Locales', function () {

            expect(sut.findLocale('en_US', locales)).toEqual(locales[1]);
        });

        it('should return undefined if it does not exist in the locale list and is not All Locales', function () {

            expect(sut.findLocale('nonexistent', locales)).not.toBeDefined();
        });

        it('should return undefined if an empty locale list is given', function () {

            expect(sut.findLocale('en_US', [])).not.toBeDefined();
        });

        it('should return undefined if a falsy locale list is given', function () {

            expect(sut.findLocale('en_US', null)).not.toBeDefined();
        });

        it('should return a mock All Locales object if the locale code represents all locales', function () {

            var allLocales = {
                locale: 'all',
                label: 'All Locales',
                flagImageUrl: null
            };

            expect(sut.findLocale('all', null)).toEqual(allLocales);
        });
    });

    describe('Get Language - ', function () {

        it('should return the language abbreviation for the given a valid locale code', function () {
            expect(sut.getLanguage('en_US')).toEqual('en');
        });

        it('should return the value that was passed in if the locale code is an invalid format', function () {
            expect(sut.getLanguage('_')).toBe('_');
        });
    });

    describe('Get Flag Images - ', function () {

        beforeEach(function () {
            $httpBackend.expectGET('/api/fi/locales').respond({status: true, data: locales});
            $httpBackend.flush();
            $rootScope.$digest();
        });

        it('should return the url of the medium flag image for a valid locale', function () {
            expect(sut.getFlagImageUrl(locales[0].locale)).toEqual(locales[0].desktopFlagUrl);
        });

        it('should return null for the medium flag image for an invalid locale', function () {
            expect(sut.getFlagImageUrl('bad_data')).toBe(null);
        });

    });

});

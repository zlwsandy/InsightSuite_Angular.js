'use strict';

describe('Formatter Specs - ', function () {
    var sut;
    var localeService;
    var mockLocales;

    beforeEach(module('mock/locales.json'));
    beforeEach(module('fi.common'));

    beforeEach(function () {

        localeService = jasmine.createSpyObj('localeService', ['findLocale']);
    });

    beforeEach(function () {
        module(function ($provide) {
            $provide.value('localeService', localeService);
        });
    });

    beforeEach(inject(function(formatter, _mockLocales_) {
        mockLocales = _mockLocales_;
        sut = formatter;
    }));

    describe('en_US - ', function () {

        beforeEach(function () {
            localeService.findLocale.and.returnValue(mockLocales.en_US);
        });

        var localeCode = 'en_US';

        it('should format positive numbers', function () {
            expect(sut.formatNumber(2929, localeCode)).toEqual("2,929");
            expect(sut.formatNumber(5284.06, localeCode)).toEqual("5,284.06");
            expect(sut.formatNumber(5, localeCode)).toEqual("5");
            expect(sut.formatNumber(583838, localeCode)).toEqual("583,838");
        });

        it('should format strings as numbers', function () {
            expect(sut.formatNumber("2929", localeCode)).toEqual("2,929");
        });

        it('should format negative numbers', function () {
            expect(sut.formatNumber(-3367, localeCode)).toEqual("-3,367");
            expect(sut.formatNumber(-5284.06, localeCode)).toEqual("-5,284.06");
            expect(sut.formatNumber(-5, localeCode)).toEqual("-5");
            expect(sut.formatNumber(-583838, localeCode)).toEqual("-583,838");
        });

        it('should return the infinity symbol if Infinity is provided', function () {
            expect(sut.formatNumber(Infinity, localeCode)).toEqual('\u221e');
        });

        it('should format positive currency amounts', function () {
            expect(sut.formatCurrency(2929, localeCode)).toEqual('$2,929.00');
            expect(sut.formatCurrency(2929.17, localeCode)).toEqual('$2,929.17');
        });

        it('should format negative currency amounts', function () {
            expect(sut.formatCurrency(-2929, localeCode)).toEqual('$-2,929.00');
        });

        it('should not include the currency symbol if false is provided for hideCurrencySymbol', function () {
            expect(sut.formatCurrency(-2929, localeCode, undefined, true)).toEqual('-2,929.00');
        });

        it('should round numbers to the formats specified fraction digits', function () {
            expect(sut.formatNumber(5284.0303333, localeCode)).toEqual("5,284.030");
        });

        it('should round currency to the formats specified fraction digits', function () {
            expect(sut.formatCurrency(5284.0303333, localeCode)).toEqual("$5,284.03");
        });
    });

    describe('fr_FR - ', function () {

        beforeEach(function () {
            localeService.findLocale.and.returnValue(mockLocales.fr_FR);
        });

        var localeCode = 'fr_FR';

        it('should format positive numbers', function () {
            expect(sut.formatNumber(2929, localeCode)).toEqual("2 929");
            expect(sut.formatNumber(5284.06, localeCode)).toEqual("5 284,06");
            expect(sut.formatNumber(5, localeCode)).toEqual("5");
            expect(sut.formatNumber(583838, localeCode)).toEqual("583 838");
        });

        it('should format strings as numbers', function () {
            expect(sut.formatNumber("2929", localeCode)).toEqual("2 929");
        });

        it('should format negative numbers', function () {
            expect(sut.formatNumber(-3367, localeCode)).toEqual("-3 367");
            expect(sut.formatNumber(-5284.06, localeCode)).toEqual("-5 284,06");
            expect(sut.formatNumber(-5, localeCode)).toEqual("-5");
            expect(sut.formatNumber(-583838, localeCode)).toEqual("-583 838");
        });

        it('should return the infinity symbol if Infinity is provided', function () {
            expect(sut.formatNumber(Infinity, localeCode)).toEqual('\u221e');
        });

        it('should format positive currency amounts', function () {
            expect(sut.formatCurrency(2929, localeCode)).toEqual('€2 929,00');
            expect(sut.formatCurrency(2929.17, localeCode)).toEqual('€2 929,17');
        });

        it('should format negative currency amounts', function () {
            expect(sut.formatCurrency(-2929, localeCode)).toEqual('€-2 929,00');
        });

        it('should not include the currency symbol if false is provided for hideCurrencySymbol', function () {
            expect(sut.formatCurrency(-2929, localeCode, undefined, true)).toEqual('-2 929,00');
        });

        it('should round numbers to the formats specified fraction digits', function () {
            expect(sut.formatNumber(5284.0303333, localeCode)).toEqual("5 284,030");
        });

        it('should round currency to the formats specified fraction digits', function () {
            expect(sut.formatCurrency(5284.0303333, localeCode)).toEqual("€5 284,03");
        });
    });


    describe('zh_CN - ', function () {

        beforeEach(function () {
            localeService.findLocale.and.returnValue(mockLocales.zh_CN);
        });

        var localeCode = 'zh_CN';

        it('should format positive numbers', function () {
            expect(sut.formatNumber(2929, localeCode)).toEqual("2,929");
            expect(sut.formatNumber(5284.06, localeCode)).toEqual("5,284.06");
            expect(sut.formatNumber(5, localeCode)).toEqual("5");
            expect(sut.formatNumber(583838, localeCode)).toEqual("583,838");
        });

        it('should format strings as numbers', function () {
            expect(sut.formatNumber("2929", localeCode)).toEqual("2,929");
        });

        it('should format negative numbers', function () {
            expect(sut.formatNumber(-3367, localeCode)).toEqual("-3,367");
            expect(sut.formatNumber(-5284.06, localeCode)).toEqual("-5,284.06");
            expect(sut.formatNumber(-5, localeCode)).toEqual("-5");
            expect(sut.formatNumber(-583838, localeCode)).toEqual("-583,838");
        });

        it('should return the infinity symbol if Infinity is provided', function () {
            expect(sut.formatNumber(Infinity, localeCode)).toEqual('\u221e');
        });

        it('should format positive currency amounts', function () {
            expect(sut.formatCurrency(2929, localeCode)).toEqual('￥2,929.00');
            expect(sut.formatCurrency(2929.17, localeCode)).toEqual('￥2,929.17');
        });

        it('should format negative currency amounts', function () {
            expect(sut.formatCurrency(-2929, localeCode)).toEqual('￥-2,929.00');
        });

        it('should not include the currency symbol if false is provided for hideCurrencySymbol', function () {
            expect(sut.formatCurrency(-2929, localeCode, undefined, true)).toEqual('-2,929.00');
        });

        it('should round numbers to the formats specified fraction digits', function () {
            expect(sut.formatNumber(5284.0303333, localeCode)).toEqual("5,284.030");
        });

        it('should round currency to the formats specified fraction digits', function () {
            expect(sut.formatCurrency(5284.0303333, localeCode)).toEqual("￥5,284.03");
        });
    });

    describe('es_CO - ', function () {

        beforeEach(function () {
            localeService.findLocale.and.returnValue(mockLocales.es_CO);
        });

        var localeCode = 'es_CO';

        it('should format positive numbers', function () {
            expect(sut.formatNumber(2929, localeCode)).toEqual("2.929");
            expect(sut.formatNumber(5284.06, localeCode)).toEqual("5.284,06");
            expect(sut.formatNumber(5, localeCode)).toEqual("5");
            expect(sut.formatNumber(583838, localeCode)).toEqual("583.838");
        });

        it('should format strings as numbers', function () {
            expect(sut.formatNumber("2929", localeCode)).toEqual("2.929");
        });

        it('should format negative numbers', function () {
            expect(sut.formatNumber(-3367, localeCode)).toEqual("-3.367");
            expect(sut.formatNumber(-5284.06, localeCode)).toEqual("-5.284,06");
            expect(sut.formatNumber(-5, localeCode)).toEqual("-5");
            expect(sut.formatNumber(-583838, localeCode)).toEqual("-583.838");
        });

        it('should return the infinity symbol if Infinity is provided', function () {
            expect(sut.formatNumber(Infinity, localeCode)).toEqual('\u221e');
        });

        it('should format positive currency amounts', function () {
            expect(sut.formatCurrency(2929, localeCode)).toEqual('$2.929,00');
            expect(sut.formatCurrency(2929.17, localeCode)).toEqual('$2.929,17');
        });

        it('should format negative currency amounts', function () {
            expect(sut.formatCurrency(-2929, localeCode)).toEqual('$-2.929,00');
        });

        it('should not include the currency symbol if false is provided for hideCurrencySymbol', function () {
            expect(sut.formatCurrency(-2929, localeCode, undefined, true)).toEqual('-2.929,00');
        });

        it('should round numbers to the formats specified fraction digits', function () {
            expect(sut.formatNumber(5284.0303333, localeCode)).toEqual("5.284,030");
        });

        it('should round currency to the formats specified fraction digits', function () {
            expect(sut.formatCurrency(5284.0303333, localeCode)).toEqual("$5.284,03");
        });
    });

    describe('Unsupported Locale - ', function () {

        beforeEach(function () {
            localeService.findLocale.and.returnValue(null);
        });

        it('should return the exact value given if no locale code is specified', function () {
            expect(sut.formatNumber(2929, null)).toEqual(2929);
        });

        it('should return the exact value given if the locale code specified is not supported', function () {
            expect(sut.formatNumber(2929, 'pt_BR')).toEqual(2929);
        });
    });

    describe('Locale with no formats - ', function () {

        beforeEach(function () {
            localeService.findLocale.and.returnValue({
                locale : 'all',
                label : 'All Locales',
                flagImageUrl : null
            });
        });

        it('should return the exact value given if no formats are returned for the locale', function () {
            expect(sut.formatNumber(2929, null)).toEqual(2929);
        });
    });

    describe('Invalid Input - ', function () {

        beforeEach(function () {
            localeService.findLocale.and.returnValue(mockLocales.en_US);
        });

        describe('Format Number', function () {
            it('should return the exact value if a string is passed', function () {
                expect(sut.formatNumber('abc', null)).toEqual('abc');
            });

            it('should return the exact value if an empty string is passed', function () {
                expect(sut.formatNumber('', null)).toEqual('');
            });

            it('should return null if a null number is passed', function () {
                expect(sut.formatNumber(null, 'en_US')).toEqual(null);
            });

            it('should return undefined if an undefined number is passed', function () {
                expect(sut.formatNumber(undefined, 'en_US')).not.toBeDefined();
            });

            it('should return spaces if NaN is passed', function () {
                expect(sut.formatNumber(NaN, 'en_US')).toEqual('');
            });
        });

        describe('Format Currency', function () {
            it('should return the exact value if a string is passed', function () {
                expect(sut.formatCurrency('abc', null)).toEqual('abc');
            });

            it('should return the exact value if an empty string is passed', function () {
                expect(sut.formatCurrency('', null)).toEqual('');
            });

            it('should return null if a null number is passed', function () {
                expect(sut.formatCurrency(null, 'en_US')).toEqual(null);
            });

            it('should return undefined if an undefined number is passed', function () {
                expect(sut.formatCurrency(undefined, 'en_US')).not.toBeDefined();
            });

            it('should return spaces if NaN is passed', function () {
                expect(sut.formatCurrency(NaN, 'en_US')).toEqual('');
            });
        });



    });

    describe('Changing Locales - ', function () {

        var value = 2929;

        it('should allow for the locale to be changed on the fly', function () {

            localeService.findLocale.and.returnValue(mockLocales.en_US);
            expect(sut.formatNumber(value, 'en_US')).toEqual("2,929");

            localeService.findLocale.and.returnValue(mockLocales.fr_FR);
            expect(sut.formatNumber(value, 'fr_FR')).toEqual("2 929");
        });
    });

    describe('Number Format Display - ', function () {

        it('should return the correct format for en_US', function () {

            localeService.findLocale.and.returnValue(mockLocales.en_US);
            expect(sut.getNumberFormatDisplay('en_US')).toEqual("#,###.##");
        });

        it('should return the correct format for zh_CN', function () {

            localeService.findLocale.and.returnValue(mockLocales.zh_CN);
            expect(sut.getNumberFormatDisplay('zh_CN')).toEqual("#,###.##");
        });

        it('should return the correct format for fr_FR', function () {

            localeService.findLocale.and.returnValue(mockLocales.fr_FR);
            expect(sut.getNumberFormatDisplay('fr_FR')).toEqual("# ###,##");
        });

        it('should return the correct format for es_CO', function () {

            localeService.findLocale.and.returnValue(mockLocales.es_CO);
            expect(sut.getNumberFormatDisplay('es_CO')).toEqual("#.###,##");
        });
    });

    describe('Round At Threshold', function () {

        beforeEach(function () {
            localeService.findLocale.and.returnValue(mockLocales.en_US);
        });

        var localeCode = 'en_US';

        it('should correctly round down at threshold if roundAtThreshold is true', function () {
            expect(sut.formatCurrency(2929.44, localeCode, undefined, false, true)).toEqual('$2,929');
        });

        it('should correctly round up at threshold if roundAtThreshold is true', function () {
            expect(sut.formatCurrency(2929.66, localeCode, undefined, false, true)).toEqual('$2,930');
        });

        it('should not round if roundAtThreshold is true but the number is not over the threshold', function () {
            expect(sut.formatCurrency(77.66, localeCode, undefined, false, true)).toEqual('$77.66');
        });

        it('should not round if roundAtThreshold is false but the number is over the threshold', function () {
            expect(sut.formatCurrency(177.66, localeCode, undefined, false, false)).toEqual('$177.66');
        });

        it('should use the specified fraction size as priority if specified', function () {
            expect(sut.formatCurrency(177.66, localeCode, 4, false, false)).toEqual('$177.6600');
        });

        it('should use the specified fraction size up until the threshold if roundAtThreshold is true ', function () {
            expect(sut.formatCurrency(99.66, localeCode, 4, false, true)).toEqual('$99.6600');
        });

        it('should round at threshold after the threshold even if a fraction is specified ', function () {
            expect(sut.formatCurrency(199.66, localeCode, 4, false, true)).toEqual('$200');
        });
    });

    describe('Format to US - ', function () {

        it('should apply grouping if specified', function () {

            var value = "2,929.87";
            localeService.findLocale.and.returnValue(mockLocales.zh_CN);
            expect(sut.formatNumberToUS(value, 'zh_CN', true)).toEqual("2,929.87");
        });

        it('should format numbers with decimal values from Chinese formats', function () {

            var value = "2,929.87";
            localeService.findLocale.and.returnValue(mockLocales.zh_CN);
            expect(sut.formatNumberToUS(value, 'zh_CN')).toEqual("2929.87");
        });

        it('should format whole numbers from Chinese formats', function () {

            var value = "2292";
            localeService.findLocale.and.returnValue(mockLocales.zh_CN);
            expect(sut.formatNumberToUS(value, 'zh_CN')).toEqual("2292");
        });

        it('should apply grouping to French formats if specified', function () {

            var value = "2 929,87";
            localeService.findLocale.and.returnValue(mockLocales.fr_FR);
            expect(sut.formatNumberToUS(value, 'fr_FR', true)).toEqual("2,929.87");
        });

        it('should format numbers with decimal values from French formats', function () {

            var value = "2 929,87";
            localeService.findLocale.and.returnValue(mockLocales.fr_FR);
            expect(sut.formatNumberToUS(value, 'fr_FR')).toEqual("2929.87");
        });

        it('should format whole numbers from French formats', function () {

            var value = "2292";
            localeService.findLocale.and.returnValue(mockLocales.fr_FR);
            expect(sut.formatNumberToUS(value, 'fr_FR')).toEqual("2292");
        });

        it('should format numbers with decimal values from Colombian formats', function () {

            var value = "2.929,87";
            localeService.findLocale.and.returnValue(mockLocales.es_CO);
            expect(sut.formatNumberToUS(value, 'es_CO')).toEqual("2929.87");
        });

        it('should apply grouping to Colombian formats if specified', function () {

            var value = "2.929,87";
            localeService.findLocale.and.returnValue(mockLocales.es_CO);
            expect(sut.formatNumberToUS(value, 'es_CO', true)).toEqual("2,929.87");
        });

        it('should format whole numbers from Colombian formats', function () {

            var value = "2292";
            localeService.findLocale.and.returnValue(mockLocales.es_CO);
            expect(sut.formatNumberToUS(value, 'es_CO')).toEqual("2292");
        });

        it('should return spaces if spaces is given as the number value', function () {

            var value = "";
            localeService.findLocale.and.returnValue(mockLocales.es_CO);
            expect(sut.formatNumberToUS(value, 'es_CO')).toEqual("");
        });

        it('should return the given value if no locale is specified with a whole number', function () {

            var value = "150";
            expect(sut.formatNumberToUS(value, null)).toEqual("150");
        });

        it('should return undefined if an undefined value is specified', function () {

            expect(sut.formatNumberToUS(undefined, 'es_CO')).not.toBeDefined();
        });

        it('should return null if a null value is specified', function () {

            expect(sut.formatNumberToUS(null, 'es_CO')).toEqual(null);
        });

        it('should return the given value if no locale is specified with a fractional number', function () {

            var value = "150,55";
            expect(sut.formatNumberToUS(value, null)).toEqual("150,55");
        });

        it('should return the given value if an unsupported locale is specified', function () {

            var value = "150,55";
            localeService.findLocale.and.returnValue(null);
            expect(sut.formatNumberToUS(value, 'pt_BR')).toEqual("150,55");
        });

    });
});





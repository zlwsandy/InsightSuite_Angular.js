'use strict';

describe('Percentage Filter Specs', function () {
    var sut;

    // the module that the directive is in
    beforeEach(module('fi.common'));

    beforeEach(inject(function(percentageFilter) {
        sut = percentageFilter;
    }));

    it('should format to the specified number of decimals', function () {

        expect(sut(.56, 4)).toEqual('56.0000');
    });

    it('should format with zero decimal places if nothing is specified', function () {

        expect(sut(.56)).toEqual('56');
    });

    it('should display the percent sign if specified', function () {

        expect(sut(.56, 1, true)).toEqual('56.0%');
    });

    it('should not display the percent sign if specified', function () {

        expect(sut(.56, 1, false)).toEqual('56.0');
    });

    it('should return NaN if the given input is not a valid number', function () {

        var result = sut('test', 1, false);
        expect(isNaN(result)).toBe(true);
    });

    it('should format to zero decimal places if the decimal place argument is not a valid number', function () {

        expect(sut(.56, 'test', false)).toEqual('56');
    });
});

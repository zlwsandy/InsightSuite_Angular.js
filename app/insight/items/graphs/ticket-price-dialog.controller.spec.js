'use strict';

describe('Ticket Price Dialog Controller Specs - ', function () {
    var sut;
    var $rootScope;
    var $mdDialog;
    var formatter;

    var mockTestPrice = 50;
    var testPrice;
    var mockTicketPrice = 60;
    var ticketPrice;
    var formattedCurrency = '50.00';
    var numberFormatDisplay = 'xx.xx';

    // load module under test
    beforeEach(module('fi.insight'));

    // Setup spies
    beforeEach(function () {

        $mdDialog = jasmine.createSpyObj('$mdDialog', ['hide']);
        formatter = jasmine.createSpyObj('formatter', ['formatCurrency', 'getNumberFormatDisplay']);
        
    });

    // Setup mock injection using $provide.value
    beforeEach(function () {
        module(function ($provide) {
            $provide.value("$mdDialog", $mdDialog);
            $provide.value("currentLocale", {});
            $provide.value("ticketPrice", ticketPrice);
            $provide.value("testPrice", testPrice);
            $provide.value("formatter", formatter);
        })
    });

    var createController = function () {
        inject(function (_$rootScope_, $controller) {
            $rootScope = _$rootScope_;

            formatter.formatCurrency.and.returnValue(formattedCurrency);
            formatter.getNumberFormatDisplay.and.returnValue(numberFormatDisplay);

            sut = $controller('TicketPriceDialogController', {
                $scope: $rootScope.$new()
            });
        });
    };

    describe('Valid Dependencies', function () {

        beforeEach(function () {
            ticketPrice = mockTicketPrice;
            testPrice = mockTestPrice;

            createController();
        });

        describe('Initialization', function () {

            it('should set the min allowable to 0.01', function () {

                expect(sut.minAllowable).toEqual(0.01);
            });

            it('should set the max allowable to 2 * the test price', function () {

                var max = mockTestPrice * 2;
                expect(sut.maxAllowable).toEqual(max);
            });

            it('should correctly build validation params', function () {
                expect(sut.validationParams).toEqual({
                    min : formattedCurrency,
                    max : formattedCurrency,
                    format : numberFormatDisplay
                });
            });

            it('should call hide on mdDialog when close is called', function () {
                var action = 'cancel';

                sut.close(action);

                expect($mdDialog.hide).toHaveBeenCalledWith({
                    action : action,
                    ticketPrice : mockTicketPrice
                });
            });
        });
    });

    describe('Invalid Dependencies', function () {

        beforeEach(function () {
            ticketPrice = undefined;
            testPrice = undefined;

            createController();
        });

        describe('Initialization', function () {

            it('should default the test price to zero if one is not provided', function () {
                expect(sut.testPrice).toEqual(0);
            });

            it('should set the max allowable to zero if no test price is provided', function () {

                expect(sut.maxAllowable).toEqual(0);
            });
        });
    });
});

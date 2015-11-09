'use strict';

describe('Chart Config Factory', function () {
    var sut;
    var localeCode = 'en_US';
    var bounds = {
        lower : 0,
        upper: 50
    };

    beforeEach(module('fi.common'));

    beforeEach(inject(function (chartConfigFactory) {
        sut = chartConfigFactory;
    }));

    describe('Test Price', function () {

        var testPrice = 20;

        it('should have set the plot line color to blue', function () {

            var testPricePlotLine = sut.getTestPricePlotLine(20, localeCode, testPrice, bounds);

            expect(testPricePlotLine.label).toEqual(sut.getTestPriceLabel(20, localeCode, testPrice, bounds));
        });

        it('should have set the test price label as a property on the test price plotline', function () {

            var testPricePlotLine = sut.getTestPricePlotLine(20, localeCode, testPrice, bounds);

            expect(testPricePlotLine.color).toEqual(sut.colors.FI_BLUE);
        });

        it('should set the x coordinate to a positive value if the test price is greater than the recommendation price', function () {

            var pricingPlotLine = sut.getTestPricePlotLine(5, localeCode, testPrice, bounds);

            expect(pricingPlotLine.label.x).toEqual(25);
        });

        it('should set the y coordinate to a lower value if the test price is greater than the recommendation price', function () {

            var pricingPlotLine = sut.getTestPricePlotLine(5, localeCode, testPrice, bounds);

            expect(pricingPlotLine.label.y).toEqual(25);
        });

        it('should set the x coordinate to a negative value if the test price is within the graph bounds and lower than the recommendation price', function () {

            var pricingPlotLine = sut.getTestPricePlotLine(25, localeCode, testPrice, bounds);

            expect(pricingPlotLine.label.x).toEqual(-25);
        });

        it('should set the x coordinate to zero if the test price is not within the lower graph bounds and ' +
            'lower than the recommendation price', function () {

            var pricingPlotLine = sut.getTestPricePlotLine(25, localeCode, bounds.lower, bounds);

            expect(pricingPlotLine.label.x).toEqual(0);
        });

        it('should set the x coordinate to zero if the test price is not within the upper graph bounds', function () {

            var pricingPlotLine = sut.getTestPricePlotLine(25, localeCode, bounds.upper, bounds);

            expect(pricingPlotLine.label.x).toEqual(0);
        });

        it('should set the y coordinate to a high value if the test price is lower than the recommendation price', function () {

            var pricingPlotLine = sut.getTestPricePlotLine(25, localeCode, testPrice, bounds);

            expect(pricingPlotLine.label.y).toEqual(315);
        });

        it('should set the x coordinate to a negative value if the test price is equal to the recommendation price', function () {

            var pricingPlotLine = sut.getTestPricePlotLine(20, localeCode, testPrice, bounds);

            expect(pricingPlotLine.label.x).toEqual(-25);
        });

        it('should set the y coordinate to a low value if the test price is equal to the recommendation price', function () {

            var pricingPlotLine = sut.getTestPricePlotLine(20, localeCode, testPrice, bounds);

            expect(pricingPlotLine.label.y).toEqual(75);
        });

        it('should set the label background color to blue', function () {
            var label = sut.getTestPriceLabel(20, localeCode, testPrice, bounds);

            expect(label.style.backgroundColor).toEqual(sut.colors.FI_BLUE);
        });

    });

    describe('Model Price Plotline', function () {

        var modelPrice = 20;

        it('should have set the model price label as a property on the model price plotline', function () {

            var plotLine = sut.getModelPricePlotLine(modelPrice, localeCode, 20, bounds);

            expect(plotLine.label).toEqual(sut.getModelPriceLabel(modelPrice, localeCode, 20, bounds));
        });

        it('should set the plotline color to green', function () {

            var plotLine = sut.getModelPricePlotLine(modelPrice, localeCode, 20, bounds);

            expect(plotLine.color).toEqual(sut.colors.FI_GREEN);
        });

        it('should set the x coordinate to a positive value if the model price is greater than the test price', function () {

            var plotLine = sut.getModelPricePlotLine(modelPrice, localeCode, 10, bounds);

            expect(plotLine.label.x).toEqual(25);
        });

        it('should set the y coordinate to a low value if the model price is greater than the test price', function () {

            var plotLine = sut.getModelPricePlotLine(modelPrice, localeCode, 10, bounds);

            expect(plotLine.label.y).toEqual(25);
        });

        it('should set the x coordinate to a negative value if the model price is less than the test price', function () {

            var plotLine = sut.getModelPricePlotLine(modelPrice, localeCode, 25, bounds);

            expect(plotLine.label.x).toEqual(-25);
        });

        it('should set the x coordinate to zero if the model price is not within the lower graph bounds and ' +
            'lower than the test price', function () {

            var pricingPlotLine = sut.getModelPricePlotLine(bounds.lower, localeCode, 20, bounds);

            expect(pricingPlotLine.label.x).toEqual(0);
        });

        it('should set the x coordinate to zero if the test price is not within the upper graph bounds', function () {

            var pricingPlotLine = sut.getModelPricePlotLine(bounds.upper, localeCode, 20, bounds);

            expect(pricingPlotLine.label.x).toEqual(0);
        });

        it('should set the y coordinate to a high value if the model price is less than the test price', function () {

            var plotLine = sut.getModelPricePlotLine(modelPrice, localeCode, 25, bounds);

            expect(plotLine.label.y).toEqual(315);
        });

        it('should set the x coordinate to a positive value if the test price is equal to the recommendation price', function () {

            var pricingPlotLine = sut.getModelPricePlotLine(modelPrice, localeCode, 20, bounds);

            expect(pricingPlotLine.label.x).toEqual(25);
        });

        it('should set the y coordinate to a low value if the test price is equal to the recommendation price', function () {

            var pricingPlotLine = sut.getModelPricePlotLine(modelPrice, localeCode, 20, bounds);

            expect(pricingPlotLine.label.y).toEqual(25);
        });

        it('should set the label background color to green', function () {
            var label = sut.getModelPriceLabel(modelPrice, localeCode, 20, false);

            expect(label.style.backgroundColor).toEqual(sut.colors.FI_GREEN);
        });

    });

    describe('Max GM Price Plotline', function () {

        var maxGMPrice = 20;

        it('should have set the max gm price label as a property on the max gm price plotline', function () {

            var plotLine = sut.getMaxGMPricePlotLine(maxGMPrice, localeCode, 20, bounds);

            expect(plotLine.label).toEqual(sut.getMaxGMPriceLabel(maxGMPrice, localeCode, 20, bounds));
        });

        it('should set the plotline color to black', function () {

            var plotLine = sut.getMaxGMPricePlotLine(maxGMPrice, localeCode, 20, bounds);

            expect(plotLine.color).toEqual(sut.colors.FI_BLACK);
        });

        it('should set the x coordinate to a positive value if the max gm price is greater than the test price', function () {

            var plotLine = sut.getMaxGMPricePlotLine(maxGMPrice, localeCode, 5, bounds);

            expect(plotLine.label.x).toEqual(25);
        });

        it('should set the y coordinate to a high value if the max gm price is greater than the test price', function () {

            var plotLine = sut.getMaxGMPricePlotLine(maxGMPrice, localeCode, 5, bounds);

            expect(plotLine.label.y).toEqual(25);
        });

        it('should set the x coordinate to a negative value if the max gm price is less than the test price', function () {

            var plotLine = sut.getMaxGMPricePlotLine(maxGMPrice, localeCode, 25, bounds);

            expect(plotLine.label.x).toEqual(-25);
        });

        it('should set the x coordinate to zero if the max gm price is not within the lower graph bounds and ' +
            'lower than the test price', function () {

            var pricingPlotLine = sut.getMaxGMPricePlotLine(0, localeCode, 20, bounds);

            expect(pricingPlotLine.label.x).toEqual(0);
        });

        it('should set the x coordinate to zero if the max gm price is not within the upper graph bounds', function () {

            var pricingPlotLine = sut.getMaxGMPricePlotLine(50, localeCode, 20, bounds);

            expect(pricingPlotLine.label.x).toEqual(0);
        });

        it('should set the y coordinate to a low value if the max gm price is greater than the test price', function () {

            var plotLine = sut.getMaxGMPricePlotLine(maxGMPrice, localeCode, 5, bounds);

            expect(plotLine.label.y).toEqual(25);
        });

        it('should set the x coordinate to a positive value if the test price is equal to the recommendation price', function () {

            var pricingPlotLine = sut.getMaxGMPricePlotLine(maxGMPrice, localeCode, 20, bounds);

            expect(pricingPlotLine.label.x).toEqual(25);
        });

        it('should set the y coordinate to a low value if the test price is equal to the recommendation price', function () {

            var pricingPlotLine = sut.getMaxGMPricePlotLine(maxGMPrice, localeCode, 20, bounds);

            expect(pricingPlotLine.label.y).toEqual(25);
        });

        it('should set the label background color to black', function () {
            var label = sut.getMaxGMPriceLabel(maxGMPrice, localeCode, 20, bounds);

            expect(label.style.backgroundColor).toEqual(sut.colors.FI_BLACK);
        });
    });

    describe('Pricing Plotlines', function () {

        it('should add a test price plotline to the plotlines array', function () {

            var item = {
                testPrice : 20,
                modelPrice : 30,
                maxGMPrice : 40
            };

            var plotLines = sut.getPricingPlotLines(item, true, localeCode, bounds);

            expect(_.any(plotLines, function (plotLine) {
                return plotLine.value === item.testPrice;
            })).toBe(true);
        });

        it('should add a max gm price plotline to the plotlines array if maxGMPricing is enabled', function () {

            var item = {
                testPrice : 20,
                modelPrice : 30,
                maxGMPrice : 40
            };

            var plotLines = sut.getPricingPlotLines(item, true, localeCode, bounds);

            expect(_.any(plotLines, function (plotLine) {
                return plotLine.value === item.maxGMPrice;
            })).toBe(true);
        });

        it('should not add a model price plotline to the plotlines array if maxGMPricing is enabled', function () {

            var item = {
                testPrice : 20,
                modelPrice : 30,
                maxGMPrice : 40
            };

            var plotLines = sut.getPricingPlotLines(item, true, localeCode, bounds);

            expect(_.any(plotLines, function (plotLine) {
                return plotLine.value === item.modelPrice;
            })).toBe(false);
        });

        it('should add a model price plotline to the plotlines array if maxGMPricing is not enabled', function () {

            var item = {
                testPrice : 20,
                modelPrice : 30,
                maxGMPrice : 40
            };

            var plotLines = sut.getPricingPlotLines(item, false, localeCode, bounds);

            expect(_.any(plotLines, function (plotLine) {
                return plotLine.value === item.modelPrice;
            })).toBe(true);
        });

        it('should not add a max gm price plotline to the plotlines array if maxGMPricing is not enabled', function () {

            var item = {
                testPrice : 20,
                modelPrice : 30,
                maxGMPrice : 40
            };

            var plotLines = sut.getPricingPlotLines(item, false, localeCode, bounds);

            expect(_.any(plotLines, function (plotLine) {
                return plotLine.value === item.maxGMPrice;
            })).toBe(false);
        });
    });
});

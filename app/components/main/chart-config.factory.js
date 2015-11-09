/**
 * Chart Config Factory for common functionality and styles for charts and graphs
 */
(function () {
    'use strict';

    /* @ngInject */
    function ChartConfigFactory(formatter, $translate, _, localeService) {

        var DEFAULT_VALUE = '0.00';
        var xOffSets = {
            left : -25,
            right : 25,
            center : 0
        };
        var yOffSets = {
            top : 25,
            topSecondary : 75,
            bottom : 315
        };
        var zIndices = {
            upper : 5,
            lower : 4
        };

        /**
         * Returns the HTML to show as the price label
         *
         * @param price - Price value
         * @param localeCode - Locale for formatting
         * @param translationKey - Translation key for the label
         * @returns {string} - String representation of HTML
         */
        var getPriceLabelHtml = function (price, localeCode, translationKey) {
            return '<div class="price-label">' +
                getPriceLabelText(getCurrency(price, localeCode), getSymbol(localeCode)) +
                '<br/><span class="price-label-font">' + $translate.instant(translationKey) + '</span></div>';
        };

        /**
         * Formats currency for display on the graph
         * @param price
         * @param localeCode
         * @returns {*}
         */
        var getCurrency = function (price, localeCode) {
            return formatter.formatCurrency(price, localeCode, undefined, false, true);
        };

        /**
         * Gets the currency symbol according to a locale code
         *
         * @param localeCode
         * @returns {*}
         */
        var getSymbol = function (localeCode) {
            var localeInfo = localeService.findLocale(localeCode);
            return localeInfo && localeInfo.numberFormat ? localeInfo.numberFormat.currencySymbol : '';
        };

        /**
         * Gets the HTML label text for pricing labels
         *
         * @param currency
         * @param symbol
         * @returns {string}
         */
        var getPriceLabelText = function (currency, symbol) {
            return currency.toString().split(symbol).join('<span class="price-label-uom">' + symbol + '</span>');
        };

        /**
         * Returns the coordinates for the label.  Coordinates are based off the price for the label in comparison
         * to other prices of labels displayed in the graph
         *
         * @param recommendationPrice - Can be Model Price / Max GM Price depending on insight pricing
         * @param testPrice - Test price for the item
         * @param isTestPriceLabel - Whether or not this label is for the test price
         * @param bounds - Bounds of the graph (min/max of the x axis)
         * @returns {{}}
         */
        var getLabelCoordinates = function (recommendationPrice, testPrice, isTestPriceLabel, bounds) {
            var coordinates = {};

            var isWithinBounds = function (price) {
                return price > bounds.lower && price < bounds.upper;
            };

            testPrice = parseFloat(testPrice);
            recommendationPrice = parseFloat(recommendationPrice);

            if (isTestPriceLabel) {
                if (testPrice > recommendationPrice) {
                    // If the test price is within the bounds of the graph, shift it right.  Otherwise center it on the
                    //  the plotline
                    coordinates.x = isWithinBounds(testPrice) ? xOffSets.right : xOffSets.center;
                    coordinates.y = yOffSets.top;

                } else if (testPrice < recommendationPrice) {
                    // If the test price is within the bounds of the graph, shift it left.  Otherwise center it on the
                    //  the plotline
                    coordinates.x = isWithinBounds(testPrice) ? xOffSets.left : xOffSets.center;
                    coordinates.y = yOffSets.bottom;

                } else if (testPrice === recommendationPrice) {
                    coordinates.x = isWithinBounds(testPrice) ? xOffSets.left : xOffSets.center;
                    coordinates.y = yOffSets.topSecondary;  // Top secondary is so that it shows directly under rec price
                }
            } else {
                if (testPrice > recommendationPrice) {
                    // If the rec price is within the bounds of the graph, shift it right.  Otherwise center it on the
                    //  the plotline
                    coordinates.x = isWithinBounds(recommendationPrice) ? xOffSets.left : xOffSets.center;
                    coordinates.y = yOffSets.bottom;

                } else if (testPrice < recommendationPrice) {
                    // If the rec price is within the bounds of the graph, shift it right.  Otherwise center it on the
                    //  the plotline
                    coordinates.x = isWithinBounds(recommendationPrice) ? xOffSets.right : xOffSets.center;
                    coordinates.y = yOffSets.top;

                } else if (testPrice === recommendationPrice) {
                    coordinates.x = isWithinBounds(recommendationPrice) ? xOffSets.right : xOffSets.center;
                    coordinates.y = yOffSets.top;
                }
            }

            return coordinates;
        };


        return {
            // Colors according to the color palette
            colors : {
                FI_BLUE : '#1a99ce',
                FI_RED : '#cd2027',
                FI_PINK : '#ffcccc',
                FI_GREY : '#818181',
                FI_ORANGE : '#FF9100',
                FI_BLACK : '#000',
                FI_WHITE : '#fff',
                FI_GREEN : '#339900',
                FI_LOVE : '#ff9999',
                FI_HATE : '#333333'
            },

            /**
             * Gets a plotLine object for use in the plotLines property of a chart
             *
             * @param color - Text representation of line color.  Can be  hex value or text (i.e. yellow)
             * @param value - Value where line will appear
             * @returns {{color: *, value: *, width: number}}
             */
            getDefaultPlotLineStyle : function () {
                return {
                    width: 3,           // Width of the line
                    zIndex : 5
                };
            },

            /**
             * Default styles for all plotline labels
             *
             * @returns {{}}
             */
            getDefaultPlotLineLabelStyle : function () {
                return {
                    rotation : 0,
                    align : 'center',
                    style : {
                        fontWeight : 'bold',
                        fontFamily : 'Helvetica',
                        fontSize: '1em',
                        padding: '5px 9px',
                        borderRadius : '7.5px',
                        color : this.colors.FI_WHITE
                    },
                    useHTML : true
                };
            },

            /**
             * Default props for all charts
             *
             * @returns {{}}
             */
            getChartDefaults : function () {
                return {
                    credits: {
                        enabled: false
                    },
                    exporting: {
                        enabled: false
                    }
                };
            },

            /**
             * Gets a plotLine object representing the Test Price (complete with label and appropriate colors)
             *
             * @param recommendationPrice - Recommendation price for comparison for label positioning
             * @param localeCode - Locale to use for formatting
             * @param testPrice - Test price (Value where line will appear)
             * @param bounds - Bounds of the graph (min/max of x axis)
             * @returns {}
             */
            getTestPricePlotLine : function (recommendationPrice, localeCode, testPrice, bounds) {

                testPrice = testPrice || DEFAULT_VALUE;

                return _.merge(this.getDefaultPlotLineStyle(), {
                    label : this.getTestPriceLabel(recommendationPrice, localeCode, testPrice, bounds),
                    color: this.colors.FI_BLUE,
                    value: testPrice,
                    zIndex : zIndices.upper
                });
            },

            /**
             * Gets a plotLine object representing the Max GM Price
             * (complete with label and appropriate colors)
             *
             * @param maxGMPrice - Value where line will appear
             * @param localeCode - Locale to use for formatting
             * @param testPrice - Test price for comparison for label positioning
             * @param bounds - Bounds of the graph (min/max of x axis)
             * @returns {}
             */
            getMaxGMPricePlotLine : function (maxGMPrice, localeCode, testPrice, bounds) {
                maxGMPrice = maxGMPrice || DEFAULT_VALUE;

                return _.merge(this.getDefaultPlotLineStyle(), {
                    label : this.getMaxGMPriceLabel(maxGMPrice, localeCode, testPrice, bounds),
                    color: this.colors.FI_BLACK,
                    value: maxGMPrice,
                    zIndex : zIndices.lower
                });
            },

            /**
             * Gets a plotLine object representing the Model Price
             * (complete with label and appropriate colors)
             *
             * @param modelPrice - Value where line will appear
             * @param localeCode - Locale to use for formatting
             * @param testPrice - Test price for comparison for label positioning
             * @param bounds - Bounds of the graph (min/max of x axis)
             * @returns {}
             */
            getModelPricePlotLine : function (modelPrice, localeCode, testPrice, bounds) {
                modelPrice = modelPrice || DEFAULT_VALUE;

                return _.merge(this.getDefaultPlotLineStyle(), {
                    label : this.getModelPriceLabel(modelPrice, localeCode, testPrice, bounds),
                    color: this.colors.FI_GREEN,
                    value: modelPrice,
                    zIndex : zIndices.lower
                });
            },

            /**
             * Returns the label for the Max GM Price Plotline
             *
             * @param maxGMPrice
             * @param localeCode
             * @param testPrice
             * @param bounds - Bounds of the graph (min/max of the x axis)
             * @returns {*}
             */
            getMaxGMPriceLabel : function (maxGMPrice, localeCode, testPrice, bounds) {
                return _.merge(this.getDefaultPlotLineLabelStyle(), getLabelCoordinates(maxGMPrice, testPrice, false, bounds), {
                    text: getPriceLabelHtml(maxGMPrice, localeCode, 'MAX_GROSS_MARGIN'),
                    style : {
                        backgroundColor: this.colors.FI_BLACK
                    }
                });
            },

            /**
             * Returns the label for the Model Price Plotline
             *
             * @param modelPrice
             * @param localeCode
             * @param testPrice
             * @param bounds - Bounds of the graph (min/max of the x axis)
             * @returns {*}
             */
            getModelPriceLabel : function (modelPrice, localeCode, testPrice, bounds) {
                return _.merge(this.getDefaultPlotLineLabelStyle(), getLabelCoordinates(modelPrice, testPrice, false, bounds), {
                    text: getPriceLabelHtml(modelPrice, localeCode, 'MODEL_PRICE'),
                    style : {
                        backgroundColor: this.colors.FI_GREEN
                    }
                });
            },

            /**
             * Returns the label for the Test Price Plotline
             *
             * @param testPrice
             * @param localeCode
             * @param testPrice
             * @param bounds - Bounds of the graph (min/max of the x axis)
             * @returns {*}
             */
            getTestPriceLabel : function (recommendationPrice, localeCode, testPrice, bounds) {
                return _.merge(this.getDefaultPlotLineLabelStyle(), getLabelCoordinates(recommendationPrice, testPrice, true, bounds), {
                    text: getPriceLabelHtml(testPrice, localeCode, 'TEST_PRICE'),
                    style : {
                        backgroundColor: this.colors.FI_BLUE
                    }
                });
            },

            /**
             * Currency formatter for use with axis labels
             *
             * @returns {string}
             */
            getCurrencyFormatter : function (localeCode) {

                return function () {
                    /*jshint validthis:true */
                    return formatter.formatCurrency(this.value, localeCode, undefined, false, true);
                };
            },

            /**
             * Returns an object that represents an empty 'helper' series, for use in the chart legend.  Used for the
             * plotLines as it is currently not possible in Highcharts to set a legend for plotLines
             *
             * @param translate - Key for translation
             * @param color - Color for series, which will show in legend
             * @returns {{name: *, color: *}}
             */
            getHelperSeriesForLegend : function (translate, color) {
                return {
                    name : $translate.instant(translate),
                    color: color,
                    type : 'areaspline',
                    events: {
                        legendItemClick: function () {
                            return false;
                        }
                    }
                };
            },

            /**
             * Returns an array of pricing plotlines for use on pricing graphs
             *
             * @param item - Item containing price values (testPrice, modelPrice, maxGMPrice)
             * @param maxGmPricingEnabled - Whether or not Max GM Pricing is enabled for the item's insight
             * @param locale - Locale for formatting
             * @param bounds - Bounds of the graph (min/max of x axis)
             *
             * @returns {Array} - Array of plotline objects
             */
            getPricingPlotLines : function (item, maxGmPricingEnabled, locale, bounds) {

                var plotLines = [];
                var pricingPlotline;

                // Determine what the recommendation price is based on whether max GM pricing is enabled
                var recommendationPrice = maxGmPricingEnabled ? item.maxGMPrice : item.modelPrice;

                // Test price plotline is always displayed
                var testPricePlotline = this.getTestPricePlotLine(recommendationPrice, locale, item.testPrice, bounds);

                // Get the appropriate plotline based on whether max GM pricing is enabled
                if (maxGmPricingEnabled) {
                    pricingPlotline = this.getMaxGMPricePlotLine(recommendationPrice, locale, item.testPrice, bounds);
                } else {
                    pricingPlotline = this.getModelPricePlotLine(recommendationPrice, locale, item.testPrice, bounds);
                }

                plotLines.push(testPricePlotline);
                plotLines.push(pricingPlotline);

                return plotLines;
            }
        };
    }

    angular
        .module('fi.common')
        .service('chartConfigFactory', ChartConfigFactory);
}());

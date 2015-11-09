/**
 * @name DemandCurve
 * @restrict E
 * @module fi.insight
 *
 * @description Displays the demand curve as a Highcharts graph for the given item
 *
 * @param {item=} item : The item to graph for the demand curve
 * @param {insightPricingEnabled=} insightPricingEnabled : a boolean representing whether the insight has pricing enabled
 * @param {maxGmPricingEnabled=} maxGmPricingEnabled : a boolean representing whether the insight has max gm pricing enabled
 *
 * @usage
 *   <demand-curve
 *      item="someController.item"
 *      current-locale="someController.currentLocale"
 *      insight-pricing-enabled="someController.insight.pricingEnabled"
 *      max-gm-pricing-enabled="someController.insight.maxGrossMargin">
 *  </demand-curve>
 */
(function () {
    'use strict';

    /* @ngInject */
    function DemandCurveDirective() {
        return {
            restrict : 'E',
            template : '<highchart class="demand-curve" config="DemandCurveController.chartConfig"></highchart>',
            controller : DemandCurveController,
            controllerAs : 'DemandCurveController',
            bindToController : true,
            scope : {
                item : '=',
                currentLocale : '=',
                insightPricingEnabled : '=',
                maxGmPricingEnabled : '='
            }
        };
    }

    function DemandCurveController(chartConfigFactory, _) {
        var vm = this;

        var plotLines;

        // Check that the curveData path exists on the item.  If not, set it to an empty object
        if (!_.has(vm, 'item.demandCurve.curveData')) {
            _.set(vm, 'item.demandCurve.curveData', {});
        }

        var bounds = {
            lower : 0,
            upper : vm.item.testPrice * 2
        };

        var totalXAxisPoints = 9;

        // Parse the curve data into a nested array of coordinates that is sorted
        //  Note, that doing this in an 'init' function will cause the chart to display empty
        var insightData = _.chain(vm.item.demandCurve.curveData)
            .pairs()
            .map(function (point) {

                // Default any falsy values in the data to be zero otherwise graph will not show
                point[0] = point[0] || 0;
                point[1] = point[1] || 0;

                // Convert the x-axis value to numbers otherwise Highcharts will increment the values by one, causing
                //  the x-axis labels to be out of sync
                point[0] = parseInt(point[0], 10);
                return point;
            })
            .sortBy(function (val) {
                return val[0];
            })
            .value();


        /**
         * Main Chart Config
         */
        vm.chartConfig = {

            options : _.assign(chartConfigFactory.getChartDefaults(), {
                //This is the Main Highcharts chart config. Any Highchart options are valid here.
                //will be overriden by values specified below.
                chart: {
                    type: 'areaspline',
                    marginLeft: 70, // Make y axis align with ticket price curve.
                    marginRight: 50, // Allow room for plot line labels on the right side of the plot area.
                    plotBorderWidth: 1,
                    plotBorderColor: chartConfigFactory.colors.FI_BLACK
                },
                legend: {
                    enabled: false
                },
                tooltip : {
                    enabled : false
                }
            }),
            //Series object (optional) - a list of series using normal highcharts series options.
            series: [
                {
                    name: '',
                    showInLegend: false,
                    title: '',
                    data: insightData,
                    lineWidth : 0,
                    lineColor: chartConfigFactory.colors.FI_PINK,
                    fillColor : chartConfigFactory.colors.FI_PINK,
                    marker: {
                        enabled : false,
                        fillColor: chartConfigFactory.colors.FI_BLUE,
                        lineWidth: 0,
                        lineColor: chartConfigFactory.colors.FI_BLUE
                    },
                    states : {
                        hover: {
                            //lineWidthPlus : 0  // lineWidthPlus will shut off the spline line from bolding on hover
                            enabled : false
                        }
                    }
                }
            ],
            //Title configuration (optional)
            title: {
                text: ''
            },
            //Configuration for the xAxis (optional). Currently only one x axis can be dynamically controlled.
            //properties currentMin and currentMax provied 2-way binding to the chart's maximimum and minimum
            xAxis: {
                min: bounds.lower - 0.1,
                max: bounds.upper + 1,
                title: '',
                name : '',
                tickInterval: bounds.upper / (totalXAxisPoints - 1), // Subtract one to account for zero
                tickColor: chartConfigFactory.colors.FI_WHITE,
                labels: {
                    formatter: chartConfigFactory.getCurrencyFormatter(vm.currentLocale.locale)
                },
                gridLineWidth: 1
            },
            yAxis : {
                gridLineWidth: 0,
                title: '',
                name : '',
                labels : {
                    enabled : false
                }
            }
        };

        // Pricing Plotlines
        if (vm.insightPricingEnabled) {
            plotLines = chartConfigFactory.getPricingPlotLines(vm.item, vm.maxGmPricingEnabled, vm.currentLocale.locale, bounds);

            vm.chartConfig.xAxis.plotLines = plotLines;
        }
    }

    angular
        .module('fi.insight')
        .directive('demandCurve', DemandCurveDirective);
}());


(function () {
    'use strict';

    /* @ngInject */
    function TicketPriceCurveDirective() {
        return {
            restrict : 'E',
            template : '<highchart class="ticket-price-curve" config="TicketPriceCurveController.chartConfig"></highchart>',
            controller : TicketPriceCurveController,
            controllerAs : 'TicketPriceCurveController',
            bindToController : true,
            scope : {
                item : '=',
                currentLocale : '=',
                insightPricingEnabled : '=',
                maxGmPricingEnabled : '='
            }
        };
    }

    function TicketPriceCurveController($scope, chartConfigFactory, _, formatter) {
        var vm = this;

        // Check that the curveData path exists on the item.  If not, set it to an empty object
        if (!_.has(vm, 'item.ticketPriceCurve.curveData')) {
            _.set(vm, 'item.ticketPriceCurve.curveData', {});
        }

        var bounds = {
            lower : 0,
            upper : vm.item.testPrice * 2
        };

        var totalXAxisPoints = 9;
        var plotLines;

        $scope.$watch(function () {
            return vm.item.ticketPriceCurve;
        }, function () {
            vm.chartConfig.series[0].data =
                _.chain(vm.item.ticketPriceCurve.curveData)
                    .pairs()
                    .map(function (point) {

                        // Default any falsy values in the data to be zero otherwise graph will not show
                        point[0] = point[0] || 0;
                        point[1] = point[1] || 0;

                        // Convert the x-axis value to numbers otherwise Highcharts will increment the values by one, causing
                        //  the x-axis labels to be out of sync
                        point[0] = parseFloat(point[0]);
                        return point;
                    })
                    .sortBy(function (val) {
                        return val[0];
                    })
                    .value();
        });

        /**
         * Main Chart Config
         */
        vm.chartConfig = {

            options : _.assign(chartConfigFactory.getChartDefaults(), {
                chart : {
                    type : 'spline',
                    marginLeft: 70, // Make y axis align with demand curve.
                    marginRight: 50,  // Allow room for plot line labels on the right side of the plot area.
                    plotBorderWidth: 1,
                    plotBorderColor: chartConfigFactory.colors.FI_BLACK
                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        stickyTracking: false
                    }
                },
                tooltip: {
                    // Remove the SVG border so it doesn't draw underneath the plot line labels.
                    borderWidth: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.0)',
                    shadow: false,
                    formatter: function () {
                        return '<b>Price: </b>' + formatter.formatCurrency(this.x, vm.currentLocale.locale, undefined, false, true) +
                                '<br><b>Demand Percentage: </b>' + formatter.formatNumber(this.y, vm.currentLocale.locale, 0) + '%';
                    },
                    useHTML: true
                }
            }),
            //Series object (optional) - a list of series using normal highcharts series options.
            series: [
                {
                    name: '',
                    showInLegend: false,
                    title: '',
                    /* data: The 'data' property is set by the watcher up above. */
                    lineColor: chartConfigFactory.colors.FI_GREY,
                    marker: {
                        fillColor: chartConfigFactory.colors.FI_ORANGE,
                        lineWidth: 0,
                        lineColor: chartConfigFactory.colors.FI_ORANGE
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
            xAxis: {
                min: bounds.lower - 0.1,
                max : bounds.upper + 1,
                title: '',
                name : '',
                tickInterval: bounds.upper / (totalXAxisPoints - 1), // Subtract one to account for zero
                tickColor: chartConfigFactory.colors.FI_WHITE,
                labels: {
                    formatter: chartConfigFactory.getCurrencyFormatter(vm.currentLocale.locale)
                },
                gridLineWidth: 1,
                gridZIndex : 0
            },
            yAxis : {
                gridLineWidth: 0,
                min : 0,
                max : 100,
                tickInterval: 10,
                labels: {
                    format: '{value}%'
                },
                name : '',
                title : {
                    text : 'Demand Percentage'
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
        .directive('ticketPriceCurve', TicketPriceCurveDirective);
}());

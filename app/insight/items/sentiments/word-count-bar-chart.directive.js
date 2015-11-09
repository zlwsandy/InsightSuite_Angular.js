(function () {
    'use strict';

    function WordCountBarChart() {
        return {
            restrict : 'E',
            templateUrl : 'insight/items/sentiments/word-count-bar-chart.directive.html',
            controller : WordCountController,
            controllerAs : 'WordCountController',
            bindToController : true,
            scope : {
                topWords: '=',
                positiveWords: '=',
                negativeWords: '=',
                height: '='
            }
        };
    }


    function WordCountController(chartConfigFactory, _) {
        var vm = this;
        vm.chartConfig = {

            options : _.assign(chartConfigFactory.getChartDefaults(), {
                //This is the Main Highcharts chart config. Any Highchart options are valid here.
                //will be overriden by values specified below.
                chart: {
                    type: 'column'
                },
                legend: {
                    enabled: false
                },
                tooltip : {
                    enabled : false
                },
                plotOptions: {
                    series: {
                        pointPadding: 0.05,
                        minPointLength: 2,
                        states: {
                            hover: {
                                enabled: false
                            }
                        }
                    }
                }
            }),
            title: {
                text: null
            },
            yAxis: {
                title: null,
                labels: {
                    enabled: false
                },
                gridLineWidth: 0,
                gridZIndex: 0,
                maxPadding: 0
            },
            xAxis: {
                lineWidth: 0,
                tickWidth: 0,
                categories: vm.topWords,
                labels: {
                    style: {
                        fontSize: '1.25em'
                    }
                }
            },
            series: [{
                data: vm.positiveWords,
                color: chartConfigFactory.colors.FI_LOVE
            }, {
                data: vm.negativeWords,
                color: chartConfigFactory.colors.FI_HATE
            }]
        };

        if (vm.height && _.isNumber(vm.height)) {
            vm.chartConfig.options.chart.height = vm.height;
        }
    }

    angular.module('fi.insight')
    .directive('wordCountBarChart', WordCountBarChart);
}());

(function () {
    'use strict';

    function sentimentBarChart() {
        return {
            restrict : 'E',
            templateUrl : 'insight/items/sentiments/sentiment-bar-chart.directive.html',
            controller : SentimentBarChartController,
            controllerAs : 'sentimentBarChartController',
            bindToController : true,
            scope : {
                item : '=',
                currentLocale : '=',
                hideSentimentLabels : '='
            }
        };
    }

    function SentimentBarChartController() {
        var vm = this;
        var widthArray = [];
        var width;
        for (var i = 0; i < vm.item.sentimentPercentages.length; i++) {
            var decimalWidth = vm.item.sentimentPercentages[i];
            var realWidth = decimalWidth * 100;
            widthArray.push(realWidth);
        }
        vm.getWidth = function (title) {
            switch (title) {
            case 'love' :
                vm.loveWidth = widthArray[5];
                width = vm.loveWidth + '%';
                break;
            case 'like' :
                vm.likeWidth = widthArray[4];
                width = vm.likeWidth + '%';
                break;
            case 'notvoted' :
                vm.notvotedWidth = widthArray[0];
                width = vm.notvotedWidth + '%';
                break;
            case 'neutral' :
                vm.neutralWidth = widthArray[3];
                width = vm.neutralWidth + '%';
                break;
            case 'leave' :
                vm.leaveWidth = widthArray[2];
                width = vm.leaveWidth + '%';
                break;
            case 'hate' :
                vm.hateWidth = widthArray[1];
                width = vm.hateWidth + '%';
                break;
            }
            return {
                'width' : width
            };
        };

    }
    angular
    .module('fi.insight')
    .directive('sentimentBarChart', sentimentBarChart);
}());

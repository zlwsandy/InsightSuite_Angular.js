'use strict';

describe('Word Count Bar Chart Directive - ', function () {
    var $scope;
    var $compile;
    var element;
    var sut;
    var mockItemTopWords;
    var mockLocales;
    var localeService;

    var compileDirective = function (topWords, positiveWords, negativeWords) {
        $scope.topWords = topWords;
        $scope.positiveWords = positiveWords;
        $scope.negativeWords = negativeWords;
        
        element = angular.element('<word-count-bar-chart top-words="topWords" positive-words="positiveWords" negative-words="negativeWords" ></word-count-bar-chart>');

        $compile(element)($scope);
        $scope.$digest();

        sut = element.isolateScope().WordCountController;
    }
    
    beforeEach(module('fi.insight'));
    
    beforeEach(module('mock/item-top-words.json'));
    beforeEach(module('mock/locales.json'));
    
    beforeEach(function () {

        localeService = jasmine.createSpyObj('localeService', ['findLocale']);
    });
    
    beforeEach(function () {
        module(function ($provide) {
            $provide.value("localeService", localeService);
        });
    });
    
    
    beforeEach(module('insight/items/sentiments/word-count-bar-chart.directive.html'));

    beforeEach(inject(function(_$compile_, _$rootScope_, _mockItemTopWords_, _mockLocales_) {

        $compile = _$compile_;
        $scope = _$rootScope_;
        mockItemTopWords = _.cloneDeep(_mockItemTopWords_);
        mockLocales = _mockLocales_;

        $scope.$digest();

    }));
    
    describe('initilization - ', function () {
        beforeEach(function () {
            compileDirective([]);
        });
        
        it('should initialize data', function () {
            expect(sut).toBeDefined();
        });
        it('should set the chartData to an empty array', function () {
            var chartData = sut.chartConfig.xAxis.categories;
            expect(chartData).toEqual([]);
        });
        it('should not show labels', function () {
            var chartData = sut.chartConfig.yAxis.labels.enabled;
            expect(chartData).toBe(false);
        })
    })
    

});
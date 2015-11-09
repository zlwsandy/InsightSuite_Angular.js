'use strict';

describe('Insight Results Card directive specs - ', function () {
    var $scope, $compile, $httpBackend, element, sut;

    var mockInsight = {
        gameRunId: 185,
        name: 'FI-11517 Insight to reach COMPLETE',
        gameRunStatus: 'RESULTS',
        department: null,
        locale: 'en_US',
        insightId: 158,
        insightImageUrl: '/imageviewer.iv?f=/2014/158/1402131275385'
    };

    var compileDirective = function (insight) {

        $scope.insight = insight;

        element = angular.element('<insight-list-card insight="insight"></insight-list-card');

        $compile(element)($scope);
        $scope.$digest();

        sut = element.isolateScope().InsightListCardController;

    };

    beforeEach(module('fi.insight'));
    beforeEach(module('insight/list/insight-list-card.directive.html'));

    beforeEach(module(function ($provide) {
        $provide.value('insightItemsMoveToPreviewDialog', {});
    }));

    beforeEach(inject(function(_$compile_, _$rootScope_, _$httpBackend_) {
        $compile = _$compile_;
        $scope = _$rootScope_;
        $httpBackend = _$httpBackend_;

        $httpBackend.whenGET('images/ic_visibility_24px.svg').respond(200);
        $httpBackend.whenGET('images/ic_visibility_off_24px.svg').respond(200);
    }));

    describe('Initialization - ', function () {
        beforeEach(function () {
            compileDirective(mockInsight);
        });

        it('should have an Insight object', function () {
            expect(sut.insight).toBe(mockInsight);
        });

        it('should have an Insight object with no completionPercentageStr', function () {
            expect(sut.insight.completionPercentageStr).toEqual(undefined);
        });
    });

    describe('Initialization - ', function () {
        it('should have an Insight object with completionPercentageStr set to \'90\'', function () {
            var insight = angular.copy(mockInsight);
            insight.completionPercentage = 90;
            compileDirective(insight);
            expect(sut.insight.completionPercentageStr).toEqual('90');
        });

        it('should have an Insight object with completionPercentageStr set to \'1.1\'', function () {
            var insight = angular.copy(mockInsight);
            insight.completionPercentage = 113;
            compileDirective(insight);
            expect(sut.insight.completionPercentageStr).toEqual('1.1');
        });
    });


    describe('showLanguageCurrency - ', function () {

        it('showLanguageCurrency false because gameType is styleOPt', function () {

            mockInsight.gameType = 'THREE_PREFERENCE'
            compileDirective(mockInsight);
            expect(sut.showLanguageCurrency()).toBe(false);
        });

        it('showLanguageCurrency false because language is undefined', function () {

            mockInsight.gameType = 'WWTP';
            compileDirective(mockInsight);
            expect(sut.showLanguageCurrency()).toBe(false);
        });

        it('showLanguageCurrency false because currency is undefined', function () {

            mockInsight.gameType = 'WWTP';
            mockInsight.language = 'EN';
            compileDirective(mockInsight);
            expect(sut.showLanguageCurrency()).toBe(false);
        });

        it('showLanguageCurrency true', function () {

            mockInsight.gameType = 'WWTP';
            mockInsight.language = 'EN';
            mockInsight.currency = 'USD';
            compileDirective(mockInsight);
            expect(sut.showLanguageCurrency()).toBe(true);
        });

        it('showLanguageCurrency false because gametype styleopt and language and currency are set', function () {

            mockInsight.gameType = 'THREE_PREFERENCE';
            mockInsight.language = 'EN';
            mockInsight.currency = 'USD';
            compileDirective(mockInsight);
            expect(sut.showLanguageCurrency()).toBe(false);
        });
    });

});

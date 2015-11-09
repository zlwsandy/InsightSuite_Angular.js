'use strict';

describe('Insights List Controller Specs - ', function () {
    var $rootScope, company, isAdmin, insights, sut, localeSelection, status,
        $scope, insightListService, insightDataService, $q, announceService, gameRunStatusValue, $window, evt;

    var mockInsights = [ {
        createTime : 1432747830000,
        gameRunId : 185,
        name : 'Mock Insight 1',
        gameRunStatus : 'RESULTS',
        department : null,
        locale : 'en_US',
        insightId : 158,
        lastStatusChange : 1432751481000,
        insightImageUrl : '/imageviewer.iv?f=/2014/158/1402131275385',
        gameType: 'WWYP'
    }, {
        createTime : 1432743950000,
        gameRunId : 181,
        name : 'Mock Insight 2',
        gameRunStatus : 'RESULTS',
        department : null,
        locale : null,
        insightId : 154,
        lastStatusChange : 1432746381000,
        insightImageUrl : null,
        gameType: 'THREE_PREFERENCE'
    }, {
        createTime : 1432743950000,
        gameRunId : 200,
        name : 'Mock Insight 3',
        gameRunStatus : 'RESULTS',
        department : null,
        locale : null,
        insightId : 100,
        lastStatusChange : 1432746381000,
        insightImageUrl : null,
        gameType: 'WWYP'
    }, {
        createTime : 1432743950000,
        gameRunId : 201,
        name : 'Mock Insight 4',
        gameRunStatus : 'HIDDEN',
        department : null,
        locale : null,
        insightId : 101,
        lastStatusChange : 1432746381000,
        insightImageUrl : null,
        gameType: 'THREE_PREFERENCE'
    }];

    var mock$state;

    beforeEach(module('fi.insight'));

    // inject mocks
    beforeEach(function () {

        evt = {
            target : {
                classList : {
                    contains : function(){
                        return false;
                    }
                }
            }
        };

        localeSelection = {};

        mock$state = {
            'go' : jasmine.createSpy('$state go'),
            current: {
                data: {}
            }
        };

        announceService = jasmine.createSpyObj('announceService', [
            'error',
            'info'
        ]);

        $window = {
            location: {}
        };

        module(function ($provide) {
            insightDataService = jasmine.createSpyObj('insightDataService', ['getInsights'])
            insightListService = jasmine.createSpyObj('insightListService', ['loadMore']);

            $provide.value('company', mockCompany);
            $provide.value('localeSelection', localeSelection);
            $provide.value('$state', mock$state);
            $provide.value('insightDataService', insightDataService);
            $provide.value('insightListService', insightListService);
            $provide.value('announceService', announceService);
            $provide.value('$window', $window);
        });
    });

    // create controller under test
    var createController = function (isAdmin, insights) {
        inject(function (_$rootScope_, $controller, _$q_) {
            $rootScope = _$rootScope_;
            $q = _$q_;

            sut = $controller('InsightsListController', {
                $scope: ($scope = $rootScope.$new()),
                isAdmin: isAdmin,
                insights: insights
            });
        });
    };

    describe('Initialization - ', function () {

        beforeEach(function () {
            createController(true, mockInsights);
        });

        it('should set the company', function () {
            expect(sut.company).toBe(mockCompany);
        });

        it('should set the admin value', function () {
            expect(sut.isAdmin).toBe(true);
        });

    });

    describe('locale change', function () {
        beforeEach(function () {
            createController(true, mockInsights);
        });

        it('should request insights', function() {
            insightDataService.getInsights.and.returnValue($q.when(mockInsights));

            $scope.$digest();
            localeSelection.locale = 'new locale';
            $scope.$digest();

            expect(sut.currentLocale).toEqual('new locale');

        });

    });

    describe('Show Results Insights - ', function () {

        it('should show results insights when the status is SUMMARY_RESULTS', function () {
            mock$state.current.data = { status: 'SUMMARY_RESULTS' };
            createController(true, mockInsights);
            expect(sut.showResults()).toBe(true);
        });

        it('should not show results insights when the status is NOT SUMMARY_RESULTS', function () {
            mock$state.current.data = { status: 'NOT_RESULTS' };
            createController(true, mockInsights);
            expect(sut.showResults()).toBe(false);
        });
    });

    describe('Insight Click - ', function () {

        beforeEach(function () {
            createController(true, mockInsights);
        });

        it('should assign the current insight', function () {
            sut.navigateToInsight(evt, mockInsights[0]);
            expect(insightDataService.currentInsight).toEqual(mockInsights[0]);
        });

        it('should navigate to the items list for that insight', function () {
            sut.navigateToInsight(evt, mockInsights[0]);
            expect(mock$state.go).toHaveBeenCalledWith('insightTabWithLocale.items', { insightId: 158, locale: 'en_US' });
        });

        it('should set the locale parameter to empty if the insight locale is null', function () {
            sut.navigateToInsight(evt, mockInsights[2]);
            expect(mock$state.go).toHaveBeenCalledWith('insightTabWithLocale.items', { insightId: 100, locale: 'empty' });
        });

        it('should not do anything', function () {
            sut.navigateToInsight(undefined, mockInsights[0]);

            expect(insightDataService.currentInsight).not.toEqual(mockInsights[0]);
            expect(mock$state.go).not.toHaveBeenCalled();
        });

    });

    describe('StyleOpt Insights Click - ', function () {

        it('should navigate to the old UI for StyleOpt insights in RESULTS status for admins', function () {
            createController(true, mockInsights);
            sut.navigateToInsight(evt, mockInsights[1]);
            expect($window.location.href).toBe('/secure/results!list.fi?id=154');
        });

        it('should navigate to the old UI for StyleOpt insights in HIDDEN status for admins', function () {
            createController(true, mockInsights);
            sut.navigateToInsight(evt, mockInsights[3]);
            expect($window.location.href).toBe('/secure/results!list.fi?id=101');
        });

    });

    describe('Remove inisghts -', function () {

        it('should remove insight', function () {
            createController(true, mockInsights);
            mockInsights.data = mockInsights[0];
            $scope.$emit('removeInsight', mockInsights);

            mockInsights.splice(0, 1);

            expect(sut.insights).toEqual(mockInsights);
        });

    });

});

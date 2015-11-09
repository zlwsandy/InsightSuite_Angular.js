'use strict';

describe('insightListService', function () {
    var insightDataService, $rootScope, $q, sut;

    var returnVal = [12];
    returnVal.totalAvailable = 10;

    beforeEach(module('fi.insight'));

    beforeEach(module(function ($provide) {
        insightDataService = jasmine.createSpyObj('insightDataService', ['getInsights']);
        $provide.value('insightDataService', insightDataService);
    }));

    beforeEach(inject(function (_insightListService_, _$rootScope_, _$q_) {
        sut = _insightListService_;
        $rootScope = _$rootScope_;
        $q = _$q_;
    }));

    describe('fetchNewList()', function () {
        it('simple single request test applies response.', function () {
            insightDataService.getInsights.and.returnValue($q.when(returnVal));

            sut.fetchNewList();

            expect(insightDataService.getInsights).toHaveBeenCalled();

            expect(sut.insights.busy).toBe(true);
            expect(sut.insights.data.length).toBe(0);

            $rootScope.$digest();
            expect(sut.insights.busy).toBe(false);
            expect(sut.insights.data.length).toBe(1);
            expect(sut.totalAvailable).toEqual(returnVal.totalAvailable);
            expect(sut.totalFetched).toEqual(returnVal.length);
        });

        it('multiple request/response scenario only applies response from last request.', function () {
            insightDataService.getInsights.and.returnValue($q.when(returnVal));

            sut.fetchNewList();

            expect(insightDataService.getInsights).toHaveBeenCalled();

            expect(sut.insights.busy).toBe(true);
            expect(sut.insights.data.length).toBe(0);

            insightDataService.getInsights.and.returnValue($q.when([]));
            sut.fetchNewList();

            expect(sut.insights.busy).toBe(true);
            expect(sut.insights.data.length).toBe(0);

            // verify only empty list response was applied
            $rootScope.$digest();
            expect(sut.insights.busy).toBe(false);
            expect(sut.insights.data.length).toBe(0);
            expect(sut.totalAvailable).toEqual(undefined);
            expect(sut.totalFetched).toEqual(0);
        });
    });

    describe('loadMore()', function () {
        beforeEach(function () {
            insightDataService.getInsights.and.returnValue($q.when(returnVal));

            sut.fetchNewList();
        });

        
        it('loadMore() works when not busy.', function () {
            $rootScope.$digest();

            // make sure state of service is as expected
            expect(sut.insights.busy).toBe(false);
            expect(sut.insights.data.length).toBe(1);
            expect(sut.totalAvailable).toEqual(returnVal.totalAvailable);
            expect(sut.totalFetched).toEqual(returnVal.length);

            sut.loadMore();
            $rootScope.$digest();

            expect(sut.insights.busy).toBe(false);
            expect(sut.insights.data.length).toBe(2 * returnVal.length);
            expect(sut.totalAvailable).toEqual(returnVal.totalAvailable);
            expect(sut.totalFetched).toEqual(2 * returnVal.length);
            
        });

        it('loadMore() does nothing when busy.', function () {

            // make sure state of service is as expected
            expect(sut.insights.busy).toBe(true);
            expect(sut.insights.data.length).toBe(0);
            expect(sut.totalAvailable).toEqual(undefined);
            expect(sut.totalFetched).toEqual(0);

            insightDataService.getInsights.and.returnValue($q.when([]));
            sut.loadMore();
            $rootScope.$digest();

            expect(sut.insights.busy).toBe(false);
            expect(sut.insights.data.length).toBe(returnVal.length);
            expect(sut.totalAvailable).toEqual(returnVal.totalAvailable);
            expect(sut.totalFetched).toEqual(returnVal.length);
        });
    });

    describe('loadMore()', function () {
        beforeEach(function () {
            insightDataService.getInsights.and.returnValue($q.when(returnVal));

            sut.fetchNewList('big bang');
        });

        
        it('vm.fetchUpdatedSearchStringList & vm.fetchUpdatedLocaleList do not undo other properties.', function () {
            $rootScope.$digest();

            // make sure state of service is as expected
            expect(sut.insights.busy).toBe(false);
            expect(sut.insights.data.length).toBe(1);
            expect(sut.totalAvailable).toEqual(returnVal.totalAvailable);
            expect(sut.options.status).toEqual('big bang');
            expect(sut.options.nameLike).toEqual(undefined);
            expect(sut.options.locale).toEqual(undefined);
            expect(sut.totalFetched).toEqual(returnVal.length);

            sut.fetchUpdatedSearchStringList('milky');

            $rootScope.$digest();
            expect(sut.insights.busy).toBe(false);
            expect(sut.insights.data.length).toBe(1);
            expect(sut.totalAvailable).toEqual(returnVal.totalAvailable);
            expect(sut.options.status).toEqual('big bang');
            expect(sut.options.nameLike).toEqual('milky');
            expect(sut.options.locale).toEqual(undefined);
            expect(sut.totalFetched).toEqual(returnVal.length);

            sut.fetchUpdatedLocaleList('red planet');

            $rootScope.$digest();
            expect(sut.insights.busy).toBe(false);
            expect(sut.insights.data.length).toBe(1);
            expect(sut.totalAvailable).toEqual(returnVal.totalAvailable);
            expect(sut.options.status).toEqual('big bang');
            expect(sut.options.nameLike).toEqual('milky');
            expect(sut.options.locale).toEqual('red planet');
            expect(sut.totalFetched).toEqual(returnVal.length);
        });
    });

    describe('loadMore()', function () {
        beforeEach(function () {
            insightDataService.getInsights.and.returnValue($q.when(returnVal));

            sut.fetchNewList('big bang');
        });

        
        it('does not fetch beyond totalAvailable.', function () {
            $rootScope.$digest();

            // make sure state of service is as expected
            expect(sut.insights.busy).toBe(false);
            expect(sut.insights.data.length).toBe(1);
            expect(sut.totalAvailable).toEqual(returnVal.totalAvailable);
            expect(sut.options.status).toEqual('big bang');
            expect(sut.options.nameLike).toEqual(undefined);
            expect(sut.options.locale).toEqual(undefined);
            expect(sut.totalFetched).toEqual(returnVal.length);

            sut.totalAvailable = 1;
            sut.totalFetched = 1;

            insightDataService.getInsights.and.returnValue($q.when([]));
            sut.loadMore();
            $rootScope.$digest();

            // unchanged besides totalAvailable & totalFetched
            expect(sut.insights.busy).toBe(false);
            expect(sut.insights.data.length).toBe(1);
            expect(sut.totalAvailable).toEqual(1);
            expect(sut.options.status).toEqual('big bang');
            expect(sut.options.nameLike).toEqual(undefined);
            expect(sut.options.locale).toEqual(undefined);
            expect(sut.totalFetched).toEqual(1);
        });
    });
});

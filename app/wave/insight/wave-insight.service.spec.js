'use strict';

describe('waveInsightService', function () {
    beforeEach(module('fi.wave'));

    var $httpBackend;

    var service;

    beforeEach(inject(function (waveInsightService, _$httpBackend_) {
        service = waveInsightService;
        $httpBackend = _$httpBackend_;
    }));

    it('should make a properly formatted API call to get all the Insights for a wave', function () {

        $httpBackend.expectGET('../api/wave/1/baskets')
            .respond({
                status: true,
                data: [{
                    basketId: 46,
                    basketName: 'Pending Insight Sport Store',
                    basketStatus: 'Pending Approval',
                    createTime: 1410895939000
                }],
                message: null,
                totalAvailable: 1
            });

        service
            .getInsights(1)
            .then(function (result) {
                expect(result.data.status).toBe(true);
                expect(result.data.totalAvailable).toBe(1);
            });

        $httpBackend.flush();
    });
});

function getInsightsTestData() {
    return [{
        basketId: 42,
        basketName: 'Patterned High Price',
        basketStatus: 'Hidden',
        createTime: 1269451348000
    }, {
        basketId: 43,
        basketName: 'Solid High Price',
        basketStatus: 'Hidden',
        createTime: 1269451348000
    }, {
        basketId: 44,
        basketName: 'Patterned Medium Price',
        basketStatus: 'Hidden',
        createTime: 1269451348000
    }];
}

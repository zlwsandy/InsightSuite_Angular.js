'use strict';

describe('WaveInsightController', function () {
    beforeEach(module('fi.wave'));

    var scope, controller, $q, waveInsightService, $httpBackend;

    beforeEach(function () {
        waveInsightService = {
            getInsights: function (waveId) {
                return getInsightTestData();
            }
        };
    });

    beforeEach(inject(function ($rootScope, $controller, _$q_, _$httpBackend_) {
        scope = $rootScope.$new();
        $q = _$q_;
        $httpBackend = _$httpBackend_;
        controller = $controller('WaveInsightController', {
            $scope: scope,
            waveInsightService: waveInsightService
        });
    }));

    it('gets the insights for a wave', function () {

        // This is needed as WaveInsightController uses waveService which makes
        // this call
        $httpBackend
            .expectGET('/api/fi/gameplayUrl')
            .respond({ data: 'urlValue' });

        expect(controller.insights).toBe(undefined);

        var promise = $q(function (resolve) {
            resolve(getInsightTestData());
        });

        spyOn(waveInsightService, 'getInsights').and.returnValue(promise);

        controller.getInsights(1);
        scope.$root.$digest();
        expect(controller.insights.length).toBe(5);
    });

});

function getInsightTestData () {
    return {
        data: {
            "status" : true,
            "data" : [ {
                "basketId" : 3896,
                "basketName" : "14.03.12 D322 Fleece Crew - Icon - Non Promo",
                "gameRunSummaryStatus" : "Pending Approval",
                "createTime" : 1394572965000,
                "locale" : "en_US"
            }, {
                "basketId" : 5136,
                "basketName" : "D323 HCo Font Test insight - May 2014",
                "gameRunSummaryStatus" : "Pending Approval",
                "createTime" : 1401284414000,
                "locale" : "en_US"
            }, {
                "basketId" : 3085,
                "basketName" : "12.18 D322 Dudes Xmas Fleece",
                "gameRunSummaryStatus" : "Setup",
                "createTime" : 1387401508000,
                "locale" : "en_US"
            }, {
                "basketId" : 4161,
                "basketName" : "14.04.02 D314 Dudes Sleep Pants",
                "gameRunSummaryStatus" : "Pending Approval",
                "createTime" : 1396316676000,
                "locale" : "en_US"
            }, {
                "basketId" : 5136,
                "basketName" : "D323 HCo Font Test insight - May 2014",
                "gameRunSummaryStatus" : "Pending Approval",
                "createTime" : 1401284414000,
                "locale" : "en_US"
            } ],
            "message" : null,
            "totalAvailable" : 5
        }
    };
}

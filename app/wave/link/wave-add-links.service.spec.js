'use strict';

describe('waveAddLinksService', function () {
    beforeEach(module('fi.wave'));

    var myService;
    var $httpBackend;

    var myWaveId = 1234;
    var myWave = {
        waveId: myWaveId
    };
    var myLinks = getLinks();
    var myLocales = getLocales();
    var myTargets = getTargets();
    var myAddLinkObjects = getAddLinkObjects();
    var myAddLinks = getAddLinks();

    beforeEach(function () {
        module(function($provide) {
            var waveService = {
                getCurrentWave: function () {
                    return myWave;
                },
                checkWaveForUpdates: function() {
                }
            };
            $provide.value('waveService', waveService);
        });

        inject(function(_waveAddLinksService_, _$httpBackend_) {
            myService = _waveAddLinksService_;
            $httpBackend = _$httpBackend_;
        });
    });

    it('test waveAddLinksService.getPossibleLinks', function () {
        $httpBackend.expectGET('../api/wave/' + myWaveId + '/possiblelinks')
            .respond({"status": true,"data": myLinks,"message": null});

        var res = myService.getPossibleLinks(myWaveId)
                .then(function (result) {
                    expect(result.data.status).toBe(true);
                });

        $httpBackend.flush();
    });

    it('test waveAddLinksService.getPossibleLocales', function () {
        $httpBackend.expectGET('../api/wave/' + myWaveId + '/possiblelocales')
            .respond({"status": true,"data": myLocales,"message": null});

        var res = myService.getPossibleLocales(myWaveId)
                .then(function (result) {
                    expect(result.data.status).toBe(true);
                });

        $httpBackend.flush();
    });

    it('test waveAddLinksService.getPossibleTargets', function () {
        $httpBackend.expectGET('../api/wave/' + myWaveId + '/possibletargets')
            .respond({"status": true,"data": myTargets,"message": null});

        var res = myService.getPossibleTargets(myWaveId)
                .then(function (result) {
                    expect(result.data.status).toBe(true);
                });

        $httpBackend.flush();
    });

    it('test waveAddLinksService.addGameLinksToWave', function () {
        $httpBackend.expectPUT('../api/wave/' + myWaveId + '/gamelinks/add', myAddLinks)
            .respond({"status": true, "data": {gameLinkList: []}, "message": null});

        var tested;
        var res = myService.addGameLinksToWave(myWave, myAddLinkObjects)
                .then(function (result) {
                    expect(result.data.status).toBe(true);
                    tested = true;
                });

        $httpBackend.flush();
        expect(tested).toBe(true);
    });

    it('test waveAddLinksService.addGameLinksToWave', function () {
        $httpBackend.expectPUT('../api/wave/' + myWaveId + '/gamelinks/add', myAddLinks)
            .respond({"status": false, "message": null});

        var tested;
        var res = myService.addGameLinksToWave(myWave, myAddLinkObjects)
                .then(function (result) {
                    expect(result.data.status).toBe(false);
                    tested = true;
                });

        $httpBackend.flush();
        expect(tested).toBe(true);
    });

});

function getLinks() {
    return [ {
        "gamePageId" : 22,
        "gamePageName" : "GamePageName 22",
        "gameLink" : "http://this/and/that.html",
        "locale" : "en_US",
        "targetType" : "Associates",
        "basketId" : 3,
        "basketName" : "Basket Three",
        "gameRunSummaryStatus" : "PREVIEW",
        "selectedFlag" : false
    }, {
        "gamePageId" : 23,
        "gamePageName" : "GamePageName 23",
        "gameLink" : "http://xyz/abc.html",
        "locale" : "fr_FR",
        "targetType" : "Customers",
        "basketId" : 3,
        "basketName" : "Basket Three",
        "gameRunSummaryStatus" : "SETUP",
        "selectedFlag" : false
    } ];
}

function getLocales() {
    return [ "fr_FR", "en_US" ]
}

function getTargets() {
    return [ "Customers", "Associates" ]
}

function getAddLinkObjects() {
    return [ {
        "gamePageId" : 1,
        "selectedFlag" : true
    }, {
        "gamePageId" : 23,
        "selectedFlag" : false
    }, {
        "gamePageId" : 2,
        "selectedFlag" : true
    } ];
}

function getAddLinks() {
    return [ 1,2 ]
}

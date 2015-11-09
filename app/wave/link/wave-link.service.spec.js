'use strict';

describe('waveLinkService', function () {
    beforeEach(module('fi.wave'));

    var $httpBackend;

    var service;

    var wave = {
        waveId: 1
    };

    beforeEach(function () {
        module(function($provide) {
            var waveService = {
                getCurrentWave: function () {
                    return wave;
                },
                checkWaveForUpdates: function() {
                }
            };
            $provide.value('waveService', waveService);
        });

        inject(function (_waveLinkService_, _$httpBackend_) {
            service = _waveLinkService_;
            $httpBackend = _$httpBackend_;
        });
    });

    it('should make a properly formatted API call to remove gamelinks from a wave', function ()  {
        $httpBackend.expectPUT('../api/wave/' + wave.waveId + '/gamelinks/remove', [1,2,3])
            .respond({"status": true,"data": null,"message": null});

        var res = service.removeLinks(wave, [1,2,3])
            .then(function (result) {
                expect(result.data.status).toBe(true);
            });
        $httpBackend.flush();
    });

    it('should make a properly formatted API call to remove gamelinks from a wave', function ()  {
        $httpBackend.expectPUT('../api/wave/' + wave.waveId + '/gamelinks/remove', [1,2,3])
            .respond({"status": false,"data": null,"message": null});

        var res = service.removeLinks(wave, [1,2,3])
            .then(function (result) {
                expect(result.data.status).toBe(false);
            });
        $httpBackend.flush();
    });

    it('should make a properly formatted API call to get all the gamelinks for a wave', function ()  {

        $httpBackend.expectGET('../api/wave/' + wave.waveId + '/gamelinks')
            .respond({"status": true,"data": null,"message": null});

        var res = service.getLinks(wave.waveId)
            .then(function (result) {
                expect(result.data.status).toBe(true);
        });
        $httpBackend.flush();
    });

});

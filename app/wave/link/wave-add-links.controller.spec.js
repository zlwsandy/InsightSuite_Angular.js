'use strict';

describe('WaveAddLinksController', function () {
    beforeEach(module('fi.wave'));

    var scope, fakeWaveService, fakeWaveAddLinksService, controller, dialog;

    var results =  {
         data : { data : [] }
    }

    var reason = 'Mock error message';

    beforeEach(function () {
        fakeWaveService = {
            getCurrentWaveId: function () {
                return 1;
            },
            getCurrentWave: function() {
                return {
                    waveId: 1
                };
            }
        }
    });

    beforeEach(inject(function ($controller, $q, $mdDialog) {
        dialog = $mdDialog;

        var getPossibleLinksMock = mockPromise();
        var getPossibleLocalesMock = mockPromise();
        var getPossibleTargetsMock = mockPromise();
        var addGameLinksToWaveMock = mockPromise();

        fakeWaveAddLinksService = {
            getPossibleLinks: getPossibleLinksMock,
            getPossibleLocales: getPossibleLocalesMock,
            getPossibleTargets: getPossibleTargetsMock,
            addGameLinksToWave: addGameLinksToWaveMock
        };

        controller = $controller('WaveAddLinksController', {
            waveService: fakeWaveService,
            waveAddLinksService: fakeWaveAddLinksService
        });

        getPossibleLinksMock.fire(results, true);
        getPossibleLocalesMock.fire(results, true);
        getPossibleTargetsMock.fire(results, true);
        addGameLinksToWaveMock.fire(results, true);

        getPossibleLinksMock.fire(reason, false);
        getPossibleLocalesMock.fire(reason, false);
        getPossibleTargetsMock.fire(reason, false);
        addGameLinksToWaveMock.fire(reason, false);
    }));

    ////////// TESTS /////////

    it('test WaveAddLinksController.possibleLinks()', function () {
        expect(controller.possibleLinks).toEqual([]);
    });

    it('test WaveAddLinksController.possibleLocales()', function () {
        expect(controller.possibleLocales).toEqual([]);
    });

    it('test WaveAddLinksController.possibleTargets()', function () {
        expect(controller.possibleTargets).toEqual([]);
    });

    it('test on clickAllCheckbox', function () {
        var myLinks = getLinks();

        //initial state
        expect(controller.numSelected).toBe(0);
        expect(controller.allSelectedFlag).toBe(false);

        //check the box
        controller.allSelectedFlag = true;
        controller.clickAllCheckbox(myLinks);
        expect(controller.numSelected).toBe(2);
        expect(controller.allSelectedFlag).toBe(true);

        //uncheck the box
        controller.allSelectedFlag = false;
        controller.clickAllCheckbox(myLinks);
        expect(controller.numSelected).toBe(0);

        controller.selectedLocale = 'en_US';
        controller.selectedTarget = 'Associates';
        controller.clickAllCheckbox(myLinks);
        expect(controller.numSelected).toBe(0);
    });

    it('test on clickGameLinkCheckbox', function () {
        var myLinks = getLinks();

        //initial state
        expect(controller.numSelected).toBe(0);
        expect(controller.allSelectedFlag).toBe(false);

        //check the box
        controller.clickGameLinkCheckbox(true, myLinks);
        expect(controller.numSelected).toBe(1);
        expect(controller.allSelectedFlag).toBe(false);
        controller.clickGameLinkCheckbox(true, myLinks);
        expect(controller.numSelected).toBe(2);
        expect(controller.allSelectedFlag).toBe(true);

        //uncheck the box
        controller.clickGameLinkCheckbox(false, myLinks);
        controller.clickGameLinkCheckbox(false, myLinks);
        expect(controller.numSelected).toBe(0);
        expect(controller.allSelectedFlag).toBe(false);
    });

    it('test on addGameLinksToWave', function () {
        var myLinks = getLinks();
        spyOn(dialog, 'hide');
        controller.addGameLinksToWave(myLinks);
        expect(dialog.hide).toHaveBeenCalled();
    });

    it('test on closeDialog', function () {
        spyOn(dialog, 'cancel');
        controller.closeDialog();
        expect(dialog.cancel).toHaveBeenCalled();
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

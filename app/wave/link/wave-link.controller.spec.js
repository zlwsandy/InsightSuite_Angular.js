'use strict';

describe('WaveLinkController', function () {
    beforeEach(module('fi.wave'));

    var $rootScope, scope, fakeWaveService, fakeLinksService, WaveLinkController, $q, $httpBackend;

    var wave = {
        waveId: 1
    };

    beforeEach(function () {
        var localeList;
        fakeWaveService = {
            getCurrentWaveId: function () {
                return wave.waveId;
            },
            getCurrentWave: function () {
                return wave;
            },
            getLocaleList: function () {
                return localeList;
            },
            setLocaleList: function (list) {
                localeList = list;
            }
        }
    });

    beforeEach(inject(function (_$q_, _$httpBackend_) {
        $q = _$q_;
        $httpBackend = _$httpBackend_;
        fakeLinksService = {
            removeLinks: function (vm, waveId, linkIds) {
                return $q.when();
            },
            getLinks: getMyLinks
        };
    }));

    // Have to do this because of fiContext. Stupid Stupid Stupid.
    beforeEach(function () {
        $httpBackend
            .expectGET('/api/fi/gameplayUrl')
            .respond({
                data: 'urlValue'
            });
    });

    beforeEach(inject(function (_$rootScope_, $controller, $q) {
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
        WaveLinkController = $controller('WaveLinkController', {
            $scope: scope,
            waveService: fakeWaveService,
            waveLinkService: fakeLinksService
        });
    }));


    it('removes a link from a wave', function () {
        WaveLinkController.links = getMyLinks();
        expect(WaveLinkController.links.length).toBe(3);
        WaveLinkController.removeLink(WaveLinkController.links[0]);
        scope.$root.$digest(); // this is required to get the above promise to work
        expect(WaveLinkController.links.length).toBe(2);
    });

    it('removes selected links from a wave', function () {
        WaveLinkController.links = getMyLinks();
        expect(WaveLinkController.links.length).toBe(3);
        WaveLinkController.removeSelectedLinks(WaveLinkController.links);
        scope.$root.$digest(); // this is required to get the above promise to work
        expect(WaveLinkController.links.length).toBe(1);
    });

    it('no links selected to remove from a wave', function () {
        WaveLinkController.links = getMyLinks();
        expect(WaveLinkController.links.length).toBe(3);
        WaveLinkController.removeSelectedLinks([]);
        scope.$root.$digest(); // this is required to get the above promise to work
        expect(WaveLinkController.links.length).toBe(3);
    });

    it('linksAdded is handled', function () {
        $rootScope.$broadcast('linksAdded', []);
    });


    it('failure to remove a link from a wave', function () {
        fakeLinksService.removeLinks = function (vm, waveId, linkIds) {
            return $q.reject();
        };

        WaveLinkController.links = getMyLinks();
        expect(WaveLinkController.links.length).toBe(3);
        WaveLinkController.removeLink(WaveLinkController.links[0]);
        scope.$root.$digest(); // this is required to get the above promise to work
        expect(WaveLinkController.links.length).toBe(3);
    });

    it('failure to removes selected links from a wave', function () {
        fakeLinksService.removeLinks = function (vm, waveId, linkIds) {
            return $q.reject();
        };

        WaveLinkController.links = getMyLinks();
        expect(WaveLinkController.links.length).toBe(3);
        WaveLinkController.removeSelectedLinks(WaveLinkController.links);
        scope.$root.$digest(); // this is required to get the above promise to work
        expect(WaveLinkController.links.length).toBe(3);
    });

    it('count total links when Select All is checked', function () {
        WaveLinkController.links = getMyLinks();
        WaveLinkController.selectAll = true;
        WaveLinkController.countLinksSelectAll(WaveLinkController.links);
        expect(WaveLinkController.numSelected).toBe(3);
    });

    it('count total links when Select All is unchecked', function () {
        WaveLinkController.links = getMyLinks();
        WaveLinkController.selectAll = false;
        WaveLinkController.countLinksSelectAll(WaveLinkController.links);
        expect(WaveLinkController.numSelected).toBe(0);
    });


    it('check countLinks is working ', function () {
        WaveLinkController.links = WaveLinkController.filteredLinks = getMyLinks();
        WaveLinkController.selectAll = false;

        WaveLinkController.numSelected = 0;

        WaveLinkController.countLinks(WaveLinkController.links[1]);
        expect(WaveLinkController.numSelected).toBe(1);
        WaveLinkController.countLinks(WaveLinkController.links[2]);
        expect(WaveLinkController.numSelected).toBe(2);
        WaveLinkController.countLinks(WaveLinkController.links[0]);
        expect(WaveLinkController.numSelected).toBe(1);

    });

    it('test checkAll is working  ', function () {
        WaveLinkController.filteredLinks = getMyLinks();
        WaveLinkController.checkAll();

        expect(WaveLinkController.filteredLinks[0].select).toBe(true);
        expect(WaveLinkController.filteredLinks[1].select).toBe(true);
        expect(WaveLinkController.filteredLinks[2].select).toBe(true);
    });

});

describe('WaveLinkController', function () {
    beforeEach(module('fi.wave'));

    var $httpBackend, $rootScope, scope, fakeWaveService, fakeLinksService, WaveLinkController, announceService, fiService;

    var wave = {
        waveId: 1
    };

    beforeEach(function () {
        var localeList;
        fakeWaveService = {
            getCurrentWaveId: function () {
                return wave.waveId;
            },
            getCurrentWave: function () {
                return wave;
            },
            getLocaleList: function () {
                return localeList;
            },
            setLocaleList: function (list) {
                localeList = list;
            }
        }

        var url = 'stop and say hello';
        fiService = {gameplayBaseUrl : function () { return url; }};

        module(function($provide) {
            $provide.value('fiService', fiService);
        });

        inject(function (_$rootScope_, $controller, _$httpBackend_, _announceService_) {
            $httpBackend = _$httpBackend_;
            $rootScope = _$rootScope_;
            announceService = _announceService_;
            scope = $rootScope.$new();
            WaveLinkController = $controller('WaveLinkController', {
                $scope: scope,
                waveService: fakeWaveService
            });
        });
    });

    it('updateLink is handled', function () {
        var links = getMyLinks();

        $httpBackend.expectGET('../api/wave/' + wave.waveId + '/gamelinks').respond({
            status: true,
            data: links
        });

        $rootScope.$broadcast('updateLink', wave);

        var locales = fakeWaveService.getLocaleList();
        expect(locales).not.toEqual(['en_US']);

        $httpBackend.flush();

        locales = fakeWaveService.getLocaleList();
        expect(locales).toEqual(['en_US']);
    });


    it('should copy the right text', function () {
        var link = { basketName: 'theName', gameLink: 'abc123/page.html'};

        expect(WaveLinkController.copyLink(link)).toEqual(link.basketName+','+fiService.gameplayBaseUrl()+'/gp/abc123/page.html');

        var links = getMyLinks();

        var multipleLinks = links[1].basketName+','+fiService.gameplayBaseUrl()+'/gp/'+links[1].gameLink+'\n'+
        links[2].basketName+','+fiService.gameplayBaseUrl()+'/gp/'+links[2].gameLink+'\n';

        WaveLinkController.numSelected = 2;
        expect(WaveLinkController.copySelectedLink(links)).toEqual(multipleLinks);


    });

    it('should call announceService.info', function () {
        spyOn(announceService, 'info');
        WaveLinkController.numSelected = 2;
        WaveLinkController.announceSelectedLinkCopy();
        expect(announceService.info).toHaveBeenCalled();
    });


});

function getMyLinks() {

    return [{
            "gamePageId" : 22,
            "gamePageName" : "GamePageName 22",
            "gameLink" : "http://this/and/that.html",
            "locale" : "en_US",
            "targetType" : "Associates",
            "basketId" : 3,
            "basketName" : "Basket Three",
            "gameRunSummaryStatus" : "PREVIEW",
            "select" : false
        }, {
            "gamePageId" : 23,
            "gamePageName" : "GamePageName 23",
            "gameLink" : "http://xyz/123.html",
            "locale" : "en_US",
            "targetType" : "Associates",
            "basketId" : 3,
            "basketName" : "Basket Three",
            "gameRunSummaryStatus" : "SETUP",
            "select" : true
        },{
            "gamePageId" : 24,
            "gamePageName" : "GamePageName 24",
            "gameLink" : "http://xyz/abc.html",
            "locale" : "en_US",
            "targetType" : "Associates",
            "basketId" : 3,
            "basketName" : "Basket Three",
            "gameRunSummaryStatus" : "SETUP",
            "select" : true
        }];
}

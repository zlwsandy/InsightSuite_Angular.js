'use strict';

describe('fiService', function () {
    var $httpBackend, $cookieStore, fiService, utilsService, $window, $rootScope,
        cookieValue = 90,
        urlValue = 'I am a url!';

    beforeEach(module('fi.common'));

    beforeEach(module(function ($provide) {
        utilsService = jasmine.createSpyObj('utilsService', ['transformHttpPromise']);
        $provide.value('utilsService', utilsService);

        $window = {};
        $window.location = {};
        $provide.value('$window', $window);

        $provide.decorator('$cookieStore', function ($delegate) {
            $delegate.put('cid', cookieValue);
            return $delegate;
        });
    }));

    beforeEach(inject(function(_fiService_, _$httpBackend_, _$cookieStore_, _$rootScope_) {
        $cookieStore = _$cookieStore_;
        $httpBackend = _$httpBackend_;
        $httpBackend.expectGET('/api/fi/gameplayUrl')
            .respond({data: urlValue});

        fiService = _fiService_;
        $rootScope = _$rootScope_;
    }));

    describe('companyId', function () {
        it('test company id getter', function () {
            expect(fiService.companyId()).toBe(JSON.stringify(cookieValue));

            // test that service picks up new value
            cookieValue = 'cookie';
            $cookieStore.put('cid', cookieValue);
            expect(fiService.companyId()).toBe(JSON.stringify(cookieValue));
        });
    });

    describe('currentUser', function () {
        it('should call /api/fi/currentuser', function () {
            $httpBackend
                .expectGET('/api/fi/currentuser')
                .respond({});

            fiService.currentUser();
            $httpBackend.flush();

            expect(utilsService.transformHttpPromise).toHaveBeenCalled();
        });
    });

    describe('getCompanyList', function () {
        it('should call /api/fi/companies', function () {
            $httpBackend
                .expectGET('/api/fi/companies')
                .respond({});

            fiService.getCompanyList();
            $httpBackend.flush();

            expect(utilsService.transformHttpPromise).toHaveBeenCalled();
        });
    });

    describe('isSysAdmin', function () {
        it('should return true', function () {
            var result,
                user = {
                    userId: 1,
                    userCompanyId: 14,
                    userRole: 'SYSADMIN'
                },
                resVal = {
                    status: true,
                    data: user
                };

            // mock out the backend
            $httpBackend
                .expectGET('/api/fi/currentuser')
                .respond(resVal);

            // mock out transformHttpPromise because it is setup as a spy
            utilsService.transformHttpPromise.and.returnValue(resVal.data);

            var promise = fiService.isSysAdmin();

            promise.then(function (x) {
                result = x;
            });

            expect(result).toBe(undefined);

            $httpBackend.flush();

            expect(result).toBe(true);

        });

        it('should return false', function () {
            var result,
                reason,
                user = {
                    userId: 1,
                    userCompanyId: 1,
                    userRole: 'COMMON'
                },
                resVal = {
                    status: true,
                    data: user
                };

            // mock out the backend
            $httpBackend
                .expectGET('/api/fi/currentuser')
                .respond(resVal);

            // mock out transformHttpPromise because it is setup as a spy
            utilsService.transformHttpPromise.and.returnValue(resVal.data);

            var promise = fiService.isSysAdmin();

            promise.then(function (x) {
                result = x;
            }, function (r) {
                reason = r;
            });

            expect(result).toBe(undefined);

            $httpBackend.flush();

            expect(reason).toBe(false);

        });
    });

    describe('isFiAdmin', function () {
        it('should return true', function () {
            var result,
                user = {
                    userId: 1,
                    userCompanyId: 14,
                    userRole: 'FIADMIN'
                },
                resVal = {
                    status: true,
                    data: user
                };

            // mock out the backend
            $httpBackend
                .expectGET('/api/fi/currentuser')
                .respond(resVal);

            // mock out transformHttpPromise because it is setup as a spy
            utilsService.transformHttpPromise.and.returnValue(resVal.data);

            var promise = fiService.isFiAdmin();

            promise.then(function (x) {
                result = x;
            });

            expect(result).toBe(undefined);

            $httpBackend.flush();

            expect(result).toBe(true);

        });

        it('should return false', function () {
            var result,
                reason,
                user = {
                    userId: 1,
                    userCompanyId: 1,
                    userRole: 'COMMON'
                },
                resVal = {
                    status: true,
                    data: user
                };

            // mock out the backend
            $httpBackend
                .expectGET('/api/fi/currentuser')
                .respond(resVal);

            // mock out transformHttpPromise because it is setup as a spy
            utilsService.transformHttpPromise.and.returnValue(resVal.data);

            var promise = fiService.isFiAdmin();

            promise.then(function (x) {
                result = x;
            }, function (r) {
                reason = r;
            });

            expect(result).toBe(undefined);

            $httpBackend.flush();

            expect(reason).toBe(false);

        });
    });

    describe('isAdmin', function () {
        it('should return true for SYSADMIN', function () {
            var result,
                user = {
                    userId: 1,
                    userCompanyId: 14,
                    userRole: 'SYSADMIN'
                },
                resVal = {
                    status: true,
                    data: user
                };

            // mock out the backend
            $httpBackend
                .expectGET('/api/fi/currentuser')
                .respond(resVal);

            // mock out transformHttpPromise because it is setup as a spy
            utilsService.transformHttpPromise.and.returnValue(resVal.data);

            var promise = fiService.isAdmin();

            promise.then(function (x) {
                result = x;
            });

            expect(result).toBe(undefined);

            $httpBackend.flush();

            expect(result).toBe(true);

        });

        it('should return true for FIADMIN', function () {
            var result,
                user = {
                    userId: 1,
                    userCompanyId: 14,
                    userRole: 'FIADMIN'
                },
                resVal = {
                    status: true,
                    data: user
                };

            // mock out the backend
            $httpBackend
                .expectGET('/api/fi/currentuser')
                .respond(resVal);

            // mock out transformHttpPromise because it is setup as a spy
            utilsService.transformHttpPromise.and.returnValue(resVal.data);

            var promise = fiService.isAdmin();

            promise.then(function (x) {
                result = x;
            });

            expect(result).toBe(undefined);

            $httpBackend.flush();

            expect(result).toBe(true);

        });

        it('should return false', function () {
            var result,
                reason,
                user = {
                    userId: 1,
                    userCompanyId: 1,
                    userRole: 'COMMON'
                },
                resVal = {
                    status: true,
                    data: user
                };

            // mock out the backend
            $httpBackend
                .expectGET('/api/fi/currentuser')
                .respond(resVal);

            // mock out transformHttpPromise because it is setup as a spy
            utilsService.transformHttpPromise.and.returnValue(resVal.data);

            var promise = fiService.isAdmin();

            promise.then(function (x) {
                result = x;
            }, function (r) {
                reason = r;
            });

            expect(result).toBe(undefined);

            $httpBackend.flush();

            expect(reason).toBe(false);

        });
    });

    describe('logoff', function () {
        it('goes to logoff.fi', function() {
            fiService.logoff();

            expect($window.location.href).toEqual('/logoff.fi');
        });
    });

    describe('serverTime', function () {
        it('should return a Date object.', function () {
            var time, response;

            response = {
                serverTime: 1
            };

            $httpBackend
                .expectGET('/api/fi/time')
                .respond(response);

            // mock out transformHttpPromise because it is setup as a spy
            utilsService.transformHttpPromise.and.returnValue(response);

            fiService.serverTime()
                .then(function (t) {
                    time = t;
                });



            $httpBackend.flush();

            expect(utilsService.transformHttpPromise).toHaveBeenCalled();
            expect(time.getTime()).toEqual(1);
        });
    });

    it('test to see that service returns undefined before http flush', function () {
        expect(fiService.gameplayBaseUrl()).toBe(undefined);

        $httpBackend.flush();

        expect(fiService.gameplayBaseUrl()).toBe(urlValue);
    });

    afterEach(function () {
        $cookieStore.remove ('cid');
    });
});

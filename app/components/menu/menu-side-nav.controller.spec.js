'use strict';

describe('MenuSideNavController', function () {
    var scope, controller, $window, $state, fiService;

    beforeEach(module('fi.common'));

    // Setup spies
    beforeEach(function () {
        $window = jasmine.createSpyObj('$window', ['open']);
        $window.location = {};

        $state = jasmine.createSpyObj('$state', ['go', 'includes']);
        fiService = jasmine.createSpyObj('fiService', ['isAdmin', 'logoff']);
    });

    beforeEach(function () {
        module(function ($provide) {
            $provide.value('$window', $window);
            $provide.value('$state', $state);
            $provide.value('fiService', fiService);
        });
    });

    describe('admin menu', function () {
        beforeEach(inject(function ($controller, $rootScope, $q) {
            fiService.isAdmin.and.returnValue($q.when(true));
            scope = $rootScope.$new();
            controller = $controller('MenuSideNavController as sideNav', {
                $scope: scope
            });
            $rootScope.$digest();
        }));

        it('should contain four menu options', function () {
            expect(controller.menuList.length).toBe(4);
        });

        describe('active menu', function () {

            it('should return the active states', function () {
                var activeStates = controller.isActiveMenu(['insightsListTab']);
                expect(activeStates).toBeFalsy();
            });
        });

        describe('compliance documents', function () {
            var complianceDocs;

            beforeEach(inject(function (_) {
                complianceDocs = _.find(controller.menuFooterList, { name: 'Compliance Documents' });
            }));

            it('should contain compliance documents menu option', function () {
                expect(complianceDocs).not.toBe(null);
            });

            it('should open new tab to compliance documents url', function () {
                complianceDocs.click();

                expect($window.open).toHaveBeenCalledWith('http://www.firstinsight.com/compliance-statement');
            });
        });

        describe('other', function () {
            var other;

            beforeEach(inject(function (_) {
                other = _.find(controller.menuList, { name: 'Other' });
            }));

            it('should contain other menu option', function () {
                expect(other).not.toBe(null);
            });

            it('should reassign the window location to game run admin', function () {
                other.click();

                expect($window.location.href).toBe('/secure/gamerun!list.fi');
            });
        });

        describe('sign off', function () {
            var signOff;

            beforeEach(inject(function (_) {
                signOff = _.find(controller.menuList, { name: 'Sign Off' });
            }));

            it('should contain Sign Off menu option', function () {
                expect(signOff).not.toBe(null);
            });

            it('should reassign the windows location', function () {
                signOff.click();

                expect(fiService.logoff).toHaveBeenCalled();
            });
        });

        describe('waves', function () {
            var waves;

            beforeEach(inject(function (_) {
                waves = _.find(controller.menuList, { name: 'Waves' });
            }));

            it('should contain Waves menu option', function () {
                expect(waves).not.toBe(null);
            });

            it('should reassign the windows location', function () {
                waves.click();

                expect($state.go).toHaveBeenCalledWith('admin.waves.list');
            });
        });
    });

    describe('non admin menu', function () {
        beforeEach(inject(function ($controller, $rootScope, $q) {
            fiService.isAdmin.and.returnValue($q.reject(false));
            scope = $rootScope.$new();
            controller = $controller('MenuSideNavController as sideNav', {
                $scope: scope
            });
            $rootScope.$digest();
        }));

        it('should contain two menu options', function () {
            expect(controller.menuList.length).toBe(2);
        });

        describe('insights', function () {
            it('should contain Insights menu option', inject(function (_) {
                var insights = _.find(controller.menuList, { name: 'Insights' });

                expect(insights).not.toBe(null);
            }));
        });

        describe('sign off', function () {
            it('should contain Sign Off menu option', inject(function (_) {
                var signOff = _.find(controller.menuList, { name: 'Sign Off' });

                expect(signOff).not.toBe(null);
            }));
        });
    });
});

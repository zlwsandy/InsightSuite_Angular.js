'use strict';

describe('Insight Settings spec -', function () {
    var $scope, $rootScope, $stateParams, $q, $mdDialog, $state, insightDataService,
        announceService, insightEditCancelDialogService, localeService, formatter, sut,
        defUpdateInsightDataService, defCreateInsightDataService;

    var mockCompany = {
        name: 'Mock Company',
        priceScaling: {
            clearancePercentage: null,
            markDownCadence: [
                1,
                0.75,
                0.50,
                0.25,
                0,
                0
            ]
        }
    };

    var mockDepartments = [{ departmentId: 41, name: 'Sweaters' },
        { departmentId: 42, name: 'Shoes' },
        { departmentId: 43, name: 'Women Flats' }];

    var mockInsight = {
        insightId: 1,
        name: 'MockInsight',
        priceScaling: {
            clearancePercentage: 0.05,
            markDownCadence: [
                1,
                0.75,
                0.50,
                0.25,
                0,
                0
            ]
        },
        pricingEnabled: false,
        pricingOption: {
            minimumSellThroughPercent: 0
        },
        gameRunLocaleList : [{
            locale : 'en_US',
            conversionRate : 1.0000000000,
            currencyCode : 'USD',
            gameRunId : 212,
            gameRunStatus : 'SETUP',
            language: undefined,
            flagImageUrl: undefined
        }],
        department: null,
        gameType: null
    };

    var renderedMarkdownCadence = [100, 75, 50, 25, 0, 0];

    var mockInsightNoLocale = {
        insightId: 1,
        name: 'MockInsight',
        priceScaling: {
            clearancePercentage: 0.05,
            markDownCadence: [
                1,
                0.75,
                0.50,
                0.25,
                0,
                0
            ]
        },
        pricingEnabled: false,
        pricingOption: {
            minimumSellThroughPercent: 0
        },
        gameRunLocaleList : [{
            locale : null
        }],
        department: null,
        gameType: null
    };

    var updatedMockInsight = {
        insightId: 1,
        name: 'UpdatedMockInsight',
        priceScaling: {
            clearancePercentage: 5,
            markDownCadence: [
                1,
                0.75,
                0.50,
                0.25,
                0,
                0
            ]
        },
        pricingEnabled: false,
        pricingOption: {
            minimumSellThroughPercent: 0
        },
        gameRunLocaleList : [{
            locale : 'en_US',
            conversionRate : 1.0000000000,
            currencyCode : 'USD',
            gameRunId : 212,
            gameRunStatus : 'SETUP',
            language: undefined,
            flagImageUrl: undefined
        }],
        department: null,
        gameType: null
    };

    var mockLocale = {
        locale: 'en_US',
        flagImageUrl: 'testFlag',
        language: 'en'
    };

    beforeEach(module('fi.insight'));

    beforeEach(function () {
        insightDataService = jasmine.createSpyObj('insightDataService', [
            'createInsight',
            'updateInsight'
        ]);

        insightEditCancelDialogService = jasmine.createSpyObj('insightEditCancelDialogService', [
            'show'
        ]);
        announceService = jasmine.createSpyObj('announceService', [
            'error',
            'info'
        ]);
        localeService = jasmine.createSpyObj('localeService', ['getLanguage', 'getFlagImageUrl']);
        formatter = jasmine.createSpyObj('formatter', ['formatCurrency', 'getNumberFormatDisplay']);
        $stateParams = {
            locale: null,
            insightId: 1
        };

        $state = {
            'go' : jasmine.createSpy('$state go'),
            current : {
                data : {
                    insightTab: '',
                    state: ''
                },
                name : ''
            }
        };

    });

    beforeEach(function () {
        module(function ($provide) {
            $provide.value('$stateParams', $stateParams);
            $provide.value('insightDataService', insightDataService);
            $provide.value('insightEditCancelDialogService', insightEditCancelDialogService);
            $provide.value('localeService', localeService);
            $provide.value('company', mockCompany);
            $provide.value('formatter', formatter);
        });
    });

    function createController(insight, departments, state, isAdmin) {
        inject(function (_$rootScope_, $controller, _$q_, _$mdDialog_) {
            $rootScope = _$rootScope_;
            $q = _$q_;
            $mdDialog = _$mdDialog_;

            defUpdateInsightDataService = $q.defer();
            defCreateInsightDataService = $q.defer();
            insightDataService.createInsight.and.returnValue(defCreateInsightDataService.promise);
            insightDataService.updateInsight.and.returnValue(defUpdateInsightDataService.promise);
            insightEditCancelDialogService.show.and.returnValue($q.when(true));

            $scope = $rootScope.$new();

            sut = $controller('InsightSettingsController', {
                $scope: $scope,
                $state: angular.copy(state) || angular.copy($state),
                insight: angular.copy(insight),
                isAdmin: isAdmin,
                departments: departments,
                announceService: announceService
            });

            $scope.InsightSettingsController = sut;
        });
    }

    describe('set markdown cadence -', function () {

        it('should set all price control values', function () {
            createController(mockInsight, [], null, true);

            $scope.$apply();
            expect(sut.clearanceMax).toEqual(25);

            for (var i = 0; i < mockInsight.priceScaling.markDownCadence.length; i++) {
                expect(sut.insight.priceScaling.markDownCadence[i])
                    .toEqual(renderedMarkdownCadence[i]);
            }
        });
    });

    describe('Initialize Locales - ', function () {

        describe('Edit insight', function () {

            // beforeEach(function () {
            //     createController(mockInsight, [], null, true);
            // });

            it('should get the language if a locale exists', function () {
                createController(mockInsight, [], null, true);
                expect(localeService.getLanguage).toHaveBeenCalledWith(sut.insight.gameRunLocaleList[0].locale);
            });

            it('should get the flagImageUrl if a locale exists', function () {
                createController(mockInsight, [], null, true);
                expect(localeService.getFlagImageUrl).toHaveBeenCalledWith(sut.insight.gameRunLocaleList[0].locale);
            });

            it('should not set the language or flag image if a locale does not exist', function () {
                createController(mockInsightNoLocale, [], null, true);
                expect(localeService.getLanguage).not.toHaveBeenCalled();
                expect(localeService.getFlagImageUrl).not.toHaveBeenCalled();
            });

            it('should indicate if an insight has locales', function () {
                createController(mockInsight, [], null, true);
                expect(sut.checkLocales()).toBe(true);
            });

            it('should indicate if an insight does not have any locales', function () {
                createController(mockInsightNoLocale, [], null, true);
                expect(sut.checkLocales()).toBe(false);
            });

            it('should set clearanceMax to zero if all cadences are undefined', function () {
                createController(updatedMockInsight, [], null, true);

                $scope.$apply();

                for (var i = 0; i < sut.insight.priceScaling.markDownCadence.length; i++) {
                    sut.insight.priceScaling.markDownCadence[i] = undefined;
                }

                $scope.$apply();

                expect(sut.clearanceMax).toEqual(0);
            });

        });

        describe('Create insight', function () {
            var tempState = {
                'go' : jasmine.createSpy('$state.go'),
                current : {
                    data : {
                        insightTab: '',
                        state: 'create'
                    },
                    name : ''
                }
            };

            it('should set the language to []', function () {
                createController({}, [], null, true);
                expect(sut.insight.gameRunLocaleList).toEqual([]);
            });

            it('should skip parsing markdown cadence when price scaling is {}', function () {
                createController({}, [], null, true);
                sut.insight.priceScaling = null;
            });

            it('should set the pricingEnabled to true', function () {
                mockCompany.pricingEnabled = true;

                createController(mockInsight, [], tempState, true);
                expect(sut.insight.pricingEnabled).toBeTruthy();
            });

            it('should set markDownCadence to company default', function () {
                createController({}, [], null, true);
                expect(sut.insight.priceScaling.markDownCadence).toEqual(mockCompany.priceScaling.markDownCadence);
            });

        });

    });

    describe('update insight', function () {
        var tempState = {
            'go' : jasmine.createSpy('$state.go'),
            current : {
                data : {
                    insightTab: '',
                    state: 'edit'
                },
                name : ''
            }
        };

        beforeEach(function () {
            createController(mockInsight, [], tempState, true);

            spyOn($scope, '$emit');
            $scope.insightForm = {
                $setPristine: jasmine.createSpy('$setPristine')
            };
        });

        it('should save the insight and update the original variable', function () {

            sut.insight.name = 'New Name';
            sut.save();
            defUpdateInsightDataService.resolve(updatedMockInsight);

            $scope.$apply();

            expect($scope.insightForm.$setPristine).toHaveBeenCalled();
            expect(sut.original).toEqual(updatedMockInsight);
        });

        it('should save the insight and replace any empty string in the markdown cadence and clearance percentage with 0', function () {

            sut.insight.priceScaling.markDownCadence[0] = '';
            sut.insight.priceScaling.clearancePercentage = '';

            sut.save();

            $scope.$apply();

            expect(sut.insight.priceScaling.markDownCadence[0]).toEqual(0);
            expect(sut.insight.priceScaling.clearancePercentage).toEqual(0);
        });

        it('should emit an insightUpdated event, passing the newly updated insight', function () {

            sut.insight.name = 'New Name';
            sut.save();
            defUpdateInsightDataService.resolve(updatedMockInsight);

            $scope.$apply();

            expect($scope.$emit).toHaveBeenCalledWith('insightUpdated', updatedMockInsight);
        });

        it('should not emit an insightUpdated event if updateInsight is never called', function () {

            sut.save();
            defUpdateInsightDataService.resolve(updatedMockInsight);

            $scope.$apply();

            expect($scope.$emit).not.toHaveBeenCalled();
        });

        it('should not save the insight if the insight was never changed', function () {

            sut.save();
            defUpdateInsightDataService.resolve(updatedMockInsight);

            $scope.$apply();

            expect(insightDataService.updateInsight).not.toHaveBeenCalled();
        });

        it('should not update the original insight if the insight was never changed', function () {

            sut.save();
            defUpdateInsightDataService.resolve(updatedMockInsight);

            $scope.$apply();

            expect(sut.original).not.toEqual(updatedMockInsight);
        });

        it('should throw an error', function () {

            sut.insight.name = 'New Name';
            sut.save();

            defUpdateInsightDataService.reject('message', {});

            $scope.$apply();

            expect(announceService.error).toHaveBeenCalled();
        });
    });

    describe('Create Insight', function () {
        var tempState = {
            'go' : jasmine.createSpy('$state.go'),
            current : {
                data : {
                    insightTab: '',
                    state: 'create'
                },
                name : ''
            }
        };

        it('should create the insight, disable the confirm exit flag, and set the form to pristine', function () {
            createController(mockInsight, [], tempState, true);
            $scope.insightForm = {
                $setPristine: jasmine.createSpy('$setPristine')
            };

            sut.save();
            defCreateInsightDataService.resolve(updatedMockInsight);

            $scope.$apply();

            expect($scope.insightForm.$setPristine).toHaveBeenCalled();
            expect(tempState.go).toHaveBeenCalledWith('insightTabWithLocale.items', {insightId: mockInsight.insightId, locale: mockInsight.gameRunLocaleList[0].locale});

        });

        it('should set the locale to en_US if game type is Style Opt', function () {
            createController(mockInsight, [], tempState, true);

            sut.insight.gameType = 'THREE_PREFERENCE';
            sut.save();

            expect(sut.insight.gameRunLocaleList[0]).toEqual({
                locale : 'en_US',
                conversionRate : 1
            });
        });

        it('should create the insight and route to settings, when there is no locale', function () {
            createController(mockInsight, [], tempState, true);
            $scope.insightForm = {
                $setPristine: jasmine.createSpy('$setPristine')
            };

            sut.insight.gameRunLocaleList[0].locale = null;

            sut.save();
            defCreateInsightDataService.resolve(mockInsightNoLocale);

            $scope.$apply();

            expect(tempState.go).toHaveBeenCalledWith('insightTabNoActionbar.settings', { insightId: mockInsightNoLocale.insightId });
        });

        it('should throw an error', function () {
            createController(mockInsight, [], tempState, true);
            $scope.insightForm = {
                $setPristine: jasmine.createSpy('$setPristine')
            };

            sut.save();

            defCreateInsightDataService.reject('message', {});

            $scope.$apply();

            expect(announceService.error).toHaveBeenCalled();
        });

    });

    describe('cancel insight', function () {

        it('should reset the insight to its original value if they differ', function () {
            createController(mockInsight, [], null, true);
            $scope.insightForm = {
                $setPristine: jasmine.createSpy('$setPristine')
            };

            sut.insight.name = 'New name';
            sut.cancel();
            $scope.$apply();

            expect($scope.insightForm.$setPristine).toHaveBeenCalled();
            expect(sut.insight).toEqual(sut.original);
        });

        it('should not reset the insight to its original value if they do not differ', function () {
            createController(mockInsight, []);

            sut.cancel();
            $scope.$apply();

            expect(sut.insight).toEqual(sut.original);
        });
    });

    describe('Initialize Departments - ', function () {

        it('should set the insight department to null if no department options are available', function () {
            createController(mockInsight, [], null, true);
        });

        it('should set the insight department to null if no department exists for the insight', function () {
            createController(mockInsight, mockDepartments, null, true);
            expect(sut.insight.department).toBe(null);
        });

        it('should set the insight department from the available options if a department exists for the insight', function () {
            var mockInsightWithDepartment = angular.copy(mockInsight);
            mockInsightWithDepartment.department = mockDepartments[0];

            createController(mockInsightWithDepartment, mockDepartments, null, true);

            expect(sut.insight.department).toEqual(mockDepartments[0]);
        });

    });

    describe('Clear Dept Selection - ', function () {

        beforeEach(function () {
            createController(mockInsight, [], null, true);
            $scope.insightForm = {
                $setPristine: jasmine.createSpy('$setPristine'),
                $setDirty: jasmine.createSpy('$setDirty')
            };
        });

        it('should set the insight department to null and set to pristine', function () {

            sut.insight.department = 'test';

            sut.clearDeptSelection();
            $scope.$apply();

            expect($scope.insightForm.$setPristine).toHaveBeenCalled();
            expect(sut.insight.department).toEqual(null);
        });

        it('should set the insight department to null and set to dirty', function () {

            sut.insight.name = 'MockInsightTest';
            sut.insight.department = 'test';

            sut.clearDeptSelection();

            expect($scope.insightForm.$setDirty).toHaveBeenCalled();
            expect(sut.insight.department).toEqual(null);
        });
    });

    describe('Clear Game Type Selection', function () {

        beforeEach(function () {
            createController(mockInsight, [], null, true);
            $scope.insightForm = {
                $setPristine: jasmine.createSpy('$setPristine'),
                $setDirty: jasmine.createSpy('$setDirty')
            };
        });

        it('should set the insight game type to WWYP and set to pristine', function () {

            sut.insight.gameType = 'test';

            sut.clearGameTypeSelection();
            $scope.$apply();

            expect($scope.insightForm.$setPristine).toHaveBeenCalled();
            expect(sut.insight.gameType).toEqual('WWYP');
        });

        it('should set the insight game type to WWYP and set to dirty', function () {

            sut.insight.name = 'MockInsightTest';
            sut.insight.gameType = 'test';

            sut.clearGameTypeSelection();

            expect($scope.insightForm.$setDirty).toHaveBeenCalled();
            expect(sut.insight.gameType).toEqual('WWYP');
        });
    });

    describe('Has Departments Check - ', function () {

        it('departments are valid', function () {
            createController(mockInsight, mockDepartments, null, true);
            $scope.$apply();
            expect(sut.hasDepartments()).toEqual(true);
        });

        it('no departments', function () {
            createController(mockInsight, [], null, true);
            $scope.$apply();
            expect(sut.hasDepartments()).toEqual(false);
        });
    });

    describe('add locale dialog', function () {
        it('should prompt the upload dialog, add locales, and set form to dirty', function () {
            createController(mockInsight, [], null, true);
            $scope.insightForm = {
                $setDirty: jasmine.createSpy('$setDirty')
            };

            spyOn($mdDialog, 'show').and.returnValue($q.when([mockLocale]));

            sut.addLocale();

            $scope.$apply();

            mockInsight.gameRunLocaleList.push(mockLocale);

            expect($mdDialog.show).toHaveBeenCalled();
            expect($scope.insightForm.$setDirty).toHaveBeenCalled();
            expect(sut.insight.gameRunLocaleList).toEqual(mockInsight.gameRunLocaleList);
        });
        it('should prompt the upload dialog but not set form to dirty', function () {
            createController(mockInsight, [], null, true);
            $scope.insightForm = {
                $setDirty: jasmine.createSpy('$setDirty')
            };

            spyOn($mdDialog, 'show').and.returnValue($q.when([]));

            sut.addLocale();

            $scope.$apply();

            mockInsight.gameRunLocaleList.push(mockLocale);

            expect($mdDialog.show).toHaveBeenCalled();
            expect($scope.insightForm.$setDirty).not.toHaveBeenCalled();
            expect(sut.insight.gameRunLocaleList).not.toEqual(mockInsight.gameRunLocaleList);
        });
    });

    describe('isStyleOpt', function () {

        beforeEach(function () {
            createController(mockInsight, [], null, true);
        });

        it('gameType StyleOpt and isStyleOpt is true', function () {

            sut.insight.gameType = 'THREE_PREFERENCE';

            expect(sut.isStyleOpt()).toBe(true);
        });

        it('gameType is WWYP and isStyleOpt is false', function () {

            sut.insight.gameType = 'WWYP';

            expect(sut.isStyleOpt()).toBe(false);
        });
    });

    describe('Check Insight Changes - ', function () {

        beforeEach(function () {
            createController(mockInsight, [], null, true);
        });

        it('should not have any changes when initialized', function () {
            expect(sut.hasChanges()).toBe(false);
        });

        it('should have changes when the insight name has changed', function () {
            sut.insight.name = 'name update';
            expect(sut.hasChanges()).toBe(true);
        });

        it('should not have changes when the insight name has changed then reverted back to the original value', function () {
            // change the name
            sut.insight.name = 'MockInsight1';
            expect(sut.hasChanges()).toBe(true);

            // change the name back to original
            sut.insight.name = 'MockInsight';
            expect(sut.hasChanges()).toBe(false);
        });
    });

});

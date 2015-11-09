'use strict';

describe('Manage Segments Controller Specs', function () {
    var sut;
    var $rootScope;
    var $scope;
    var $state;
    var $controller;
    var $q;
    var dialogAlertService;
    var mockItemSegmentResults;
    var mockInsight;
    var insightDataService;
    var localeService;
    var mockSegmentOptions;
    var mockLocales;
    var dialogConfirmService;
    var progressService;

    var stateParams = {
        insightId : 123,
        locale : 'en_US'
    };
    //used for only one segment remain
    var mockOnlyOneSegment = [{
        "gameItemId": 959,
        "name": "T-SHIRT COL BIJOUX",
        "gameRunId": 182,
        "gameRunName": "Multi-Locale Insight with Results",
        "gameRunStatus": "RESULTS",
        "segmentGameItems": [
          {
            "gameItemId": 998,
            "name": "T-SHIRT COL BIJOUX",
            "gameRunId": 185,
            "gameRunName": "Female",
            "gameRunStatus": "RESULTS",
          }
        ]
      }]
    // Load module under test
    beforeEach(module('components/announce/toast.html'));
    beforeEach(module('mock/segment-options.json'));
    beforeEach(module('mock/item-segment-results.json'));
    beforeEach(module('mock/locales.json'));
    beforeEach(module('mock/insight.json'));
    beforeEach(module('fi.insight'));

    // Setup spies
    beforeEach(function () {
        $state = {
            'go' : jasmine.createSpy('$state go'),
            'params' : stateParams
        };

        dialogConfirmService = jasmine.createSpyObj('dialogConfirmService', ['show']);
        dialogAlertService = jasmine.createSpyObj('dialogAlertService', ['show']);
        progressService = jasmine.createSpyObj('progressService', ['show', 'hide']);

        insightDataService = jasmine.createSpyObj('insightDataService', [
            'getInsightSegmentOptions',
            'getInsightSegmentDefinition',
            'createSegment',
            'deleteSegment',
            'editSegmentName'
        ]);

        localeService = jasmine.createSpyObj('localeService', ['findLocale']);

    });

    // Setup mock injection using $provide.value
    beforeEach(function () {
        module(function ($provide) {
            $provide.value("$state", $state);
            $provide.value("insightDataService", insightDataService);
            $provide.value("localeService", localeService);
            $provide.value("dialogConfirmService", dialogConfirmService);
            $provide.value("dialogAlertService", dialogAlertService);
            $provide.value("progressService", progressService);
        });
    });

    beforeEach(function () {
        inject(function (_$rootScope_, _$controller_, _mockItemSegmentResults_, _$q_, _mockInsight_,
                         _mockSegmentOptions_, _mockLocales_) {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            $controller = _$controller_;
            mockItemSegmentResults = _mockItemSegmentResults_;
            mockInsight = _mockInsight_;
            mockSegmentOptions = _mockSegmentOptions_;
            mockLocales = _mockLocales_;
            $q = _$q_;

            $rootScope.previousState = {
                name : 'insightTabWithLocale.items'
            };

            $rootScope.previousStateParams = stateParams;

            insightDataService.createSegment.and.returnValue($q.when('test'));
            insightDataService.getInsightSegmentDefinition.and.returnValue($q.when('test'));
            insightDataService.deleteSegment.and.returnValue($q.when('test'));
            insightDataService.editSegmentName.and.returnValue($q.when('test'));
            insightDataService.getInsightSegmentOptions.and.returnValue($q.when(_.cloneDeep(mockSegmentOptions)));
            localeService.findLocale.and.returnValue(mockLocales.en_US);

        });
    });

    var createController = function (controllerParams) {
        controllerParams = controllerParams || {};

        sut = $controller('ManageSegmentsController', {
            $scope: $scope,
            insight : mockInsight,
            insightSegments : controllerParams.insightSegments,
            isAdmin : controllerParams.isAdmin !== undefined ? controllerParams.isAdmin : true
        });

        $rootScope.$digest();
    };

    describe('Initialization With Segments ', function () {

        describe('With Segments ', function () {
            beforeEach(function () {
                createController({
                    insightSegments : _.cloneDeep(mockItemSegmentResults)
                });
            });

            it('should default the first segment as selected', function () {

                expect(sut.selectedIndex).toEqual(0);
                expect(sut.selectedSegment).toEqual(sut.segments[0]);
            });

            it('should get segment options from the data service if segment options is not yet defined', function () {
                expect(insightDataService.getInsightSegmentDefinition).toHaveBeenCalled();
            });

            it('should set the segment options on the selected segment', function () {
                $rootScope.$digest();

                expect(sut.selectedSegment.segmentOptions).toEqual('test');
            });

            it('should set the view mode to true', function () {
                expect(sut.viewMode).toBe(true);
            });
        });

        describe('Without Segments', function () {
            beforeEach(function () {
                createController({
                    insightSegments : []
                });
            });

            it('should set the view mode to true', function () {
                expect(sut.viewMode).toBe(false);
            });
        });

    });

    describe('Close', function () {

        beforeEach(function () {
            createController({
                insightSegments : _.cloneDeep(mockItemSegmentResults)
            });

            $scope.segmentForm = {};
            $scope.segmentForm.$dirty = true;

        });

        it('should navigate back to the item list if there is no previous state when close is called', function () {

            $scope.segmentForm = {};
            $scope.segmentForm.$dirty = false;

            sut.cancel();

            expect($state.go).toHaveBeenCalledWith({name : 'insightTabWithLocale.items'}, stateParams);
        });

        it('should navigate back to the item list if the form is dirty and the first button is clicked', function () {
            sut.viewMode = false;
            $scope.segmentForm = {};
            $scope.segmentForm.$dirty = true;
            dialogConfirmService.show.and.returnValue($q.when('0'));

            sut.cancel();

            $rootScope.$digest();

            expect($state.go).toHaveBeenCalledWith({name : 'insightTabWithLocale.items'}, stateParams);
        });

        it('should refresh the state if the form is dirty and the second button is clicked', function () {
            sut.viewMode = false;
            $scope.segmentForm = {};
            $scope.segmentForm.$setPristine = jasmine.createSpy('$setPristine');
            $scope.segmentForm.$dirty = true;
            dialogConfirmService.show.and.returnValue($q.when('1'));

            sut.cancel();

            $rootScope.$digest();

            expect($scope.segmentForm.$setPristine).toHaveBeenCalled();
        });

        it('should navigate back to the previous state if one exists when close is called', function () {
            $rootScope.previousState.name = 'test';
            $scope.segmentForm = {};
            $scope.segmentForm.$dirty = false;

            sut.cancel();

            expect($state.go).toHaveBeenCalledWith({name : 'test'}, stateParams);
        });
    });

    describe('Select Segment', function () {

        var selectedIndex = 1;

        beforeEach(function () {
            createController({
                insightSegments : _.cloneDeep(mockItemSegmentResults)
            });
        });

        it('should set the selected index if it is the first segment', function () {

            sut.selectSegment(0);

            expect(sut.selectedIndex).toEqual(0);
        });

        it('should not set the selected index if it is not the first segment and view mode is false', function () {

            sut.viewMode = false;
            sut.selectSegment(1);

            expect(sut.selectedIndex).not.toEqual(1);
        });

        it('should set the selected index if it is not the first segment but view mode is true', function () {

            sut.viewMode = true;
            sut.selectSegment(1);

            expect(sut.selectedIndex).toEqual(1);
        });

        it('should set the selected segment based on the index', function () {

            sut.selectSegment(selectedIndex);

            expect(sut.selectedSegment).toEqual(sut.segments[selectedIndex]);
        });
    });

    describe('View Segment', function () {

        beforeEach(function () {
            createController({
                insightSegments : _.cloneDeep(mockItemSegmentResults)
            });
        });

        it('should navigate to view segments', function () {

            sut.viewSegment();

            expect($state.go).toHaveBeenCalledWith('insightTabWithLocale.segments', stateParams);
        });
    });

    describe('Selection Toggling', function () {

        beforeEach(function () {
            createController({
                insightSegments : []
            });
        });

        it('should correctly toggle the specified attribute to false', function () {
            var attributeName = 'regions';

            sut.selectedSegment.segmentOptions[attributeName].selectAll = false;

            sut.toggleAttrSelectAll(attributeName);

            expect(_.every(sut.selectedSegment.segmentOptions[attributeName], function (attr) {
                return !attr.selected;
            })).toBe(true);
        });

        it('should correctly toggle the specified attribute to true', function () {
            var attributeName = 'regions';

            // Unselect All first
            sut.selectedSegment.segmentOptions[attributeName].selectAll = false;
            sut.toggleAttrSelectAll(attributeName);

            sut.selectedSegment.segmentOptions[attributeName].selectAll = true;

            sut.toggleAttrSelectAll(attributeName);

            expect(_.every(sut.selectedSegment.segmentOptions[attributeName], function (attr) {
                return attr.selected;
            })).toBe(true);
        });

        it('should correctly toggle all answers false', function () {
            var questionIndex= 0;

            sut.selectedSegment.segmentOptions.questions[questionIndex].selectAll = false;

            sut.toggleNestedAttrSelectAll('questions', 'answers', questionIndex);

            expect(_.every(sut.selectedSegment.segmentOptions.questions[questionIndex].answers, function (answer) {
                return !answer.selected;
            })).toBe(true);
        });

        it('should correctly toggle all answers true', function () {
            var questionIndex= 0;

            // Unselect all first
            sut.selectedSegment.segmentOptions.questions[questionIndex].selectAll = false;
            sut.toggleNestedAttrSelectAll('questions', 'answers', questionIndex);

            sut.selectedSegment.segmentOptions.questions[questionIndex].selectAll = true;

            sut.toggleNestedAttrSelectAll('questions', 'answers', questionIndex);

            expect(_.every(sut.selectedSegment.segmentOptions.questions[questionIndex].answers, function (answer) {
                return answer.selected;
            })).toBe(true);
        });

        it('should auto select all answers upon initialization', function () {
            var questionIndex = 0;

            expect(_.every(sut.selectedSegment.segmentOptions.questions[questionIndex].answers, function (attr) {
                return attr.selected;
            })).toBe(true);
        });

        it('should auto select all regions upon initialization', function () {

            expect(_.every(sut.selectedSegment.segmentOptions.regions, function (attr) {
                return attr.selected;
            })).toBe(true);
        });

        it('should auto select all personas upon initialization', function () {

            expect(_.every(sut.selectedSegment.segmentOptions.personas, function (attr) {
                return attr.selected;
            })).toBe(true);
        });

        it('should auto select all target types upon initialization', function () {

            expect(_.every(sut.selectedSegment.segmentOptions.targetTypes, function (attr) {
                return attr.selected;
            })).toBe(true);
        });
    });

    describe('Show Respondent Type', function () {

        it('should show the respondent type if the user is an admin', function () {
            var isAdmin = true;

            createController({
                isAdmin : isAdmin,
                insightSegments : _.cloneDeep(mockItemSegmentResults)
            });

            expect(sut.showRespondentType()).toBe(isAdmin);
        });

        it('should not show the respondent type if the user is not an admin', function () {
            var isAdmin = false;

            createController({
                isAdmin : isAdmin,
                insightSegments : _.cloneDeep(mockItemSegmentResults)
            });

            expect(sut.showRespondentType()).toBe(isAdmin);
        });
    });

    describe('New Segment', function () {
        beforeEach(function () {
            createController({
                insightSegments : _.cloneDeep(mockItemSegmentResults)
            });
        });

        it('should show the progress loader if no segment options are already cached', function () {
            sut.newSegment();

            expect(progressService.show).toHaveBeenCalled();
        });

        it('should not show the progress loader if segment options are already cached', function () {
            sut.segmentOptionsCache = mockSegmentOptions;

            sut.newSegment();

            expect(progressService.show).not.toHaveBeenCalled();
        });

        it('should cache the segment options retrieved, sorting the question text positionally', function () {
            sut.newSegment();

            $rootScope.$digest();

            expect(sut.segmentOptionsCache.questions[0].questionText).toEqual('What is your gender?');
        });

        it('should hide the progress loader once results are retrieved', function () {
            sut.newSegment();

            $rootScope.$digest();

            expect(progressService.hide).toHaveBeenCalled();
        });

        it('should not call the data service if segment options are already cached', function () {
            sut.segmentOptionsCache = mockSegmentOptions;

            sut.newSegment();

            expect(insightDataService.getInsightSegmentOptions).not.toHaveBeenCalled();
        });
    });

    describe('Save Segment', function () {
        beforeEach(function () {
            createController({
                insightSegments : []
            });
        });

        it('should show an alert if no options are unchecked prior to save', function () {
            spyOn(sut, 'parseSegmentOptions').and.returnValue("Test Message");

            sut.saveSegment();

            expect(dialogAlertService.show).toHaveBeenCalledWith("SAVE", "Test Message");
        });

        it('should not show an alert if parseSegmentOptions returns a valid object', function () {
            spyOn(sut, 'parseSegmentOptions').and.returnValue({});

            sut.saveSegment();

            expect(dialogAlertService.show).not.toHaveBeenCalled();
        });

        it('should set view mode back to true when the save segment process completes', function () {

            spyOn(sut, 'parseSegmentOptions').and.returnValue({});

            sut.saveSegment();

            $rootScope.$digest();

            expect(sut.viewMode).toBe(true);
        });
        
        it('should not call editSegmentName when viewMode is false', function () {
            sut.viewMode = false;
            expect(insightDataService.editSegmentName).not.toHaveBeenCalled();
        })
        it('should disable save button after changed name', function () {
            sut.viewMode = true;
            $scope.segmentForm = {};
            $scope.segmentForm.$setPristine = jasmine.createSpy('$setPristine');
            $scope.segmentForm.$dirty = true;
            sut.saveSegment();

            $rootScope.$digest();

            expect(sut.saveDisabled).toBe(true);
        })
    });
    
    describe('Delete Segment', function () {

        it('should go to previous page if only one segment', function () {
            createController({
                insightSegments : mockOnlyOneSegment
            });
            $rootScope.previousState.name = 'test';
            dialogConfirmService.show.and.returnValue($q.when('0'));

            sut.deleteSegment();

            $rootScope.$digest();
            expect($state.go).toHaveBeenCalledWith({name : 'test'}, stateParams);
        })

        it('should navigate back to the item list if there is no previous state when close is called', function () {
            createController({
                insightSegments : mockOnlyOneSegment
            });
            dialogConfirmService.show.and.returnValue($q.when('0'));

            sut.deleteSegment();

            $rootScope.$digest();

            expect($state.go).toHaveBeenCalledWith({name : 'insightTabWithLocale.items'}, stateParams);
        });
    })

    describe('Parse Segment Options', function () {
        beforeEach(function () {
            createController({
                insightSegments : []
            });
        });

        it('should return "No Filter" message constant if no options are unchecked', function () {
            var response = sut.parseSegmentOptions();
            expect(response).toEqual('ERROR_SEGMENT_NO_FILTER_CRITERIA');
        });

        it('should return "Invalid Group Options" if no options are checked', function () {
            // Unselect all first
            var attributeName = 'regions';
            sut.selectedSegment.segmentOptions[attributeName].selectAll = false;
            sut.toggleAttrSelectAll(attributeName);
            
            var response = sut.parseSegmentOptions();
            expect(response).toEqual('ERROR_SEGMENT_GROUP_NO_SELECTIONS');
        });

        it('should return "Invalid Group Options" if no answers are checked', function () {
            // Unselect all first
            var questionIndex= 0;
            sut.selectedSegment.segmentOptions.questions[questionIndex].selectAll = false;
            sut.toggleNestedAttrSelectAll('questions', 'answers', questionIndex);

            var response = sut.parseSegmentOptions();
            expect(response).toEqual('ERROR_SEGMENT_GROUP_NO_SELECTIONS');
        });

        it('should return a valid object if a single option is selected in a group', function () {
            var attributeName = 'regions';

            // Unselect All first
            sut.selectedSegment.segmentOptions[attributeName].selectAll = false;
            sut.toggleAttrSelectAll(attributeName);
            sut.selectedSegment.segmentOptions[attributeName][0].selected = true;

            var response = sut.parseSegmentOptions();
            expect(response).toEqual(jasmine.objectContaining({
                regions : [{
                    region: sut.selectedSegment.segmentOptions[attributeName][0].region,
                    count: 1,
                    selected: true
                }]
            }));
            expect(response).not.toEqual(jasmine.objectContaining({
                personas : jasmine.any(Object)
            }));
            expect(response).not.toEqual(jasmine.objectContaining({
                questions : jasmine.any(Object)
            }));
        });

        it('should return a valid object if a single option is selected in a group', function () {
            var attributeName = 'regions';

            // Don't unselect All first
            sut.selectedSegment.segmentOptions[attributeName][1].selected = false;
            sut.selectedSegment.segmentOptions[attributeName][2].selected = false;
            sut.selectedSegment.segmentOptions[attributeName][3].selected = false;

            var response = sut.parseSegmentOptions();
            expect(response).toEqual(jasmine.objectContaining({
                regions : [{
                    region: sut.selectedSegment.segmentOptions[attributeName][0].region,
                    count: 1,
                    selected: true
                }]
            }));
            expect(response).not.toEqual(jasmine.objectContaining({
                personas : jasmine.any(Object)
            }));
            expect(response).not.toEqual(jasmine.objectContaining({
                questions : jasmine.any(Object)
            }));
        });

        it('should return a valid object if a single answer is selected for a question', function () {
            var questionIndex= 0;

            // Unselect all first
            sut.selectedSegment.segmentOptions.questions[questionIndex].selectAll = false;
            sut.toggleNestedAttrSelectAll('questions', 'answers', questionIndex);
            sut.selectedSegment.segmentOptions.questions[questionIndex].answers[0].selected = true;
            sut.toggleNestedAttrSelect('questions', 'answers', questionIndex);
            var response = sut.parseSegmentOptions();
            expect(response).toEqual(jasmine.objectContaining({
                questions : [{
                    questionId: sut.selectedSegment.segmentOptions.questions[questionIndex].questionId,
                    surveyId: sut.selectedSegment.segmentOptions.questions[questionIndex].surveyId,
                    questionText: sut.selectedSegment.segmentOptions.questions[questionIndex].questionText,
                    questionLabel: sut.selectedSegment.segmentOptions.questions[questionIndex].questionLabel,
                    position: sut.selectedSegment.segmentOptions.questions[questionIndex].position,
                    answers: [sut.selectedSegment.segmentOptions.questions[questionIndex].answers[0]],
                    selectAll: false
                }]
            }));
            expect(response).not.toEqual(jasmine.objectContaining({
                personas : jasmine.any(Object)
            }));
            expect(response).not.toEqual(jasmine.objectContaining({
                regions : jasmine.any(Object)
            }));
        });

        it('should return a valid object if a single answer is selected for a question', function () {
            var questionIndex= 0;
            var answerIndex= 1;

            // Don't unselect all first
            sut.selectedSegment.segmentOptions.questions[questionIndex].answers[answerIndex].selected = false;
            sut.toggleNestedAttrSelect('questions', 'answers', questionIndex);
            var response = sut.parseSegmentOptions();
            expect(response).toEqual(jasmine.objectContaining({
                questions : [{
                    questionId: sut.selectedSegment.segmentOptions.questions[questionIndex].questionId,
                    surveyId: sut.selectedSegment.segmentOptions.questions[questionIndex].surveyId,
                    questionText: sut.selectedSegment.segmentOptions.questions[questionIndex].questionText,
                    questionLabel: sut.selectedSegment.segmentOptions.questions[questionIndex].questionLabel,
                    position: sut.selectedSegment.segmentOptions.questions[questionIndex].position,
                    answers: [sut.selectedSegment.segmentOptions.questions[questionIndex].answers[0]],
                    selectAll: false
                }]
            }));
            expect(response).not.toEqual(jasmine.objectContaining({
                personas : jasmine.any(Object)
            }));
            expect(response).not.toEqual(jasmine.objectContaining({
                regions : jasmine.any(Object)
            }));
        });
    });
    
    describe('check segment name', function () {
        beforeEach(function () {
            createController({
                insightSegments : _.cloneDeep(mockItemSegmentResults)
            });
        });
        it('should set original name to the first segment name', function () {
            
            $rootScope.$digest();
            expect(sut.selectedSegment).toEqual(sut.segments[0]);
            expect(sut.originalName).toEqual(sut.segments[0].name);
        })
        
        it('should set save button disabled originally', function () {
            sut.selectedSegment = sut.segments[1];
            sut.viewMode = true;
            expect(sut.saveDisabled).toBe(true);
        })
        it('should disable save button if selected segment changed', function () {
            
            sut.selectedSegment = sut.segments[1];
            sut.viewMode = true;
            $rootScope.$digest();
            sut.selectedSegment = sut.segments[2];
            expect(sut.saveDisabled).toBe(true);
        })
        
        it('should check segment name with no changing, and save button is disabled', function () {
            $rootScope.$digest();
            sut.selectedSegment.name = sut.segments[1].name;
            sut.viewMode = true;
            expect(sut.saveDisabled).toBe(true);
        })
        
        it('should check segment name with changed, and save button is not disabled', function () {
            sut.selectedSegment.name = sut.segments[1].name;
            sut.viewMode = true;
            $rootScope.$digest();
            sut.selectedSegment.name = 'name changed';
            expect(sut.saveDisabled).toBe(false);
        })
        
        it('should be able to navigate to other screen if having segment name', function () {
            
            sut.selectedSegment.name = sut.segments[1].name;
            sut.viewMode = true;
            $rootScope.$digest();
            expect(sut.ableToNavigate).toBe(true);
        })
        
        it('should not be able to navigate to other screen if no segment name ', function () {
            
            sut.selectedSegment.name = '';
            sut.viewMode = true;
            $rootScope.$digest();
            expect(sut.ableToNavigate).toBe(false);
        })
    })

});

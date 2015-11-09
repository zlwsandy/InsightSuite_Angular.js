'use strict';

describe('Segments Select Directive Specs', function () {
    var $scope;
    var $compile;
    var $state;
    var $httpBackend;
    var element;
    var sut;
    var insightLocaleFactory;

    // Stage test data
    var mockSegments;
    var mockLocales;
    var mockInsight;

    var selectedSegment;
    var countryLocale;

    var allLocales = {
        locale : 'all'
    };

    var compileDirective = function (segments, selectedLocale) {

        $scope.segmentsArray = segments;
        $scope.selectedLocale = selectedLocale;
        $scope.selectedSegment = selectedSegment;
        $scope.segmentChangeMock = jasmine.createSpy('segmentChangeMock');
        $scope.insight = mockInsight;

        element = angular.element('<fi-segment-select insight="insight" segments="segmentsArray" current-segment="selectedSegment" current-locale="selectedLocale" change="segmentChangeMock()"></fi-segment-select>');

        $compile(element)($scope);
        $scope.$digest();

        sut = element.isolateScope().FiSegmentSelectController;
    };

    beforeEach(module('mock/insight.json'));
    beforeEach(module('mock/locales.json'));
    beforeEach(module('mock/segments.json'));
    beforeEach(module('fi.common'));

    // The external template file referenced by templateUrl
    beforeEach(module('components/fi/fi-segment-select.directive.html'));

    // Setup spies
    beforeEach(function () {

        insightLocaleFactory = jasmine.createSpyObj('insightLocaleFactory', [
            'isInsightLocaleResults'
        ]);

        $state = jasmine.createSpyObj('$state', ['go']);
    });

    // Setup mock injection using $provide.value
    beforeEach(function () {
        module(function ($provide) {
            $provide.value("insightLocaleFactory", insightLocaleFactory);
            $provide.value("$state", $state);
        })
    });

    beforeEach(inject(function(_$compile_, _$rootScope_, _$httpBackend_, _mockLocales_, _mockSegments_, _mockInsight_) {

        $compile = _$compile_;
        $scope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        mockLocales = _mockLocales_;
        mockSegments = _mockSegments_;
        mockInsight = _mockInsight_;

        countryLocale = mockLocales.en_US;
        selectedSegment = mockSegments[1];

    }));

    describe('Common Initialization', function () {

        it('should have a currently selected segment object of whatever is given as the current segment', function () {
            compileDirective(mockSegments, countryLocale);
            expect(sut.currentSegment.gameRunStatus).toEqual(selectedSegment.gameRunStatus);
        });
    });

    describe('segment change watcher', function () {

        beforeEach(function () {
            compileDirective(null, countryLocale);
        });

        it('should set the segment options when the segments are populated', function () {

            expect(sut.segmentOptions).toEqual([]);

            sut.segments = mockSegments;
            $scope.$digest();

            expect(sut.segmentOptions).toEqual(mockSegments);
        });

        it('should set the segment options to an empty array if segments is changed to a non-array value', function () {
            expect(sut.segmentOptions).toEqual([]);

            sut.segments = 'test';
            $scope.$digest();

            expect(sut.segmentOptions).toEqual([]);
        });
    });

    describe('change event', function () {
        beforeEach(function () {
            compileDirective(mockSegments, countryLocale);
        });

        it('should call the passed function when an actual segment is selected', function () {
            spyOn(sut, 'change');
            spyOn(sut, 'isManageSegmentsSelected').and.returnValue(false);

            expect(sut.change).not.toHaveBeenCalled();

            // Call the controller function which executes the callback that was passed into the directive (parent function)
            sut.changeSegment();

            expect(sut.change).toHaveBeenCalled();
        });

        it('should not call the passed function when Manage Segments is selected', function () {
            spyOn(sut, 'change');
            spyOn(sut, 'isManageSegmentsSelected').and.returnValue(true);

            expect(sut.change).not.toHaveBeenCalled();

            sut.changeSegment();

            expect(sut.change).not.toHaveBeenCalled();
        });

        it('should reset the current segment to the previous segment when Manage Segments is selected', function () {
            spyOn(sut, 'change');
            spyOn(sut, 'isManageSegmentsSelected').and.returnValue(true);

            var segment = {
                name : 'preSegment',
                gameRunId : 123
            };
            sut.previousSegment = segment;

            sut.changeSegment();

            expect(sut.currentSegment).toEqual(segment);
        });

        it('should navigate to the Manage Segments view when Manage Segments is selected', function () {
            spyOn(sut, 'change');
            spyOn(sut, 'isManageSegmentsSelected').and.returnValue(true);

            sut.changeSegment();

            expect($state.go).toHaveBeenCalledWith('insightTabNoActionbarWithLocale.manageSegments', {
                locale : countryLocale.locale,
                insightId : mockInsight.insightId
            });
        });

        it('should set the previous segment to the current segment when an actual segment is selected', function () {
            spyOn(sut, 'change');
            spyOn(sut, 'isManageSegmentsSelected').and.returnValue(false);

            var segment = {
                name : 'currentSegment',
                gameRunId : 456
            };
            sut.currentSegment = segment;

            sut.changeSegment();

            expect(sut.previousSegment).toEqual(segment);
        });
    });
});

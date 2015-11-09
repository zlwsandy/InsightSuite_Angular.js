'use strict';

describe('Item Comments Directive Spec - ', function () {
    var $scope;
    var $compile;
    var $q;
    var element;
    var sut;
    var insightDataService;
    var $httpBackend;
    var mockComments = [
        {
            sentimentValue : 5,
            comment : 'Visible Love',
            visible : true,
            createDate : 1420727971000
        },
        {
            sentimentValue : 4,
            comment : 'Visible Like',
            visible : true,
            createDate : 1420727971066
        },
        {
            sentimentValue : 4,
            comment : 'Hidden Like',
            visible : false,
            createDate : 1420727971000
        },
        {
            sentimentValue : 3,
            comment : 'Visible Neutral',
            visible : true,
            createDate : 1420727971000
        },
        {
            sentimentValue : 3,
            comment : 'Hidden Neutral',
            visible : false,
            createDate : 1420727971077
        },
        {
            sentimentValue : 0,
            comment : 'Visible None',
            visible : true,
            createDate : 1420727971088
        },
        {
            sentimentValue : 0,
            comment : 'Visible None',
            visible : true,
            createDate : 1420727971000
        },
        {
            sentimentValue : 5,
            comment : 'Hidden Love',
            visible : false,
            createDate : 1420727971055
        },
        {
            sentimentValue : 1,
            comment : 'Visible Hate',
            visible : true,
            createDate : 1420727971000
        },
        {
            sentimentValue : 1,
            comment : 'Hidden Hate',
            visible : false,
            createDate : 1420727971044
        },
        {
            sentimentValue : 2,
            comment : 'Visible Leave',
            visible : true,
            createDate : 1420727971000
        },
        {
            sentimentValue : 2,
            comment : 'Hidden Leave',
            visible : false,
            createDate : 1420727971033
        }
    ];
    var HIDE_COMMENTS = 'hide comments';
    var SHOW_COMMENTS = 'show comments';
    var mockComment1 = {
            sentimentValue : 2,
            comment : 'Hidden Leave',
            visible : true,
            createDate : 1420727971033,
            menuOptions : [{
                value : HIDE_COMMENTS,
                label : 'Hide Comments'
            }]
    }

    var mockComment2 = {
            sentimentValue : 2,
            comment : 'Hidden Leave',
            visible : false,
            createDate : 1420727971033,
            menuOptions : [{
                value : SHOW_COMMENTS,
                label : 'Show Comments'
            }]
    }

    var getSuccessfulPromise = function (data) {
        return $q(function (resolve) {
            resolve(data);
        });
    };
    // Stage test data

    var compileDirective = function (comments, showHidden) {

        $scope.comments = comments;
        $scope.showHidden = showHidden;

        element = angular.element('<item-comments comments="comments" show-hidden="showHidden"></item-comments>');

        $compile(element)($scope);
        $scope.$digest();

        sut = element.isolateScope().ItemCommentsController;
    };

    beforeEach(module('fi.insight'));

    // The external template file referenced by templateUrl
    beforeEach(module('insight/items/sentiments/item-comments.directive.html'));

    beforeEach(function () {

        insightDataService = jasmine.createSpyObj('insightDataService', ['toggleComment']);

        module(function ($provide) {
            $provide.value('insightDataService', insightDataService);
        });
    });
    beforeEach(inject(function(_$compile_, _$rootScope_, _$q_, _$httpBackend_) {

        $compile = _$compile_;
        $scope = _$rootScope_;
        $q = _$q_;
        $httpBackend = _$httpBackend_;
        $scope.$digest();

        $httpBackend.whenGET('images/icon-options.svg').respond(200);
        insightDataService.toggleComment.and.returnValue(getSuccessfulPromise(mockComment1));
    }));

    describe('Common Initialization - ', function () {

        it('should initialize even if a falsy value for comments are passed', function () {
            compileDirective(null);
            expect(sut).toBeDefined();
        });

        it('should initialize even if no comments are passed', function () {
            compileDirective([]);
            expect(sut).toBeDefined();
        });

        it('should sort the comments list upon initialization', function () {

            var topComment = 'Hidden Love';

            compileDirective(mockComments, true);
            expect(sut.comments[0].comment).toEqual(topComment);
        });

        it('should show hidden comments if show hidden is true', function () {

            var topComment = 'Hidden Love';

            compileDirective(mockComments, true);
            expect(sut.comments[0].comment).toEqual(topComment);
        });

        it('should not show hidden comments if show hidden is false', function () {

            var topComment = 'Visible Love';

            compileDirective(mockComments, false);
            expect(sut.comments[0].comment).toEqual(topComment);
        });

        it('should default to showHidden of false if no value is passed', function () {

            var topComment = 'Visible Love';

            compileDirective(mockComments);
            expect(sut.comments[0].comment).toEqual(topComment);
        });
    });

    describe('Select Option', function () {
        beforeEach(function () {
            compileDirective(mockComments);
            $scope.$digest();
        });

        it('should call hideComments API if the selected menu item is hide comments', function () {
            var index = _.findIndex(mockComment1.menuOptions, function (option) {
                return option.value.toLowerCase() === 'hide comments';
            });
            sut.selectOption(mockComment1, index);

            expect(mockComment1.visible).toBe(true);
        });

        it('should call showComments API if the selected menu item is show comments', function () {
            var index = _.findIndex(mockComment2.menuOptions, function (option) {
                return option.value.toLowerCase() === 'show comments';
            });
            sut.selectOption(mockComment2, index);

            expect(mockComment2.visible).toBe(false);
        });
    });

});

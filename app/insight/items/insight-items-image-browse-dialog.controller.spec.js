'use strict';

describe('Image Browse Dialog Controller Specs - ', function () {
    var sut;
    var $rootScope;
    var $mdDialog;
    var mockImages = [
        {
            "itemImageId" : 1899,
            "primary" : false,
            "status" : "COMPLETE",
            "name" : "6.jpeg",
            "thumbnailUrl" : "/secure/imageviewer.iv?f=%2F2014%2F217%2F1407257137435",
            "fullsizeUrl" : "/secure/imageviewer.iv?f=%2F2014%2F217%2F1407257137433"
        },
        {
            "itemImageId" : 1898,
            "primary" : true,
            "status" : "COMPLETE",
            "name" : "5.jpeg",
            "thumbnailUrl" : "/secure/imageviewer.iv?f=%2F2014%2F217%2F1407257137435",
            "fullsizeUrl" : "/secure/imageviewer.iv?f=%2F2014%2F217%2F1407257137433"
        }
    ];
    var images;

    // load module under test
    beforeEach(module('fi.insight'));

    // Setup spies
    beforeEach(function () {

        $mdDialog = jasmine.createSpyObj('$mdDialog', ['hide']);
    });

    // Setup mock injection using $provide.value
    beforeEach(function () {
        module(function ($provide) {
            $provide.value("images", images);
            $provide.value("$mdDialog", $mdDialog);
        })
    });

    var createController = function () {
        inject(function (_$rootScope_, $controller) {
            $rootScope = _$rootScope_;

            sut = $controller('ImageBrowseDialogController', {
                $scope: $rootScope.$new()
            });
        });
    };

    describe('Valid Images', function () {

        beforeEach(function () {
            images = _.cloneDeep(mockImages);

            createController();
        });

        describe('Initialization', function () {

            it('should sort the images so that the reference item is first', function () {

                expect(sut.images[0].primary).toBe(true);
            });

            it('should default the current image to be the first in the images array', function () {
                expect(sut.current).toEqual(0);
            });
        });

        describe('Navigation', function () {

            it('should set the current index to be the last one if the current one is 0 and previous is called', function () {

                sut.previous();

                expect(sut.current).toBe(images.length - 1);
            });

            it('should set the current index to one less than the current if the current is not zero and previous is called', function () {

                sut.current = 1;
                sut.previous();

                expect(sut.current).toBe(0);
            });

            it('should set the current index to one greater than the current if the current is zero and next is called', function () {

                sut.current = 0;
                sut.next();

                expect(sut.current).toBe(1);
            });

            it('should set the current index to be zero if the current one is the last one and next is called', function () {

                sut.current = images.length - 1;
                sut.next();

                expect(sut.current).toBe(0);
            });
        });

        describe('Get Current Image', function () {

            it('should return the full size image URL of the current image if it exists', function () {

                expect(sut.getCurrentImage()).toEqual(images[0].fullsizeUrl);
            });
        });

        describe('Close', function () {

            it('should call hide on the mdDialog', function () {
                sut.close();

                expect($mdDialog.hide).toHaveBeenCalled();
            });
        });

        describe('Show Navigation', function () {

            it('should return true if there is more than one image', function () {

                expect(sut.showNavigation()).toBe(true);
            });
        });
    });

    describe('Invalid Images', function () {

        beforeEach(function () {
            images = undefined;

            createController();
        });

        describe('Initialization', function () {

            it('should default images to an empty array if undefined is passed', function () {
                expect(sut.images).toEqual([]);
            });
        });

        describe('Navigation', function () {

            it('should not update the current index if there are no images and previous is called', function () {

                sut.previous();

                expect(sut.current).toBe(0);
            });

            it('should not update the current index if there are no images and next is called', function () {

                sut.current = 0;
                sut.next();

                expect(sut.current).toBe(0);
            });
        });

        describe('Get Current Image', function () {

            it('should return undefined if there are no images', function () {

                expect(sut.getCurrentImage()).not.toBeDefined();
            });
        });

        describe('Show Navigation', function () {

            it('should return false if there are no images', function () {

                expect(sut.showNavigation()).toBe(false);
            });
        });
    });

    describe('One Image', function () {

        beforeEach(function () {
            images = [mockImages[0]];

            createController();
        });

        describe('Show Navigation', function () {

            it('should return false if there is only one image', function () {

                expect(sut.showNavigation()).toBe(false);
            });
        });
    });
});

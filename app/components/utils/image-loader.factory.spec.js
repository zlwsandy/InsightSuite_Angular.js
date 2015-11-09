'use strict';

describe('Image Loader Specs', function () {

    var sut;
    var $httpBackend;
    var testImageUrl = 'app/images/noimages-item.png';

    beforeEach(module('fi.common'));

    beforeEach(inject(function (imageLoader, _$httpBackend_) {
        sut = imageLoader;
        $httpBackend = _$httpBackend_;

        $httpBackend
            .whenGET('/testImageUrl')
            .respond({});
    }));

    describe('Load Fullsize Images', function () {

        it('should not load any images if no objects contain a fullsizeUrl', function () {

            var images = [{
                name : 'imageName'
            }];

            expect(sut.loadFullsizeImages(images)).toEqual(0);
        });

        it('should not load any images if no objects contain a fullsizeUrl', function () {

            var images = [{
                name : 'imageName',
                fullsizeUrl : testImageUrl
            }];

            expect(sut.loadFullsizeImages(images)).toEqual(0);
        });

        it('should not load any images if nothing is passed to load images', function () {
            expect(sut.loadFullsizeImages()).toEqual(0);
        })
    });

    describe('Load Fullsize Images By Items', function () {

        beforeEach(function () {

            spyOn(sut, 'loadFullsizeImages');
        });

        it('should not attempt to load images if no items are specified', function () {

            var items = [];

            sut.loadFullsizeImagesByItems(items);

            expect(sut.loadFullsizeImages.calls.count()).toEqual(0);
        });

        it('should attempt to load images once for each item', function () {

            var items = [
                {
                    itemImages : [
                        {
                            name : 'imageName2',
                            fullsizeUrl : testImageUrl
                        }
                    ]
                }
            ];

            sut.loadFullsizeImagesByItems(items);

            expect(sut.loadFullsizeImages.calls.count()).toEqual(1);

        });
    });
});

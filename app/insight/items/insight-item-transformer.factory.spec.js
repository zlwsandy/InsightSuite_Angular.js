'use strict';

describe('Insight Item Transformer Specs', function () {
    var sut;

    var mockItems = [
        {
            'createTime' : 1412605661000,
            'itemId' : 87,
            'gameItemId' : 385,
            'name' : '0',
            'number' : '1',
            'reference' : 'LOW',
            'itemImages' : [{
                'itemImageId' : 1886,
                'primary' : true,
                'status' : 'COMPLETE',
                'name' : '0.jpeg',
                'thumbnailUrl' : 'thumbnail',
                'fullsizeUrl' : 'fullsize'
            }, {
                'itemImageId' : 1887,
                'primary' : false,
                'status' : 'COMPLETE',
                'name' : '1.jpeg',
                'thumbnailUrl' : 'thumbnail',
                'fullsizeUrl' : 'fullsize'
            }],
            'testPrice' : 10.00,
            'promotionalPrice' : null,
            'unitCost' : 4.00,
            'description' : 'Jeans n At',
            'totalValue' : 1.0,
            'percentTestPrice' : 0.958,
            'maxGMPrice' : 0.00,
            'modelPrice' : null,
            'maxGrossMarginPercent' : 0.0,
            'grossMarginDeltaBasisPoints' : -6000.0,
            'overallPositive' : 0.0,
            'overallNegative' : 0.0
        },
        {
            'createTime' : 1412605661000,
            'itemId' : 87,
            'gameItemId' : 385,
            'name' : '0',
            'number' : '1',
            'reference' : 'LOW',
            'itemImages' : [{
                'itemImageId' : 1886,
                'primary' : false,
                'status' : 'COMPLETE',
                'name' : '0.jpeg',
                'thumbnailUrl' : 'thumbnail',
                'fullsizeUrl' : 'fullsize'
            }, {
                'itemImageId' : 1887,
                'primary' : true,
                'status' : 'COMPLETE',
                'name' : '1.jpeg',
                'thumbnailUrl' : 'thumbnail',
                'fullsizeUrl' : 'fullsize'
            }],
            'testPrice' : 5.00,
            'promotionalPrice' : null,
            'unitCost' : 4.00,
            'description' : 'Jeans n At',
            'totalValue' : 1.0,
            'percentTestPrice' : 0.998,
            'maxGMPrice' : 0.00,
            'modelPrice' : null,
            'maxGrossMarginPercent' : 0.0,
            'grossMarginDeltaBasisPoints' : -3000.0,
            'overallPositive' : 0.0,
            'overallNegative' : 0.0
        }, {
            'createTime' : 1412605661000,
            'itemId' : 87,
            'gameItemId' : 385,
            'name' : '0',
            'number' : '1',
            'reference' : 'LOW',
            'itemImages' : [],
            'testPrice' : 5.00,
            'promotionalPrice' : null,
            'unitCost' : 4.00,
            'description' : 'Jeans n At',
            'totalValue' : 1.0,
            'percentTestPrice' : 0.998,
            'maxGMPrice' : 0.00,
            'modelPrice' : null,
            'maxGrossMarginPercent' : 0.0,
            'grossMarginDeltaBasisPoints' : -3000.0,
            'overallPositive' : 0.0,
            'overallNegative' : 0.0
        }
    ];

    beforeEach(module('fi.insight'));
    beforeEach(module('fi.constants'));

    beforeEach(inject(function (insightItemTransformer) {
        sut = insightItemTransformer;
    }));

    describe('Primary Image', function () {

        it('should set the primary image on the items', function () {

            var transformedResults = sut(mockItems);

            expect(transformedResults[0].primaryImage).toEqual(mockItems[0].itemImages[0]);
        });

        it('should set the primary image on a item', function () {
            var transformedResult = sut(mockItems[0]);

            expect(transformedResult.primaryImage).toEqual(mockItems[0].itemImages[0]);
        });

        it('should set the primary image to NO_IMAGE', inject(function (FiConstants) {
            var transformedResult = sut(mockItems[2]);

            expect(transformedResult.primaryImage).toEqual(jasmine.objectContaining({
                thumbnailUrl: FiConstants.NO_IMAGE_PATH,
                status: FiConstants.NO_IMAGE_STATUS
            }));
        }));

        it('should arrange the item images such that the primary image is the first image', function () {
            var transformedResult = sut(mockItems[2]);

            expect(transformedResult.itemImages[0]).toEqual(transformedResult.primary);
        });
    });
});

'use strict';

describe('Insight Item Segment Transformer Specs', function () {
    var sut;

    var mockItemSegments;

    beforeEach(module('mock/item-details-segment-results.json'));
    beforeEach(module('fi.insight'));

    beforeEach(inject(function(insightItemSegmentTransformer, _mockItemDetailsSegmentResults_) {
        mockItemSegments = _.cloneDeep(_mockItemDetailsSegmentResults_);
        sut = insightItemSegmentTransformer;
    }));

    describe('Primary Image', function () {

        it('should set the primary image on the items', function () {

            var transformedResults = sut(mockItemSegments);

            expect(transformedResults.primaryImage).toEqual(mockItemSegments.itemImages[0]);
        });
    });

    describe('Sorting', function () {

        var transformedResults;
        beforeEach(function () {

            transformedResults = sut(mockItemSegments);
        });

        it('should sort segment game items alphanumerically', function () {

            expect(transformedResults.segmentGameItems[0].gameRunName).toEqual("Female");
            expect(transformedResults.segmentGameItems[1].gameRunName).toEqual("Female");
            expect(transformedResults.segmentGameItems[2].gameRunName).toEqual("Male");
        });

        it('should use game run ID as the tiebreaker if two segments have the same game run name', function () {

            expect(transformedResults.segmentGameItems[0].gameRunId).toEqual(184);
            expect(transformedResults.segmentGameItems[1].gameRunId).toEqual(186);
        });
    });

});

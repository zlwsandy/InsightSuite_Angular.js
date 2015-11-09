'use strict';

describe('Segment Transformer Specs', function () {
    var sut, mockSegments;

    beforeEach(module('mock/segments.json'));
    beforeEach(module('fi.insight'));
    beforeEach(module('fi.constants'));

    beforeEach(inject(function(segmentTransformer, _mockSegments_) {
        mockSegments = _mockSegments_;
        sut = segmentTransformer;
    }));

    describe('Sorting', function () {

        var transformedResults;
        beforeEach(function () {
            transformedResults = sut(mockSegments);
        });

        it('should sort segments alphanumerically', function () {

            expect(transformedResults[0].name).toEqual("123Segment");
            expect(transformedResults[1].name).toEqual("789Segment");
            expect(transformedResults[2].name).toEqual("789Segment");
            expect(transformedResults[3].name).toEqual("AbcSegment");
            expect(transformedResults[4].name).toEqual("XyzSegment");
        });

        it('should use game run ID as the tiebreaker if two segments have the same name', function () {

            expect(transformedResults[1].gameRunId).toEqual(4);
            expect(transformedResults[2].gameRunId).toEqual(5);
        });
    });

    describe('Is Generating', function () {

        var transformedResults;
        beforeEach(function () {

            transformedResults = sut(mockSegments);
        });

        it('should correctly set isGenerating based on status', function () {

            expect(transformedResults[0].isGenerating).toBe(false);
            expect(transformedResults[1].isGenerating).toBe(true);
            expect(transformedResults[2].isGenerating).toBe(true);
            expect(transformedResults[3].isGenerating).toBe(false);
            expect(transformedResults[4].isGenerating).toBe(true);
        });
    });
});

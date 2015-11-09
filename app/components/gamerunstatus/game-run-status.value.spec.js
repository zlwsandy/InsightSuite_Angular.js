'use strict';

describe('gameRunStatusValue', function () {
    var gameRunStatusValue;

    beforeEach(module('fi.common'));

    beforeEach(inject(function (_gameRunStatusValue_) {
        gameRunStatusValue = _gameRunStatusValue_;
    }));

    describe('isInSetup', function () {
        it('should return true when the candidate equals setup', function () {
            expect(gameRunStatusValue.isInSetup('sEtUp')).toBe(true);
        });

        it('should return true when the candidate is an object with a property of gameRunStatus whose value equal to setup', function () {
            expect(gameRunStatusValue.isInSetup({ gameRunStatus: 'sEtUp'})).toBe(true);
        });

        it('should return false when the candiate does not equal setup', function () {
            expect(gameRunStatusValue.isInSetup({ gameRunStatus: 'prEvIEw'})).toBe(false);
        });

        it('should return false when the candidate is an object with a property of gameRunStatus whose value does not equal setup', function () {
            expect(gameRunStatusValue.isInSetup({ gameRunStatus: 'prEvIEw'})).toBe(false);
        });

        it('should return false when the candidate is an object without a gameRunStatus property', function () {
            expect(gameRunStatusValue.isInSetup({})).toBe(false);
        });

        it('should return false when the candidate is falsey', function () {
            expect(gameRunStatusValue.isInSetup(null)).toBe(false);
        });
    });

    describe('isInPreview', function () {
        it('should return true when the candidate equals preview', function () {
            expect(gameRunStatusValue.isInPreview('prEvIEw')).toBe(true);
        });

        it('should return true when the candidate is an object with a property of gameRunStatus whose value equal to preview', function () {
            expect(gameRunStatusValue.isInPreview({ gameRunStatus: 'prEvIEw'})).toBe(true);
        });

        it('should return false when the candiate does not equal preview', function () {
            expect(gameRunStatusValue.isInPreview({ gameRunStatus: 'sEtUp'})).toBe(false);
        });

        it('should return false when the candidate is an object with a property of gameRunStatus whose value does not equal preview', function () {
            expect(gameRunStatusValue.isInPreview({ gameRunStatus: 'sEtUp'})).toBe(false);
        });

        it('should return false when the candidate is an object without a gameRunStatus property', function () {
            expect(gameRunStatusValue.isInPreview({})).toBe(false);
        });

        it('should return false when the candidate is falsey', function () {
            expect(gameRunStatusValue.isInPreview(null)).toBe(false);
        });
    });

    describe('isInProgress', function () {
        it('should return true when the candidate equals progress', function () {
            expect(gameRunStatusValue.isInProgress('runNing')).toBe(true);
        });

        it('should return true when the candidate is an object with a property of gameRunStatus whose value equal to progress', function () {
            expect(gameRunStatusValue.isInProgress({ gameRunStatus: 'runNing'})).toBe(true);
        });

        it('should return false when the candiate does not equal progress', function () {
            expect(gameRunStatusValue.isInProgress({ gameRunStatus: 'prEvIEw'})).toBe(false);
        });

        it('should return false when the candidate is an object with a property of gameRunStatus whose value does not equal progress', function () {
            expect(gameRunStatusValue.isInProgress({ gameRunStatus: 'prEvIEw'})).toBe(false);
        });

        it('should return false when the candidate is an object without a gameRunStatus property', function () {
            expect(gameRunStatusValue.isInProgress({})).toBe(false);
        });

        it('should return false when the candidate is falsey', function () {
            expect(gameRunStatusValue.isInProgress(null)).toBe(false);
        });
    });

    describe('hasResults', function () {
        it('should return true when the candidate equals results', function () {
            expect(gameRunStatusValue.hasResults('rEsUlts')).toBe(true);
        });

        it('should return true when the candidate is an object with a property of gameRunStatus whose value equal to results', function () {
            expect(gameRunStatusValue.hasResults({ gameRunStatus: 'rEsUlts'})).toBe(true);
        });

        it('should return false when the candiate does not equal results', function () {
            expect(gameRunStatusValue.hasResults({ gameRunStatus: 'prEvIEw'})).toBe(false);
        });

        it('should return false when the candidate is an object with a property of gameRunStatus whose value does not equal results', function () {
            expect(gameRunStatusValue.hasResults({ gameRunStatus: 'prEvIEw'})).toBe(false);
        });

        it('should return false when the candidate is an object without a gameRunStatus property', function () {
            expect(gameRunStatusValue.hasResults({})).toBe(false);
        });

        it('should return false when the candidate is falsey', function () {
            expect(gameRunStatusValue.hasResults(null)).toBe(false);
        });
    });

    describe('isHidden', function () {
        it('should return true when the candidate equals hidden', function () {
            expect(gameRunStatusValue.isHidden('hIddEn')).toBe(true);
        });

        it('should return true when the candidate is an object with a property of gameRunStatus whose value equal to hidden', function () {
            expect(gameRunStatusValue.isHidden({ gameRunStatus: 'hIddEn'})).toBe(true);
        });

        it('should return false when the candiate does not equal hidden', function () {
            expect(gameRunStatusValue.isHidden({ gameRunStatus: 'prEvIEw'})).toBe(false);
        });

        it('should return false when the candidate is an object with a property of gameRunStatus whose value does not equal hidden', function () {
            expect(gameRunStatusValue.isHidden({ gameRunStatus: 'prEvIEw'})).toBe(false);
        });

        it('should return false when the candidate is an object without a gameRunStatus property', function () {
            expect(gameRunStatusValue.isHidden({})).toBe(false);
        });

        it('should return false when the candidate is falsey', function () {
            expect(gameRunStatusValue.isHidden(null)).toBe(false);
        });
    });

    describe('isSummarySetup', function () {
        it('should return true when the candidate equals SUMMARY_SETUP', function () {
            expect(gameRunStatusValue.isSummarySetup('sUMmary_SETup')).toBe(true);
        });

        it('should return true when the candidate is an object with a property of gameRunStatus whose value equal to SUMMARY_SETUP', function () {
            expect(gameRunStatusValue.isSummarySetup({ gameRunStatus: 'sUMmary_SETup'})).toBe(true);
        });

        it('should return false when the candiate does not equal SUMMARY_SETUP', function () {
            expect(gameRunStatusValue.isSummarySetup({ gameRunStatus: 'prEvIEw'})).toBe(false);
        });

        it('should return false when the candidate is an object with a property of gameRunStatus whose value does not equal SUMMARY_SETUP', function () {
            expect(gameRunStatusValue.isSummarySetup({ gameRunStatus: 'prEvIEw'})).toBe(false);
        });

        it('should return false when the candidate is an object without a gameRunStatus property', function () {
            expect(gameRunStatusValue.isSummarySetup({})).toBe(false);
        });

        it('should return false when the candidate is falsey', function () {
            expect(gameRunStatusValue.isSummarySetup(null)).toBe(false);
        });
    });

    describe('isSummaryResults', function () {
        it('should return true when the candidate equals SUMMARY_RESULTS', function () {
            expect(gameRunStatusValue.isSummaryResults('sUMmary_REsulTS')).toBe(true);
        });

        it('should return true when the candidate is an object with a property of gameRunStatus whose value equal to SUMMARY_RESULTS', function () {
            expect(gameRunStatusValue.isSummaryResults({ gameRunStatus: 'sUMmary_REsulTS'})).toBe(true);
        });

        it('should return false when the candiate does not equal SUMMARY_RESULTS', function () {
            expect(gameRunStatusValue.isSummaryResults({ gameRunStatus: 'prEvIEw'})).toBe(false);
        });

        it('should return false when the candidate is an object with a property of gameRunStatus whose value does not equal SUMMARY_RESULTS', function () {
            expect(gameRunStatusValue.isSummaryResults({ gameRunStatus: 'prEvIEw'})).toBe(false);
        });

        it('should return false when the candidate is an object without a gameRunStatus property', function () {
            expect(gameRunStatusValue.isSummaryResults({})).toBe(false);
        });

        it('should return false when the candidate is falsey', function () {
            expect(gameRunStatusValue.isSummaryResults(null)).toBe(false);
        });
    });

    describe('isSummaryProgress', function () {
        it('should return true when the candidate equals SUMMARY_PROGRESS', function () {
            expect(gameRunStatusValue.isSummaryProgress('sUMmary_ProgrEss')).toBe(true);
        });

        it('should return true when the candidate is an object with a property of gameRunStatus whose value equal to SUMMARY_PROGRESS', function () {
            expect(gameRunStatusValue.isSummaryProgress({ gameRunStatus: 'sUMmary_ProgrEss'})).toBe(true);
        });

        it('should return false when the candiate does not equal SUMMARY_RESULTS', function () {
            expect(gameRunStatusValue.isSummaryProgress({ gameRunStatus: 'prEvIEw'})).toBe(false);
        });

        it('should return false when the candidate is an object with a property of gameRunStatus whose value does not equal SUMMARY_PROGRESS', function () {
            expect(gameRunStatusValue.isSummaryProgress({ gameRunStatus: 'prEvIEw'})).toBe(false);
        });

        it('should return false when the candidate is an object without a gameRunStatus property', function () {
            expect(gameRunStatusValue.isSummaryProgress({})).toBe(false);
        });

        it('should return false when the candidate is falsey', function () {
            expect(gameRunStatusValue.isSummaryProgress(null)).toBe(false);
        });
    });

    describe('isProcessing', function () {
        it('should return true when the candidate equals PROCESSING', function () {
            expect(gameRunStatusValue.isProcessing('PrOcessing')).toBe(true);
        });

        it('should return true when the candidate is an object with a property of gameRunStatus whose value equal to PROCESSING', function () {
            expect(gameRunStatusValue.isProcessing({ gameRunStatus: 'Processing'})).toBe(true);
        });

        it('should return false when the candiate does not equal PROCESSING', function () {
            expect(gameRunStatusValue.isProcessing({ gameRunStatus: 'prEvIEw'})).toBe(false);
        });

        it('should return false when the candidate is an object with a property of gameRunStatus whose value does not equal PROCESSING', function () {
            expect(gameRunStatusValue.isProcessing({ gameRunStatus: 'prEvIEw'})).toBe(false);
        });

        it('should return false when the candidate is an object without a gameRunStatus property', function () {
            expect(gameRunStatusValue.isProcessing({})).toBe(false);
        });

        it('should return false when the candidate is falsey', function () {
            expect(gameRunStatusValue.isProcessing(null)).toBe(false);
        });
    });
});

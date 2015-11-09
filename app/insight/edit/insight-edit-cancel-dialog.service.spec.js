'use strict';

describe('InsightEditCancelDialogService', function () {
    var $mdDialog, insightEditCancelDialogService;

    beforeEach(module('fi.insight'));

    beforeEach(inject(function (_insightEditCancelDialogService_, _$mdDialog_) {
        insightEditCancelDialogService = _insightEditCancelDialogService_;
        $mdDialog = _$mdDialog_;

        spyOn($mdDialog, 'show').and.callThrough();
        spyOn($mdDialog, 'confirm').and.callThrough();
    }));


    describe('show', function () {
        beforeEach(inject(function ($rootScope) {
            insightEditCancelDialogService.show();
            $rootScope.$digest();
        }));

        it('should build a confirmation dialog', function () {
            expect($mdDialog.confirm).toHaveBeenCalled();
        });

        it('should display the dialog', function () {
            expect($mdDialog.show).toHaveBeenCalled();
        });
    });
});

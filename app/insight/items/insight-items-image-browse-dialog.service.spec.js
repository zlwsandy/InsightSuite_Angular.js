'use strict';

describe('Image Browse Dialog Spec - ', function () {
    var sut;
    var $mdDialog;

    beforeEach(module('fi.insight'));

    beforeEach(inject(function (_$mdDialog_, _imageBrowseDialog_) {
        sut = _imageBrowseDialog_;
        $mdDialog = _$mdDialog_;

        spyOn($mdDialog, 'show');
    }));

    describe('Show - ', function () {

        it('should call show on mdDialog when called', function () {
            sut.show();
            expect($mdDialog.show).toHaveBeenCalled();
        });
    });
});

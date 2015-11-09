'use strict';

describe('Item Comments Dialog Spec - ', function () {
    var sut;
    var $mdDialog;

    beforeEach(module('fi.insight'));

    beforeEach(inject(function (_$mdDialog_, _itemCommentsDialog_) {
        sut = _itemCommentsDialog_;
        $mdDialog = _$mdDialog_;

        spyOn($mdDialog, 'show');
    }));

    describe('Show - ', function () {
        var insight;

        it('should call show on mdDialog when called', function () {
            sut.show();
            expect($mdDialog.show).toHaveBeenCalled();
        });
    });
});

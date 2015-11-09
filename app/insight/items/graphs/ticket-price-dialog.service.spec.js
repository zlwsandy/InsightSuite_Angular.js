'use strict';

describe('Ticket Price Dialog Spec - ', function () {
    var sut;
    var $mdDialog;

    beforeEach(module('fi.insight'));

    beforeEach(inject(function (_$mdDialog_, _ticketPriceDialog_) {
        sut = _ticketPriceDialog_;
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

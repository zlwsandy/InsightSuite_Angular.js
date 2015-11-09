'use strict';

describe('insightItemsMoveToPreviewDialog', function () {
    var announceService, insightItemsMoveToPreviewDialog, dialogAlert, insightDataService, $mdDialog, INSIGHT, COMPANY;

    beforeEach(module('fi.insight'));
    beforeEach(module('components/announce/toast.html'));

    beforeEach(module(function ($provide) {
        var fiService = jasmine.createSpyObj('fiService', ['companyId']);
        fiService.companyId.and.callFake(function () {
            return 101;
        });

        insightDataService = jasmine.createSpyObj('insightDataService', ['moveToPreview']);

        $provide.value('fiService', fiService);
        $provide.value('insightDataService', insightDataService);
    }));

    beforeEach(inject(function (_announceService_, _dialogAlert_, _insightItemsMoveToPreviewDialog_, companyService, _$mdDialog_, $q) {
        announceService = _announceService_;
        dialogAlert = _dialogAlert_;
        insightItemsMoveToPreviewDialog = _insightItemsMoveToPreviewDialog_;
        $mdDialog = _$mdDialog_;

        spyOn($mdDialog, 'show').and.returnValue($q.when());
        spyOn($mdDialog, 'confirm').and.callThrough();
        spyOn(announceService, 'info');
        spyOn(dialogAlert, 'show');
        spyOn(companyService, 'getCompany').and.returnValue($q.when(COMPANY));
    }));

    describe('show', function () {
        var insight;

        beforeEach(inject(function ($rootScope, $q) {
            insight = angular.copy(INSIGHT);
        }));

        describe('is able to move the game run to in preview status', function () {
            beforeEach(inject(function ($rootScope, $q) {
                insightDataService.moveToPreview.and.returnValue($q.when(insight));
                insightItemsMoveToPreviewDialog.show(null, insight);
                $rootScope.$digest();
            }));

            it('should create a confirmation dialog', function () {
                expect($mdDialog.confirm).toHaveBeenCalled();
            });

            it('should show the confirmation dialog', function () {
                expect($mdDialog.show).toHaveBeenCalled();
            });

            it('should move the game run to in preview', function () {
                expect(insightDataService.moveToPreview).toHaveBeenCalledWith(insight.gameRunId, false);
            });

            it('should announce the game run was moved to preview', function () {
                expect(announceService.info).toHaveBeenCalled();
            });
        });

        describe('unable to move the game run to preview', function () {
            var err = 'Nooo!!!';

            beforeEach(inject(function ($rootScope, $q) {
                insightDataService.moveToPreview.and.returnValue($q.reject(err));
                insightItemsMoveToPreviewDialog.show(null, insight);
                $rootScope.$digest();
            }));

            it('should create a confirmation dialog', function () {
                expect($mdDialog.confirm).toHaveBeenCalled();
            });

            it('should show the confirmation dialog', function () {
                expect($mdDialog.show).toHaveBeenCalled();
            });
        });
    });

    INSIGHT = {
        name: 'insight name',
        locale: 'en_US',
        gameRunId: 101,
        gameRunStatus: 'SETUP'
    };

    COMPANY = {
        il8nEnabled: true
    };
});

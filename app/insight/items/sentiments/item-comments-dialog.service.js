(function () {
    'use strict';

    /* @ngInject */
    function ItemCommentsDialog($mdDialog) {

        var vm = this;

        /**
         * Display the Item Comments dialog, listing the given comments.  Returns the promise generated by $mdDialog.show
         * so that consumers of this function can act on the action to which it resolves
         *
         * @param comments
         * @returns {Promise}
         */
        vm.show = function (gameItemId) {
            return $mdDialog.show({
                templateUrl: 'insight/items/sentiments/item-comments-dialog.html',
                controller : function (comments, isAdmin, isCompanyAdmin, $mdDialog) {

                    this.comments = comments;
                    this.isAdmin = isAdmin;
                    this.isCompanyAdmin = isCompanyAdmin;

                    this.close = function () {
                        $mdDialog.hide('close');
                    };
                },
                controllerAs : 'itemCommentsDialogController',
                resolve : {
                    /* @ngInject */
                    isAdmin : function (_, fiService) {
                        return fiService
                            .isAdmin()
                            .then(_.wrap(true))
                            .catch(_.wrap(false));
                    },
                    /* @ngInject */
                    isCompanyAdmin : function (_, fiService) {
                        return fiService
                            .isCompanyAdmin()
                            .then(_.wrap(true))
                            .catch(_.wrap(false));
                    },
                    /* @ngInject */
                    comments : function (insightDataService) {
                        return insightDataService.getInsightItemComments(gameItemId);
                    }
                }
            });
        };
    }

    angular
        .module('fi.insight')
        .service('itemCommentsDialog', ItemCommentsDialog);
}());

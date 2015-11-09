/**
 * @name ItemComments
 * @restrict E
 * @module fi.insight
 *
 * @description Displays a list of comments for an insight item, along with their sentiments
 *
 * @param {comments=} comments : The comments to display in list
 * @param [showHidden=] showHidden : Optional:  Whether to show the hidden comments.  If true, hidden
 *  comments will show along with their status indicating they are hidden. Defaults to false.
 *
 * @usage
 *   <item-comments
 *      comments="someController.comments"
 *      show-hidden="someController.isAdmin">
 *  </item-comments>
 */
(function () {
    'use strict';

    /* @ngInject */
    function ItemComments() {
        return {
            restrict : 'E',
            templateUrl : 'insight/items/sentiments/item-comments.directive.html',
            controller: ItemCommentsController,
            controllerAs: 'ItemCommentsController',
            bindToController : true,
            replace : true,
            scope : {
                comments : '=',
                showHidden : '='
            }
        };
    }

    /* @ngInject */
    function ItemCommentsController($translate, insightDataService, announceService, _) {
        var vm = this;

        var HIDE = 'hide';
        var SHOW = 'show';

        var showCommentOption = [{
            value : SHOW,
            label : $translate.instant('SHOW_COMMENT')
        }];

        var hideCommentOption = [{
            value : HIDE,
            label : $translate.instant('HIDE_COMMENT')
        }];

        // Map of sentiments and their attributes
        var sentimentMap = {
            '5' : {
                icon : 'images/icon-sentiment-loveit.svg',
                sortOrder : 1
            },
            '4' : {
                icon : 'images/icon-sentiment-likeit.svg',
                sortOrder : 2
            },
            '0' : {
                icon : 'images/icon-sentiment-noresponse.svg',
                sortOrder : 3
            },
            '3' : {
                icon : 'images/icon-sentiment-neutral.svg',
                sortOrder : 4
            },
            '2' : {
                icon : 'images/icon-sentiment-leaveit.svg',
                sortOrder : 5
            },
            '1' : {
                icon : 'images/icon-sentiment-hateit.svg',
                sortOrder : 6
            }
        };

        /**
         * Initialization Function
         */
        function init() {
            if (vm.comments) {

                // If showHidden is false, then make a defensive copy and remove all hidden comments from the list
                if (!vm.showHidden) {
                    vm.comments = _.chain(vm.comments)
                        .cloneDeep()
                        .filter(function (comment) {
                            return comment.visible;
                        })
                        .value();
                }

                vm.comments.sort(function (a, b) {
                    // The primary sort is the pre-defined order of the comment sentiments.  If those are equal, then
                    //  sort by the createTime with the most recent coming first
                    var sentimentOrder = sentimentMap[a.sentimentValue].sortOrder - sentimentMap[b.sentimentValue].sortOrder;

                    return sentimentOrder !== 0 ? sentimentOrder : b.createDate - a.createDate;
                });
                getMenuOptions();
            }
        }


        function getMenuOptions() {
            for (var i = 0; i < vm.comments.length; i++) {
                vm.comments[i].menuOptions = [];
                if (vm.comments[i].visible) {
                    vm.comments[i].menuOptions = hideCommentOption;
                } else {
                    vm.comments[i].menuOptions = showCommentOption;
                }
            }
        }

        /**
         * Gets the icon for the given sentiment
         *
         * @param sentiment
         * @returns String representing the path to the icon
         */
        vm.getIcon = function (sentiment) {
            return sentimentMap[sentiment].icon;
        };

        vm.openMenu = function ($mdOpenMenu, ev) {
            $mdOpenMenu(ev);
        };

        vm.selectOption = function (comment, index) {
            var selectedOption = comment.menuOptions[index];
            var playerCommentId = comment.playerCommentId;
            var action;
            var visible;
            var newOption;

            if (selectedOption.value.toLowerCase() === HIDE) {

                action = HIDE;
                visible = false;
                newOption = showCommentOption;

            } else if (selectedOption.value.toLowerCase() === SHOW) {

                action = SHOW;
                visible = true;
                newOption = hideCommentOption;
            }

            insightDataService.toggleComment(playerCommentId, action, {visible : visible}).then(function () {
                comment.visible = visible;
                comment.menuOptions = newOption;
            }).catch(announceService.error);
        };
        init();
    }

    angular
        .module('fi.insight')
        .directive('itemComments', ItemComments);
}());

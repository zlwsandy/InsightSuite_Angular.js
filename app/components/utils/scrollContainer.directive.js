(function () {
    'use strict';

    function link(scope, element) {

        var SCROLL_CONTAINER_CLASS = 'insight-details-scroll-container';
        var SCROLL_DISTANCE = 100;

        var container;

        /**
         * Searches the element children for the scroll container.  It is a child of the
         * element structure due to the left and right scroll buttons
         */
        var findScrollContainer = function () {
            var i;
            var children = element.find('span');
            for (i = 0; i < children.length; i += 1) {
                if (angular.element(children[i]).hasClass(SCROLL_CONTAINER_CLASS)) {
                    container = children[i];
                    break;
                }
            }
        };

        /**
         * Sets the scrollLeft attribute on the scroll container to a given value
         *
         * @param value
         */
        scope.handleScroll = function (value) {
            container.scrollLeft = container.scrollLeft + value;
        };

        /**
         * Scroll the container in the given direction a set distance
         * @param direction
         */
        scope.scroll = function (direction) {
            var multiplier;
            if (container) {
                multiplier = direction === 'left' ? -1 : 1;

                scope.handleScroll(SCROLL_DISTANCE * multiplier);
            }
        };

        findScrollContainer();
    }

    /* @ngInject */
    function scrollContainer() {
        var directive = {
            restrict: 'E',
            link: link,
            scope : {
                itemDetails : '='
            },
            templateUrl : 'components/utils/scrollContainer.directive.html'
        };

        return directive;
    }

    angular
        .module('fi.common')
        .directive('scrollContainer', scrollContainer);
}());

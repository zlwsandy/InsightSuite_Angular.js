/**
 * @name FiScrollShrink
 * @restrict E
 * @module fi.common
 *
 * @description This directive can be used by either a source scrolling container or a target element that should shrink.
 * If the element is marked as the source, it will broadcast a scrollShrink / scrollGrow event when scrolling passes a
 * given threshold
 *
 * If the element is marked as the target, it will bind to scrollShrink and scrollGrow events and will add/remove the
 * .shrink class accordingly
 *
 * @usage
 *
 * For source elements (scrolling containers)
 * <fi-scroll-shrink source="true"></fi-scroll-shrink>
 *
 * For target elements (elements that will shrink/grow based on scrolling container)
 * <fi-scroll-shrink target="true"></fi-scroll-shrink>
 *
 */
(function () {
    'use strict';

    /* @ngInject */
    function FiScrollShrink($rootScope) {

        var SCROLL_THRESHOLD = 100;
        var SCROLL_SHRINK_EVENT = 'scrollShrink';
        var SCROLL_GROW_EVENT = 'scrollGrow';
        var SHRINK_CLASS_NAME = 'shrink';

        var link = function (scope, element, attrs) {

            // Wrap the element in an Angular element wrapper
            var el = angular.element(element[0]);

            var shrinkBroadcast = false;
            var growBroadcast = true;

            // If this element is the source, then bind to its scroll event
            if (attrs.source) {
                el.bind('scroll', function () {
                    // If the element passes the scroll threshold and the shrink event hasn't already been broadcast,
                    //  then broadcast and adjust the booleans accordingly
                    if (element[0].scrollTop > SCROLL_THRESHOLD && !shrinkBroadcast) {
                        $rootScope.$broadcast(SCROLL_SHRINK_EVENT);
                        growBroadcast = false;
                        shrinkBroadcast = true;

                    // If the element scrolls under the scroll threshold and the grow event hasn't already been broadcast,
                    //  then broadcast and adjust the booleans accordingly
                    } else if (element[0].scrollTop < SCROLL_THRESHOLD && !growBroadcast) {
                        $rootScope.$broadcast(SCROLL_GROW_EVENT);
                        growBroadcast = true;
                        shrinkBroadcast = false;
                    }
                });
            // If element is the target, bind to the scrollShrink and scrollGrow events using its scope
            } else if (attrs.target) {
                scope.$on(SCROLL_SHRINK_EVENT, function () {
                    el.addClass(SHRINK_CLASS_NAME);
                });
                scope.$on(SCROLL_GROW_EVENT, function () {
                    el.removeClass(SHRINK_CLASS_NAME);
                });
            }
        };

        return {
            restrict : 'A',
            link : link
        };
    }

    angular
        .module('fi.common')
        .directive('fiScrollShrink', FiScrollShrink);
}());

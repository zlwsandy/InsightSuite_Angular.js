(function () {
    'use strict';

    /* @ngInject */
    function FiScrollTo($timeout, $interval) {

        var link = function (scope, element, attrs) {

            var SCROLL_INTERVAL = 10; // interval to call scroll function
            var SCROLL_INCREMENT = 20; // distance to scroll in pixels

            /**
            *   Attach event handler to the element triggering the scroll
            */
            element.bind('click', function (e) {

                e.preventDefault();

                var parentContainer = findElement(attrs.scrollContainer);
                var targetElement = findElement(attrs.scrollTarget);

                if (!parentContainer || !targetElement) {
                    return;
                }

                smoothScroll(parentContainer[0], targetElement[0]);
            });

            /**
            *   Perform scrolling
            */
            var smoothScroll = function (container, target) {

                var startPosition, endPosition, scrollDistance, scrollPosition, direction;

                startPosition = container.scrollTop;
                endPosition = target.offsetTop + 1;
                scrollDistance = endPosition - startPosition;
                // multiplier used to scroll up or down
                direction = scrollDistance > 1 ? 1 : -1;

                // Scroll on an interval until destination is reached.
                var scrollPromise = $interval(function () {

                    scrollPosition = getScrollPosition(container);

                    if (scrollPosition === endPosition || scrollDistance === 0) {
                        $interval.cancel(scrollPromise);
                    } else {
                        if ((scrollDistance * direction) > SCROLL_INCREMENT) {
                            container.scrollTop = container.scrollTop + (SCROLL_INCREMENT * direction);
                            scrollDistance = scrollDistance - (SCROLL_INCREMENT * direction);
                        } else {
                            container.scrollTop = container.scrollTop + (scrollDistance * direction);
                            scrollDistance = 0;
                        }
                    }

                }, SCROLL_INTERVAL);

            };

            var getScrollPosition = function (element) {
                return element.scrollTop;
            };

            /**
            *  Finds an element by class or id.  Only supports unique (single instance on page)
            */
            var findElement = function (selector) {
                var elem;
                if ((selector === null) || selector.length === 0) {
                    return;
                }
                if (typeof selector === 'string') {
                    // removes single quotes
                    selector = selector.replace(/'/g, '');
                    elem = angular.element(document.querySelector(selector));
                }
                if (elem !== null) {
                    return elem;
                } else {
                    throw 'invalid selector provided to scrollTo directive.';
                }
            };

        };

        return {
            restrict : 'A',
            link : link
        };
    }

    angular
        .module('fi.common')
        .directive('fiScrollTo', FiScrollTo);
}());

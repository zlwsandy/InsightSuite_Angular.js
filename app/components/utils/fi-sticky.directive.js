/**
 * @name        FiSticky
 * @restrict    A
 * @module      fi.common
 *
 * @description This will make any element sticky with a specified top offset and specifying the scroll container.
 *
 * @param {float}  fi-sticky-top:       Specifies the top offset
 * @param {string} fi-sticky-container: Specifies the container to bind the scroll event to
 *
 * @usage
 *      <div fi-sticky fi-sticky-top="200" fi-stick-container="ui-wrapper-container"></div>
 */
(function () {
    'use strict';

    /* @ngInject */
    function FiSticky() {

        function FiStickyLink(scope, element, attrs) {
            // get options
            var top = parseFloat(attrs.fiStickyTop),
                container = attrs.fiStickyContainer,

                // get elements
                nativeElement = element[0],
                span = element.find('span'),
                nativeWrapper = span[0],

                // nativeWrapper = document.createElement('span'),
                wrapper = angular.element(nativeWrapper),
                // wrapper = angular.element(nativeElement),

                // cache style
                style = element.attr('style'),

                // init states
                activeTop = false,
                offset = {};

            // activate sticky
            function activate() {
                // get element computed style
                var computedStyle = getComputedStyle(nativeElement),
                    position = 'top: ' + top;

                // style wrapper
                wrapper.attr('style', 'display: ' + computedStyle.display + '; height: ' + nativeElement.offsetHeight + 'px; margin: ' + computedStyle.margin + '; width: ' + nativeElement.offsetWidth + 'px;');

                // style element
                element.attr('style', 'left: ' + offset.left + 'px; margin: 0; position: fixed; transition: none; ' + position + 'px; width: ' + computedStyle.width);
            }

            // deactivate sticky
            function deactivate() {
                // unstyle element
                if (style === undefined) {
                    element.removeAttr('style');
                } else {
                    element.attr('style', style);
                }

                // unstyle wrapper
                wrapper.removeAttr('style');

                activeTop = false;
            }

            // window scroll listener
            function onscroll() {

                if (activeTop) { // if activated
                    // get wrapper offset
                    offset = nativeWrapper.getBoundingClientRect();
                } else {
                    // get element offset
                    offset = nativeElement.getBoundingClientRect();

                    activeTop = !isNaN(top) && offset.top < top;

                    // activate if element is outside range
                    if (activeTop) {
                        activate();
                    }
                }
            }

            // window resize listener
            function onresize() {
                // conditionally deactivate sticky
                if (activeTop) {
                    deactivate();
                }

                // re-initialize sticky
                onscroll();
            }

            var containerElement = angular.element(document.getElementsByClassName(container));

            // bind listeners
            containerElement.bind('scroll', function () {
                onscroll();
            });
            window.addEventListener('resize', onresize);

            // // initialize sticky
            onscroll();
        }

        return {
            restrict: 'A',
            transclude: true,
            template: '<span ng-transclude></span>',
            link: FiStickyLink
        };
    }

    angular
        .module('fi.common')
        .directive('fiSticky', FiSticky);
}());

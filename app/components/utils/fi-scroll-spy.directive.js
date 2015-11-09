/**
 * @name        FiScrollSpy
 * @restrict    A
 * @module      fi.common
 *
 * @description This is will first search for child elements that are anchors and then use the href
 *              string to find the associated section id.
 *
 * @usage
 *      NOTE: the id for the links must have Link attached to the end of it like id="generalLink"
 *            and "general" must be the id on the section id="general"
 *
 *      <div fi-scroll-spy></div>
 */
(function () {
    'use strict';

    /* @ngInject */
    function FiScrollSpy($timeout, _) {

        function FiScrollSpyLink(scope, elem) {
            var menuItems = [],
                linkElements = {},
                spySections = [],
                prevId;

            $timeout(function () {
                // get anchors
                menuItems = elem.find('a');

                // build array and objets for easy access on scroll
                _.map(menuItems, function (menuItem) {
                    linkElements[menuItem.id] = angular.element(menuItem.parentNode);
                    spySections.push(elem[0].querySelector(menuItem.getAttribute('href')));

                });

            });

            // bind scroll listener
            elem.bind('scroll', function () {
                var id,
                    // get scroll top of bound element
                    scrollTop = this.scrollTop,

                    // determine the current section the scroll is in
                    currentId = _.map(spySections, function (section) {
                        if (scrollTop > section.offsetTop) {
                            return section.id;
                        }

                    });

                // remove the undefineds to just have the active section
                currentId = _.remove(currentId, undefined);
                id = currentId[currentId.length - 1];

                // if the section has changed update the menu items
                if (prevId !== id) {

                    if (prevId) {
                        linkElements[prevId + 'Link'].removeClass('active');
                    }

                    if (id) {
                        linkElements[id + 'Link'].addClass('active');
                    } else {
                        linkElements.generalLink.addClass('active');
                    }

                    prevId = id;
                }
            });
        }

        return {
            restrict: 'A',
            link: FiScrollSpyLink
        };
    }

    angular
        .module('fi.common')
        .directive('fiScrollSpy', FiScrollSpy);
}());

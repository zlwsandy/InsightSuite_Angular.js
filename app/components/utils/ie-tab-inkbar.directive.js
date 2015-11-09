/**
 * @name        IeTabInkbar
 * @restrict    EA
 * @module      fi.common
 *
 * @description partially reimplements material design tab directive so it works for IE
 *
 * @usage
 *      <md-tab label="{{'SOME_LABEL' | translate}} ie-tab-inkbar></md-tab>
 */
(function () {
    'use strict';

    /* @ngInject */
    function IeTabInkbar($timeout) {

        var linkFunction = function (scope, element) {
            var el = {},
                parentEl = element[0].parentNode.parentNode;

            var animateInkBar = function (newIndex, oldIndex) {
                if (newIndex < oldIndex) {
                    el.inkBar.setAttribute('class',  'md-left');
                } else {
                    el.inkBar.setAttribute('class', 'md-right');
                }
            };

            var setInkBar = function (label, onload) {

                var oldIndex, newIndex, left, right, tab, totalWidth;

                for (var i = 0; i < el.tabs.length; i++) {
                    if (label === undefined) {

                        totalWidth = el.pagination.offsetWidth;
                        tab        = el.tabs[0];
                        left       = tab.offsetLeft;
                        right      = totalWidth - left - tab.offsetWidth;

                    } else if (label === el.tabs[i].innerText.toUpperCase()) {

                        totalWidth = el.pagination.offsetWidth;
                        tab        = el.tabs[i];
                        left       = tab.offsetLeft;
                        right      = totalWidth - left - tab.offsetWidth;

                        newIndex = i;
                    } else {

                        oldIndex = i;
                    }
                }

                if (!onload) {
                    animateInkBar(newIndex, oldIndex);
                }

                el.inkBar.setAttribute('style', 'left:' + left + 'px; right:' + right + 'px;');
            };

            $timeout(function () {

                el.canvas = parentEl.getElementsByTagName('md-tabs-canvas')[0];
                el.pagination = el.canvas.getElementsByTagName('md-pagination-wrapper')[0];
                el.tabs = el.canvas.getElementsByTagName('md-tab-item');
                el.inkBar  = el.pagination.getElementsByTagName('md-ink-bar')[0];

                setInkBar(undefined, true);
            });


            element.on('click', function (elm) {
                setInkBar(elm.target.getAttribute('label').toUpperCase(), false);
            });
        };


        return {
            restrict: 'EA',
            link: linkFunction
        };
    }

    angular
        .module('fi.common')
        .directive('ieTabInkbar', IeTabInkbar);
}());

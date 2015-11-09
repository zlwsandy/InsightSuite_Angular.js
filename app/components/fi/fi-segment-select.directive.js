/**
 * @name fiSegmentSelect
 * @restrict E
 * @module fi.common
 *
 * @description Displays a select box, with segments as options
 *
 * @param {array=} segments : an array of segments to display as options
 * @param {callback=} change : a callback event to call when the selection changes.  passes the model as an argument.
 *
 * @usage
 *   <fi-segment-select
 *      segments="someController.arrayOfSegments"
 *      change="someController.anEventHandler">
 *   </fi-segment-select>
 */
(function () {
    'use strict';

    /* @ngInject */
    function fiSegmentSelect() {
        var directive = {
            restrict: 'E',
            templateUrl: 'components/fi/fi-segment-select.directive.html',
            scope: {
                segments: '=',
                insight : '=',
                disabled: '=',
                visible: '=',
                currentSegment: '=',
                currentLocale: '=',
                change: '&'
            },
            controller: FiSegmentSelectController,
            controllerAs: 'FiSegmentSelectController',
            bindToController: true
        };

        return directive;
    }



    /* @ngInject */
    function FiSegmentSelectController($scope, _, $state) {

        var vm = this;

        function setSegmentOptions(segments) {

            if (_.isArray(segments)) {
                vm.segmentOptions = segments;

                vm.previousSegment = vm.currentSegment;

            } else {
                vm.segmentOptions = [];
            }
        }

        function init() {


            setSegmentOptions(vm.segments);

            $scope.$watchCollection(function () {
                return vm.segments;
            }, function (newVal, oldVal) {

                if (oldVal !== newVal) {
                    setSegmentOptions(newVal);

                    var matchedOption = _.find(vm.segmentOptions, function (option) {
                        return option.name === vm.currentSegment.name;
                    });

                    if (!matchedOption) {
                        vm.currentSegment = vm.segmentOptions[0];
                    } else {
                        vm.currentSegment = matchedOption;
                    }

                }
            });
        }


        vm.isManageSegmentsSelected = function () {
            if (!vm.currentSegment) {
                return false;
            }
            return vm.currentSegment.gameRunId === 0;
        };

        vm.changeSegment = function () {

            // If manage segments is not selected, then invoke the callback function
            //  passed in via the directive "change" attribute and save off the current segment
            if (!vm.isManageSegmentsSelected()) {

                // invoke the callback function passed in via the directive "change" attribute
                vm.change({'current' : vm.currentSegment});

                vm.previousSegment = vm.currentSegment;

            } else {
                // If manage segments is selected, don't invoke the change callback and set the current segment
                //  back to the previous so that 'Manage Segments' isn't the selected option in the select
                vm.currentSegment = vm.previousSegment;

                $state.go('insightTabNoActionbarWithLocale.manageSegments', {
                    locale : vm.currentLocale.locale,
                    insightId : vm.insight.insightId
                });
            }
        };

        init();
    }

    angular
        .module('fi.common')
        .directive('fiSegmentSelect', fiSegmentSelect);
}());

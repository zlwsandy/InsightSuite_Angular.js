/**
 * @name ManageSegmentsController
 * @module fi.insight
 *
 * @description Controller that backs the Manage Segments page, which includes viewing, creating, and editing segments
 *
 * Regarding segment creation, this controller can handle both flat segment attributes and nested segment attributes.
 * In addition, the only maintenance that needs done to this controller when new segment attributes are added / removed,
 *  is to update the attrs or nestedAttrs objects below.  The entire controller is completely property-name agnostic.
 *
 * Flat Segment attributes are flat arrays of options.  For example:
 *      regions : [
 *          {
 *              region : 'Region ABC'
 *          }
 *      ];
 *
 * Nested Segment attributes are nested arrays of options.  For example:
 *    questions : [
 *      {
 *          question : 'What is your gender?',
 *          answers : [
 *              {
 *                  answerText : 'Male'
 *              }
 *          ]
 *      }
 *    ];
 */
(function () {
    'use strict';


    /* @ngInject */
    function ManageSegmentsController($state, insight, insightSegments, localeService, $translate, announceService,
                                      insightDataService, $scope, $rootScope, isAdmin, _, dialogAlertService,
                                      dialogConfirmService, progressService) {
        var vm = this;
        var NEW_SEGMENT_NAME = $translate.instant('NEW_SEGMENT');
        var PREDICTOR_OPTION = 'predictor';

        // Buttons for the Cancel Dialog Confirm
        var cancelDialogButtons = [
            {
                translateKey : 'DISCARD_AND_EXIT',
                className : 'btn-primary-action'
            },
            {
                translateKey : 'DISCARD',
                className : 'btn-default-action'
            },
            {
                translateKey : 'STAY_ON_PAGE',
                className : 'btn-negative-action'
            }
        ];
        //Buttons for edit segment name cancel
        var cancelEditNameDialogButtons = [
                                   {
                                       translateKey : 'DISCARD_CHANGES',
                                       className : 'btn-default-action'
                                   },
                                   {
                                       translateKey : 'STAY_ON_PAGE',
                                       className : 'btn-negative-action'
                                   }
                               ];
        //Buttons for delete segment
        var deleteSegmentButtons = [
                                    {
                                        translateKey : 'YES',
                                        className : 'btn-primary-action'
                                    },
                                    {
                                        translateKey : 'NO',
                                        className : 'btn-text-action'
                                    }
                                ];

        // Flat segment attributes
        var attrs = {
            TARGET_TYPES : 'targetTypes',
            PERSONAS : 'personas',
            REGIONS : 'regions'
        };

        // Nested segment attributes:  'prop' represents the name of the property
        //  in the segment definition and 'childProp' is the name of the option inside that property that will be
        //  selected/unselected.
        var nestedAttrs = {
            QUESTIONS : {
                prop : 'questions',
                childProp : 'answers'
            }
        };

        // Cache for segment options so that the same options aren't retrieved each time New Segment is invoked
        vm.segmentOptionsCache = null;

        /**
         * Show an alert if validation failed
         *
         * @returns {*|void|Promise}
         */
        function showAlert(messageConstant) {
            return dialogAlertService.show('SAVE', messageConstant);
        }

        /**
         * Selects all segment options.  Function will select all flat attrs as well as nested attrs
         */
        function selectAllOptions() {

            // Loop through the keys of the flat attrs and set the 'selectAll' property to true
            _.forOwn(attrs, function (attr) {

                vm.selectedSegment.segmentOptions[attr].selectAll = true;

                // Call selectAll for this attribute, which will use the value of the 'selectAll' property to
                //  toggle selection
                vm.toggleAttrSelectAll(attr);
            });

            // Loop through the keys of the nested attrs and set the 'selectAll' property to true
            _.forOwn(nestedAttrs, function (nestedAttr) {

                // Call selectAll for this attribute, which will use the value of the 'selectAll' property to
                //  toggle selection
                _.forEach(vm.selectedSegment.segmentOptions[nestedAttr.prop], function (prop, index) {
                    prop.selectAll = true;
                    vm.toggleNestedAttrSelectAll(nestedAttr.prop, nestedAttr.childProp, index);
                });
            });
        }

        /**
         * Constructs the segment options for a New Segment
         *
         * @param options - Options to use for display when creating a new segment
         */
        function setNewSegmentOptions(options) {

            // Add a new segment to the list with a default name and options based on the current locale
            vm.segments.unshift({
                name : NEW_SEGMENT_NAME,
                segmentOptions : options
            });

            // Select the new segment
            vm.selectSegment(0, true);

            // Default Respondent Type to Relevant Responders Only
            vm.selectedSegment.segmentOptions.predictorOrCrowd = PREDICTOR_OPTION;

            selectAllOptions();
        }

        /**
         * Navigate back from whence you came.  If there is a previousState, then go there.  Otherwise, default to
         *  return to the Items List
         */
        function navigateBack() {
            if ($rootScope.previousState.name) {
                $state.go($rootScope.previousState, $rootScope.previousStateParams);
            } else {
                $state.go('insightTabWithLocale.items', {
                    insightId : $state.params.insightId,
                    locale : $state.params.locale
                });
            }
        }
        /**
         * Handling server error
         *
         */
        function handleServerError(error) {
            var segmentName = 'segmentName';

            // Segment name existing is a special case.  If the server responds with this error on save,
            //  then the segment name field must be programmatically set to invalid.  In addition, Material
            //  Design does not show the red error line unless the field gains then loses focus
            if (error === 'ERROR_SEGMENT_NAME_EXISTS') {
                var inputNameField = document.querySelector('input[name="' + segmentName + '"]');
                $scope.segmentForm[segmentName].$setValidity('fi-segment-name-exists', false);

                inputNameField.focus();
                inputNameField.blur();
                inputNameField.focus();
            }
            announceService.error(error);
        }

        /**
         *Check segment name changed or not
         *
         */
        function checkSegmentName() {
            vm.originalName = vm.selectedSegment.name;
            $scope.$watch(function () {
                return vm.selectedSegment;
            }, function (newSegment, oldSegment) {
                if (newSegment !== oldSegment) {
                    vm.originalName = newSegment.name;
                } else {
                    $scope.$watch(function () {
                        return vm.selectedSegment.name;
                    }, function (newData) {
                        if (vm.viewMode === true) {
                            if (newData === vm.originalName) {
                                vm.saveDisabled = true;
                                vm.ableToNavigate = true;
                            } else {
                                vm.saveDisabled = false;
                                vm.ableToNavigate = false;
                            }
                            if (!newData) {
                                vm.saveDisabled = true;
                                vm.ableToNavigate = false;
                            }
                        } else {
                            if (!newData) {
                                vm.saveDisabled = true;
                            } else {
                                vm.saveDisabled = false;
                            }
                        }
                    });
                }
            });
        }

        /**
         * Selects a segment among the list of segments
         *
         * @param index - Index of the segment
         */
        vm.selectSegment = function (index, isNew) {
            // If the segment being selected is the first one or controller is in viewMode, allow the selection
            //  Reason for the index === 0 logic is for creating a new segment, which will add the new segment as the
            //  first segment and protect all others.  This allows the auto-selection of that newly added segment
            if (vm.saveDisabled && vm.ableToNavigate || vm.notAbleToSelect) {
                if (index === 0 || vm.viewMode) {
                    vm.selectedIndex = index;
                    vm.selectedSegment = vm.segments[index];
                    // If the options for this segment are not yet set, then retrieve them and cache on the segment object
                    if (!vm.selectedSegment.segmentOptions && !isNew) {

                        insightDataService.getInsightSegmentDefinition(vm.selectedSegment.gameRunId).then(function (data) {
                            vm.selectedSegment.segmentOptions = data;
                        });
                    }
                }
            }
        };

        /**
         * Listener for the View button on screen.  Navigates to the segments tab
         */
        vm.viewSegment = function () {
            $state.go('insightTabWithLocale.segments', {
                insightId : $state.params.insightId,
                locale : $state.params.locale
            });
        };

        /**
         * Parses segment options during submission of the form.  Function doubles (probably not a good idea) as
         * both validation and transformation of segment information.
         *
         * Since the segment definition can only be submitted if at least one attribute is unselected, this function
         * will build a new segment definition object included only the selected attributes.  If there are none that
         * were unselected, the function will return undefined, which will prevent form submission
         *
         * @returns {*} - Built segment definition if valid.  Error message constant if invalid
         */
        vm.parseSegmentOptions = function () {

            // Create new segment definition object
            var segmentDefinition = {};
            segmentDefinition.gameRunName = vm.selectedSegment.name;
            segmentDefinition.predictorOrCrowd = vm.selectedSegment.segmentOptions.predictorOrCrowd;

            // Tracks how many options were unselected
            var totalUnselected = 0;
            var errorMessage = null;

            // Loop through the flat attributes and get all selected, while at the same time, tracking how many were
            //  unselected.  In each iteration of this loop, 'attr' will equal the key of the flat attribute property
            //  i.e. Regions, Target Types, etc.
            _.forOwn(attrs, function (attr) {
                var unselectedOptions;
                var options = vm.selectedSegment.segmentOptions[attr];

                var selectedOptions = _.filter(options, function (option) {
                    return option.selected;
                });

                // If all options are unselected, return the invalid options message.
                if (options && options.length > 0 && (!selectedOptions || selectedOptions.length === 0)) {
                    errorMessage = 'ERROR_SEGMENT_GROUP_NO_SELECTIONS';
                    return false;
                }

                // Only set this property on the built segment definition if some were selected,
                // .. and they were not all selected.
                if (selectedOptions && selectedOptions.length > 0 && selectedOptions.length < options.length) {
                    segmentDefinition[attr] = selectedOptions;
                }

                // Determine how many were left unselected and track that value
                unselectedOptions = options.length - selectedOptions.length;

                totalUnselected = totalUnselected + unselectedOptions;
            });

            if (angular.isString(errorMessage)) {
                return errorMessage;
            }

            // Loop through the nested attributes and get all selected, while at the same time, tracking how many were
            //  unselected.  In each iteration of this loop, 'attr' will equal the key of the nested attribute property
            //  i.e. Questions.
            _.forOwn(nestedAttrs, function (nestedAttr) {
                var unselectedOptions;
                var nestedAttrPropName = nestedAttr.prop;
                var nestedAttrChildPropName = nestedAttr.childProp;

                // Get the props for the nested attribute property name.  This will equal an array
                // in which each element contains a nested array of options (i.e. an array of Questions where each
                //  Question in the array contains an array of Answers
                var parentOptions = vm.selectedSegment.segmentOptions[nestedAttrPropName];

                // Map over the nested attribute property (i.e. Questions) and generate a new array that contains only
                //  the selected child props for the nested attribute.  i.e. The end result of this map for Questions
                //  will be an array of Questions that contain only selected Answers
                var selectedOptions = _.chain(parentOptions)
                    .map(function (parentOption) {

                        // Clone the parent option so the form on screen isn't affected and we don't mutate the state
                        var clonedParentOption = _.cloneDeep(parentOption);

                        var selectedChildren = _.filter(parentOption[nestedAttrChildPropName], function (childOption) {
                            return childOption.selected;
                        });

                        // If all options are unselected, return the invalid options message.
                        if (!selectedChildren || selectedChildren.length === 0) {
                            return 'ERROR_SEGMENT_GROUP_NO_SELECTIONS';
                        }

                        // Only set this property on the built segment definition if some were selected,
                        // .. and they were not all selected.
                        if (selectedChildren && selectedChildren.length > 0 && selectedChildren.length < parentOption[nestedAttrChildPropName].length) {
                            // Set the child property to an array containing only the selected child properties
                            // In other words, set the Answers property on this Question to an array of selected Answers
                            clonedParentOption[nestedAttrChildPropName] = selectedChildren;
                        } else {
                            clonedParentOption[nestedAttrChildPropName] = [];
                        }

                        // Unselected child options is the total child options for this property minus the total selected
                        unselectedOptions = parentOption[nestedAttrChildPropName].length - selectedChildren.length;

                        totalUnselected = totalUnselected + unselectedOptions;

                        return clonedParentOption;
                    })
                    // The resultant array should only contain those parent options that have at least one selected
                    //  child option
                    .filter(function (parentOption) {
                        if (!angular.isString(parentOption)) {
                            return parentOption[nestedAttrChildPropName].length > 0;
                        }
                        return true;
                    })
                    .value();
                selectedOptions.forEach(function (option) {
                    if (angular.isString(option)) {
                        errorMessage = option;
                        return;
                    }
                });

                // Only set this property on the main segment definition if it has values (i.e. don't set empty arrays)
                // ... i.e. there are questions to filter on.
                if (selectedOptions && selectedOptions.length > 0) {
                    segmentDefinition[nestedAttr.prop] = selectedOptions;
                }
            });

            if (angular.isString(errorMessage)) {
                return errorMessage;
            }

            // If there are no unselected values, return no filter message constant.  Otherwise, return the built segment definition
            return totalUnselected > 0 ? segmentDefinition : 'ERROR_SEGMENT_NO_FILTER_CRITERIA';
        };

        /**
         * Toggles all options in the given list based on the toggle property
         *
         * @param options
         * @param toggle
         * @returns {Array}
         */
        vm.toggleSelected = function (options, toggle) {
            return _.map(options, function (option) {
                option.selected = toggle;
                return option;
            });
        };

        /**
         * Saves changes to a segment
         */
        vm.saveSegment = function () {
            //case for add new segment
            if (!vm.viewMode) {
                var segmentInfo = vm.parseSegmentOptions();
                if (angular.isString(segmentInfo)) {
                    showAlert(segmentInfo);
                } else {
                    insightDataService.createSegment(vm.currentLocale.gameRunId, segmentInfo).then(function (data) {
                        vm.viewMode = true;
                        vm.saveDisabled = true;
                        vm.selectedSegment.gameRunId = data;
                        checkSegmentName();
                        announceService.info('SEGMENT_CREATE_SUCCESS', {
                            gameRunName: vm.selectedSegment.name
                        });
                    }, handleServerError);
                }
            } else {
                insightDataService.editSegmentName(vm.selectedSegment.gameRunId, vm.selectedSegment.name).then(function (data) {
                    vm.viewMode = true;
                    vm.saveDisabled = true;
                    var newSegmentName = data.name;
                    vm.originalName = newSegmentName;
                    $scope.segmentForm.$setPristine();
                    announceService.info('SAVED_CHANGES');
                }, handleServerError);
            }
        };
        /**
         * Called when cancel is clicked.  If the form is dirty, then confirm that this is the desired action
         *
         * If confirmed or the form is not dirty, navigate away from page
         */
        vm.cancel = function () {
            if (!vm.viewMode) {
                if ($scope.segmentForm.$dirty) {

                    dialogConfirmService.show('CANCEL', 'DISCARD_CHANGES_MESSAGE', cancelDialogButtons).then(function (index) {
                        if (index === '0') {            // Discard and Exit
                            navigateBack();
                        } else if (index === '1') {
                            // Discard
                            // Reset the state of the form.
                            vm.segments.shift();
                            vm.newSegment();
                            $scope.segmentForm.$setPristine();
                        }
                    });
                } else {
                    navigateBack();
                }
            } else {
                if ($scope.segmentForm.$dirty) {

                    dialogConfirmService.show('CANCEL', 'DISCARD_CHANGES_MESSAGE', cancelEditNameDialogButtons).then(function (index) {
                        if (index === '0') {
                            // Discard
                            // Reset the state of the form.
                            $scope.segmentForm.$setPristine();
                            vm.selectedSegment.name = vm.originalName;
                        }
                    });
                } else {
                    navigateBack();
                }
            }
        };

        vm.deleteSegment = function () {
            dialogConfirmService.show('DELETE', 'DELETE_SEGMENTS_MESSAGE', deleteSegmentButtons).then(function (index) {
                if (index === '0') {
                    if (vm.segments.length > 1) {
                        insightDataService.deleteSegment(vm.selectedSegment.gameRunId).then(function () {
                            // retrieve segments to refresh segments list in the left pane
                            insightDataService.getInsightSegments(insight.insightId, $state.params.locale).then(function (data) {
                                vm.segments = _.cloneDeep(data);
                                // select the first segment  in the left pane.
                                vm.selectSegment(0);
                            });
                            announceService.info('DELETE_SEGMENT_SUCCESS');
                        }, function (error) {
                            announceService.error(error);
                        });
                    } else {
                        insightDataService.deleteSegment(vm.selectedSegment.gameRunId).then(function () {
                            //go to previous page
                            navigateBack();
                            announceService.info('DELETE_SEGMENT_SUCCESS');
                        }, function (error) {
                            announceService.error(error);
                        });
                    }
                }
            });
        };

        /**
         * Returns whether all options in the given list are selected
         *
         * @param options
         * @returns {boolean}
         */
        vm.areAllOptionsSelected = function (options) {
            return _.every(options, function (option) {
                return option.selected;
            });
        };

        /**
         * Toggles selection for all child elements for a given nested attribute property
         *  i.e.  Toggles selection for all Answers for a given Question
         *
         * @param prop - Name of the nested attribute property (i.e. Question)
         * @param childProp - Name of the nested attribute property's child property (i.e. Answers)
         * @param parentIndex - Index in the segment options array that contains the nested attribute to toggle
         */
        vm.toggleNestedAttrSelectAll = function (attr, childAttr, parentIndex) {

            // Get a specific property (i.e. get a specific Question among the list of Questions
            var nestedAttr = vm.selectedSegment.segmentOptions[attr][parentIndex];

            // Get the child options for this specific property (i.e. all Answers for this specific Question)
            var childOptions = nestedAttr[childAttr];

            // Map over each child and toggle its selection based on the selectAll property of its parent
            //  i.e. if the Question says select all, then select all of this Question's Answers
            childOptions = vm.toggleSelected(childOptions, nestedAttr.selectAll);
        };

        /**
         * Toggles selection for ONE child element for a given nested attribute property
         *  i.e.  Toggles selection for ONE Answer for a given Question
         *
         * @param prop - Name of the nested attribute property (i.e. Question)
         * @param childProp - Name of the nested attribute property's child property (i.e. Answers)
         * @param parentIndex - Index in the segment options array that contains the nested attribute to toggle
         */
        vm.toggleNestedAttrSelect = function (prop, childProp, parentIndex) {

            // Get a specific property (i.e. get a specific Question among the list of Questions
            var options = vm.selectedSegment.segmentOptions[prop][parentIndex];

            // Programmatically set the select all property if all child properties are selected
            //  i.e. if each individual Answer for a given Question is selected, then auto-select the Question's
            //  selectAll property.  This will cause the group selector on screen to select / unselect
            options.selectAll = vm.areAllOptionsSelected(options[childProp]);
        };

        /**
         * Toggles selection for all options of a specific attribute
         *  i.e.  Toggles selection for all Regions
         *
         * @param prop - Name of the attribute property (i.e. Region)
         */
        vm.toggleAttrSelectAll = function (attr) {

            var options = vm.selectedSegment.segmentOptions[attr];

            options = vm.toggleSelected(options, options.selectAll);
        };

        /**
         * Toggles selection for ONE option for a specific attribute
         *  i.e.  Toggles selection for ONE Region
         *
         * @param prop - Name of the attribute property (i.e. Region)
         */
        vm.toggleAttrSelect = function (prop) {

            var options = vm.selectedSegment.segmentOptions[prop];

            // Programmatically set the select all property if all options are selected
            //  i.e. if each individual Region is selected, then auto-select the Region
            //  selectAll property.  This will cause the group selector on screen to select / unselect
            options.selectAll = vm.areAllOptionsSelected(options);
        };

        /**
         * Configures the view to create a new segment
         */
        vm.newSegment = function () {

            // Set view mode to false to allow editing of the new segment
            vm.viewMode = false;
            // If there are no segmentOptions cached, then get the current ones for this locale
            if (!vm.segmentOptionsCache) {

                progressService.show();

                insightDataService.getInsightSegmentOptions(vm.currentLocale.gameRunId).then(function (options) {

                    progressService.hide();

                    options.questions = _.sortBy(options.questions, 'position');
                    options.targetTypes = _.sortBy(options.targetTypes, 'type');
                    options.personas = _.sortBy(options.personas, 'persona');
                    options.regions = _.sortBy(options.regions, 'region');

                    // Save off the options so that they're not retrieved everytime New is clicked
                    vm.segmentOptionsCache = options;

                    // Clone the options and set as the options for the new segment
                    setNewSegmentOptions(_.cloneDeep(vm.segmentOptionsCache));
                });
            } else {

                // Clone the options and set as the options for the new segment
                setNewSegmentOptions(_.cloneDeep(vm.segmentOptionsCache));
            }
        };

        /**
         * Show respondent type selection only if user is an Admin
         *
         * @returns {Boolean}
         */
        vm.showRespondentType = function () {
            return isAdmin;
        };

        /**
         * Initialization
         */
        function init() {

            vm.currentLocale = localeService.findLocale($state.params.locale, insight.gameRunLocaleList);

            // Save off the injected segments
            vm.segments = _.cloneDeep(insightSegments) || [];
            // Only select the first segment if segments exist
            if (vm.segments.length > 0) {
                //set save button disabled
                vm.saveDisabled = true;
                // Set viewMode to true
                vm.viewMode = true;
                // Set able to navigate to other screen
                vm.ableToNavigate = true;
                // Select the first segment
                vm.selectSegment(0);

            } else {
                vm.newSegment();
                vm.notAbleToSelect = true
            }
            if (vm.selectedSegment) {
                checkSegmentName();
            }
        }
        init();
    }

    angular
        .module('fi.insight')
        .controller('ManageSegmentsController', ManageSegmentsController);
}());

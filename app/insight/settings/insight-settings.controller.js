(function () {
    'use strict';

    /* @ngInject */
    function InsightSettingsController($scope, $state, FiConstants, company, insight, isAdmin, announceService,
                                       insightDataService, insightEditCancelDialogService, formatter,
                                       localeService, gameRunStatusValue, departments, $mdDialog, _) {
        var vm = this;
        vm.showProgressLoader = false;
        vm.minConversionRate = 0.01;
        vm.maxConversionRate = 99999.99;
        vm.validationParams = {
            min: formatter.formatCurrency(vm.minConversionRate, company.defaultLocale),
            max: formatter.formatCurrency(vm.maxConversionRate, company.defaultLocale),
            format: formatter.getNumberFormatDisplay(company.defaultLocale)
        };
        vm.enableConfirmExit = true;

        function create() {

            vm.enableConfirmExit = false;

            if (vm.insight.gameType === FiConstants.GAME_TYPE.STYLE_OPT) {
                vm.insight.gameRunLocaleList = [{ locale: 'en_US', conversionRate: 1 }];
            }

            insightDataService
                .createInsight(vm.insight)
                .then(function (insight) {
                    $scope.insightForm.$setPristine();

                    announceService.info('INSIGHT_CREATED');

                    if (insight.gameRunLocaleList[0].locale) {
                        $state.go('insightTabWithLocale.items', { insightId: insight.insightId, locale: insight.gameRunLocaleList[0].locale });
                    } else {
                        $state.go('insightTabNoActionbar.settings', { insightId: insight.insightId });
                    }
                })
                .catch(function (message) {
                    vm.enableConfirmExit = true;
                    announceService.error(message || 'UNABLE_CREATE_INSIGHT');
                });
        }

        function update() {

            // replace empty string with 0 in markdown cadence and clearance
            _.forEach(vm.insight.priceScaling.markDownCadence, function (md, index, array) {
                array[index] = isValue(md) ? 0 : md;
            });
            vm.insight.priceScaling.clearancePercentage = isValue(vm.insight.priceScaling.clearancePercentage) ? 0 : vm.insight.priceScaling.clearancePercentage;

            if (!_.isEqual(vm.original, vm.insight)) {
                vm.showProgressLoader = true;
                return insightDataService
                    .updateInsight(vm.insight)
                    .then(function (insight) {

                        // set default values
                        vm.initializeInsightDefaults(insight);
                        vm.insight = angular.copy(insight);
                        vm.original = angular.copy(insight);

                        $scope.insightForm.$setPristine();

                        // Notify any watchers that the insight was updated
                        $scope.$emit('insightUpdated', insight);

                        announceService.info('SAVED_CHANGES', insight);
                        vm.showProgressLoader = false;
                    })
                    .catch(function (message, data) {
                        announceService.error(message, data);
                        vm.showProgressLoader = false;
                    });
            }
        }

        /**
         * Save insight.
         */
        vm.save = function () {

            if ($state.current.data.state === 'create') {
                create();
            } else {
                update();
            }

        };

        /**
         * Cancels insight only if the 'ignore changes button is click on modal'
         *
         * @param  {object} evt click cancel button event
         */
        vm.cancel = function (evt) {
            if (!angular.equals(vm.original, vm.insight)) {
                insightEditCancelDialogService.show(evt).then(function () {
                    // reset insight to original values
                    vm.insight = angular.copy(vm.original);
                    // check the locales list
                    vm.hasLocales = vm.checkLocales();
                    // reset the department selection
                    vm.initializeDepartment();

                    $scope.insightForm.$setPristine();
                });
            }
        };

        /**
         * Clears the department on the insight
         */
        vm.clearDeptSelection = function () {
            vm.insight.department = null;

            checkFormValidity();
        };

        vm.clearGameTypeSelection = function () {
            vm.insight.gameType = FiConstants.GAME_TYPE.WWTP;

            checkFormValidity();
        };

        function isValue(value) {
            return (value === '') || _.isNull(value) || _.isUndefined(value);
        }

        /**
         * Checks the clearance value to determine its max value when markdown
         * cadences are changed.  It takes the lowest none zero cadence to set
         * to its max.
         *
         * @param  {array} value array of cadence values
         */
        function clearanceCheck(value) {
            var max = _.min(_.filter(value, function (val) {
                return val > 0;
            }));

            vm.clearanceMax = isFinite(max) ? max : 0;
        }


        function formatCadenceData(insight) {

            /**
             * Transforms value from decimal to percentage.
             *
             * @param  {double}  decimalNum number
             * @return {integer}            integer in percentage form
             */
            function makePercentage(decimalNum) {
                return parseInt((decimalNum * 100).toFixed(0), 10);
            }

            // parse markdown cadence into percentages
            _.forEach(insight.priceScaling.markDownCadence, function (mdc, index, array) {
                array[index] = makePercentage(mdc);
            });

            if (!(_.isUndefined(insight.priceScaling) || _.isNull(insight.priceScaling) || _.isUndefined(insight.priceScaling.clearancePercentage) || _.isNull(insight.priceScaling.clearancePercentage))) {
                insight.priceScaling.clearancePercentage = makePercentage(insight.priceScaling.clearancePercentage);
            }

            if (!(_.isUndefined(insight.pricingOption) || _.isNull(insight.pricingOption) || _.isUndefined(insight.pricingOption.minimumSellThroughPercent) || _.isNull(insight.pricingOption.minimumSellThroughPercent))) {
                insight.pricingOption.minimumSellThroughPercent = makePercentage(insight.pricingOption.minimumSellThroughPercent);
            }

            return insight;
        }

        function checkFormValidity() {
            if (_.isEqual(vm.original, vm.insight)) {
                $scope.insightForm.$setPristine();
            } else {
                $scope.insightForm.$setDirty();
            }
        }

        vm.hasChanges = function () {
            return !angular.equals(vm.original, vm.insight);
        };

        vm.initializeLocales = function (locales) {
            _.forEach(locales, function (gr) {
                if (gr.locale) {
                    gr.language = localeService.getLanguage(gr.locale);
                    gr.flagImageUrl = localeService.getFlagImageUrl(gr.locale);
                }
            });
        };

        vm.checkLocales = function () {
            return _.some(vm.insight.gameRunLocaleList, 'locale');
        };

        vm.isStyleOpt = function () {
            //THREE_PREFERRENCE is styleOpt
            return (vm.insight.gameType === 'THREE_PREFERENCE') ? true : false;
        };


        vm.addLocale = function (ev) {
            $mdDialog.show({
                targetEvent: ev,
                controller: 'InsightAddLocaleController',
                controllerAs: 'insightAddLocaleController',
                bindToController: true,
                locals: {
                    insightLocales: _.pluck(vm.insight.gameRunLocaleList, 'locale'),
                    unavailableLocales: vm.insight.unavailableLocaleList
                },
                preserveScope: true,
                templateUrl: 'insight/settings/insight-add-locale.html'
            }).then(function (selectedLocales) {
                if (selectedLocales.length > 0) {
                    _.forEach(selectedLocales, function (locale) {
                        // remove the disabled and select props because its specific for the add local dialog
                        // then push into gameruns
                        vm.insight.gameRunLocaleList.push(_.omit(locale, ['disabled', 'selected']));
                    });
                    // now sort it alphabetically
                    vm.insight.gameRunLocaleList = _.sortBy(vm.insight.gameRunLocaleList, 'locale');
                    vm.hasLocales = true;
                    $scope.insightForm.$setDirty();
                }
            });
        };

        vm.hasDepartments = function () {
            return vm.departments && vm.departments.length > 0;
        };


        var WATCHERS = ['InsightSettingsController.insight.priceScaling.markDownCadence[0]',
                        'InsightSettingsController.insight.priceScaling.markDownCadence[1]',
                        'InsightSettingsController.insight.priceScaling.markDownCadence[2]',
                        'InsightSettingsController.insight.priceScaling.markDownCadence[3]',
                        'InsightSettingsController.insight.priceScaling.markDownCadence[4]'];

        $scope.$watchGroup(WATCHERS, clearanceCheck);

        /*  if the department is not null, set it to the matching object in the departments array.
            md-select is having issues with initializing selected objects https://github.com/angular/material/issues/4118 */
        vm.initializeDepartment = function () {
            vm.insight.department = vm.insight.department ? _.find(vm.departments, 'departmentId', vm.insight.department.departmentId) : null;
        };

        vm.initializeInsightDefaults = function (insight) {
            // set default to WWTP
            insight.gameType = insight.gameType || FiConstants.GAME_TYPE.WWTP;
            insight.gameRunLocaleList = insight.gameRunLocaleList || [];
            insight.name = insight.name || '';
            insight.objective = insight.objective || '';
            insight.pricingOption = insight.pricingOption || {};
            insight.pricingOption.minimumSellThroughPercent = insight.pricingOption.minimumSellThroughPercent || 0;
            insight.priceScaling = insight.priceScaling || {};
            insight.priceScaling.clearancePercentage = angular.isNumber(insight.priceScaling.clearancePercentage) ? insight.priceScaling.clearancePercentage : vm.company.priceScaling.clearancePercentage;
            insight.priceScaling.markDownCadence = insight.priceScaling.markDownCadence || vm.company.priceScaling.markDownCadence;
            insight.department = insight.department ? _.find(vm.departments, 'departmentId', insight.department.departmentId) : null;

            vm.initializeLocales(insight.gameRunLocaleList);
            insight = formatCadenceData(insight);
            return insight;
        };

        function init() {

            // assign the injected data
            vm.gameRunStatusValue = gameRunStatusValue;
            vm.company = company;
            vm.isAdmin = isAdmin;
            vm.departments = departments;
            // check what state the settings page is in
            vm.isCreate = $state.current.data.state === 'create';

            vm.gameTypes = [];
            for (var i in FiConstants.GAME_TYPE) {
                vm.gameTypes.push({ key: i, value: FiConstants.GAME_TYPE[i] });
            }

            // set the price enable to true if it's set on company
            if (vm.company.pricingEnabled && vm.isCreate) {
                insight.pricingEnabled = true;
            }

            // setup default values
            vm.initializeInsightDefaults(insight);
            vm.insight = angular.copy(insight);
            // has to be done on the vm.insight object (thanks MD)
            vm.initializeDepartment();
            vm.original = angular.copy(vm.insight);

            // set the locales flag
            vm.hasLocales = vm.checkLocales();
        }

        init();
    }

    angular
        .module('fi.insight')
        .controller('InsightSettingsController', InsightSettingsController);
}());

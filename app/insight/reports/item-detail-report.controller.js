(function () {

    'use strict';

    /* @ngInject */
    function ItemDetailReportController(insight, insightItem, localeService, insightItemLocales, insightItemSegments,
                                        insightItemTopWords, insightLocaleFactory, $stateParams, $rootScope,
                                        $translate, _) {

        var vm = this;

        function parseItemTopWords() {
            vm.topWords = [];
            vm.positiveWords = [];
            vm.negativeWords = [];

            angular.forEach(vm.insightItemTopWords, function (data) {
                vm.topWords.push(data.word);
                vm.positiveWords.push(data.positiveFrequency);
                vm.negativeWords.push(data.negativeFrequency);
            });
        }

        function findItemLocaleIndex() {
            return _.findIndex(vm.insightItemLocales, function (itemLocale) {
                return itemLocale.gameRunLocale === vm.currentLocale.locale;
            });
        }

        function sortLocales() {
            vm.insightItemLocales = _.sortBy(vm.insightItemLocales, 'locale');

            if (!vm.isAllLocales) {
                var index = findItemLocaleIndex();

                vm.insightItemLocales.splice(0, 0, vm.insightItemLocales.splice(index, 1)[0]);
            }
        }

        function addAllRespondents() {
            var index = findItemLocaleIndex();
            var allRespondents = _.cloneDeep(vm.insightItemLocales[index]);
            allRespondents.gameRunName = $translate.instant('ALL_RESPONDENTS');
            vm.insightItemSegments.segmentGameItems.unshift(allRespondents);
        }

        function determineResultsDisplay() {
            vm.insightItemSegments.segmentGameItems = vm.insightItemSegments.segmentGameItems.map(function (segment) {
                segment.hideResults = (segment.isGenerating || segment.isHidden);
                return segment;
            });
        }

        function findSegment() {
            return _.find(vm.insightItemSegments.segmentGameItems, function (segment) {
                return segment.gameRunId.toString() === $stateParams.segmentId;
            });
        }

        function init() {

            vm.insight = insight;
            vm.item = insightItem;
            vm.insightItemLocales = insightItemLocales;
            vm.insightItemSegments = insightItemSegments;
            vm.insightItemTopWords = insightItemTopWords;

            vm.insightPricingEnabled = vm.insight.pricingEnabled;
            vm.maxGmPricingEnabled = vm.insight.maxGrossMargin;

            vm.locales = insight.gameRunLocaleList;
            vm.companyData = $rootScope.companyData;

            // Combine these
            vm.currentLocale = localeService.findLocale($stateParams.locale);

            vm.insightLocale = insightLocaleFactory.findInsightLocale($stateParams.locale, vm.locales);
            vm.isAllLocales = localeService.isAllLocales(vm.currentLocale);

            if (!vm.companyData.i18nEnabled) {
                vm.showLocaleFlag = false;
                vm.showLocaleCode = false;
            } else {

                if (vm.insightItemLocales && vm.insightItemLocales.length > 1) {
                    sortLocales();
                }

                if (vm.isAllLocales) {
                    vm.showLocaleFlag = false;
                    vm.showLocaleCode = true;
                    vm.localeCode = $translate.instant('ALL_LOCALES');
                } else {
                    vm.showLocaleFlag = true;
                    vm.showLocaleCode = true;
                    vm.localeCode = vm.currentLocale.locale;
                }
            }

            addAllRespondents();

            determineResultsDisplay();

            vm.currentSegment = findSegment();

            // Get comments top words and display it
            parseItemTopWords();
        }

        /**
         * Returns the precision that should be used to display the total value
         */
        vm.getTotalValuePrecision = function () {
            // Show one decimal place if All Locales is selected, 0 otherwise
            return vm.isAllLocales ? 1 : 0;
        };

        /**
         * Returns whether to display the model price in the results list
         *
         * @returns {boolean}
         */
        vm.showModelPrice = function () {
            return !vm.isAllLocales && vm.insightPricingEnabled && !vm.maxGmPricingEnabled;
        };

        /**
         * Returns whether to display the Max Gross Margin Price in the results list
         *
         * @returns {boolean}
         */
        vm.showMaxGmPrice = function () {
            return !vm.isAllLocales && vm.insightPricingEnabled && vm.maxGmPricingEnabled;
        };

        init();
    }

    angular
        .module('fi.insight')
        .controller('ItemDetailReportController', ItemDetailReportController);

}());

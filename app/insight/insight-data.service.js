(function () {
    'use strict';

    /* @ngInject */
    function insightDataService(_, fiService, utilsService, $http, $q, insightTransformer, segmentTransformer,
                                insightItemTransformer, insightItemSegmentTransformer, $window) {

        function formatPriceScaling(insight) {
            function toDecimal(value) {
                return (value) ? value / 100 : value;
            }

            insight = angular.copy(insight);
            insight.priceScaling.markDownCadence = insight.priceScaling.markDownCadence.map(function (num) {
                if (num === 0) {
                    return null;
                } else {
                    return toDecimal(num);
                }
            });

            if (!(_.isUndefined(insight.priceScaling) || _.isNull(insight.priceScaling) || _.isUndefined(insight.priceScaling.clearancePercentage) || _.isNull(insight.priceScaling.clearancePercentage))) {
                insight.priceScaling.clearancePercentage = toDecimal(insight.priceScaling.clearancePercentage);
            }

            if (!(_.isUndefined(insight.pricingOption) || _.isNull(insight.pricingOption) || _.isUndefined(insight.pricingOption.minimumSellThroughPercent) || _.isNull(insight.pricingOption.minimumSellThroughPercent))) {
                insight.pricingOption.minimumSellThroughPercent = toDecimal(insight.pricingOption.minimumSellThroughPercent);
            }

            return insight;
        }

        function createInsight(insight) {

            var insightTransposed = formatPriceScaling(insight);

            return $http
                .post('../api/insight', insightTransposed)
                .then(utilsService.transformHttpPromise);
        }

        function getInsightById(id) {
            return $http
                .get('../api/insight/' + id)
                .then(utilsService.transformHttpPromise);
        }

        function extractParam(obj, name) {
            var result;
            if (obj && obj[name]) {
                result = obj[name];
                delete obj[name];
            }

            return result;
        }

        function getInsights(queryObj) {
            var config;

            var start, limit, sortCol, sortDir;

            start = extractParam(queryObj, 'start');
            limit = extractParam(queryObj, 'limit');
            sortCol = extractParam(queryObj, 'sortCol');
            sortDir = extractParam(queryObj, 'sortDir');

            if (!!queryObj) {
                config = {
                    params: {
                        start: start,
                        limit: limit,
                        sortCol: sortCol,
                        sortDir: sortDir,

                        filter: generateInsightFilterString(queryObj)
                    }
                };
            }

            return $http
                .get('../api/insights/company/' + fiService.companyId(), config)
                .then(utilsService.transformHttpPromise)
                .then(insightTransformer);
        }

        function getInsightSegments(insightId, locale) {
            return $http
                .get('../api/insight/' + insightId + '/' + locale + '/segments')
                .then(utilsService.transformHttpPromise)
                .then(segmentTransformer);
        }

        function getInsightItems(gameRunId) {
            return $http
                .get('../api/gamerun/' + gameRunId + '/items')
                .then(utilsService.transformHttpPromise)
                .then(insightItemTransformer);
        }

        function getInsightItemLocales(insightId, itemId) {
            return $http
                .get('../api/insight/' + insightId + '/item/' + itemId + '/localedetails')
                .then(utilsService.transformHttpPromise)
                .then(insightItemTransformer);
        }

        function getInsightItemResultsSegments(gameItemId) {
            return $http
                .get('../api/gameitem/' + gameItemId + '/segments')
                .then(utilsService.transformHttpPromise)
                .then(insightItemSegmentTransformer);
        }

        function getInsightSegmentOptions(gameRunId) {
            return $http
                .get('../api/gamerun/' + gameRunId + '/segmentOptions')
                .then(utilsService.transformHttpPromise);
        }

        function getInsightSegmentDefinition(gameRunId) {
            return $http
                .get('../api/segment/' + gameRunId + '/segmentDefinition')
                .then(utilsService.transformHttpPromise);
        }

        function createSegment(gameRunId, segmentOptions) {
            return $http
                .post('../api/gamerun/' + gameRunId + '/segment', segmentOptions)
                .then(utilsService.transformHttpPromise);
        }

        function deleteSegment(gameRunId) {
            return $http
                .delete('../api/segment/' + gameRunId)
                .then(utilsService.transformHttpPromise);
        }

        function editSegmentName(gameRunId, segmentName) {
            return $http
                .put('../api/segment/' + gameRunId, {
                    name: segmentName
                })
                .then(utilsService.transformHttpPromise);
        }

        function getInsightItemById(gameRunId, itemId) {
            return $http
                .get('../api/gamerun/' + gameRunId + '/item/' + itemId)
                .then(utilsService.transformHttpPromise)
                .then(insightItemTransformer);
        }

        function getInsightItem(gameItemId) {
            return $http
                .get('../api/gameitem/' + gameItemId)
                .then(utilsService.transformHttpPromise)
                .then(insightItemTransformer);
        }

        function getInsightItemComments(gameItemId) {
            return $http
                .get('../api/gameitem/' + gameItemId + '/comments')
                .then(utilsService.transformHttpPromise);
        }

        function getInsightItemSegments(gameRunId) {
            return $http
                .get('../api/gamerun/' + gameRunId + '/items' + '/segments')
                .then(utilsService.transformHttpPromise)
                .then(insightItemSegmentTransformer);
        }

        function getInsightItemTopWords(gameItemId) {
            return $http
                .get('../api/gameitem/' + gameItemId + '/topwordcounts')
                .then(utilsService.transformHttpPromise);
        }

        function removeInsightItem(gameRunLocale, item) {
            return $http
                .put('../api/gamerun/' + gameRunLocale.gameRunId + '/items/remove', [item])
                .then(utilsService.transformHttpPromise, utilsService.transformHttpPromise);

        }

        function moveToPreview(gameRunId, ignoreRefItemsCheck) {
            ignoreRefItemsCheck = (ignoreRefItemsCheck === true) ? true : false;

            return $http
                .put('../api/gamerun/' + gameRunId + '/status/pending?ignoreMinAmountReferenceItemsRequired=' + ignoreRefItemsCheck)
                .then(utilsService.transformHttpPromise, utilsService.transformHttpPromise);
        }

        function getInsightItemsForAllLocales(insightId) {
            return $http
                .get('../api/insight/' + insightId + '/items')
                .then(utilsService.transformHttpPromise)
                .then(insightItemTransformer);
        }

        function updateInsightItem(insight, insightItem, gameRunLocale) {
            var insightId, itemId;

            if ([insight, insightItem, gameRunLocale].some(angular.isUndefined)) {
                return $q.reject();
            }

            if ([insight.insightId, insightItem.itemId].some(_.negate(angular.isNumber))) {
                return $q.reject();
            }

            insightId = insight.insightId;
            itemId = insightItem.itemId;

            return $http
                .put('../api/insight/' + insightId + '/' + gameRunLocale + '/item/' + itemId, insightItem)
                .then(utilsService.transformHttpPromise);
        }

        function clearInsightItemTicketPrice(gameItemId) {
            return $http
            .put('../api/gameitem/' + gameItemId + '/ticketprice', {
                ticketPrice : null
            })
            .then(utilsService.transformHttpPromise);
        }

        function updateInsightItemTicketPrice(gameItemId, ticketPrice) {

            if ([gameItemId, ticketPrice].some(angular.isUndefined)) {
                return $q.reject();
            }

            if ([gameItemId, ticketPrice].some(_.negate(angular.isNumber))) {
                return $q.reject();
            }

            return $http
                .put('../api/gameitem/' + gameItemId + '/ticketprice', {
                    ticketPrice : ticketPrice
                })
                .then(utilsService.transformHttpPromise);
        }

        function updateInsight(insight) {

            var insightTransposed = formatPriceScaling(insight);

            return $http
                .put('../api/insight/' + insightTransposed.insightId, insightTransposed)
                .then(utilsService.transformHttpPromise);
        }

        function getEligibleAddItems(gameRunId) {
            return $http
                .get('/api/gamerun/' + gameRunId + '/possibleItems')
                .then(utilsService.transformHttpPromise)
                .then(insightItemTransformer);
        }

        function toggleComment(playerCommentId, hideShow) {
            return $http
            .put('/api/playercomment/' + playerCommentId + '/' + hideShow)
            .then(utilsService.transformHttpPromise);
        }

        function hideLocale(gameRunId) {
            return $http
            .put('/api/gamerun/' + gameRunId + '/status/hidden')
            .then(utilsService.transformHttpPromise);
        }

        function showLocale(gameRunId) {
            return $http
            .put('/api/gamerun/' + gameRunId + '/status/complete')
            .then(utilsService.transformHttpPromise);
        }

        function rerunAnalytics(gameRunId) {
            return $http
            .put('/api/gamerun/' + gameRunId + '/rerun');
        }

        //This is opened using window.open which will cause the page to quickly flash in order to start the download automatically.
        //Grabbing the file asynchronously won't cause the browser to force the download and another solution which dynamically created a
        //anchor tag to downloaded it cause a popup blocker message which is not ideal so this solution will be used for now.
        function exportFlexPLMItems(gameRunId) {
            $window.open('/api/gamerun/' + gameRunId + '/itemexport/ptc-flexplm/');
        }

        function downloadComments(gameRunId) {
            $window.open('/api/gamerun/' + gameRunId + '/comments/export');
        }

        return {
            createInsight: createInsight,
            getInsights: getInsights,
            getInsightById: getInsightById,
            getInsightItems: getInsightItems,
            moveToPreview: moveToPreview,
            getInsightItemsForAllLocales: getInsightItemsForAllLocales,
            getInsightItemById: getInsightItemById,
            getInsightItem: getInsightItem,
            getInsightItemComments: getInsightItemComments,
            removeInsightItem: removeInsightItem,
            getInsightSegments: getInsightSegments,
            updateInsightItem: updateInsightItem,
            updateInsightItemTicketPrice: updateInsightItemTicketPrice,
            updateInsight: updateInsight,
            getInsightItemSegments: getInsightItemSegments,
            getEligibleAddItems: getEligibleAddItems,
            clearInsightItemTicketPrice: clearInsightItemTicketPrice,
            getInsightItemLocales: getInsightItemLocales,
            toggleComment: toggleComment,
            getInsightItemResultsSegments: getInsightItemResultsSegments,
            getInsightItemTopWords: getInsightItemTopWords,
            getInsightSegmentOptions: getInsightSegmentOptions,
            getInsightSegmentDefinition: getInsightSegmentDefinition,
            createSegment : createSegment,
            hideLocale: hideLocale,
            showLocale: showLocale,
            rerunAnalytics: rerunAnalytics,
            exportFlexPLMItems: exportFlexPLMItems,
            downloadComments: downloadComments,
            deleteSegment: deleteSegment,
            editSegmentName: editSegmentName
        };
    }

    function escapeSpecialCharacters(str) {
        var specialChars = [
            {
                re: new RegExp(/\\/g),
                by: '\\\\'
            },
            {
                re: new RegExp(/\|/g),
                by: '\\|'
            },
            {
                re: new RegExp(/:/g),
                by: '\\:'
            }
        ];

        for (var i = 0; i < specialChars.length; i++) {
            str = str.replace(specialChars[i].re, specialChars[i].by);
        }
        return str;
    }

    function generateInsightFilterString(options) {
        if (!options) {
            return;
        }

        var filterString = '';

        angular.forEach(options, function (value, key) {
            if (angular.isDefined(value) && value !== -1) {
                if (key === 'nameLike') {
                    value = escapeSpecialCharacters(value);
                }
                filterString += key + '::' + value + '|';
            }
        });
        return filterString.slice(0, -1); // Removes the last pipe
    }

    angular
        .module('fi.insight')
        .factory('insightDataService', insightDataService);
}());

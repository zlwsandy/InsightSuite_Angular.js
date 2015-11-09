(function () {
    'use strict';

    /* @gnInject */
    function companyIdFromCookie($cookies, $q) {
        var cookie = $cookies.cid;
        return cookie <= 0 || angular.isUndefined(cookie) ? $q.reject('cookie') : $q.when(cookie);
    }

    /* @gnInject */
    function noInsightOnEnter($state, insight) {
        if (!insight) {
            $state.$current.locals = {};
            $state.go('insightsListTab.results', {
                reload : true
            });
        }
    }

    /* @ngInject */
    function routes($stateProvider, $urlRouterProvider) {

        /* @ngInject */
        var verifyCompanyData = function ($q, $rootScope, companyId, companyService) {
            // Note companyId is another resolve in this state.  It is injected so that this
            //  resolve is a dependency of that resolve
            return $q(function (resolve) {
                // If companyData is in rootScope already, then resolve the promise and let the routes continue
                // This is the scenario when logging in for the first time because the company data will be in rootScope
                //  courtesy of loginAdminCompany
                if ($rootScope.companyData) {
                    resolve(true);
                } else {
                    // If the company is not yet in rootScope, yet the app is attempting to go this state, someone is
                    //  navigating to the site directly (or refreshing the page).  So, attempt to get the company
                    //  information and when retrieved, resolve the route
                    //  Note that the app will only make it this far if there is a companyId cookie present
                    companyService.getCompany(companyId).then(function (data) {
                        $rootScope.companyData = data;
                        resolve(true);
                    });
                }
            });
        };

        // Redirect unmatched urls to /insightsListTab.results
        $urlRouterProvider.otherwise('insightsListTab.results');

        $stateProvider
            .state('root', {
                abstract: true,
                resolve: {
                    // only allow routes to be viewed if company cookie is set
                    companyId: companyIdFromCookie,
                    // Verify that the company data was retrieved (this is dependent on companyId)
                    companyData: verifyCompanyData,
                    localeService: 'localeService',
                    locales: function (localeService) {
                        return localeService.isInitialized();
                    },
                    /* @ngInject */
                    company: function (companyService, fiService) {
                        return companyService.getCompany(fiService.companyId(), false);
                    }
                },
                views: {
                    root: {
                        templateUrl: 'components/main/main-template.html'
                    }
                }
            })
            .state('print', {
                abstract: true,
                resolve: {
                    // only allow routes to be viewed if company cookie is set
                    companyId: companyIdFromCookie,
                    // Verify that the company data was retrieved (this is dependent on companyId)
                    companyData: verifyCompanyData,
                    localeService: 'localeService',
                    locales: function (localeService) {
                        return localeService.isInitialized();
                    }
                },
                views: {
                    print: {
                        templateUrl: 'components/main/print-template.html'
                    }
                }
            })
            .state('print.itemSummaryReport', {
                url: '/insight/:insightId/:locale/:segmentId/itemSummaryReport?sortby',
                views: {
                    main: {
                        templateUrl: './insight/reports/item-summary-report.html',
                        controller: 'ItemSummaryReportController as itemSummaryReportController'
                    }
                },
                resolve : {
                    insight : function (insightDataService, $stateParams) {
                        return insightDataService.getInsightById($stateParams.insightId);
                    }
                }
            })
            .state('print.itemDetailReport', {
                url: '/insight/:insightId/:locale/:segmentId/itemDetailReport/:gameItemId',
                views: {
                    main: {
                        templateUrl: './insight/reports/item-detail-report.html',
                        controller: 'ItemDetailReportController as itemDetailReportController'
                    }
                },
                resolve : {
                    insight : function (insightDataService, $stateParams) {
                        return insightDataService.getInsightById($stateParams.insightId);
                    },
                    insightItem : function (insightDataService, $stateParams) {
                        // Retrieve the Insight Item for injection
                        return insightDataService.getInsightItem($stateParams.gameItemId);
                    },
                    insightItemLocales : function (insightDataService, insight, insightItem) {
                        return insightDataService.getInsightItemLocales(insight.insightId, insightItem.itemId);
                    },
                    insightItemSegments : function (insightDataService, insightItem) {
                        // If parentGameItemId exists, that indicates this is a child item (specific segment chosen)
                        //  but the segments on itemDetail should be all segments for this item, so the
                        //  parentGameItemId is required to retrieve that list.  If the parentGameItemId is null, then
                        //  the current item IS the parent, so use its gameItemId
                        var gameItemId = insightItem.parentGameItemId || insightItem.gameItemId;

                        return insightDataService.getInsightItemResultsSegments(gameItemId);
                    },
                    insightItemTopWords : function (insightDataService, $stateParams) {
                        return insightDataService.getInsightItemTopWords($stateParams.gameItemId);
                    }
                }
            })
            .state('loginAdminCompany', {
                url: '/loginAdminCompany',
                views: {
                    root: {
                        templateUrl: './login/login-admin-company.html',
                        controller: 'LoginAdminCompanyController as loginAdminCompanyController'
                    }
                }
            })
            .state('403', {
                url: '/403',
                parent: 'root',
                resolve: {
                    companyId: companyIdFromCookie,
                    menuConfig: function () {
                        return {
                            name: '403'
                        };
                    },
                    serverTime: function (fiService) {
                        return fiService.serverTime();
                    }
                },
                views: {
                    main: {
                        templateUrl: './error/403.html',
                        controller: 'ForbiddenAccessController as forbiddenAccessController'
                    },
                    menu: {
                        templateUrl: './components/menu/menu.html',
                        controller: 'MenuController as menuController'
                    }
                }
            })
            .state('admin', {
                abstract: true,
                parent: 'root',
                resolve: {
                    menuConfig: function () {
                        return {
                            name: '403'
                        };
                    },
                    /* @ngInject */
                    isAdmin : function (_, fiService, $q) {
                        return fiService
                            .isAdmin()
                            .then(_.wrap(true))
                            .catch(_.wrap($q.reject('not admin')));
                    }
                },
                views: {
                    main: {
                        template: '<div ui-view="main" class="main-content" flex layout="column"></div>'
                    },
                    menu: {
                        template: '<div ui-view="menu"></div>'
                    }
                }
            })
            .state('admin.waves', {
                abstract: true,
                resolve: {
                    menuConfig: function () {
                        return {
                            name: 'INSIGHT_WAVES'
                        };
                    }
                },
                views: {
                    main: {
                        templateUrl: './wave/wave.html'
                    },
                    menu: {
                        templateUrl: './components/menu/menu.html',
                        controller: 'MenuController as menuController'
                    }
                }
            })
            .state('admin.waves.list', {
                url: '/waves',
                views: {
                    toolbar: {
                        templateUrl: './wave/wave-toolbar.html',
                        controller: 'WaveToolbarController as waveToolbarController'
                    },
                    waves: {
                        templateUrl: './wave/wave-list.html',
                        controller: 'WaveController as waveController'
                    }
                }
            })
            .state('insightTab', {
                abstract: true,
                parent: 'root',
                url: '/insight/:insightId',
                resolve: {
                    menuConfig: function () {
                        return {
                            name: 'SETUP_INSIGHT'
                        };
                    },
                    isAdmin : function (_, fiService) {
                        return fiService
                            .isAdmin()
                            .then(_.wrap(true))
                            .catch(_.wrap(false));
                    },
                    isSysAdmin : function (_, fiService) {
                        return fiService
                            .isSysAdmin()
                            .then(_.wrap(true))
                            .catch(_.wrap(false));
                    },
                    insight : function (insightDataService, $stateParams) {
                        return $stateParams.insightId !== '' ? insightDataService.getInsightById($stateParams.insightId) : {};
                    }
                },
                views: {
                    main: {
                        templateUrl: './insight/insight-tab.html',
                        controller: 'InsightTabController as insightTabController'
                    },
                    menu: {
                        templateUrl: './components/menu/menu.html',
                        controller: 'MenuController as menuController'
                    }
                }
            })
            // Same as insightTab except there is no grey action bar.  Child views provide their own when using
            //  this state
            .state('insightTabNoActionbar', {
                abstract: true,
                parent: 'root',
                url: '/insight/:insightId',
                resolve: {
                    menuConfig: function () {
                        return {
                            name: 'SETUP_INSIGHT'
                        };
                    },
                    isAdmin : function (_, fiService) {
                        return fiService
                            .isAdmin()
                            .then(_.wrap(true))
                            .catch(_.wrap(false));
                    },
                    isSysAdmin : function (_, fiService) {
                        return fiService
                            .isSysAdmin()
                            .then(_.wrap(true))
                            .catch(_.wrap(false));
                    },
                    insight : function (insightDataService, $stateParams) {
                        return $stateParams.insightId !== '0' ? insightDataService.getInsightById($stateParams.insightId) : {};
                    }
                },
                onEnter: noInsightOnEnter,
                views: {
                    main: {
                        templateUrl: './insight/insight-tab-noactionbar.html',
                        controller: 'InsightTabController as insightTabController'
                    },
                    menu: {
                        templateUrl: './components/menu/menu.html',
                        controller: 'MenuController as menuController'
                    }
                }
            })
            .state('insightTabWithLocale', {
                abstract: true,
                parent: 'root',
                url: '/insight/:insightId/:locale',
                resolve: {
                    menuConfig: function () {
                        return {
                            name: 'SETUP_INSIGHT'
                        };
                    },
                    isAdmin : function (_, fiService) {
                        return fiService
                            .isAdmin()
                            .then(_.wrap(true))
                            .catch(_.wrap(false));
                    },
                    isSysAdmin : function (_, fiService) {
                        return fiService
                            .isSysAdmin()
                            .then(_.wrap(true))
                            .catch(_.wrap(false));
                    },
                    insight : function (insightDataService, $stateParams) {
                        return insightDataService.getInsightById($stateParams.insightId);
                    }
                },
                onEnter: noInsightOnEnter,
                views: {
                    main: {
                        templateUrl: './insight/insight-tab.html',
                        controller: 'InsightTabController as insightTabController'
                    },
                    menu: {
                        templateUrl: './components/menu/menu.html',
                        controller: 'MenuController as menuController'
                    }
                }
            })
            // Same as insightTab except there is no grey action bar.  Child views provide their own when using
            //  this state
            .state('insightTabNoActionbarWithLocale', {
                abstract: true,
                parent: 'root',
                url: '/insight/:insightId/:locale',
                resolve: {
                    menuConfig: function () {
                        return {
                            name: 'SETUP_INSIGHT'
                        };
                    },
                    isAdmin : function (_, fiService) {
                        return fiService
                            .isAdmin()
                            .then(_.wrap(true))
                            .catch(_.wrap(false));
                    },
                    isSysAdmin : function (_, fiService) {
                        return fiService
                            .isSysAdmin()
                            .then(_.wrap(true))
                            .catch(_.wrap(false));
                    },
                    insight : function (insightDataService, $stateParams) {
                        return insightDataService.getInsightById($stateParams.insightId);
                    }
                },
                onEnter: noInsightOnEnter,
                views: {
                    main: {
                        templateUrl: './insight/insight-tab-noactionbar.html',
                        controller: 'InsightTabController as insightTabController'
                    },
                    menu: {
                        templateUrl: './components/menu/menu.html',
                        controller: 'MenuController as menuController'
                    }
                }
            })
            .state('insightTabWithLocale.items', {
                url: '/items',
                views: {
                    insightTabView: {
                        templateUrl: './insight/items/insight-items.html',
                        controller: 'InsightItemsController as insightItemsController'
                    }
                },
                resolve: {
                    menuConfig: function () {
                        return {
                            name: 'SETUP_INSIGHT_ITEMS'
                        };
                    },
                    isAdmin : function (_, fiService) {
                        return fiService
                            .isAdmin()
                            .then(_.wrap(true))
                            .catch(_.wrap(false));
                    }
                },
                data: {
                    insightTab: 'items'
                }
            })
            .state('insightTabWithLocale.itemEdit', {
                url: '/items/:gameRunId/edit/:itemId',
                views: {
                    insightTabView: {
                        templateUrl: './insight/items/insight-setup-item-detail.html',
                        controller: 'InsightSetupItemDetailController as insightSetupItemDetailController'
                    }
                },
                resolve: {
                    insightItem : function (insightDataService, $stateParams) {
                        // Retrieve the Insight Item for injection
                        return insightDataService.getInsightItemById($stateParams.gameRunId, $stateParams.itemId);
                    }
                },
                data: {
                    insightTab: 'items',
                    disableActions: true
                }
            })
            .state('insightTabNoActionbarWithLocale.itemDetail', {
                url: '/items/:gameItemId',
                views: {
                    insightTabView: {
                        templateUrl: './insight/items/insight-results-item-detail.html',
                        controller: 'InsightResultsItemDetailController as insightResultsItemDetailController'
                    }
                },
                resolve: {
                    insightItem : function (insightDataService, $stateParams) {
                        // Retrieve the Insight Item for injection
                        return insightDataService.getInsightItem($stateParams.gameItemId);
                    },
                    insightItemLocales : function (insightDataService, insight, insightItem) {
                        return insightDataService.getInsightItemLocales(insight.insightId, insightItem.itemId);
                    },
                    insightItemSegments : function (insightDataService, insightItem) {
                        // If parentGameItemId exists, that indicates this is a child item (specific segment chosen)
                        //  but the segments on itemDetail should be all segments for this item, so the
                        //  parentGameItemId is required to retrieve that list.  If the parentGameItemId is null, then
                        //  the current item IS the parent, so use its gameItemId
                        var gameItemId = insightItem.parentGameItemId || insightItem.gameItemId;

                        return insightDataService.getInsightItemResultsSegments(gameItemId);
                    },
                    insightItemTopWords : function (insightDataService, insightItem) {
                        return insightDataService.getInsightItemTopWords(insightItem.gameItemId);
                    },
                    insightItemComments : function (insightDataService, insightItem) {
                        return insightDataService.getInsightItemComments(insightItem.gameItemId);
                    }
                },
                data: {
                    insightTab: 'items'
                }
            })
            .state('insightTabNoActionbarWithLocale.manageSegments', {
                url: '/manageSegments/',
                views: {
                    insightTabView: {
                        templateUrl: './insight/items/results/manage-segments.html',
                        controller: 'ManageSegmentsController as manageSegmentsController'
                    }
                },
                resolve : {
                    insightSegments : function ($stateParams, insightDataService) {
                        return insightDataService.getInsightSegments($stateParams.insightId, $stateParams.locale);
                    }
                },
                data: {
                    insightTab: 'items'
                }
            })
            .state('insightTabNoActionbar.newInsight', {
                url: '/newInsight',
                views: {
                    insightTabView: {
                        templateUrl: 'insight/settings/insight-settings.html',
                        controller: 'InsightSettingsController as InsightSettingsController'
                    }
                },
                resolve: {
                    menuConfig: function () {
                        return {
                            name: 'NEW_INSIGHT'
                        };
                    },
                    /* @ngInject */
                    company: function (companyService, fiService) {
                        return companyService.getCompany(fiService.companyId(), false);
                    },

                    departments: function (departmentService) {
                        return departmentService.getDepartments();
                    }
                },
                data: {
                    insightTab: 'settings',
                    state: 'create'
                }
            })
            .state('insightTabNoActionbar.settings', {
                url: '/settings',
                views: {
                    insightTabView: {
                        templateUrl: 'insight/settings/insight-settings.html',
                        controller: 'InsightSettingsController as InsightSettingsController'
                    }
                },
                resolve: {
                    menuConfig: function () {
                        return {
                            name: 'SETUP_INSIGHT_SETTINGS'
                        };
                    },
                    /* @ngInject */
                    company: function (companyService, fiService) {
                        return companyService.getCompany(fiService.companyId(), false);
                    },

                    departments: function (departmentService) {
                        return departmentService.getDepartments();
                    }

                },
                data: {
                    insightTab: 'settings',
                    state: 'edit'
                }
            })
            .state('insightTabWithLocale.segments', {
                url: '/segments',
                views: {
                    insightTabView: {
                        templateUrl: './insight/segments/insight-segments.html',
                        controller: 'InsightsSegmentsController as InsightsSegmentsController'
                    }
                },
                resolve: {
                    menuConfig: function () {
                        return {
                            name: 'SETUP_INSIGHT_SEGMENTS'
                        };
                    },
                    insight : function (insightDataService, $stateParams) {
                        return insightDataService.getInsightById($stateParams.insightId);
                    },
                    isAdmin : function (_, fiService) {
                        return fiService
                            .isAdmin()
                            .then(_.wrap(true))
                            .catch(_.wrap(false));
                    }
                },
                data: {
                    insightTab: 'segments'
                }
            })
            .state('insightTab.survey', {
                url: '/survey',
                views: {
                    insightTabView: {
                        templateUrl: './insight/survey/insight-survey.html'
                    }
                },
                resolve: {
                    menuConfig: function () {
                        return {
                            name: 'SETUP_INSIGHT_SURVEY'
                        };
                    },
                    insight : function (insightDataService, $stateParams) {
                        return insightDataService.getInsightById($stateParams.insightId);
                    },
                    isAdmin : function (_, fiService) {
                        return fiService
                            .isAdmin()
                            .then(_.wrap(true))
                            .catch(_.wrap(false));
                    }
                },
                data: {
                    insightTab: 'survey'
                }
            })
            .state('insightTab.games', {
                url: '/games',
                views: {
                    insightTabView: {
                        templateUrl: './insight/games/insight-games.html'
                    }
                },
                resolve: {
                    menuConfig: function () {
                        return {
                            name: 'SETUP_INSIGHT_GAMES'
                        };
                    }
                },
                data: {
                    insightTab: 'games'
                }
            })
            .state('insightsListTab', {
                abstract: true,
                parent: 'root',
                url: '/insightslist',
                resolve: {
                    menuConfig: function () {
                        return {
                            name: 'INSIGHTS'
                        };
                    },
                    /* @ngInject */
                    company: function (companyService, fiService) {
                        return companyService.getCompany(fiService.companyId(), false);
                    },
                    locales: function (companyService) {
                        return companyService.getLocaleList();
                    },
                    isAdmin: function (_, fiService) {
                        return fiService
                            .isAdmin()
                            .then(_.wrap(true))
                            .catch(_.wrap(false));
                    },
                    localeSelection: function () {
                        return {
                            locale: undefined
                        };
                    }
                },
                views: {
                    main: {
                        templateUrl: './insight/list/insights-list-tab.html',
                        controller: 'InsightsListTabController as insightsListTabController'
                    },
                    menu: {
                        templateUrl: './components/menu/menu.html',
                        controller: 'MenuController as menuController'
                    }
                }
            })
            .state('insightsListTab.results', {
                url: '/results',
                views: {
                    insightsListTabView: {
                        templateUrl: 'insight/list/insights-list.html',
                        controller: 'InsightsListController as insightsListController'
                    }
                },
                resolve: {
                    /* @ngInject */
                    insights: function (insightListService, localeSelection) {
                        return insightListService.fetchNewList('SUMMARY_RESULTS', localeSelection.locale);
                    }
                },
                data: {
                    insightsListTab: 'results',
                    status: 'SUMMARY_RESULTS'
                }
            })
            .state('insightsListTab.inProgress', {
                url: '/progress',
                views: {
                    insightsListTabView: {
                        templateUrl: 'insight/list/insights-list.html',
                        controller: 'InsightsListController as insightsListController'
                    }
                },
                resolve: {
                    /* @ngInject */
                    insights: function (insightListService, localeSelection) {
                        return insightListService.fetchNewList('SUMMARY_PROGRESS', localeSelection.locale);
                    }
                },
                data: {
                    insightsListTab: 'progress',
                    status: 'SUMMARY_PROGRESS'
                }
            })
            .state('insightsListTab.inPreview', {
                url: '/preview',
                views: {
                    insightsListTabView: {
                        templateUrl: 'insight/list/insights-list.html',
                        controller: 'InsightsListController as insightsListController'
                    }
                },
                resolve: {
                    /* @ngInject */
                    insights: function (insightListService, localeSelection) {
                        return insightListService.fetchNewList('SUMMARY_PREVIEW', localeSelection.locale);
                    }
                },
                data: {
                    insightsListTab: 'preview',
                    status: 'SUMMARY_PREVIEW'
                }
            })
            .state('insightsListTab.inSetup', {
                url: '/setup',
                views: {
                    insightsListTabView: {
                        templateUrl: 'insight/list/insights-list.html',
                        controller: 'InsightsListController as insightsListController'
                    }
                },
                resolve: {
                    /* @ngInject */
                    insights: function (insightListService, localeSelection) {
                        return insightListService.fetchNewList('SUMMARY_SETUP', localeSelection.locale);
                    }
                },
                data: {
                    insightsListTab: 'setup',
                    status: 'SUMMARY_SETUP'
                }
            });
    }

    angular
        .module('fi')
        .config(routes);
}());

'use strict';
//test
module.exports = function (config) {
    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: './',


        // frameworks to use
        frameworks: ['jasmine', 'sinon'],


        // list of files / patterns to load in the browser
        files: [
            {pattern: 'app/**/*.png', watched: false, included: false, served: true},
            'bower_components/angular/angular.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/lodash/lodash.js',
            'bower_components/angular-aria/angular-aria.js',
            'bower_components/angular-animate/angular-animate.js',
            'bower_components/angular-material/angular-material.js',
            'bower_components/angular-translate/angular-translate.js',
            'bower_components/angular-sanitize/angular-sanitize.js',
            'bower_components/angular-ui-router/release/angular-ui-router.js',
            'bower_components/ngInfiniteScroll/build/ng-infinite-scroll.min.js',
            'bower_components/angular-cookies/angular-cookies.js',
            'bower_components/zeroclipboard/dist/ZeroClipboard.js',
            'bower_components/ng-clip/src/ngClip.js',
            'bower_components/angular-messages/angular-messages.js',
            'bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.js',
            'bower_components/angular-translate-storage-local/angular-translate-storage-local.js',
            'bower_components/messageformat/messageformat.js',
            'bower_components/angular-translate-interpolation-messageformat/angular-translate-interpolation-messageformat.js',
            'bower_components/lodash/lodash.js',
            'bower_components/ng-flow/dist/ng-flow.js',
            'bower_components/highcharts-release/adapters/standalone-framework.js',
            'bower_components/highcharts-release/highcharts.js',
            'bower_components/highcharts-release/highcharts-more.js',
            'bower_components/highcharts-release/modules/exporting.js',
            'bower_components/highcharts-ng/dist/highcharts-ng.js',
            'bower_components/fi-img-crop/dist/fi-img-crop.directive.js',

            'app/*.js',
            'app/**/*.value.js',
            'app/**/*.factory.js',
            'app/**/*.service.js',
            'app/**/*.directive.js',
            'app/**/*.controller.js',
            'app/**/*.filter.js',
            'app/**/*.value.js',
            'app/**/*.constants.js',
            'app/**/*.html',

            'test/testUtils.js',
            'app/stubs/*.json',
            'app/**/*.spec.js'
        ],

        // needed to suppress warns about images being unavailable
        proxies :  {
            '/app': '/app'
        },

        // list of files to exclude
        exclude: [
            'app/routes.js',
            'app/index.html'
        ],


        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['progress', 'coverage'],

        preprocessors: {
            'app/**/*.value.js': ['coverage'],
            'app/**/*.factory.js': ['coverage'],
            'app/**/*.service.js': ['coverage'],
            'app/**/*.directive.js': ['coverage'],
            'app/**/*Path.js': ['coverage'],
            'app/**/*.controller.js': ['coverage'],
            'app/**/*.html': ['ng-html2js'],
            'app/stubs/*.json': ['ng-json2js']
        },

        ngHtml2JsPreprocessor: {
            stripPrefix: 'app/'
        },

        ngJson2JsPreprocessor: {
            stripPrefix: 'app/stubs/',
            prependPrefix: 'mock/'
        },

        // optionally, configure the reporter
        coverageReporter: {
            // specify a common output directory
            dir: 'build/reports/coverage',
            reporters: [{
                // reporters not supporting the `file` property
                type: 'html',
                subdir: 'report-html'
            }, {
                type: 'lcov',
                subdir: 'report-lcov'
            }, {
                // reporters supporting the `file` property, use `subdir` to directly
                // output them in the `dir` directory
                type: 'cobertura',
                subdir: '.',
                file: 'cobertura.txt'
            }, {
                type: 'lcovonly',
                subdir: '.',
                file: 'report-lcovonly.txt'
            }, {
                type: 'teamcity', subdir: '.', file: 'teamcity.txt'
            }, {
                type: 'text',
                subdir: '.',
                file: 'text.txt'
            }, {
                type: 'text-summary',
                subdir: '.',
                file: 'text-summary.txt'
            }]
        },


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera (has to be installed with `npm install karma-opera-launcher`)
        // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
        // - PhantomJS
        // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
        browsers: ['Chrome', 'PhantomJS'],


        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,


        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false
    });
};

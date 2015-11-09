'use strict';

var gulp = require('gulp');
var inject = require('gulp-inject');
var useref = require('gulp-useref');
var del = require('del');
var notify = require('gulp-notify');
var gulpif = require('gulp-if');
var sass = require('gulp-sass');
var runSequence = require('run-sequence');

var isProductionBuild = true;

gulp.task('jslint', function () {
    var jshint = require('gulp-jshint');
    var jscs = require('gulp-jscs');

    return gulp.src([
            './*.js',
            './app/**/*.js',
            '!./*.spec.js',
            '!./app/**/*.spec.js'
        ])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish', {
            verbose: true
        }))
        .pipe(jscs())
        .on('error', notify.onError({ message: 'js lint failed' }));
});

gulp.task('css', function () {
    return gulp.src('./app/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./app/styles'));
});

gulp.task('lint', ['jslint']);

gulp.task('test', ['lint'], function (done) {
    startTests(true, done);
});

gulp.task('at', ['autotest']);
gulp.task('autotest', function (done) {
    startTests(false, done);
});

gulp.task('wiredep', function () {
    var wiredep = require('wiredep').stream;
    var order = require('gulp-order');

    return gulp.src('./app/index.html')
        .pipe(wiredep({
            bowerJson: require('./bower.json'),
            directory: './bower_components/',
            ignorePath: '../..'
        }))
        .pipe(inject(gulp.src(['./app/**/*.js', '!./app/**/*.spec.js'])
            .pipe(order(['*.js', '**/*.js']))))
        .pipe(gulp.dest('./app'));
});

gulp.task('copyHTML', function () {
    return gulp.src(['./app/**/*.html'])
        .pipe(gulp.dest('./build/'));
});

gulp.task('copyImages', function () {
    return gulp.src(['./app/images/**'])
        .pipe(gulp.dest('./build/images/'));
});

gulp.task('copySwf', function () {
    return gulp.src(['./bower_components/**/*.swf'])
        .pipe(gulp.dest('./build/bower_components'));
});

gulp.task('clean-build', function (done) {
    del('build', done);
});


// This will run in this order:
// * wiredep
// * 'css', 'copyHTML', 'copyImages', 'copySwf' in parallel
// * optimize2
// * Finally call the callback function
gulp.task('optimize', function (callback) {
    runSequence('wiredep',
        ['css', 'copyHTML', 'copyImages', 'copySwf'],
        'generate-build',
        callback);
});

gulp.task('generate-build', function () {
    var ngAnnotate = require('gulp-ng-annotate');
    var uglify = require('gulp-uglify');
    var filter = require('gulp-filter');
    var rev = require('gulp-rev');
    var revReplace = require('gulp-rev-replace');
    var sourcemap = require('gulp-sourcemaps');
    var assets = useref.assets({
        searchPath: ['./', './bower_components/', './app/']
    });
    var jsLibFilter = filter('**/lib.js');
    var jsAppFilter = filter(['./app/**/*.js', '!**/*.spec.js'], {
        matchBase: './app'
    });

    return gulp
        .src('./app/index.html')
        .pipe(assets)
        .pipe(sourcemap.init())
        .pipe(jsLibFilter)
        .pipe(gulpif(isProductionBuild, uglify()))
        .pipe(jsLibFilter.restore())
        .pipe(jsAppFilter)
        .pipe(ngAnnotate({
            'single_quotes': true
        }))
        .pipe(gulpif(isProductionBuild, uglify()))
        .pipe(jsAppFilter.restore())
        .pipe(rev())
        .pipe(assets.restore())
        .pipe(sourcemap.write('./maps'))
        .pipe(revReplace())
        .pipe(useref())
        .pipe(gulp.dest('./build/'));
});

gulp.task('build', ['lint', 'optimize'], function () {
    gulp.src('*.js')
                .pipe(notify({ message: 'All tasks complete.', onLast: true }));
});

gulp.task('bw', ['build-watch']);
gulp.task('build-watch', function () {
    isProductionBuild = false;
    gulp.start('build');
    gulp.watch(['./app/**', '!./app/index.html', '!./app/styles/**'], ['build']);
});

gulp.task('help', require('gulp-task-listing'));

gulp.task('default', ['help']);

/* jshint -W003 */
function startTests(singleRun, done) {
    var karma = require('karma').server;

    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: !!singleRun
    }, karmaComplete);

    function karmaComplete(karmaResult) {
        if (karmaResult === 1) {
            done('karma: tests failed with code ' + karmaResult);
        } else {
            done();
        }
    }
}

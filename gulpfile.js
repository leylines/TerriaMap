'use strict';

/*global require*/
// Every module required-in here must be a `dependency` in package.json, not just a `devDependency`,
// This matters if ever we have gulp tasks run from npm, especially post-install ones.
var gulp = require('gulp');
var jsoncombine = require('gulp-jsoncombine');
var gutil = require('gulp-util');
var path = require('path');

var minNode = require('./package.json').engines.node;
if (!require('semver').satisfies(process.version, minNode)) {
    console.log('Terria requires Node.js ' + minNode + ' to build. Please update your version of Node.js, delete your node_modules directory' +
        ', then run npm install and gulp again.');
    process.exit();
}

gulp.task('build', ['build-css', 'merge-datasources', 'copy-terriajs-assets', 'build-app']);
gulp.task('release', ['build-css', 'copy-terriajs-assets', 'release-app', 'make-editor-schema']);
gulp.task('watch', ['watch-css', 'watch-terriajs-assets', 'watch-app']);
gulp.task('default', ['inject-files', 'lint', 'build']);

var watchOptions = {
    interval: 1000
};

gulp.task('inject-files', function(done) {
    gulp.src([
            '../build-data/images/**'
        ], { base: '../build-data/images' })
    .pipe(gulp.dest('wwwroot/images'));
    gulp.src([
            '../build-data/cesium-js/*.js'
        ], { base: '../build-data/cesium-js' })
    .pipe(gulp.dest('node_modules/terriajs-cesium/Source/DataSources'));
    return;
});

gulp.task('merge-datasources', function() {
    var jsonspacing=0;
    gulp.src("../build-data/datasources-prod/*.json")
        .pipe(jsoncombine("leylines.json", function(data) {
        // be absolutely sure we have the files in alphabetical order, with 000_settings first.
        var keys = Object.keys(data).slice().sort();
        data[keys[0]].catalog = [];

        for (var i = 1; i < keys.length; i++) {
            data[keys[0]].catalog.push(data[keys[i]].catalog[0]);
        }
        return new Buffer(JSON.stringify(data[keys[0]], null, jsonspacing));
    }))
    .pipe(gulp.dest("./wwwroot/init"));
    return;
});

gulp.task('build-app', ['write-version'], function(done) {
    var runWebpack = require('terriajs/buildprocess/runWebpack.js');
    var webpack = require('webpack');
    var webpackConfig = require('./buildprocess/webpack.config.js');

    runWebpack(webpack, webpackConfig, done);
});

gulp.task('release-app', ['write-version'], function(done) {
    var runWebpack = require('terriajs/buildprocess/runWebpack.js');
    var webpack = require('webpack');
    var webpackConfig = require('./buildprocess/webpack.config.js');

    runWebpack(webpack, Object.assign({}, webpackConfig, {
        plugins: [
            new webpack.optimize.UglifyJsPlugin(),
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.OccurrenceOrderPlugin()
        ].concat(webpackConfig.plugins || [])
    }), done);
});

gulp.task('watch-app', function(done) {
    var fs = require('fs');
    var watchWebpack = require('terriajs/buildprocess/watchWebpack');
    var webpack = require('webpack');
    var webpackConfig = require('./buildprocess/webpack.config.js');

    fs.writeFileSync('version.js', 'module.exports = \'Development Build\';');
    watchWebpack(webpack, webpackConfig, done);
});

gulp.task('build-css', function() {
    var less = require('gulp-less');
    var NpmImportPlugin = require('less-plugin-npm-import');
    var rename = require('gulp-rename');

    return gulp.src('./index.less')
        .on('error', onError)
        .pipe(less({
            plugins: [
                new NpmImportPlugin()
            ]
        }))
        .pipe(rename('leylines.css'))
        .pipe(gulp.dest('./wwwroot/build/'));
});

gulp.task('watch-css', ['build-css'], function() {
    var terriaStylesGlob = path.join(getPackageRoot('terriajs'), 'lib', 'Styles', '**', '*.less');
    var appStylesGlob = path.join(__dirname, 'lib', 'Styles', '**', '*.less');
    return gulp.watch(['./index.less', terriaStylesGlob, appStylesGlob], watchOptions, ['build-css']);
});

gulp.task('copy-terriajs-assets', function() {
    var terriaWebRoot = path.join(getPackageRoot('terriajs'), 'wwwroot');
    var sourceGlob = path.join(terriaWebRoot, '**');
    var destPath = path.resolve(__dirname, 'wwwroot', 'build', 'TerriaJS');

    return gulp
        .src([ sourceGlob ], { base: terriaWebRoot })
        .pipe(gulp.dest(destPath));
});

gulp.task('watch-terriajs-assets', ['copy-terriajs-assets'], function() {
    var terriaWebRoot = path.join(getPackageRoot('terriajs'), 'wwwroot');
    var sourceGlob = path.join(terriaWebRoot, '**');

    return gulp.watch(sourceGlob, watchOptions, [ 'copy-terriajs-assets' ]);
});

// Generate new schema for editor, and copy it over whatever version came with editor.
gulp.task('make-editor-schema', ['copy-editor'], function() {
    var generateSchema = require('generate-terriajs-schema');

    return generateSchema({
        source: getPackageRoot('terriajs'),
        dest: 'wwwroot/editor',
        noversionsubdir: true,
        editor: true,
        quiet: true
    });
});

gulp.task('copy-editor', function() {
    var glob = path.join(getPackageRoot('terriajs-catalog-editor'), '**');

    return gulp.src(glob)
        .pipe(gulp.dest('./wwwroot/editor'));
});

gulp.task('lint', function() {
    var runExternalModule = require('terriajs/buildprocess/runExternalModule');

    runExternalModule('eslint/bin/eslint.js', [
        '-c', path.join(getPackageRoot('terriajs'), '.eslintrc'),
        '--ignore-pattern', 'lib/ThirdParty',
        '--max-warnings', '0',
        'index.js',
        'lib'
    ]);
});

gulp.task('write-version', function() {
    var fs = require('fs');
    var dateFormat = require('dateformat');
    var spawnSync = require('child_process').spawnSync;

    // Get a version string from "git describe".
    //var version = spawnSync('git', ['describe']).stdout.toString().trim();
    //var isClean = spawnSync('git', ['status', '--porcelain']).stdout.toString().length === 0;
    //if (!isClean) {
    //    version += ' (plus local modifications)';
    //}
    var currentTime = new Date();
    var version = dateFormat(currentTime, "isoDateTime");

    fs.writeFileSync('version.js', 'module.exports = \'' + version + '\';');
});

function onError(e) {
    if (e.code === 'EMFILE') {
        console.error('Too many open files. You should run this command:\n    ulimit -n 2048');
        process.exit(1);
    } else if (e.code === 'ENOSPC') {
        console.error('Too many files to watch. You should run this command:\n' +
                    '    echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p');
        process.exit(1);
    }
    gutil.log(e.message);
    process.exit(1);
}

function getPackageRoot(packageName) {
    return path.dirname(require.resolve(packageName + '/package.json'));
}

var gulp = require('gulp'),
    ts = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    connect = require('gulp-connect'),
    open = require('gulp-open');

module.exports = function (meta) {
    var scaffold = meta.scaffolds.filter(function (scaffold) {
        return scaffold.name === 'demo';
    })[0];
    if (!scaffold)
        return;

    gulp.task('demo-build', function () {
        return gulp.src(scaffold.src)
            .pipe(sourcemaps.init())
            .pipe(ts({
                target: 'ES5',
                pathFilter: {'demo': ''}
            }))
            .pipe(sourcemaps.write('./', {sourceRoot: '/', debug: true}))
            .pipe(gulp.dest('demo/.build/'))
            .pipe(connect.reload());
    });

    gulp.task('demo', ['default', 'demo-build'], function () {
        var options = {
            url: 'http://localhost:' + scaffold.port.toString()
        };
        gulp.src('demo/index.html')
            .pipe(open('', options));

        connect.server({
            livereload: true,
            root: ['demo', 'demo/.build'],
            port: scaffold.port
        });

        gulp.watch('demo/**/*.ts', ['demo-build']);
        gulp.watch('demo/.build/**/*', connect.reload);
    });
};
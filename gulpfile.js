var fs = require('fs'),
    path = require('path'),
    gulp = require('gulp'),
    glob = require('glob'),
    taskListing = require('gulp-task-listing'),
    typings = require('bower-typings'),
    allTypings = typings(),
    name = 'curve',
    meta = {
        name: name,
        src: rel([
            'typings/*.d.ts',
            'src/_version.ts',
            'src/**/*.ts'
        ].concat(typings({includeSelf: false}))),
        scaffolds: [
            {
                name: 'test',
                symdirs: ['dist', 'src'],
                src: [
                    'typings/*.d.ts',
                    'test/**/*.ts',
                    '!test/lib/**/*.ts',
                    'dist/' + name + '.d.ts'
                ].concat(allTypings)
            },
            {
                name: 'stress',
                ignore: 'lib/qunit',
                port: 8002,
                symdirs: ['dist', 'src'],
                src: [
                    'typings/*.d.ts',
                    'stress/**/*.ts',
                    '!stress/lib/**/*.ts',
                    'dist/' + name + '.d.ts'
                ].concat(allTypings)
            },
            {
                name: 'demo',
                ignore: 'lib/qunit',
                port: 8003,
                symdirs: ['dist', 'src'],
                src: [
                    'typings/*.d.ts',
                    'demo/**/*.ts',
                    '!demo/lib/**/*.ts',
                    'dist/' + name + '.d.ts'
                ].concat(allTypings)
            }
        ]
    };

gulp.task('help', taskListing);

function rel(patterns) {
    return patterns
        .reduce((prev, cur) => prev.concat(glob.sync(cur)), [])
        .map(file => path.resolve(file));
}

fs.readdirSync('./gulp')
    .forEach(function (file) {
        require('./gulp/' + file)(meta);
    });
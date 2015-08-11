var fs = require('fs'),
    gulp = require('gulp'),
    taskListing = require('gulp-task-listing'),
    typings = require('bower-typings'),
    allTypings = typings(),
    name = 'path2d',
    meta = {
        name: name,
        src: [
            'typings/*.d.ts',
            'src/_version.ts',
            'src/**/*.ts'
        ].concat(typings({includeSelf: false})),
        scaffolds: [
            {
                name: 'test',
                symdirs: ['dist', 'src', 'themes'],
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
            }
        ]
    };

gulp.task('help', taskListing);

fs.readdirSync('./gulp')
    .forEach(function (file) {
        require('./gulp/' + file)(meta);
    });
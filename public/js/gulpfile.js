'use strict';
let gulp = require('gulp');
let gutil = require('gulp-util');
let browserify = require('browserify');
let babelify = require('babelify');
let source = require('vinyl-source-stream');
let minifyCSS = require('gulp-minify-css');
let autoprefixer = require('gulp-autoprefixer');
let concat = require('gulp-concat');

gulp.task('build', () => {
    return browserify({
        entries: './src/main.jsx',
        extensions: ['.jsx'],
        debug: true
    })
        .transform('babelify', {
            presets: ['es2015', 'react'],
            plugins: ['transform-class-properties']
        })
        .bundle()
        .on('error', function(err){
            console.log(err);
            gutil.log(gutil.colors.red.bold('[browserify error]'));
            gutil.log(err.message);
            this.emit('end');
        })
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./build/'));
});

gulp.task('watch', ['build'], () => {
    gulp.watch('./src/**/*.jsx', ['build']);
});

gulp.task('buildCss', function(){
    gulp.src('./src/**/*.css')
        .pipe(minifyCSS())
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
        .pipe(concat('main.css'))
        .pipe(gulp.dest('./production/css'))
});


gulp.task('watchCss', ['buildCss'], () => {
    gulp.watch('./src/**/*.css', ['buildCss']);
});


gulp.task('default', ['watch', 'watchCss']);
/* gulpfile.js */
var 
    gulp = require('gulp'),
    sass = require('gulp-sass');
    //compass = require('gulp-compass'),
    //plumber = require('gulp-plumber'),
    browserSync = require('browser-sync').create();

// source and distribution folder
var
    source = 'src/',
    dest = 'dist/';
    
// Bootstrap scss source
var bootstrapSass = {
        in: './node_modules/bootstrap-sass/'
    };

// Bootstrap fonts source
var fonts = {
        in: [source + 'fonts/*.*', bootstrapSass.in + 'assets/fonts/**/*'],
        out: dest + 'fonts/'
    };

// Our scss source folder: .scss files
var scss = {
    in: source + 'scss/main.scss',
    out: dest + 'css/',
    watch: source + 'scss/**/*',
    sassOpts: {
        outputStyle: 'nested',
        precison: 3,
        errLogToConsole: true,
        includePaths: [bootstrapSass.in + 'assets/stylesheets']
    }
};

// copy bootstrap required fonts to dest
gulp.task('fonts', function () {
    return gulp
        .src(fonts.in)
        .pipe(gulp.dest(fonts.out));
});

// compile scss
gulp.task('sass', ['fonts'], function () {
    return gulp.src(scss.in)
        .pipe(sass(scss.sassOpts))
        .pipe(gulp.dest(scss.out));
});

// browser-sync
gulp.task('browser-sync', function() {
    browserSync.init(["css/*.css","js/*.js","*.html", "images/*.img"],{
        server: {
            baseDir: "./"
        }
    });
});

// default task
gulp.task('default', ['sass', 'browser-sync'], function () {
     gulp.watch(scss.watch, ['sass']);
});



var gulp   = require('gulp'),
    gutil  = require('gulp-util'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    less   = require('gulp-less'),
    rename = require('gulp-rename'),
    mincss = require('gulp-minify-css'),
    paths = {
        clientjs: ['./src/client/js/*.js'],
	less:     ['./src/client/style/*.less'],
	serverjs: ['./src/server/js/**/*.js']
    };
    

// Client build tasks
gulp.task('less', function() {

    gulp.src(paths.less)
        .pipe(less())
	.pipe(concat('jbw_css.css')),
	//should minify as well
	.pipe(gulp.dest('./deploy/res'));
});


gulp.task('client-js', function() {

    gulp.src(paths.clientjs)
        .pipe(concat('jbw_client.js'))
	.pipe(uglify())
	.pipe(gulp.dest('./deploy/res'));
});


gulp.task('client', ['less', 'client-js']);


// Server build tasks
gulp.task('server-js', function() {

    gulp.src(paths.serverjs)
        .pipe(concat('jbw_server.js'))
	.pipe(uglify())
	.pipe(gulp.dest('./deploy'));
});


gulp.task('server', ['server-js']);


// Global build tasks
gulp.task('lint', function() {

    gulp.src([].concat(clientjs, serverjs))
        .pipe(jshint())
	.pipe(jshint().reporter('default'));
});


gulp.task('default', ['lint', 'server', 'client']);

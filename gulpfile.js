//var gulp = require('gulp'),
//  connect = require('gulp-connect'),
//  watch = require('gulp-watch');
//
//
// 
//gulp.task('webserver', function() {
//  connect.server({
//    livereload: true,
//    port : 8000,
//    root: ['.', '.tmp']
//  });
//});
// 
//gulp.task('livereload', function() {
//  gulp.src(['.tmp/styles/*.css', '.tmp/scripts/*.js'])
//    .pipe(watch())
//    .pipe(connect.reload());
//});
// 
//gulp.task('less', function() {
//  gulp.src('styles/main.less')
//    .pipe(gulp.dest('.tmp/styles'));
//});
// 
//gulp.task('watch', function() {
//  gulp.watch('styles/*.less', ['less']);
//})
// 
//gulp.task('default', ['less', 'webserver', 'livereload', 'watch']);


//Good looking alternate from gulp-connect page

var gulp = require('gulp'),
  connect = require('gulp-connect');

gulp.task('connect', function() {
  connect.server({
    root: 'app',
    port : 8888,
    livereload: true
  });
});

gulp.task('html', function () {
  gulp.src('./app/*.html')
    .pipe(connect.reload());
});

gulp.task('css', function () {
  gulp.src('./app/styles/*.css')
    .pipe(connect.reload());
});

gulp.task('js', function () {
  gulp.src('./app/js/*.js')
    .pipe(connect.reload());
});


gulp.task('watch', function () {
  gulp.watch(['./app/*.html'], ['html']);
  gulp.watch(['./app/styles/*.*'], ['css']); //update for anything in this file
  gulp.watch(['./app/js/*.*'], ['js']); //update for anything in this file
});

gulp.task('default', ['connect', 'watch']);

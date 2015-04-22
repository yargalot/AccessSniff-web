var del = require('del');
var gulp = require('gulp');
var path = require('path');
var open = require('gulp-open');
var less = require('gulp-less');
var react = require('gulp-react');
var bower = require('gulp-bower');
var connect = require('gulp-connect');
var runSequence = require('run-sequence');

gulp.task('clean', function(cb) {
  del(['./dist'], cb);
});

gulp.task('bower', function() {
  return bower()
    .pipe(gulp.dest('dist/lib/'))
});

gulp.task('less', function () {
  gulp.src('./less/**/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('jsx', function () {
  gulp.src('src/js/*.jsx')
    .pipe(react())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('connect', function() {
  connect.server({
    root: 'dist',
    livereload: true
  });
});

gulp.task('html', function () {
  gulp.src('./src/*.html')
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload());
});

gulp.task('open', function(){
  gulp.src('./dist/index.html')
    .pipe(open('', {
      url: 'http://localhost:8080'
    }));
});

gulp.task('watch', function () {
  gulp.watch(['./src/*.html'], ['html']);
  gulp.watch(['./src/js/*.jsx'], ['jsx']);
});

gulp.task('default', function(callback) {
  runSequence('clean', ['bower', 'html', 'jsx'], 'connect', 'open', 'watch', callback);
});

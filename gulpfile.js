var gulp = require('gulp');
var path = require('path');
var less = require('gulp-less');
var react = require('gulp-react');
var connect = require('gulp-connect');

gulp.task('clean', function(cb) {
  // You can use multiple globbing patterns as you would with `gulp.src`
  del(['build'], cb);
});

gulp.task('less', function () {
  return gulp.src('./less/**/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('react', function () {
  gulp.src('src/js/*.jsx')
    .pipe(react())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('connect', function() {
  connect.server({
    root: 'src',
    livereload: true
  });
});

gulp.task('html', function () {
  gulp.src('./src/*.html')
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['./src/*.html'], ['html']);
});

gulp.task('default', ['connect', 'watch']);

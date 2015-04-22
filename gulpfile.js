var del = require('del');
var gulp = require('gulp');
var path = require('path');
var open = require('gulp-open');
var less = require('gulp-less');
var react = require('gulp-react');
var bower = require('gulp-bower');
var notify = require('gulp-notify');
var connect = require('gulp-connect');
var runSequence = require('run-sequence');

var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');


var browserify = require('browserify');
var reactify = require('reactify');

gulp.task('clean', function(cb) {
  del(['./dist'], cb);
});

gulp.task('bower', function() {
  return bower()
    .pipe(gulp.dest('dist/lib/'));
});

gulp.task('less', function () {
  gulp.src('./less/**/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('jsx', function () {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: './src/js/template.jsx',
    debug: true,
    // defining transforms here will avoid crashing your stream
    transform: [reactify]
  });

  return b.bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    // .pipe(sourcemaps.init({loadMaps: true}))
    //     // Add transformation tasks to the pipeline here.
    //     .pipe(uglify())
    //     .on('error', gutil.log)
    // .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/js/'));
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
    }))
    .pipe(notify('Server started!'));
});

gulp.task('watch', function () {
  gulp.watch(['./src/*.html'], ['html']);
  gulp.watch(['./src/js/*.jsx'], ['jsx']);
});

gulp.task('default', function(callback) {
  runSequence('clean', ['bower', 'html', 'jsx'], 'connect', 'open', 'watch', callback);
});

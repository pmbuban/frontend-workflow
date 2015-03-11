var gulp        = require('gulp'),
    jade        = require('gulp-jade'),
    browserify  = require('browserify'),
    source      = require('vinyl-source-stream'),
    b           = browserify(),
    uglify      = require('gulp-uglify'),
    gulpif      = require('gulp-if'),
    streamify   = require('gulp-streamify');

//defaults to development if node variable isn't explicitly set
//to set NODE_ENV use the following
//NODE_ENV=development gulp js
//NODE_ENV=production gulp js
var env = process.env.NODE_ENV || 'development';

//convert jade to html
gulp.task('jade', function(){
  return gulp.src('src/templates/**/*.jade')
    .pipe(jade())
    .pipe(gulp.dest('builds/development'));
});

//bundle js files together and minify
gulp.task('js', function(){
  return b.add('./src/js/main', { debug:true === 'development' })
    .bundle()
    .pipe(source('builds/development/js/bundle.js'))
    //.pipe( streamify(uglify()) )
    .pipe( gulpif(env === 'production', streamify(uglify())) )
    .pipe(gulp.dest('.'));
});
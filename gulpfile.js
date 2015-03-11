var gulp        = require('gulp'),
    jade        = require('gulp-jade'),
    browserify  = require('browserify'),
    source      = require('vinyl-source-stream'),
    b           = browserify(),
    uglify      = require('gulp-uglify'),
    gulpif      = require('gulp-if'),
    streamify   = require('gulp-streamify'),
    sass        = require('gulp-sass'),
    connect     = require('gulp-connect'),
    open        = require('gulp-open');

//defaults to development if node variable isn't explicitly set
//to set NODE_ENV use the following
//NODE_ENV=development gulp js
//NODE_ENV=production gulp js
var env = process.env.NODE_ENV || 'development';
var outputDir = 'builds/development';

//convert jade to html
gulp.task('jade', function(){
  return gulp.src('src/templates/**/*.jade')
    .pipe(jade())
    .pipe(gulp.dest( outputDir ))
    .pipe(connect.reload());
});

//bundle js files together and minify
gulp.task('js', function(){
  return b.add('./src/js/main', { debug:true === 'development' })
    .bundle()
    .pipe(source( outputDir + '/js/bundle.js'))
    .pipe( gulpif(env === 'production', streamify(uglify())) )
    .pipe(gulp.dest('.'))
    .pipe(connect.reload());
});

gulp.task('sass', function(){
  var config = {};
  if (env === 'development'){
    config.sourceComments = 'map';
  }
  if (env === 'production'){
    config.outputStyle = 'compressed';
  }
  return gulp.src('src/sass/main.scss')
    .pipe(sass( config ))
    .pipe(gulp.dest(outputDir + '/css'))
    .pipe(connect.reload());
});

gulp.task('watch', function(){
  gulp.watch('src/templates/**/*.jade', ['jade']);
  gulp.watch('src/js/**/*.js', ['js']);
  gulp.watch('src/sass/**/*.scss', ['sass']);
})

gulp.task('connect', function(){
  connect.server({
    root: outputDir,
    port: 9001,
    livereload:true
  });
});


gulp.task('url', function(){
  var options={
    url: "http://localhost:9001",
    //app: 'chrome' //on windows
    //app: 'google-chrome' //on linux
    app: 'google chrome' //on osx
  };
  gulp.src('./builds/development/index.html')
    .pipe(open('', options));
});

//runs all tasks with command 'gulp'
gulp.task('default', ['js', 'jade', 'sass', 'watch', 'connect', 'url']);


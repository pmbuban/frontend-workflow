var gulp = require('gulp'),
    jade = require('gulp-jade');

gulp.task('jade', function(){
  return gulp.src('src/templates/**/*.jade')
    .pipe(jade())
    .pipe(gulp.dest('builds/development'));
})
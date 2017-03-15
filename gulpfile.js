const gulp = require('gulp')
const browserify = require('browserify')
const source = require('vinyl-source-stream')

gulp.task('bundle', () => 
  browserify({
    entries: './app-ui/src/index.js',
  })
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(gulp.dest('app-ui/dist'))
)

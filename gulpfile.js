const gulp = require('gulp')

const browserify = require('browserify')
const source = require('vinyl-source-stream')

const nano = require('cssnano')
const autoprefixer = require('autoprefixer')
const sass = require('gulp-sass')
const postcss = require('gulp-postcss')

const sourcemaps = require('gulp-sourcemaps')

gulp.task('bundle', () => 
  browserify({
    entries: './app-ui/src/index.js',
  })
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(gulp.dest('app-ui/dist'))
)

gulp.task('styles', () => 
  gulp.src('./app-ui/src/scss/styles.scss')
  .pipe(sourcemaps.init())
  .pipe(sass({
    includePaths: [
      __dirname + '/node_modules/normalize-scss/sass',
    ],
  }))  
  .pipe(postcss([autoprefixer(), nano()]))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('app-ui/dist'))
)

const gulp = require('gulp')
const rename = require('gulp-rename')
const {spawn} = require('child_process')

const browserSync = require('browser-sync')

const browserify = require('browserify')
const watchify = require('watchify')
// eslint-disable-next-line no-unused-vars
const babelify = require('babelify')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const ngAnnotate = require('gulp-ng-annotate')
const uglify = require('gulp-uglify')

const nano = require('cssnano')
const autoprefixer = require('autoprefixer')
const sass = require('gulp-sass')
const postcss = require('gulp-postcss')

const sourcemaps = require('gulp-sourcemaps')

const ENV = process.env.NODE_ENV || 'development'

const bPlugins = {
  'development': [watchify],
  'production': [],
}

const b = browserify({
  cache: {},
  packageCache: {},
  entries: './app-ui/src/index.js',
  plugin: bPlugins[ENV],
  transform: [['babelify', {
    ignore: ['./node_modules'],
    presets: [__dirname + '/node_modules/babel-preset-es2015'],
  }]],
})

const bundle = () => b.bundle()

if (ENV === 'development') b.on('update', bundle)

gulp.task('presentation', () => 
  gulp.src('./app-ui/src/**/presentation/*/*.html')
  .pipe(rename(path => {
    path.dirname = ''
  }))
  .pipe(gulp.dest('app-ui/dist/presentation'))
)

gulp.task('containers', () => 
  gulp.src('./app-ui/src/containers/*/*.html')
  .pipe(rename(path => {
    path.dirname = ''
  }))
  .pipe(gulp.dest('app-ui/dist/containers'))
)

gulp.task('bundle', ['containers', 'presentation'], () => 
  bundle()
  .pipe(source('bundle.js'))
  .pipe(buffer())
  .pipe(ngAnnotate())
  .pipe(uglify({ options: { mangle: false }}))
  .pipe(gulp.dest('app-ui/dist'))
)

gulp.task('bundle:dev', ['containers', 'presentation'], () => 
  bundle()
  .pipe(source('bundle.js'))
  .pipe(buffer())
  .pipe(ngAnnotate())
  .pipe(uglify({ options: { mangle: false }}))
  .pipe(sourcemaps.init({loadMaps: true}))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('app-ui/dist'))
)

gulp.task('styles', () => {
  gulp.src('./app-ui/src/scss/styles.scss')
  .pipe(sass({
    includePaths: [
      __dirname + '/node_modules/normalize-scss/sass',
    ],
  }))  
  .pipe(postcss([autoprefixer(), nano()]))
  .pipe(gulp.dest('app-ui/dist'))
})

gulp.task('styles:dev', () => {
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
})

gulp.task('watch', () => {
  if (ENV === 'development') {
    gulp.watch('./app-ui/src/scss/**/*.scss', ['styles', 'refresh'])
  }
})

gulp.task('servers', () => {
  const command = ENV === 'development' ? './node_modules/.bin/nodemon' : 'node'

  spawn(command, ['./api-converter/index.js'], {
    stdio: 'inherit',
  })
  spawn(command, ['./api-scheduler/index.js'], {
    stdio: 'inherit',
  })
  spawn(command, ['./app-ui/index.js'], {
    stdio: 'inherit',
  })
})

gulp.task('sync', ['styles', 'bundle:dev'], () => 
  browserSync({
    files: ['./app-ui/dist/styles.css', './app-ui/dist/bundle.js'],
    proxy: {
      target: require('./app-ui/config').server.url,
      ws: true,
    },
  })
)

gulp.task('refresh', ['watch', 'bundle:dev'], browserSync.reload)

const TASKS = {
  'development': ['styles:dev', 'bundle:dev', 'watch', 'servers', 'sync', 'refresh'],
  'production': ['styles', 'bundle', 'servers'],
}

gulp.task('default', TASKS[ENV])

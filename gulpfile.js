const gulp = require('gulp')
const rename = require('gulp-rename')
const clean = require('gulp-clean')

const {spawn} = require('child_process')
const EventEmmitter = require('events')

const Promise = require('bluebird')

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

const js = ENV === 'development' ? 'bundle:dev' : 'bundle'
const styles = ENV === 'development' ? 'styles:dev' : 'styles'

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

let isCleaned = false
const cleanEvents = new EventEmmitter()
cleanEvents.on('complete', () => {
  isCleaned = true
})
const whenCleaned = (fn) => () => {
  if (isCleaned) return fn()
  return new Promise((resolve) => {
    cleanEvents.on('complete', () => {
      fn().on('end', resolve)
    })
  })
}

gulp.task('clean', () =>
  gulp.src([
    'app-ui/dist/*.*',
    'app-ui/dist/containers/*',
    'app-ui/dist/presentation/*',
  ], {read: false})
  .pipe(clean())
  .on('end', () => cleanEvents.emit('complete'))
)

gulp.task('presentation', whenCleaned(() => 
  gulp.src('./app-ui/src/**/views/*/*.html')
  .pipe(rename(path => {
    path.dirname = ''
  }))
  .pipe(gulp.dest('app-ui/dist/presentation'))
))

gulp.task('containers', whenCleaned(() => 
  gulp.src('./app-ui/src/components/*/*.html')
  .pipe(rename(path => {
    path.dirname = ''
  }))
  .pipe(gulp.dest('app-ui/dist/containers'))
))

gulp.task('index', whenCleaned(() => 
  gulp.src('./app-ui/src/index.html')
  .pipe(rename(path => {
    path.dirname = ''
  }))
  .pipe(gulp.dest('app-ui/dist'))
))

gulp.task('bundle', whenCleaned(() => 
  bundle().on('error', () => console.log('Compiling js failed'))
  .pipe(source('bundle.js'))
  .pipe(buffer())
  .pipe(ngAnnotate())
  .pipe(uglify({ options: { mangle: false }}))
  .pipe(gulp.dest('app-ui/dist'))
))

gulp.task('bundle:dev', whenCleaned(() => 
  bundle().on('error', (err) => console.log(err))
  .pipe(source('bundle.js'))
  .pipe(buffer())
  .pipe(sourcemaps.init({loadMaps: true}))
  .pipe(ngAnnotate())
  .pipe(uglify({ options: { mangle: false }}))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('app-ui/dist'))
))

gulp.task('styles', whenCleaned(() =>
  gulp.src('./app-ui/src/scss/styles.scss')
  .pipe(sass({
    includePaths: [
      __dirname + '/node_modules/normalize-scss/sass',
    ],
  }))  
  .pipe(postcss([autoprefixer(), nano()]))
  .pipe(gulp.dest('app-ui/dist'))
))

gulp.task('styles:dev', whenCleaned(() =>
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
))

const registry = {}

const startService = (cmd, module, args = []) => new Promise(resolve => {
  if (registry[module] && registry[module].kill) registry[module].kill()
  registry[module] = spawn(cmd, ['index.js'].concat(args), {
    cwd: `./${module}`,
  }).stdout.on('data', msg => {
    const message = msg.toString()
    console.log(message.trim())
    if (message.indexOf('started and listening') > -1) resolve()
  })    
})

gulp.task('api:converter', () => startService('nodemon', 'api-converter'))

gulp.task('api:scheduler', () => startService('nodemon', 'api-scheduler'))

gulp.task('server:ui', ['index', 'containers', 'presentation', styles, js], () => 
  startService('node', 'app-ui', [
    '--ignore ./src/',
    '--ignore ./dist/',
  ])
)

gulp.task('watch', ['server:ui'], () => {
  gulp.watch('./app-ui/src/scss/**/*.scss', [styles]),
  gulp.watch('./app-ui/src/index.html', ['index']),
  gulp.watch('./app-ui/src/components/*/*.html', ['containers']),
  gulp.watch('./app-ui/src/**/views/*/*.html', ['presentation']),
  gulp.watch('./app-ui/src/**/*.js', [js]),
  gulp.watch('./lib/app.js', [js])
})

gulp.task('sync', ['server:ui'], () => 
  browserSync({
    files: ['./app-ui/dist/*.*'],
    proxy: {
      target: require('./app-ui/config').server.url,
      ws: true,
    },
  })
)

gulp.task('servers', ['api:converter', 'api:scheduler', 'server:ui'])

const TASKS = {
  'development': ['clean', js, styles, 'servers', 'watch', 'sync'],
  'production': ['clean', js, styles, 'servers'],
}

gulp.task('default', TASKS[ENV])

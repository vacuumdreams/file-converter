const gulp = require('gulp')
const rename = require('gulp-rename')
const {spawn} = require('child_process')
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

gulp.task('bundle', () => 
  bundle().on('error', (err) => console.log(err))
  .pipe(source('bundle.js'))
  .pipe(buffer())
  .pipe(ngAnnotate())
  .pipe(uglify({ options: { mangle: false }}))
  .pipe(gulp.dest('app-ui/dist'))
)

gulp.task('bundle:dev', () => 
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

gulp.task('server:ui', ['containers', 'presentation', styles, js], () => startService('node', 'app-ui', [
  '--ignore ./src/',
  '--ignore ./dist/',
]))

gulp.task('watch', () => {
  gulp.watch('./app-ui/src/scss/**/*.scss', [styles])
  gulp.watch('./app-ui/src/containers/*/*.html', ['containers'])
  gulp.watch('./app-ui/src/**/presentation/*/*.html', ['presentation'])
  gulp.watch('./app-ui/src/**/*.js', [js])
})

gulp.task('sync', ['server:ui'], () => 
  browserSync({
    files: ['./app-ui/dist/*'],
    proxy: {
      target: require('./app-ui/config').server.url,
      ws: true,
    },
  })
)

gulp.task('servers', ['api:converter', 'api:scheduler', 'server:ui'])

const TASKS = {
  'development': ['bundle:dev', 'styles:dev', 'servers', 'watch', 'sync'],
  'production': ['bundle', 'styles', 'servers'],
}

gulp.task('default', TASKS[ENV])

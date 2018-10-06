const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');

// Static server
gulp.task('server', function () {
  browserSync.init({
    server: {
      port: 9000,
      baseDir: "build"
    }
  });

  gulp.watch('build/**/*').on('change', browserSync.reload);
});

//  pug-compile

gulp.task('template:compile', function buildHTML() {
  return gulp.src('source/template/index.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('build'))
});

//  styles compile

gulp.task('styles:compile', function () {
  return gulp.src('source/styles/main.scss')
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('build/css'));
});

//  sprite

gulp.task('sprite', function (cb) {
  const spriteData = gulp.src('source/images/icons/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    imgPath: '../images/sprite.css',
    cssName: 'sprite.scss'
  }));


  spriteData.img.pipe(gulp.dest('build/images/'));
  spriteData.css.pipe(gulp.dest('source/styles/global/'));
  cb();
});

//  delete

gulp.task('clean', function del(cb) {
  return rimraf('build', cb);
})

// copy fonts

gulp.task('copy:fonts', function () {
  return gulp.src('./source/fonts/**/*.*')
    .pipe(gulp.dest('build/fonts'));
})

// copy images

gulp.task('copy:images', function () {
  return gulp.src('./source/images/**/*.*')
    .pipe(gulp.dest('build/images'));
})

// copy

gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'))

//  watchers

gulp.task('watch', function () {
  gulp.watch('source/template/**/*.pug', gulp.series('template:compile'));
  gulp.watch('source/styles/**/*.scss', gulp.series('styles:compile'));
})

// prefixer, sourcemaps, concat

gulp.task('prefixer', () =>
  gulp.src('source/styles/main.scss')
  .pipe(sourcemaps.init())
  .pipe(autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false
  }))
  .pipe(concat('all.css'))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('dist'))
);

// default

gulp.task('default', gulp.series(
  'clean',
  gulp.parallel('template:compile', 'styles:compile', 'prefixer', 'sprite', 'copy'),
  gulp.parallel('watch', 'server')
));
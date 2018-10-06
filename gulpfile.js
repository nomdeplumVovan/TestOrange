const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf');

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
  return gulp.src('source/template/*.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('build'))
});

//  styles compile

gulp.task('styles:compile', function () {
  return gulp.src('source/styles/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('.build/css'));
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
    .pipe(gulp.dest('builds/fonts'));
})

// copy images

gulp.task('copy:images', function () {
  return gulp.src('./source/images/**/*.*')
    .pipe(gulp.dest('builds/images'));
})

// copy

gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'))

//  watchers

gulp.task('watch', function () {
  gulp.watch('source/template/**/*.pug', gulp.series('template:compile'));
  gulp.watch('source/styles/**/*.scss', gulp.series('styles:compile'));
})

// default

gulp.task('default', gulp.series(
  'clean',
  gulp.parallel('template:compile', 'styles:compile', 'sprite', 'copy'),
  gulp.parallel('watch', 'server')
));
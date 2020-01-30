//Gulp Packages
const gulp = require('gulp');
const gulpIf = require('gulp-if');
const browserSync = require('browser-sync').create();
const clean = require('gulp-clean');

const imagemin = require('gulp-imagemin');

const sass = require("gulp-sass");
const rename = require('gulp-rename');
const autoprefixer = require('autoprefixer')
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss')

const ts = require("gulp-typescript");
const tslint = require("gulp-tslint");
const uglify = require('gulp-uglify');

const notify = require('gulp-notify');

//Global Variables
var production = false;

//Path Definitions
const paths = {
  html: {
    src: "*.html",
    dest: "dist"
  },
  styles: {
    main_scss_src: "sass/styles.scss",
    src: "sass/**/*.scss",
    dest: "dist/assets"
  },
  scripts: {
    src: "assets/js/*.ts",
    dest: "dist/scripts"
  },
  images: {
    src: "assets/images/**/*",
    dest: "dist/assets/images"
  }
}

//Internal Tasks
function cleanDist() {
  return gulp.src('dist/', { allowEmpty: true })
    .pipe(clean())
}

// If there is Pug file
function html() {
  return gulp.src(paths.html.src)
    //        .pipe(pug())
    .pipe(gulp.dest(paths.html.dest))
}

function scripts() {
  return gulp.src(paths.scripts.src, { allowEmpty: true })
    .pipe(ts({
      out: "output.js"
    }))
    .pipe(tslint({
      formatter: "verbose"
    }))
    .pipe(tslint.report())
    .pipe(gulpIf(production, uglify()))
    .pipe(gulp.dest(paths.scripts.dest));
}

function styles() {
  let sassOptions = {};
  if (production) {
    sassOptions = {
      outputStyle: 'compressed'
    }
  }
  return gulp.src(paths.styles.main_scss_src)
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(postcss([ autoprefixer() ]))
    .pipe(rename('styles.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream())
}

function images() {
  return gulp.src(paths.images.src, { allowEmpty: true })
    .pipe(gulpIf(production, imagemin()))
    .pipe(gulp.dest(paths.images.dest))
}

function copyFiles() {
  gulp.src(['favicon.png', 'CNAME'], { allowEmpty: true })
    .pipe(gulp.dest('dist'))
  gulp.src(['assets/**'], { allowEmpty: true })
    .pipe(gulp.dest('dist/assets'))
}

//External Tasks

gulp.task("default",
  gulp.series(cleanDist, gulp.parallel(html, scripts, styles, images))
);

gulp.task('production', gulp.series((done) => { production = true;
  done(); }, 'default'));

gulp.task("serve", gulp.series('default', () => {
  browserSync.init({
    server: "./dist"
  });
  copyFiles();
  gulp.watch(paths.styles.src, gulp.series(styles));
  gulp.watch(paths.scripts.src, gulp.series(scripts));
  gulp.watch(paths.images.src, gulp.series(images));
  gulp.watch("assets/**/*").on('change', browserSync.reload);
  gulp.watch(paths.html.src, gulp.series(html)).on('change', browserSync.reload);
}));

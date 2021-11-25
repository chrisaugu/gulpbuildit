const { dest, src, series, parallel, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const rename = require('gulp-rename');
const purgecss = require('gulp-purgecss');
const minifyCSS = require('gulp-minify-css');
const uglifycss = require('gulp-uglifycss');

function clean(cb) {  
  return src([
    'public/css/theme.css',
  ])
  .pipe(cleanCSS())
  .pipe(dest('public/css'));

  cb();
}

// function purgecss(cb) {
//   return gulp.src('src/**/*.css')
//     .pipe(rename({
//       suffix: '.rejected'
//     }))
//     .pipe(purgecss({
//       content: ['src/**/*.html'],
//       rejected: true
//     }))
//     .pipe(gulp.dest('build/css'));

//   cb();
// }

function cssTranspile(cb) {
  // return src(['src/**/*.scss', 'src/**/*.css'])
  return src('src/styles/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('theme.css'))
    .pipe(dest('public/css/'));

  cb();
};

function cssMinify(cb) {
  return src('public/css/theme.css')
    // .pipe(autoprefixer())
    // .pipe(rename({ suffix: '.min' }))
    // .pipe(cleanCSS())
    // .pipe(minifyCSS())
    // .pipe(uglifycss({
    //   "maxLineLen": 80,
    //   "uglyComments": true
    // }))
    .pipe(dest('public/css/'));

    cb();
};

// transpile all .js files to clean .js files
function jsTranspile(cb) {
  // return src('src/js/*.js')
  return src([
    './src/js/*.js',
    // './src/components/*.jsx'
    ])
    // .pipe(sourcemaps.init())
    // .pipe(babel({
    //   presets: [
    //     'es2015',
    //     'react',
    //     'env'
    //   ] 
    // }))
    .pipe(dest('src/js/'));

  cb();
}

// bundle all .js file into theme.min.js
function jsBundle(cb) {
  return src('src/js/*.js')
  // return src(['assets/js/vendor/*.js', 'assets/js/main.js', 'assets/js/module*.js'])
  // return src(['./public/js/**/*.js','./public/assets/js/*.js']) //Use wildcards to select all files in a particular folder or be specific
    .pipe(concat('theme.js')) //this will concat all the files into theme.js
    .pipe(dest('public/js')); //this will save uglify.js into destination Directory defined above
  cb();
}

function jsMinify(cb) {
  return src('public/js/theme.js')
    // .pipe(rename({ suffix: '.min' }))
    // .pipe(minify({
    //   ext:{
    //     min:'.js'
    //   },
    //   noSource: true
    // }))
    // .pipe(jshint({
      // esversion: 6
    // }))
    // .pipe(jshint.reporter('default'))
    // .pipe(uglify()) //this will uglify/minify uglify.js
    .pipe(dest('public/js')); //this will save uglify.js into destination Directory defined above

  cb();
};

function publish(cb) {
  // body omitted
  cb();
}

function build(cb) {
  return src('src/styles/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(dest('public/s/css'));

  cb();
}
exports.build = build;

exports.styles = series(cssTranspile, cssMinify)
exports.scripts = series(jsTranspile, jsBundle, jsMinify);

exports.watch = function() {
  // watch('src/styles/*.scss', styles);
  watch('src/styles/*.scss', series(clean, styles));
  watch('src/js/*.js', series(clean, javascript, jsuglify));
};

exports.default = series(
  clean,
  parallel(
    cssTranspile,
    series(jsTranspile, jsBundle)
  ),
  parallel(cssMinify, jsMinify),
  // publish
);

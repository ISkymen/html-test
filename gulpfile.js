'use strict';
var config = require('./config.js');
var gulp = require('gulp'),
    watch = require('gulp-watch'), // Rebuild only changed files
    plumber = require('gulp-plumber'), // Protect from exit on error
    prefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
  	concat = require('gulp-concat'),
  	uglify = require('gulp-uglify'),
		gutil = require('gulp-util'),
		svgSprite = require('gulp-svg-sprite'),
		size = require('gulp-size'),
    shell = require('gulp-shell'),
    browserSync = require("browser-sync"),
    argv = require('yargs').argv,
    reload = browserSync.reload;

var args = {
  debug: argv.debug
};

var basePath = './';

var path = {
	sprite: {
		src: basePath + 'sprite/*',
		svg: 'css/img/sprite.svg',
		scss: 'scss/_sprite.scss',
		tpl: basePath + 'scss/sprite-tpl.scss'
	},
	styles: {
		css: basePath + 'css/',
		scss: basePath + '/scss/**/*.*',
		scss_input: basePath + 'scss/styles.scss'
	},
	js: {
		src: 'profiles/amvb_website/themes/amvb_theme/js_src/**/*.*',
		dst: 'profiles/amvb_website/themes/amvb_theme/js/'
	},
	template: 'profiles/amvb_website/themes/amvb_theme/templates/*.twig'
};	
	

gulp.task('webserver', ['sass', 'js'], function () {
    browserSync.init({
        proxy: config.site_name,
        open: false
    });
});

gulp.task('sprite', function () {
	return gulp.src(path.sprite.src)
		.pipe(svgSprite({
			shape: {
				spacing: {
					padding: 5
				}
			},
			mode: {
				css: {
					dest: "./",
					layout: "vertical",
					sprite: path.sprite.svg,
					bust: false,
					render: {
						scss: {
							dest: path.sprite.scss,
							template: path.sprite.tpl
						}
					}
				}
			},
			variables: {
				mapname: "icons"
			}
		}))
		.pipe(gulp.dest(basePath));
});

gulp.task('sass', function () {
    gulp.src(path.styles.scss_input)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass()).on('error', sass.logError)
        .pipe(prefixer())
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest(path.styles.css))
        .pipe(reload({stream: true}));
});

gulp.task('js', function () {
  var debug = args.debug;

  var process = gulp.src(path.js.src)
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(concat('main.js'));

  if (!debug) {
    process
			.pipe(uglify())
  }

  process
		.pipe(sourcemaps.write('/'))
    .pipe(gulp.dest(path.js.dst))
    .pipe(reload({stream: true}));
});

gulp.task('clearcache', function() {
    return shell.task([
        'drush cr'
    ]);
});

gulp.task('reload', ['clearcache'], function () {
    reload();
});

gulp.task('watch', ['webserver'], function () {
    watch([path.styles.scss], function (event, cb) {
    gulp.start('sass');
  });
    watch([path.js.src], function (event, cb) {
    gulp.start('js');
  });
    watch([path.template], function (event, cb) {
    gulp.start('reload');
  });
});


gulp.task('default', ['watch', 'sass']);

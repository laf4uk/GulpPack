var	gulp 					= require('gulp'),
		browserSync 	= require('browser-sync').create(),
		sass					= require('gulp-sass'),
		concat				= require('gulp-concat'),
		// gutil					= require('gulp-util')
		uglify				= require('gulp-uglify-es').default,
		notify				= require('gulp-notify'),
		plumber				= require('gulp-plumber'),
		sourcemaps		= require('gulp-sourcemaps'),
		imagemin			=	require('gulp-imagemin'),
		pug						= require('gulp-pug'),
		rename				= require('gulp-rename'),
		postcss				= require('gulp-postcss'),
		autoprefixer	= require('autoprefixer'),
		cssnano 			= require('cssnano'),
		del						= require('del');

gulp.task('server', function() {
	browserSync.init({
		// proxy: 'opencart.loc' // if using cms (opencart, modx, etc)
		server: {
			baseDir: './build/'
		},
		notify: false,
		// open: false,
		// online: false,
		// tunnel: true, tunnel: "projectname",
	});

	gulp.watch('app/sass/**/*.sass', gulp.parallel('styles'));
	gulp.watch('app/pug/**/*.pug', gulp.parallel('pug'));
	gulp.watch(['libs/**/*.js', 'app/js/**/*.js'], gulp.parallel('js'));
	gulp.watch('app/libs/**/*.*', gulp.parallel('libs'));
	gulp.watch('app/fonts/**/*.*', gulp.parallel('fonts'));
	gulp.watch('app/img/**/*.*', gulp.parallel('img'));
});

gulp.task('styles', function() {
	var plugins = [
		autoprefixer(),
		cssnano()
	];
	return gulp.src('./app/sass/**/*.sass')
	.pipe(plumber({
		errorHandler: notify.onError(function(err){
			return {
				title: 'styles',
				message: err.message
			}
		})
	}))
	.pipe(sourcemaps.init())
	.pipe(sass())
  .pipe(rename({
  	suffix: ".min",
  	prefix: ''
  }))
  .pipe(postcss(plugins))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('./build/css'))
  .pipe(browserSync.stream());
});

gulp.task('js', function() {
	return gulp.src([
		'app/libs/jquery/dist/jquery.min.js',
		'app/libs/mmenu-js-master/dist/mmenu.min.js',
		'app/libs/owl-carousel/dist/owl.carousel.min.js',
		'app/libs/Likely/release/likely.js',
		// 'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js',
		// 'app/libs/inputmask/dist/min/jquery.inputmask.bundle.min.js',
		// 'app/libs/jquery-validation/dist/jquery.validate.min.js',
		// 'app/libs/jquery-validation/dist/additional-methods.min.js',
		'app/js/**/*.js',
		])
	  .pipe(concat('scripts.min.js'))
	  .pipe(sourcemaps.init())
	  .pipe(uglify())
	  .on('error', function (err) {
	  	gutil.log(gutil.colors.red('[Error]'), err.toString());
	  })
	  .pipe(sourcemaps.write())
	  .pipe(gulp.dest('./build/js'))
		.pipe(browserSync.stream());
});

gulp.task('pug', function buildHTML() {
	return gulp.src('./app/pug/pages/**/*.pug')
	.pipe(plumber({
		errorHandler: notify.onError(function(err){
			return {
				title: 'pug',
				message: err.message
			}
		})
	}))
	.pipe(pug({
		pretty: true
	}))
	.pipe(gulp.dest('./build/'))
	.pipe(browserSync.stream());
});

gulp.task('libs', function() {
	return gulp.src('./app/libs/**/*.*')
	.pipe(gulp.dest('./build/libs'))
	.pipe(browserSync.stream());
});

gulp.task('fonts', function() {
	return gulp.src('./app/fonts/**/*.*')
		.pipe(gulp.dest('./build/fonts'))
		.pipe(browserSync.stream());
});

gulp.task('img', function() {
	return gulp.src('./app/img/**/*.*')
		.pipe(imagemin())
		.pipe(gulp.dest('./build/img'))
		.pipe(browserSync.stream());
});

gulp.task('clean:build', function() {
    return del('./build');
});

gulp.task('default', gulp.series('clean:build', gulp.parallel('styles', 'pug', 'js', 'libs', 'fonts', 'img', 'server')));

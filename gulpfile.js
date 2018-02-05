const 	gulp 			= require('gulp'),
	 	connect 		= require('gulp-connect'),
	 	browserify 		= require('browserify'),
	 	babelify 		= require('babelify'),
		source 			= require('vinyl-source-stream'),
		sass 			= require('gulp-sass'),
		autoprefixer	= require('gulp-autoprefixer'),
		concat			= require('gulp-concat'),
		cssnano			= require('gulp-cssnano'),
		del				= require('del'),
		rename			= require('gulp-rename'),
		cache			= require('gulp-cache'),
		pngquant		= require('imagemin-pngquant'),
		imagemin		= require('gulp-imagemin'),
		uglify			= require('gulp-uglifyjs'),
		listTasks 		= ['connect','js', 'html', 'sass','scripts', 'img','json','fonts', 'watch'];

gulp.task('connect', () => {
	connect.server({
		base: 'http://localhost',
		port: 9000,
		root: './dist',
		livereload: true
	});
});

/*  SASS/SCSS conf */
gulp.task('sass', function(){
	return gulp.src([
		'app/sass/styles.+(scss|sass)',
		'app/sass/libs.+(scss|sass)'
	])
	.pipe(sass())
	.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'],{ cascade: true}))
	.pipe(gulp.dest('./dist/css'))
	.pipe(connect.reload());
});

/* JS libs */
gulp.task('scripts', function(){
	return gulp.src([
		'app/libs/js/jquery.js',
		'app/libs/js/bootsrap_4.js'
	])
	.pipe(concat('libs.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('./dist/js'));
});

/* SASS/SCSS/CSS libs   */
gulp.task('css-libs', ['sass'], function(){
	return gulp.src('./app/css/libs.css')
	.pipe(cssnano())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('./dist/css'));
});

/* delete /.dist */
gulp.task('clean', function(){
	return del.sync('./dist');
});

/* minification img */
gulp.task('img', function(){
	return gulp.src('./app/img/**/*')
	.pipe(cache(imagemin({
		interlaced: true,
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		une: [pngquant()]
	})))
	.pipe(gulp.dest('./dist/img'));
});

/* ES6 */ 
gulp.task('js', () => {
	browserify('./app/js/main.js')
		.transform(babelify)
		.bundle()
		.pipe(source('main.js'))
		.pipe(gulp.dest('./dist/js'))
		.pipe(connect.reload());
});

/* HTML */ 
gulp.task('html', () => {
	gulp.src('./app/*.html')
		.pipe(gulp.dest('./dist'))
		.pipe(connect.reload());
});

/* Fonts */ 
gulp.task('fonts', () => {
	gulp.src('./app/fonts/*')
		.pipe(gulp.dest('./dist/fonts'))
		.pipe(connect.reload());
});

/* JSON */ 
gulp.task('json', () => {
	gulp.src('./app/data/*')
		.pipe(gulp.dest('./dist/data'))
		.pipe(connect.reload());
});

gulp.task('watch', () => {
	gulp.watch('./app/js/**/*.js', ['js']);
	gulp.watch('./app/*.html', ['html']);
	gulp.watch('./app/sass/*.scss', ['css-libs']);
	gulp.watch('./app/libs/js/*.js', ['scripts']);
	gulp.watch('./app/img/*', ['img']);
	gulp.watch('./app/data/*', ['json']);
	gulp.watch('./app/fonts/*', ['fonts']);
});


gulp.task('default', listTasks);

var gulp = require ('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gp_rename = require("gulp-rename");
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var minifyCss = require("gulp-minify-css");
var runSequence = require('run-sequence');


gulp.task('styles', function(callback) {
  runSequence('sass', 'concat', 'minify-css', callback);
});


// task
gulp.task('minify-css', function () {
    return gulp.src([
        './static/css/concat.css',
    ]) // path to your file
    .pipe(gp_rename({suffix: '.min'}))
    .pipe(minifyCss())
    .pipe(gulp.dest('./static/css'));
});


gulp.task('concat', function () {
    return gulp.src([
        './static/css/main.css',
        './assets/scripts/plugins/tipped-4.6.0-light/css/tipped/tipped.css'
    ]) // path to your file
    .pipe(concat('concat.css'))
    .pipe(gulp.dest('./static/css'));
});


gulp.task('sass', function() {
    return gulp.src([
            './assets/styles/main.scss',
        ])
	    .pipe(sourcemaps.init())
    	.pipe(sass({includePaths: [
            './assets/styles/partials', 
        ]}).on('error', sass.logError))
    	.pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./static/css'));
});

gulp.task('scripts', function(){
	return gulp.src([
		'./bower_components/jquery/dist/jquery.js',
		'./bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
		'./bower_components/swiper/dist/js/swiper.jquery.js',

		'./assets/scripts/plugins/slick.js',
        './assets/scripts/plugins/jquery-ui/jquery-ui-1.10.1.custom.min.js',
        './assets/scripts/plugins/bootstrap-modalmanager.js',
        './assets/scripts/plugins/bootstrap-modal.js',
        './assets/scripts/plugins/jquery.noty-2.3.8/js/noty/packaged/jquery.noty.packaged.min.js',
        './assets/scripts/plugins/jquery.fancybox/source/jquery.fancybox.js',
        './assets/scripts/plugins/bootbox.min.js',
        './assets/scripts/plugins/jquery.validate/jquery.validate.min.js',
        './assets/scripts/plugins/waypoint/lib/jquery.waypoints.min.js',
        './assets/scripts/plugins/handlebars-v4.0.5.js',
        './assets/scripts/plugins/jquery.lazyload.min.js',
        './assets/scripts/plugins/jquery.dotdotdot.min.js',
        './assets/scripts/plugins/owl.carousel.min.js',

        '../../static/sdk/js/cloudinary/jquery.cloudinary.js',
        '../../static/sdk/js/common.js',
        '../../static/sdk/js/blog.js',
        '../../static/sdk/js/article.js',
        '../../static/sdk/js/search.js',
        '../../static/sdk/js/disqus.js',
        '../../static/sdk/js/video-player.js',
        '../../static/sdk/js/user-articles.js',
        '../../static/sdk/js/follow.js',
        '../../static/sdk/js/login.js',
        '../../static/sdk/js/image.js',
        '../../static/sdk/js/social-share.js',
        '../../static/sdk/js/yii/yii.js',
        '../../static/sdk/js/yii/yii.captcha.js',
        '../../static/sdk/js/uploadfile.js',
        '../../static/sdk/js/media-player/mediaelement-and-player.min.js',

        './assets/scripts/plugins/tipped-4.6.0-light/js/tipped/tipped.js',
		'./assets/scripts/*.js',

		])
		.pipe(concat('concat.js'))
		.pipe(gulp.dest('./static/js'))
		.pipe(gp_rename('scripts.js'))
		.pipe(uglify().on('error', gutil.log))
		.pipe(gulp.dest('./static/js'));
});

gulp.task('watch', function (){
	gulp.watch('./assets/styles/**/*.scss', ['styles']);
	// gulp.watch('./assets/scripts/**/*.js', ['scripts']);
});

gulp.task('default', ['scripts','styles']);
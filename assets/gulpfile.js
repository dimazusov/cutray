const gulp        = require('gulp');
const sass        = require('gulp-sass');
const concat      = require('gulp-concat');
const minify      = require('gulp-clean-css');

gulp.task('default', function() {
    gulp.watch('./src/css/sass/**/*.*', gulp.series('sass'));
});

gulp.task('sass', function() {
    return gulp.src('src/css/sass/**/*.sass')
        .pipe(sass())
        .pipe(concat('App.css'))
        .pipe(minify())
        .pipe(gulp.dest("./src/css/app"));
});
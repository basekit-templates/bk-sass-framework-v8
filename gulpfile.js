var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('concat', function() {
    return gulp.src(
        [
            './**/**/*.scss',
            './**/*.scss',
            './*.scss',
            '!./node_modules/**/*.scss',
            '!./concat/**/*.scss',
            '!./validation.scss',
            '!./bk-sass-precompiled.scss'
        ]
    )
    .pipe(concat('bk-sass-framework-v8.scss'))
    .pipe(gulp.dest('./concat/'));
});
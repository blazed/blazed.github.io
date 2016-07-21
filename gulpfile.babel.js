import gulp from 'gulp'
import htmlmin from 'gulp-htmlmin'
import runSequence from 'run-sequence'
import shell from 'gulp-shell'
import rev from 'gulp-rev'
import cleanCSS from 'gulp-clean-css'
import concat from 'gulp-concat'
import revReplace from 'gulp-rev-replace'
import revdel from 'gulp-rev-delete-original'

gulp.task('hugo-build', shell.task(['hugo -t simple-a']))

gulp.task('minify-html', () => {
  let manifest = gulp.src("./public/rev-manifest.json")
  return gulp.src('public/**/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true,
      removeComments: true,
      useShortDoctype: true,
    }))
    .pipe(revReplace({ manifest: manifest}))
    .pipe(gulp.dest('./public'))
})

gulp.task('minify-css', () => {
  return gulp.src('public/**/*.css')
  .pipe(concat('main.css'))
  .pipe(cleanCSS({
    compatibility: 'ie8'
  }))
  .pipe(gulp.dest('./public/css'))
})

gulp.task('rev', () => {
  return gulp.src('public/**/*.css')
    .pipe(rev())
    .pipe(gulp.dest('./public'))
    .pipe(revdel())
    .pipe(rev.manifest())
    .pipe(gulp.dest('./public'))
})

gulp.task('build', ['hugo-build'], (callback) => {
  runSequence('minify-css', 'rev', 'minify-html', callback)
})

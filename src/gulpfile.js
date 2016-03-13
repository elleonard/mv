var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('tachie', function(){
  // 基点となるファイルのみ指定
  gulp.src(['../Project/js/plugins/Tachie.js', '../Project/js/plugins/Saba.js'])
    .pipe(concat('Tachie.js'))
    .pipe(gulp.dest('../dist/'));
});

gulp.task('scenario', function(){
  // 基点となるファイルのみ指定
  gulp.src(['../Project/js/plugins/SimpleScenario.js', '../Project/js/plugins/SimpleScenarioValidator.js', '../Project/js/plugins/Saba.js'])
    .pipe(concat('SimpleScenario.js'))
    .pipe(gulp.dest('../dist/'));
});


gulp.task('default',['tachie','scenario']);

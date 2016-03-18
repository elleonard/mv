var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('tachie', function(){
  // 基点となるファイルのみ指定
  gulp.src(['../Project/js/plugins/Saba_Lib.js', '../Project/js/plugins/Saba_Tachie.js'])
    .pipe(concat('Tachie.js'))
    .pipe(gulp.dest('../dist/'));
});

gulp.task('scenario', function(){
  // 基点となるファイルのみ指定
  gulp.src(['../Project/js/plugins/Saba_Lib.js', '../Project/js/plugins/Saba_SimpleScenario.js', '../Project/js/plugins/Saba_SimpleScenarioValidator.js'])
    .pipe(concat('SimpleScenario.js'))
    .pipe(gulp.dest('../dist/'));
});


gulp.task('default',['tachie','scenario']);

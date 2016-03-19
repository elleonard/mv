var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('tachie', function(){
  // 基点となるファイルのみ指定
  gulp.src(['../Project/js/plugins/Saba_Lib.js', '../Project/js/plugins/Saba_Tachie.js'])
    .pipe(concat('Saba_Tachie.js'))
    .pipe(gulp.dest('../../gal1/gal1/Project/js/plugins/'));
});

gulp.task('scenario', function(){
  // 基点となるファイルのみ指定
  gulp.src(['../Project/js/plugins/Saba_Lib.js', '../Project/js/plugins/Saba_SimpleScenario.js', '../Project/js/plugins/Saba_SimpleScenarioValidator.js'])
    .pipe(concat('Saba_SimpleScenario.js'))
    .pipe(gulp.dest('../../gal1/gal1/Project/js/plugins/'));
});


gulp.task('default',['tachie','scenario']);

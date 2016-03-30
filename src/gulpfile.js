var gulp = require('gulp');
var concat = require('gulp-concat');
var replace = require('gulp-replace');
var fs = require('fs');

var output = '../../gal5/Project/js/plugins/';

gulp.task('tachie', function(){
  var file = '../js/Saba_Tachie.js';
  var stat = fs.statSync(file);
  gulp.src(['../js/Saba_Lib.js', file])
    .pipe(concat('Saba_Tachie.js'))
    .pipe(replace('* Ver', '* Ver ' + getDateFormatString(stat.mtime)))
    .pipe(gulp.dest('../Project/js/plugins/'))
    .pipe(gulp.dest(output));
});


gulp.task('scenario', function(){
  var file1 = '../js/Saba_SimpleScenario.js';
  var file2 = '../js/Saba_SimpleScenarioValidator.js';
  var stat1 = fs.statSync(file1);
  var stat2 = fs.statSync(file2);

  var mtime = stat1.mtime;
  if (stat1.mtime.getTime() < stat2.mtime.getTime()) {
      mtime = stat2.mtime;
  }

  gulp.src(['../js/Saba_Lib.js', '../js/Saba_SimpleScenario.js', '../js/Saba_SimpleScenarioValidator.js'])
    .pipe(concat('Saba_SimpleScenario.js'))
    .pipe(replace('* Ver', '* Ver ' + getDateFormatString(mtime)))
    .pipe(gulp.dest('../Project/js/plugins/'))
    .pipe(gulp.dest(output));
});


gulp.task('backlog', function(){
    var file = '../js/Saba_BackLog.js';
    var stat = fs.statSync(file);
    gulp.src(['../js/Saba_Lib.js', file])
      .pipe(concat('Saba_BackLog.js'))
      .pipe(replace('* Ver', '* Ver ' + getDateFormatString(stat.mtime)))
      .pipe(gulp.dest('../Project/js/plugins/'))
      .pipe(gulp.dest(output));
});

gulp.task('battle', function(){
    var file = '../js/Saba_BattleTachie.js';
    var stat = fs.statSync(file);
    gulp.src([file])
      .pipe(replace('* Ver', '* Ver ' + getDateFormatString(stat.mtime)))
      .pipe(gulp.dest('../Project/js/plugins/'));
});


gulp.task('watch', function(){
  gulp.watch('../js/*.js', ['tachie', 'scenario', 'backlog', 'battle']);
});

gulp.task('default', ['watch']);



function getDateFormatString(date) {
    var format = 'YYYY-MM-DD hh:mm:ss';
    format = format.replace(/YYYY/g, date.getFullYear());
    format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
    format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
    format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
    format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
    format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
    return format;
}
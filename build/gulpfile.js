var gulp = require('gulp');
var watch = require('gulp-watch');
var sftp = require('gulp-sftp');

gulp.task('watchAndUpload', function(){

    return watch('../output*/**', {ignoreInitial: false, base: '../output'})
        .pipe(sftp({
            host: '192.168.1.222',
            user: 'rongyi',
            pass: 'rongyi',
            remotePath: '/home/rongyi/cmsfrontend/webroot'
        }));
});
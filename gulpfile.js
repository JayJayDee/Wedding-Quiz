
var gulp = require('gulp');
var typescript = require('gulp-tsc');
var runseq = require('run-sequence');
var spawn = require('child_process').spawn;

var paths = {
  tsPath: 'src/**/*.ts',
  jsPath: 'bin'
};

var node;
gulp.task('server', function() {
  if (node) node.kill();
  node = spawn('node', ['bin/app.js'], {stdio: 'inherit'});
  node.on('close', function(code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
});

gulp.task('build', function(cb) {
  return gulp.src(paths.tsPath)
    .pipe(typescript({
      emitError: false,
      target: 'es2017',
      sourceMap: true 
    }))
    .pipe(gulp.dest(paths.jsPath));
});

gulp.task('gen-apidoc', function(cb) {
  apidoc({
      src: './src/docs',
      dest: './doc'
  }, cb);
});
 
gulp.task('default', function () {
  runseq('build', 'server');
  gulp.watch('src/**/*.ts', function() {
    runseq('build', 'server');
  });
});
 
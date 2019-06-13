var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");
var standalonify = require('standalonify');

gulp.task("default", function () {
  return browserify({
    basedir: '.',
    debug: false,
    entries: ['src/index.ts'],
    cache: {},
    packageCache: {}
  })
  .plugin(standalonify, {
    name: 'DrawingBoard',
    hasAmdDeps: true
  })
  .plugin(tsify, {
    module: "commonjs"
  })
  .bundle()
  .pipe(source('drawing-board.js'))
  .pipe(gulp.dest("dist"));
});
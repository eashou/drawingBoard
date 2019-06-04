var gulp = require("gulp");
var ts = require("gulp-typescript");

gulp.task("default", function () {
  var tsResult = gulp.src("src/index.ts")
    .pipe(ts({
      noImplicitAny: true,
      out: "drawing-board.js"
    }));
  return tsResult.js.pipe(gulp.dest('dist'));
});
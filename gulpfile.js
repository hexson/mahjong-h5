var gulp = require('gulp');
var del = require('del');
var through2 = require('through2');
var browserSync = require('browser-sync');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var less = require('gulp-less');
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');
var reload = browserSync.reload;


var NODE_ENV = process.env.NODE_ENV || '';

var isDev = function(){
  return NODE_ENV.trim() === 'development';
}();

var isProd = function(){
  return NODE_ENV.trim() === 'production';
}();


gulp.task('clean', function(cb){
  var stream = del(['dist/**/*', 'rev-manifest.json'], cb);
  return stream;
});
gulp.task('clean:rev:json', function(cb){
  var stream = del(['rev-manifest.json', 'dist/**/*-manifest.json'], cb);
  return stream;
});

gulp.task('copy:html', function(){
  gulp.src('src/index.html')
      // .pipe(gulp.dest('./'));
      .pipe(gulp.dest('dist/'));
  gulp.src(['src/**/*.{html,htm}', '!src/index.html'])
      .pipe(gulp.dest('dist/'));
});

gulp.task('copy:hash:html', ['css:less:uglifycss'], function(){
  gulp.src('src/index.html')
      .pipe(revReplace({manifest: gulp.src('dist/css/*ss-manifest.json')}))
      // .pipe(gulp.dest('./'));
      .pipe(gulp.dest('dist/'));
  return gulp.src(['src/**/*.{html,htm}', '!src/index.html'])
      .pipe(rev())
      .pipe(gulp.dest('dist/'))
      .pipe(rev.manifest({
        base: 'dist',
        merge: true
      }))
      .pipe(gulp.dest('dist/'));
});

gulp.task('copy:lib', function(){
  gulp.src('node_modules/jquery/dist/*.min.js')
      .pipe(gulp.dest('dist/js/jquery/'));
  gulp.src('node_modules/angular/angular.min.js')
      .pipe(gulp.dest('dist/js/angular/'));
  // gulp.src('node_modules/angular-toastr/dist/*.{js,css}')
      // .pipe(gulp.dest('dist/js/angular-toastr/'));
  gulp.src('node_modules/angular-ui-router/release/angular-ui-router.min.js')
      .pipe(gulp.dest('dist/js/angular-ui-router/'));
  // gulp.src('node_modules/ng-dialog/js/ngDialog.min.js')
      // .pipe(gulp.dest('dist/js/ng-dialog/'));
  // gulp.src('node_modules/ng-dialog/css/**/*.css')
      // .pipe(gulp.dest('dist/js/ng-dialog/'));
  gulp.src('node_modules/ng-file-upload/dist/*.*')
      .pipe(gulp.dest('dist/js/ng-file-upload/'));
  gulp.src('node_modules/ngstorage/ngStorage.min.js')
      .pipe(gulp.dest('dist/js/ngstorage/'));
  gulp.src('node_modules/oclazyload/dist/ocLazyLoad.min.js')
      .pipe(gulp.dest('dist/js/oclazyload/'));
});

gulp.task('image', function(){
  gulp.src('src/img/*')
      .pipe(gulp.dest('dist/img/'));
});

gulp.task('imagemin', function(){
  gulp.src('src/img/*')
      .pipe(imagemin())
      .pipe(gulp.dest('dist/img/'));
});

gulp.task('css:less', function(){
  gulp.src('src/css/*')
      .pipe(gulp.dest('dist/css/'))
      .pipe(reload({stream: true}));
  gulp.src('src/less/*')
      .pipe(less())
      .pipe(gulp.dest('dist/css/'))
      .pipe(reload({stream: true}));
});

gulp.task('css:less:uglifycss', function(){
  gulp.src('src/css/*')
      .pipe(uglifycss())
      .pipe(rev())
      .pipe(gulp.dest('dist/css/'))
      .pipe(rev.manifest('css-manifest.json'))
      .pipe(gulp.dest('dist/css/'));
  return gulp.src('src/less/*')
      .pipe(less())
      .pipe(uglifycss())
      .pipe(rev())
      .pipe(gulp.dest('dist/css/'))
      .pipe(rev.manifest('less-manifest.json'))
      .pipe(gulp.dest('dist/css/'));
});

gulp.task('concat:appjs', function(){
  gulp.src(['src/app.config.js', 'src/app.js', 'src/app.filter.js', 'src/app.services.js'])
      .pipe(concat('app.js'))
      .pipe(modify(devBasePath))
      .pipe(gulp.dest('dist/'));
});

gulp.task('uglify:concat:appjs', ['copy:hash:html', 'uglify:pagejs'], function(){
  return gulp.src(['src/app.config.js', 'src/app.js', 'src/app.filter.js', 'src/app.services.js'])
      .pipe(uglify())
      .pipe(concat('app.js'))
      .pipe(modify(version))
      .pipe(revReplace({manifest: gulp.src('./rev-manifest.json')}))
      .pipe(rev())
      .pipe(modify(pagePath))
      .pipe(modify(basePath))
      .pipe(gulp.dest('dist/'))
      .pipe(rev.manifest('app-manifest.json'))
      .pipe(gulp.dest('dist/'));
});

gulp.task('revReplace:index', ['uglify:concat:appjs'], function(){
  gulp.src('dist/index.html')
      .pipe(revReplace({manifest: gulp.src('dist/app-manifest.json')}))
      .pipe(gulp.dest('dist/'));
});

gulp.task('copy:pagejs', function(){
  gulp.src(['src/**/*.js', '!src/*.js'])
      .pipe(gulp.dest('dist/'));
});

gulp.task('uglify:pagejs', function(){
  return gulp.src(['src/**/*.js', '!src/*.js'])
      .pipe(uglify())
      .pipe(rev())
      .pipe(gulp.dest('dist/'))
      .pipe(rev.manifest({
        base: 'dist',
        merge: true
      }))
      .pipe(gulp.dest('dist/'));
});

gulp.task('server', ['css:less'], function(){
  browserSync({
    server: {
      baseDir: 'dist/'
    },
    port: 8000
  });
  gulp.watch("app/less/*.less", ['css:less']);
  gulp.watch(['src/**/*', '!src/less/*.less']).on('change', reload);
});

gulp.task('watch', function(){
  gulp.watch('src/**/*.{html,htm}', ['copy:html']);
  gulp.watch('src/img/*', ['image']);
  gulp.watch(['src/less/*', 'src/css/*'], ['css:less']);
  gulp.watch(['src/app.config.js', 'src/app.js', 'src/app.filter.js', 'src/app.services.js'], ['concat:appjs']);
  gulp.watch(['src/**/*.js', '!src/*.js'], ['copy:pagejs']);
});

var taskList = ['copy:lib'];

if (isProd){
  taskList.push('imagemin', 'copy:hash:html', 'css:less:uglifycss', 'uglify:concat:appjs', 'uglify:pagejs', 'revReplace:index');
}else {
  taskList.push('image', 'copy:html', 'css:less', 'concat:appjs', 'copy:pagejs', 'server', 'watch');
}

function modify(modifier){
  return through2.obj(function(file, encoding, done){
    var content = modifier(String(file.contents));
    file.contents = new Buffer(content);
    this.push(file);
    done();
  });
}

function version(data){
  return data.replace(/__VERSION__/, 'v1.0.0');
}
function pagePath(data){
  return data.replace(/pages\//g, '');
}
function basePath(data) {
  return data.replace(/__path__/, 'pages/');
}
function devBasePath(data) {
  return data.replace(/__path__/, '');
}


gulp.task('default', taskList);
var gulp          = require('gulp'),
    browserSync   = require('browser-sync'), // Авто обновление страницы
    imagemin      = require('gulp-imagemin'), //  Сжатия картинок
    watch         = require('gulp-watch'),
    pngquant      = require('imagemin-pngquant'), // Сжатия картинок png
    uglify        = require('gulp-uglify'), // Сжатия JavaScript
    clean         = require('gulp-clean'), // Очистка дериктории dist
    cssmin        = require('gulp-minify-css'),
    rename        = require('gulp-rename'), // Переминование папок
    sass          = require('gulp-sass'),
    gcmq          = require('gulp-group-css-media-queries'), //Комбинует медиа запроссы
    notify        = require("gulp-notify"), // выводит ошибки при сборке 
    sourcemaps    = require('gulp-sourcemaps'),
    rigger        = require('gulp-rigger'),
    babel         = require('gulp-babel'),
    prefixer      = require('gulp-autoprefixer'), // Префиксы для браузеров
    reload        = browserSync.reload;

var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        libs: 'build/libs',
        fonts: 'build/fonts/'
    },
    src: { //Пути откуда брать исходники
        html: 'src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'src/js/main.js',//В стилях и скриптах нам понадобятся только main файлы
        style: 'src/style/main.scss',
        libs: 'src/libs/**/*.*',
        img: 'src/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'src/fonts/**/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};



var config = {
    server: {
        baseDir: "./build"
    },
    //tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "Kuznetsov"
};


gulp.task('html:build', function () {
    gulp.src(path.src.html) //Выберем файлы по нужному пути
        .pipe(rigger()) //Прогоним через rigger
        .pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
        .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
});


gulp.task('js:build', function () {
    gulp.src(path.src.js) //Найдем наш main файл
        .pipe(rigger()) //Прогоним через rigger
        .pipe(sourcemaps.init()) //Инициализируем sourcemap
        .pipe(babel({
            presets: ['es2015']
        }))
        //.pipe(uglify()) //Сожмем наш js
        .on('error', notify.onError ())
        // .pipe(sourcemaps.write()) //Пропишем карты
        .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
        .pipe(reload({stream: true})); //И перезагрузим сервер
});


// gulp.task('babel', function () {
//     return gulp.src(path.src.js)
//         .pipe(babel({
//             presets: ['es2015']
//         }))
//         .pipe(gulp.dest('dist'));
// });


gulp.task('style:build', function () {
    gulp.src(path.src.style) //Выберем наш main.scss
        //.pipe(sourcemaps.init()) //То же самое что и с js
        .pipe(sass()) //Скомпилируем
        .on('error', notify.onError ())
        //.pipe(prefixer()) //Добавим вендорные префиксы
        .pipe(gcmq()) // media
        //.pipe(cssmin()) //Сожмем
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css)) //И в build
        .pipe(reload({stream: true}));
});


gulp.task('img:build', function () {
    gulp.src(path.src.img) //Выберем наши картинки
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img)) //И бросим в build
        .pipe(reload({stream: true}));
});


gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
});

gulp.task('libs:build', function() {
    gulp.src(path.src.libs)
        .pipe(gulp.dest(path.build.libs));
});


gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'img:build',
    'libs:build'
]);


gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        setTimeout(function () {
        gulp.start('style:build');
    }, 250);
    });
    watch([path.watch.js], function(event, cb) {
        setTimeout(function () {
        gulp.start('js:build');
    }, 250);
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('img:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});


gulp.task('webserver', function () {
    browserSync(config);
});


gulp.task('clean', function () {  
    return gulp.src(path.clean, {read: false})
      .pipe(clean());
});


gulp.task('default', ['build', 'webserver', 'watch']);

# gulp-packages - gulp package management helper

## Features

1. Smart package-require notation
2. Add 'install' task to your gulpfile
3. Add 'uninstall' task to your gulpfile

## Install

```sh
$ npm install gulp-packages
```

## Features1: Smart package-require notation

### BEFORE

__gulpfile.js__

```js
var gulp = require('gulp');
var less = require('gulp-less');
var coffee = require('gulp-coffee');
var pleeease = require('gulp-pleeease');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');
var coffeelint = require('gulp-coffeelint');
var concat = require('gulp-concat');
```

### AFTER

__gulpfile.js__

```js
var gulp = require('gulp');
var pkg = require('gulp-packages')(gulp, [
  'less',
  'coffee',
  'pleeease',
  'minifyCss',
  'uglify',
  'rename',
  'watch',
  'plumber',
  'coffeelint',
  'concat'
]);
```

For the above example, Packages are loaded into `pkg` variable.

#### Use of loaded packages

```js
gulp.src('/path/to/*.coffee')
  .pipe(pkg.plumber())  // <-
  .pipe(pkg.coffee())   // <- pkg.XXX(package name)
  .pipe(pkg.uglify())   // <-
  .pipe(gulp.dest('js/'));
```

## Features2: Add 'install' task to your gulpfile

When the following conditions:

__gulpfile.js__

```js
var gulp = require('gulp');
var pkg = require('gulp-packages')(gulp, [
  'less',
  'coffee',
  'pleeease',
  'minifyCss',
  'uglify',      // <- not installed yet
  'rename',      // <- not installed yet 
  'watch',
  'plumber',     // <- not installed yet
  'coffeelint',
  'concat'       // <- not installed yet
]);
```

### BEFORE

```sh
$ npm install gulp-uglify gulp-rename gulp-plumber gulp-concat --save-dev
```

### AFTER

```sh
$ gulp install
```

## Features3: Add 'uninstall' task to your gulpfile

When the following conditions:

__gulpfile.js__

```js
var gulp = require('gulp');
var pkg = require('gulp-packages')(gulp, [
  'less',
  'coffee',
  'pleeease',
  'minifyCss',
  'watch',
  'coffeelint',
]);
```

and

__package.json__

```json:package.json
{
  "devDependencies": {
    "coffee-script": "*",
    "gulp": "*",
    "gulp-coffee": "^2.1.1",
    "gulp-coffeelint": "^0.3.3",
    "gulp-concat": "^2.3.4",      // <- no longer using
    "gulp-less": "^1.3.2",
    "gulp-minify-css": "^0.3.7",
    "gulp-pleeease": "0.0.5",
    "gulp-plumber": "^0.6.4",     // <- no longer using
    "gulp-rename": "^1.2.0",      // <- no longer using
    "gulp-uglify": "^0.3.1",      // <- no longer using
    "gulp-watch": "^0.6.8"
  }
}
```

### BEFORE

```sh
$ npm uninstall gulp-uglify gulp-rename gulp-plumber gulp-concat --save-dev
```

### AFTER

```sh
$ gulp uninstall
```

## Changelog

### 0.1.0 (2014-07-26)

* First release

## License

[MIT license](http://www.opensource.org/licenses/mit-license)

&copy; 2014 [ktty1220](mailto:ktty1220@gmail.com)

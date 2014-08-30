/*jshint node:true,forin:false,strict:false*/
/*global suite,test,suiteSetup,suiteTeardown,setup,teardown*/

var assert = require('chai').assert;
var gulpPkgs = require('../gulp-packages');

suite('gulp-packages', function () {
  suiteSetup(function () {
    this.dummyGulp = { task: function () {} };
    this.pkg = gulpPkgs(this.dummyGulp, [
      'uglify',
      'minify-css',
      'html-minifier as minHtm',
      'taskListing as help',
      'xxx'
    ]);
  });
  suiteTeardown(function () {
  });
  setup(function () {
  });
  teardown(function () {
  });

  test('converted package names', function () {
    assert.deepEqual(Object.keys(this.pkg), [
      'uglify',
      'minifyCss',
      'minHtm',
      'help'
    ]);
  });

  test('loaded object is function', function () {
    for (var p in this.pkg) {
      assert.isFunction(this.pkg[p], p);
    }
  });

  test('loaded function: uglify', function () {
    assert.isTrue(this.pkg.uglify.toString().indexOf('uglify') !== -1);
  });

  test('loaded function: minify-css', function () {
    assert.isTrue(this.pkg.minifyCss.toString().indexOf('minifyCSS') !== -1);
  });

  test('loaded function: minHtm', function () {
    assert.isTrue(this.pkg.minHtm.toString().indexOf('gulp-htmlmin') !== -1);
  });

  test('loaded function: help', function () {
    assert.isTrue(this.pkg.help.toString().indexOf('Main Tasks') !== -1);
  });
});

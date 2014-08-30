/*jshint node:true*/
module.exports = function (gulp, packages) {
  'use strict';

  var me = 'gulp-packages';
  var _pkgs = { notInstalled: [], loaded: {} };

  var clc = require('cli-color');
  var cwd = process.cwd();
  var camel = function (str) {
    return str.replace(/-(\w)/g, function (match, char) { return char.toUpperCase(); });
  };
  for (var i = 0; i < packages.length; i++) {
    var pkg = packages[i].split(/\sas\s/, 2);
    pkg[1] = camel(pkg[pkg.length === 2 ? 1 : 0]);
    pkg[0] = pkg[0].replace(/([A-Z])/g, '-$1').toLowerCase();
    packages[i] = pkg[0];
    var m = 'gulp-' + pkg[0];
    try {
      if (_pkgs.loaded[pkg[1]]) {
        console.warn('[' + clc.green(me) + '] ' + clc.red('Duplicate package: ' + pkg[1]));
      } else {
        _pkgs.loaded[pkg[1]] = require(cwd + '/node_modules/' + m);
      }
    } catch (e) {
      _pkgs.notInstalled.push(m);
    }
  }

  var npmCommand = function(cmd, pkgs, cb) {
    if (pkgs.length === 0) {
      console.info('\n' + clc.blue('no package to ' + cmd) + '\n');
      return cb();
    }
    var npm = require('npm');
    npm.load(function (e) {
      if (e) {
        console.error('\n' + clc.red(e.message) + '\n');
        return cb();
      }
      var saveDev = npm.config.get('save-dev');
      npm.config.set('save-dev', true);
      npm.commands[cmd](pkgs, function (e) {
        npm.config.set('save-dev', saveDev);
        if (e) {
          console.error('\n' + clc.red(e.message) + '\n');
        } else {
          var u = ' package' + ((pkgs.length > 1) ? 's ' : ' ');
          console.info('\n' + clc.green(pkgs.length + u + cmd + 'ed') + '\n');
        }
        cb();
      });
    });
  };

  gulp.task('install', function (cb) {
    npmCommand('install', _pkgs.notInstalled, cb);
  });

  gulp.task('uninstall', function (cb) {
    var installed = Object.keys(require(cwd + '/package.json').devDependencies || {});
    var toUninstall = [];
    for (var i = 0; i < installed.length; i++) {
      if (! /^gulp-/.test(installed[i])) { continue; }
      if (installed[i] === 'gulp-packages') { continue; }
      if (packages.indexOf(installed[i].substr(5)) === -1) { toUninstall.push(installed[i]); }
    }
    npmCommand('uninstall', toUninstall, cb);
  });

  return _pkgs.loaded;
};

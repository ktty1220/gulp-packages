/*jshint node:true,loopfunc:true*/
module.exports = function (gulp, packages) {
  'use strict';

  gulp._packages = { notInstalled: [], loaded: {} };

  var clc = require('cli-color');
  var cwd = process.cwd();

  for (var i = 0; i < packages.length; i++) {
    var m = 'gulp-' + packages[i].replace(/([A-Z])/g, '-$1').toLowerCase();
    try {
      gulp._packages.loaded[packages[i]] = require(cwd + '/node_modules/' + m);
    } catch (e) {
      gulp._packages.notInstalled.push(m);
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
    npmCommand('install', gulp._packages.notInstalled, cb);
  });

  gulp.task('uninstall', function (cb) {
    var installed = Object.keys(require(cwd + '/package.json').devDependencies || {});
    var toUninstall = [];
    for (var i = 0; i < installed.length; i++) {
      if (! /^gulp-/.test(installed[i])) { continue; }
      var m = installed[i].substr(5).replace(/-([a-z])/g, function (m, p) { return p.toUpperCase(); });
      if (packages.indexOf(m) === -1 && m !== 'packages') { toUninstall.push(installed[i]); }
    }
    npmCommand('uninstall', toUninstall, cb);
  });

  return gulp._packages.loaded;
};

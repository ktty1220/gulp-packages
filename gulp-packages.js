module.exports = function (gulp, packages) {
  gulp._packages = { notInstalled: [], loaded: {} };

  var cwd = process.cwd();

  for (var i = 0; i < packages.length; i++) {
    var m = 'gulp-' + packages[i].replace(/([A-Z])/g, '-$1').toLowerCase();
    try {
      gulp._packages.loaded[packages[i]] = require(cwd + '/node_modules/' + m);
    } catch (e) {
      gulp._packages.notInstalled.push(m);
    }
  }

  var npmCommand = function(cmd, pkgs) {
    var npm = require('npm');
    npm.load(function (e) {
      if (e) { return console.error(e.message); }
      var saveDev = npm.config.get('save-dev');
      npm.config.set('save-dev', true);
      npm.commands[cmd](pkgs, function (e) {
        if (e) { console.error(e.message); }
        npm.config.set('save-dev', saveDev);
      });
    });
  };

  gulp.task('install', function () {
    if (gulp._packages.notInstalled.length === 0) {
      return console.log('\nall package is installed.\n');
    }
    npmCommand('install', gulp._packages.notInstalled);
  });

  gulp.task('uninstall', function () {
    var installed = Object.keys(require(cwd + '/package.json').devDependencies || {});
    var forUninstall = [];
    for (var i = 0; i < installed.length; i++) {
      if (! /^gulp-/.test(installed[i])) { continue; }
      var m = installed[i].substr(5).replace(/-([a-z])/g, function (m, p) { return p.toUpperCase(); });
      if (packages.indexOf(m) === -1 && m !== 'packages') { forUninstall.push(installed[i]); }
    }
    if (forUninstall.length === 0) {
      return console.log('\nno package for uninstall.\n');
    }
    npmCommand('uninstall', forUninstall);
  });

  return gulp._packages.loaded;
};

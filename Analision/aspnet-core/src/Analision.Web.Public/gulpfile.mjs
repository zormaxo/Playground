﻿import gulp from 'gulp';
import path from 'path';
import orderedReadStreams from 'ordered-read-streams';
import fs from 'fs';
import { globbySync } from 'globby';
import concat from 'gulp-concat';
import less from 'gulp-less';
import gulpTerser from 'gulp-terser';
import { minify } from 'terser';
import cleanCss from 'gulp-clean-css';
import postcss from 'gulp-postcss';
import url from 'postcss-url';

const __dirname = import.meta.dirname;

const bundleConfig = JSON.parse(fs.readFileSync('./bundles.json', 'utf-8'));

var production = false;

var styleEntries = {};
var scriptEntries = {};

var viewScripts = globbySync(['./wwwroot/view-resources/**/*.js', '!./wwwroot/view-resources/**/*.min.js']);

var viewStyles = globbySync([
  './wwwroot/view-resources/**/*.css',
  './wwwroot/view-resources/**/*.less',
  '!./wwwroot/view-resources/**/*.min.css',
]);

function processInputDefinition(input) {
  var result = [];
  for (var i = 0; i < input.length; i++) {
    var url = input[i];
    if (url.startsWith('!')) {
      result.push('!' + path.resolve(__dirname, url.substring(1)));
    } else {
      result.push(path.resolve(__dirname, url));
    }
  }

  return result;
}

function fillScriptBundles() {
  // User defined bundles
  for (var k = 0; k < bundleConfig.scripts.length; k++) {
    var scriptBundle = bundleConfig.scripts[k];
    scriptEntries[scriptBundle.output] = globbySync(scriptBundle.input);
  }

  // View scripts
  for (var i = 0; i < viewScripts.length; i++) {
    var viewScriptName = viewScripts[i].replace('./wwwroot/', '');
    scriptEntries[viewScriptName.replace('.js', '.min.js')] = [path.resolve(__dirname, viewScripts[i])];
  }
}

function fillStyleBundles() {
  // User defined styles
  for (var k = 0; k < bundleConfig.styles.length; k++) {
    var styleBundle = bundleConfig.styles[k];
    styleEntries[styleBundle.output] = globbySync(styleBundle.input);
  }

  // View styles
  for (var j = 0; j < viewStyles.length; j++) {
    var viewStyleName = viewStyles[j].replace('./wwwroot/', '');

    if (viewStyleName.indexOf('.css') >= 0) {
      styleEntries[viewStyleName.replace('.css', '.min.css')] = [path.resolve(__dirname, 'wwwroot/' + viewStyleName)];
    }

    if (viewStyleName.indexOf('.less') >= 0) {
      styleEntries[viewStyleName.replace('.less', '.min.css')] = [path.resolve(__dirname, 'wwwroot/' + viewStyleName)];
    }
  }
}

function getFileNameFromPath(path) {
  return path.substring(path.lastIndexOf('/') + 1);
}

function getPathWithoutFileNameFromPath(path) {
  return path.substring(0, path.lastIndexOf('/'));
}

function fillScriptMappings() {
  for (var k = 0; k < bundleConfig.scriptMappings.length; k++) {
    var scriptBundle = bundleConfig.scriptMappings[k];
    var inputFilesToBeCopied = globbySync(scriptBundle.input);
    for (var j = 0; j < inputFilesToBeCopied.length; j++) {
      var outputFileName = path.join(scriptBundle.outputFolder, getFileNameFromPath(inputFilesToBeCopied[j]));
      scriptEntries[outputFileName] = [inputFilesToBeCopied[j]];
    }
  }
}

function createScriptBundles() {
  var tasks = [];
  for (var script in scriptEntries) {
    tasks.push(createScriptBundle(script));
  }

  return tasks;
}

function createScriptBundle(script) {
  var bundleName = getFileNameFromPath(script);
  var bundlePath = getPathWithoutFileNameFromPath(script);

  var stream = gulp.src(scriptEntries[script]);

  if (production) {
    stream = stream.pipe(gulpTerser({}, minify));
  }

  return stream.pipe(concat(bundleName)).pipe(gulp.dest('wwwroot/' + bundlePath));
}

function createStyleBundles() {
  var tasks = [];
  for (var style in styleEntries) {
    tasks.push(createStyleBundle(style));
  }

  return tasks;
}

function createStyleBundle(style) {
  var bundleName = getFileNameFromPath(style);
  var bundlePath = getPathWithoutFileNameFromPath(style);

  var options = {
    url: function (asset) {
      // Ignore absolute URLs
      if (asset.url.substring(0, 1) === '/') {
        return asset.url;
      }

      var outputFolder = '';

      if (asset.url.match(/\.(png|svg|jpg|gif)$/)) {
        outputFolder = 'dist/img';
      } else if (asset.url.match(/\.(woff|woff2|eot|ttf|otf)[?]{0,1}.*$/)) {
        outputFolder = 'dist/fonts';
      } else {
        // Ignore not recognized assets like data:image etc...
        return asset.url;
      }

      var fileName = asset.absolutePath.substring(asset.absolutePath.lastIndexOf(path.sep) + 1);
      var outputPath = path.join(__dirname, '/wwwroot/' + outputFolder + '/');

      gulp.src(asset.absolutePath, { encoding: false }).pipe(gulp.dest(outputPath));

      return '/' + outputFolder + '/' + fileName;
    },
  };

  var stream = gulp
    .src(styleEntries[style], { encoding: false })
    .pipe(postcss([url(options)]))
    .pipe(less());

  if (production) {
    stream = stream.pipe(cleanCss());
  }

  return stream.pipe(concat(bundleName)).pipe(gulp.dest('wwwroot/' + bundlePath));
}

function findMatchingElements(path, array) {
  var result = [];
  for (var item in array) {
    if (array[item].indexOf(path) >= 0) {
      result[item] = array[item];
    }
  }

  return result;
}

function watchScriptEntries() {
  for (var script in scriptEntries) {
    var watcher = gulp.watch(scriptEntries[script]);

    watcher.on('change', function (path, stats) {
      console.log(`${path} updated`);

      var changedBundles = findMatchingElements(path, scriptEntries);

      for (var changedBundle in changedBundles) {
        createScriptBundle(changedBundle);
      }
    });
  }
}

function watchStyleEntries() {
  for (var style in styleEntries) {
    var watcher = gulp.watch(styleEntries[style]);

    watcher.on('change', function (path, stats) {
      console.log(`${path} updated`);

      var changedBundles = findMatchingElements(path, styleEntries);

      for (var changedBundle in changedBundles) {
        createStyleBundle(changedBundle);
      }
    });
  }
}

function build() {
  production = true;

  fillScriptBundles();
  fillStyleBundles();
  fillScriptMappings();

  var scriptTasks = createScriptBundles();
  var styleTasks = createStyleBundles();

  return orderedReadStreams(scriptTasks.concat(styleTasks));
}

function buildDev() {
  fillScriptBundles();
  fillStyleBundles();
  fillScriptMappings();

  var scriptTasks = createScriptBundles();
  var styleTasks = createStyleBundles();

  watchScriptEntries();
  watchStyleEntries();

  console.log('Bundles are being created, please wait...');

  return orderedReadStreams(scriptTasks.concat(styleTasks));
}

export { build as build, buildDev as buildDev };

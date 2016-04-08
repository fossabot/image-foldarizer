/**
 * image-foldarizer
 * https://github.com/paazmaya/image-foldarizer
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (http://paazmaya.fi)
 * Licensed under the MIT license
 */

'use strict';

const fs = require('fs'),
  path = require('path');

const INDEX_NOT_FOUND = -1;

/**
 * Read a directory, by returning all files with full filepath
 * that possibly match the limitation set by initChar option
 *
 * @param {string} directory  Directory
 * @param {object} options    Options {verbose: boolean, dryRun: boolean, initChar: boolean}
 * @returns {array} List of files
 */
const getFiles = (directory, options) => {
  if (options.verbose) {
    console.log(`Reading directory ${directory}`);
  }

  const files = fs.readdirSync(directory)
    .filter((item) => {
      return options.initChar ? item.match(/^\D/) : true;
    })
    .map((item) => {
      return path.join(directory, item);
    })
    .filter((item) => {
      const stat = fs.statSync(item);

      return stat.isFile();
    });

  return files;
};

/**
 * Find candidates for grouping under directories
 *
 * @param {array} files     List of files found
 * @returns {object} Group of files with same name
 */
const getGroups = (files) => {
  // keys are the future directory names
  const groups = {};

  // Now find something similar in the file names and create directories
  files.forEach((filepath) => {
    const base = path.parse(filepath),
      nocounter = base.name.replace(/_\d+$/g, '');

    if (nocounter === base.name) {
      // Nothing was removed, hence file should be ignored
      return;
    }

    const existing = Object.keys(groups);

    if (existing.indexOf(nocounter) !== INDEX_NOT_FOUND) {
      // List exists, add to it and move to the next file
      groups[nocounter].push(filepath);
    }
    else {
      groups[nocounter] = [filepath];
    }
  });

  return groups;
};

/**
 * Check if the destination directory exists and possibly has
 * files in it.
 *
 * @param {string} targetDir Target directory to be checked or created
 * @param {object} options   Options {verbose: boolean, dryRun: boolean, initChar: boolean}
 * @returns {boolean} Go forward or not
 */
const checkDestination = (targetDir, options) => {
  if (fs.existsSync(targetDir)) {
    const stat = fs.statSync(targetDir);

    if (stat.isDirectory()) {
      // Target directory exists, allow cancelling by user
      const subfiles = fs.readdirSync(targetDir);

      if (options.verbose) {
        console.log(`Target directory exists and is a directory which has files of total ${subfiles.length}`);
      }
      if (subfiles.length > 0) {
        return false;
      }
    }
    else {
      return false;
    }
  }
  else if (!options.dryRun) {
    fs.mkdirSync(targetDir);
  }

  return true;
};

/**
 * Move files to subdirectories based on the group structure
 *
 * @param {string} directory  Root directory in which images should be
 * @param {array} groups    Groups of files found
 * @param {object} options  Options {verbose: boolean, dryRun: boolean, initChar: boolean}
 * @returns {object} Group of files with same name
 */
const handleGroups = (directory, groups, options) => {
  const keys = Object.keys(groups);

  keys.forEach((key) => {
    const targetDir = path.join(directory, key);

    if (checkDestination(targetDir, options)) {
      groups[key].forEach((filepath) => {
        const basename = path.basename(filepath),
          target = path.join(targetDir, basename);

        if (options.verbose) {
          console.log(`Moving ${filepath} --> ${target}`);
        }
        if (!options.dryRun) {
          fs.renameSync(filepath, target);
        }
      });
    }
  });
};

/**
 * @param {string} directory  Root directory in which images should be
 * @param {object} options    Options {verbose: boolean, dryRun: boolean, initChar: boolean}
 *
 * @returns {void}
 */
module.exports = (directory, options) => {
  const files = getFiles(directory, options),
    groups = getGroups(files);

  if (options.verbose) {
    console.log(`Moving under ${Object.keys(groups).length} groups`);
  }

  handleGroups(directory, groups, options);
};
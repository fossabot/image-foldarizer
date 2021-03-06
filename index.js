/**
 * image-foldarizer
 * https://github.com/paazmaya/image-foldarizer
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

'use strict';

const path = require('path');

const getFiles = require('./lib/get-files'),
  handleGroups = require('./lib/handle-groups');

const INDEX_NOT_FOUND = -1;

/**
 * Find candidates for grouping under directories
 *
 * @param {array} files     List of files found
 * @returns {object} Group of files with same name
 */
const getGroups = (files) => {
  // Keys are the future directory names
  const groups = {};

  // Now find something similar in the file names and create directories
  files.forEach((filepath) => {
    const base = path.parse(filepath),
      nocounter = base.name.replace(/_\d+$/gu, '');

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
 * @param {string} directory  Root directory in which images should be
 * @param {object} options    Options that are all boolean values and false by default
 * @param {boolean} options.verbose Print out which file is being processed
 * @param {boolean} options.dryRun  Do not touch files, just show what would happen
 * @param {boolean} options.lowercaseSuffix   Lowercase the resulting file suffix
 * @param {boolean} options.initChar Initial character in the filename needs to be a character
 *
 * @returns {void}
 */
module.exports = (directory, options) => {
  const files = getFiles(directory, options),
    groups = getGroups(files);

  if (options.verbose) {
    console.log(`Moving under ${Object.keys(groups).length} groups`);
  }

  const countFiles = handleGroups(directory, groups, options);

  if (options.verbose) {
    if (options.dryRun) {
      console.log(`Would have moved total of ${countFiles} files, but did not due to dry-run`);
    }
    else {
      console.log(`Moved total of ${countFiles} files`);
    }
  }
};

// Export methods for testing
module.exports._getGroups = getGroups;

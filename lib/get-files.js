/**
 * image-foldarizer
 * https://github.com/paazmaya/image-foldarizer
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

'use strict';

const fs = require('fs'),
  path = require('path');

/**
 * Read a directory, by returning all files with full filepath
 * that possibly match the limitation set by initChar option
 *
 * @param {string} directory  Directory
 * @param {object} options    Options that are all boolean values and false by default
 * @param {boolean} options.verbose Print out which file is being processed
 * @param {boolean} options.dryRun  Do not touch files, just show what would happen
 * @param {boolean} options.initChar Initial character in the filename needs to be a character
 *
 * @returns {array} List of files
 */
const getFiles = (directory, options) => {
  if (options.verbose) {
    console.log(`Reading directory ${directory}`);
  }

  const files = fs.readdirSync(directory)
    .filter((item) => {
      return options.initChar ?
        item.match(/^\D/u) :
        true;
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


module.exports = getFiles;

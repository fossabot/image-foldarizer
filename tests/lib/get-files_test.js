/**
 * image-foldarizer
 * https://github.com/paazmaya/image-foldarizer
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

'use strict';

const path = require('path');

const tape = require('tape'),
  getFiles = require('../../lib/get-files');

tape('getFiles with all options set to false as are defaults', (test) => {
  test.plan(1);

  const options = {
    verbose: false,
    dryRun: false,
    initChar: false
  };

  const result = getFiles(path.join(__dirname, '..', 'fixtures'), options);

  test.equal(result.length, 8);
});

tape('getFiles with only files not starting with a number', (test) => {
  test.plan(1);

  const options = {
    verbose: false,
    dryRun: false,
    initChar: true
  };

  const result = getFiles(path.join(__dirname, '..', 'fixtures'), options);

  test.equal(result.length, 7);
});

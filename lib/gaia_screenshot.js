#!/usr/bin/env node

var Path = require('path'),
    child_process = require('child_process'),
    program = require('commander'),
    gitlog = require('gitlog'),
    execSync = require('exec-sync');

var SERVER_PATH = Path.normalize(__dirname + '/server.js'),
    GAIA_PATH = execSync('pwd');

// Defile parameter and version information
program
  .version('0.0.1')
  .option('-f, --file [file]',
    'Choose specified file', null)
  .option('-m, --mode [single / diff]',
    'Test mode (General report / Diff report)', 'diff')
  .parse(process.argv);

console.log('Please commit your change' +
  'before using gaia integration test diff tool.');
console.log('Test mode: %s', program.mode);

// Init server process.
var server = child_process.fork(SERVER_PATH, [program.mode, GAIA_PATH]);

options = {
  repo: './',
  branch: program.file,
  number: 2,
  fields: ['hash', 'abbrevHash', 'subject', 'authorName', 'authorDateRel']
};

gitlog(options, function(error, commits) {

  switch (program.mode) {
    case 'diff': {
      var branch_name = execSync('git symbolic-ref -q --short HEAD');
      printComparisonInformation(commits[0], commits[1]);

      runIntegrationTest(program.file, 'First version complete...');
      runGitCheckout(commits[1].hash);

      runIntegrationTest(program.file, 'Second version complete...');
      runGitCheckout(branch_name);
      break;
    }
    case 'single': {
      printSingleInformation(commits[0]);
      runIntegrationTest(program.file, 'Report generating...');
      break;
    }
    default:
      break;
  }

  // Kill server process.
  server.kill();

  console.log('Done...');
});


// Flow helper
function printComparisonInformation(commitA, commitB) {
  console.log('----------------------------------------');
  console.log('Compare:');
  console.log(commitA);
  console.log('with previous version:');
  console.log(commitB);
  console.log('----------------------------------------');
}
function printSingleInformation(commit) {
  console.log('----------------------------------------');
  console.log('Single:');
  console.log(commit);
  console.log('----------------------------------------');
}
function runIntegrationTest(file, message) {
  try {
    var log = '';
    if (file)
      log = execSync('bin/gaia-marionette ' + file);
    else
      log = execSync('make test-integration');
    //console.log(log);
    console.log(message);
  } catch (err) {
    console.log('Running integration test failed');
  }
}
function runGitCheckout(hash) {
  try {
    execSync('git checkout ' + hash);
  } catch (err) { /* err */ }
}

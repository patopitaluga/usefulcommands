#!/usr/bin/env node

const repoName = require('git-repo-name');

console.log(123);
process.stdout.write("whuut");

repoName('../', function(err, currentRepoName) {
  console.log(currentRepoName);
});

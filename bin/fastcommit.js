#!/usr/bin/env node

const prompt = require('prompt');
const {exec} = require('child_process');
const branch = require('git-branch');
const repoName = require('git-repo-name');

let commitmessage = '';
function step1() {
  prompt.start();

  prompt.get([
    {
      name: 'commitmessage',
      description: 'Commit message (enter for .)'
    }
  ], function(err, result) {
    commitmessage = result.commitmessage;
    step2();
  });
}
function step2() {
  exec('git add .', (err, stdout, stderr) => {
    if (err) throw err;
    if (commitmessage === '') commitmessage = '.';
    console.log(stdout);
    step3();
  });
}
function step3() {
  exec('git commit -am "' + commitmessage + '"', (err, stdout, stderr) => {
    if (err) {
      if (err) {
        console.log.bind(err);
        console.log(stdout);
        return;
      }
      step4();
    } else {
      step4();
    }
  });
}
function step4() {
  branch(function(err, branchName) {
    exec('git push origin ' + branchName, (err, stdout, stderr) => {
      if (err) throw err;
      console.log(stdout);
      //step5();
    });
  });
}
/*function step5() {
  console.log('\x1b[32m', 'Create a merge request from source branch ' + branchName + ' to dev');
  console.log('\x1b[0m', '');

  repoName(function(err, currentRepoName) {
    exec('start https://bitbucket.org/ /' + currentRepoName + '/pull-requests/new', (err, stdout, stderr) => {
    if (err) throw err;
    console.log(stdout);

    exec('git checkout dev', (err, stdout, stderr) => {
      if (err) throw err;

    });
    });
  });
}*/
step1();

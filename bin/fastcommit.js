#!/usr/bin/env node

const prompt = require('prompt');
const {exec} = require('child_process');
const branch = require('git-branch');
const repoName = require('git-repo-name');

let commitmessage = '';
async () => {
  await new Promise((resolve, reject) => {
    prompt.start();
    prompt.get([{
      name: 'commitmessage',
      description: 'Commit message (enter for .)'
    }], function(err, result) {
      commitmessage = result.commitmessage;
      resolve();
    });
  });
  await new Promise((resolve, reject) => {
    exec('git add .', (err, stdout, stderr) => {
      if (err) throw err;
      if (commitmessage === '') commitmessage = '.';
      console.log(stdout);
      resolve();
    });
  });
  await new Promise((resolve, reject) => {
    exec('git commit -am "' + commitmessage + '"', (err, stdout, stderr) => {
      if (err) {
        if (err) {
          console.log.bind(err);
          console.log(stdout);
          reject();
          return;
        }
        resolve();
      } else {
        resolve();
      }
    });
  });
  await new Promise((resolve, reject) => {
    branch(function(err, branchName) {
      exec('git push origin ' + branchName, (err, stdout, stderr) => {
        if (err) {
          console.log.bind(err);
          console.log(stdout);
          reject();
          return;
        }
        console.log(stdout);
        resolve();
        return;
      });
    });
  });
  await new Promise((resolve, reject) => {
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
  });
}();

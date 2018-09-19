#!/usr/bin/env node

const prompt = require('prompt');
const {exec} = require('child_process');
const branch = require('git-branch');
const repoName = require('git-repo-name');
const gitRemoteOriginUrl = require('git-remote-origin-url');

/**
 *
 */
let fastCommit = async () => {
  let commitmessage = '';
  let branchName;
  await new Promise((resolve, reject) => {
    branch(function(err, result) {
      branchName = result;
      resolve();
    });
  });
  await new Promise((resolve, reject) => {
    prompt.start();
    prompt.get([{
      name: 'commitmessage',
      description: 'Commit message (enter for .)'
    }], function(err, result) {
      commitmessage = result.commitmessage;
      if (commitmessage === '') commitmessage = '.';
      resolve();
    });
  })
  .catch((err) => {
    console.log(err);
  });
  await new Promise((resolve, reject) => {
    let command = 'git add .';
    console.log(command);
    exec(command, (err, stdout, stderr) => {
      if (err) throw err;
      console.log(stdout);
      resolve();
    });
  })
  .catch((err) => {
    console.log(err);
  });
  await new Promise((resolve, reject) => {
    let command = 'git commit -am "' + commitmessage + '"';
    console.log(command);
    exec(command, (err, stdout, stderr) => {
      console.log(stdout);
      if (err) {
        console.log.bind(err);
        reject();
        return;
      }
      resolve();
    });
  })
  .catch((err) => {
    console.log(err);
  });
  await new Promise((resolve, reject) => {
    let command = 'git push origin ' + branchName;
    console.log(command);
    exec(command, (err, stdout, stderr) => {
      console.log(stdout); // Is empty somehow.
      console.log(stderr); // Is wehat stdout should be.
      if (err) {
        console.log.bind(err);
        reject();
        return;
      }
      resolve();
      return;
    });
  });
  await new Promise((resolve, reject) => {
    gitRemoteOriginUrl().then(url => {
      let urlpart = url.substr(url.lastIndexOf(':') + 1);
      urlpart = urlpart.replace('.git', '');
      console.log('\x1b[32m', 'Create a merge request from source branch ' + branchName + ' to main branch');
      console.log('\x1b[0m', '');

      repoName(function(err, currentRepoName) {
        exec('start https://bitbucket.org/' + urlpart + '/branch/' + branchName + '/pull-requests/new', (err, stdout, stderr) => {
          if (err) throw err;
          console.log(stdout);

          exec('git checkout dev', (err, stdout, stderr) => {
            if (err) throw err;
          });
        });
      });
    });
  });
};
fastCommit();

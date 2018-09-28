#!/usr/bin/env node

if (typeof process.argv[2] === 'undefined') throw 'Must set project name after deployhq command.';
if (typeof process.argv[3] === 'undefined') throw 'Must set branch name after project name.';

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

if (!process.env.DEPLOYHQ_URL) {
  throw 'Run setupdeployhq.';
}

const axios = require('axios');

let deployqh = async function() {
  let latest_revision = '';
  await axios.get(process.env.DEPLOYHQ_URL + '/projects/' + process.argv[2] + '/repository/latest_revision?branch=' + process.argv[3], {
    auth: {
      username: process.env.DEPLOYHQ_EMAIL,
      password: process.env.DEPLOYHQ_APIKEY
    },
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }})
    .then(function(response) {
      let responseJSON = response.data;
      if (typeof responseJSON === 'string') responseJSON = JSON.parse(responseJSON);
      latest_revision = responseJSON.ref;
    })
    .catch(function(error) {
      console.log('error');
      console.log(error);
    });

  let parent_identifier = '';
  let start_revision = '';
  await axios.get(process.env.DEPLOYHQ_URL + '/projects/' + process.argv[2] + '/deployments', {
    auth: {
      username: process.env.DEPLOYHQ_EMAIL,
      password: process.env.DEPLOYHQ_APIKEY
    },
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }})
    .then(function(response) {
      console.log('ok');
      // console.log(response.data.records[0]);
      // console.log(response.data.records[0].identifier);
      parent_identifier = response.data.records[0].servers[0].identifier;
      response.data.records.forEach((eachRecord) => {
        if (eachRecord.branch === process.argv[3] && start_revision === '') {
          start_revision = eachRecord.end_revision.ref;
        }
      })
      // console.log(response.data.records);
    })
    .catch(function(error) {
      console.log('error');
      console.log(error);
    });

  if (latest_revision !== '' && parent_identifier !== '' && start_revision !== '') {
    console.log('Initiating deploy');
    console.log(
      {
        'parent_identifier': parent_identifier,
        'start_revision': start_revision,
        'end_revision': latest_revision
      }
    );
    axios.post(process.env.DEPLOYHQ_URL + '/projects/' + process.argv[2] + '/deployments', {
        deployment: {
          'parent_identifier': parent_identifier,
          'start_revision': start_revision,
          'end_revision': latest_revision
        }
      },
      {
        auth: {
          username: process.env.DEPLOYHQ_EMAIL,
          password: process.env.DEPLOYHQ_APIKEY
        },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      .then(function(data) {
        console.log('Deploy started');
      })
      .catch(function(error) {
        console.log('error');
        console.log(error.response.data);
      });
  }
}

deployqh();

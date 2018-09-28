#!/usr/bin/env node

const path = require('path');
const envVars = require('dotenv').config({ path: path.join(__dirname, '../.env') });
const envConfig = envVars.parsed;

const fs = require('fs');
const prompt = require('prompt-sync')();

function startPromt() {
  let deployHQUrl = prompt('DeployHQ url? ');
  if (deployHQUrl === '') throw 'Must set DeployHQ url';
  if (deployHQUrl.slice(-1) === '/') deployHQUrl = deployHQUrl.substr(0, deployHQUrl.length - 1);
  let deployHQUserEmail = prompt('DeployHQ user email? ');
  if (deployHQUserEmail === '') throw 'Must set email';
  let deployHQApiKey = prompt('DeployHQ API key? (get it in your ' + deployHQUrl + '/security) ');
  if (deployHQApiKey === '') throw 'Must set api key';

  let dotEnvText = '';
  for (let eachEnvVarInDontEnv in envConfig) {
    if (eachEnvVarInDontEnv !== 'DEPLOYHQ_URL' && eachEnvVarInDontEnv !== 'DEPLOYHQ_EMAIL' && eachEnvVarInDontEnv !== 'DEPLOYHQ_APIKEY')
      dotEnvText += eachEnvVarInDontEnv + '=' + envConfig[eachEnvVarInDontEnv] + '\n';
  }
  dotEnvText += `DEPLOYHQ_URL=${deployHQUrl}
DEPLOYHQ_EMAIL=${deployHQUserEmail}
DEPLOYHQ_APIKEY=${deployHQApiKey}
`;

  fs.writeFile(path.join(__dirname, '..', '.env'), dotEnvText, function(err) {
    if (err) return console.log(err);

    console.log('Setup done. Run: "deployhq projectname branchname"');
  });
}

startPromt();

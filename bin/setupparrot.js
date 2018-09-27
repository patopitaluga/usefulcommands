#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const prompt = require('prompt-sync')();

function startPromt() {
  let NotifyParrotUrl = prompt('NotifyParrot url? ');
  if (NotifyParrotUrl === '') throw 'Must set url';
  let NotifyParrotJWK = prompt('NotifyParrot token? ');
  if (NotifyParrotJWK === '') throw 'Must set url';

  if (NotifyParrotUrl.slice(-1) === '/') NotifyParrotUrl = NotifyParrotUrl.substr(0, NotifyParrotUrl.length - 1);
  if (NotifyParrotUrl.slice(-7) === '/notify') NotifyParrotUrl = NotifyParrotUrl.substr(0, NotifyParrotUrl.length - 7);

  let doyEnvText = `PARROT_URL=${NotifyParrotUrl}
PARROT_TOKEN=${NotifyParrotJWK}
`;

  fs.writeFile(path.join(__dirname, '..', '.env'), doyEnvText, function(err) {
    if (err) return console.log(err);

    console.log('Setup done. Run: "parrot your message"');
  });
}

startPromt();

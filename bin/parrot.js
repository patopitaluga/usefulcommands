#!/usr/bin/env node

if (typeof process.argv[2] === 'undefined') throw 'Must set message';
let messageInArgs = process.argv;
messageInArgs.shift();
messageInArgs.shift();
messageInArgs = process.argv.join(' ');

const http = require('http');
const querystring = require('querystring');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

let message = messageInArgs;
let postData = querystring.stringify({
  message: message
});

let serverUrl;
if (process.env.PARROT_URL)
  serverUrl = process.env.PARROT_URL;
else
  throw 'Must setup parrot (setupparrot)';

let notifyParrotJWT;
if (process.env.PARROT_TOKEN)
  notifyParrotJWT = process.env.PARROT_TOKEN;
else
  throw 'Must setup parrot (setupparrot)';

serverUrl = serverUrl.replace('http://', '').replace('https://', '')
let serverPort = 80;
if (serverUrl.indexOf(':') > -1) {
  serverPort = serverUrl.substr(serverUrl.lastIndexOf(':') + 1);
  serverUrl = serverUrl.substr(0, serverUrl.indexOf(':'));
}

let req = http.request({
  hostname: serverUrl,
  port: serverPort,
  path: '/notify',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': postData.length,
    'Authorization': 'Bearer ' + notifyParrotJWT
  }
}, function (res) {
  console.log('NotifyParrot: ' + message);
});

req.on('error', function (e) {
});

req.write(postData);
req.end();

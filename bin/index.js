#!/usr/bin/env node

console.log(123);
process.stdout.write("whuut");

var remoteOriginUrl = require('remote-origin-url');

remoteOriginUrl('./', function(err, url) {
  if (err) return console.log(err);
  console.log(url);
  // url => "https://github.com/jonschlinkert/remote-origin-url.git"
});

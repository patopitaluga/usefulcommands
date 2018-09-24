#!/usr/bin/env node

const axios = require('axios');

console.log('Getting current value...');
axios.get('https://www.google.com.ar/search?q=1+usd+to+ars')
  .then(function(response) {
    let part = response.data.substr(response.data.indexOf(' = ') + 3);
    part = part.substr(0, part.indexOf(' '));
    console.log('1usd = $' + part + ' pesos argentinos.');
    // console.log(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });

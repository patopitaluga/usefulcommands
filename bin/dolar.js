#!/usr/bin/env node

const axios = require('axios');

console.log('Getting current value...');
axios.get('https://www.google.com.ar/search?q=1usd+to+ars&oq=1usd+to+ars&aqs=chrome..69i57.5664j0j1&sourceid=chrome&ie=UTF-8')
  .then(function (response) {
    let valDolar = response.data.substr(response.data.indexOf('<b>1 USD</b> = ') + 15);
    valDolar = valDolar.substr(0, valDolar.indexOf(' '));
    console.log('1usd = $' + valDolar + ' pesos argentinos.');
  })
  .catch(function (error) {
    console.log(error);
  });

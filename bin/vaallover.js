#!/usr/bin/env node

const axios = require('axios');

// console.log('Getting current value...');
axios.get('https://weather.com/es-AR/tiempo/hoy/l/-34.60,-58.38?par=google', { headers: {
    'Content-Type': 'text/html;charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
  }})
  .then(function (response) {
    let val = response.data.substr(response.data.indexOf('precip-val" className="precip-val"><span>') + ('precip-val" className="precip-val"><span>').length);
    val = val.substr(0, val.indexOf('<span'));
    if (Number(val) > 50)
      console.log('Sí');
    else
      console.log('No');
  })
  .catch(function (error) {
    console.log(error);
  });

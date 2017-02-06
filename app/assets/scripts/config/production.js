'use strict';
// var logo = require('./logo');
/*
 * App config for production.
 */
module.exports = {
  environment: 'production',
  API_URL: 'http://localhost:4000' || process.env.API_URL,
  mapbox: {
    token: process.env.MAPBOX_TOKEN,
    baseStyle: 'mapbox://styles/mapbox/outdoors-v10'
  }
};

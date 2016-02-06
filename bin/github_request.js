'use strict';
var req = require('request');

let fileEndpoint = `https://api.github.com/repos/
  ${process.env.GH_USERNAME}/
  ${process.env.GH_REPO}/
  ${process.env.GH_DATA_FILE}`

let options = {
  uri: fileEndpoint,
  headers: {
    'User-Agent': process.env.GH_USERNAME
  },
  body: {
    branch: 'gh-pages'
  },
  json: true,
  auth: {
    user: process.env.GH_USERNAME,
    pass: process.env.GH_SECRET
  }
}

module.exports = req.defaults(options);

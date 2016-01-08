'use strict';
var req = require('request');

module.exports = function() {
  return new Promise(function(resolve, reject){

    let fileEndpoint = `https://api.github.com/repos/${process.env.GH_USERNAME}/${process.env.GH_REPO}/contents/${process.env.GH_DATA_FILE}`

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

    req.get(options, function(err, response, body) {
      if(err) {
        reject(err)
      } else {
        resolve(response)
      }
    });
  });
}

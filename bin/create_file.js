'use strict';
var req = require('request');

module.exports = function(file) {
  return new Promise(function(resolve, reject){
    let fileEndpoint = `https://api.github.com/repos/${process.env.GH_USERNAME}/${process.env.GH_REPO}/contents/${process.env.GH_DATA_FILE}`

    let options = {
      uri: fileEndpoint,
      headers: {
        'User-Agent': process.env.GH_USERNAME
      },
      body: {
        branch: 'gh-pages',
        content: file,
        message: 'Creating campaigns.json from Mailchimp api'
      },
      json: true,
      auth: {
        user: process.env.GH_USERNAME,
        pass: process.env.GH_SECRET
      }
    }

    req.put(options, function(err, response, body) {
      if(err) {
        reject(err)
      } else {
        resolve(body)
      }
    });
  });
}
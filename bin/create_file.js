'use strict';
var baseRequest = require('./github_request');

module.exports = function(file) {
  return new Promise(function(resolve, reject){
    let options = {
      body: {
        content: file,
        message: 'Creating campaigns.json from Mailchimp api'
      }
    }

    baseRequest.put(options, function(err, response, body) {
      if(err) {
        reject(err)
      } else {
        resolve(body)
      }
    });
  });
}
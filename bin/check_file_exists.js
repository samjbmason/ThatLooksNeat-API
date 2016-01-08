'use strict';
var baseRequest = require('./github_request');

module.exports = function() {
  return new Promise(function(resolve, reject){

    baseRequest.get(null, function(err, response, body) {
      if(err) {
        reject(err)
      } else {
        resolve(response)
      }
    });

  });
}

'use strict';
var baseRequest = require('./github_request');
var moment = require('moment');

module.exports = function(newFile, currentFile) {
  return new Promise(function(resolve, reject){

    // I cant believe I have to do this Github adds new lines and this breaks comparison
    let currentFileBreaksRemoved = currentFile.content.replace(new RegExp('\n', 'g'), '')

    if(newFile != currentFileBreaksRemoved) {
      console.log("File is being updated with new info")

      let options = {
        body: {
          content: newFile,
          message: `Updating campaigns.json from Mailchimp api on ${moment().format('Do/MM/YYYY')}`,
          sha: currentFile.sha
        }
      }

      baseRequest.put(options, function(err, response, body) {
        if(err) {
          reject(err)
        } else {
          resolve(body)
        }
      });

    } else {
      console.log('Files are identical, stopping')
    } // End of if

  });
}
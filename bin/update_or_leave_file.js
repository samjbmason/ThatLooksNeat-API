'use strict';
var req = require('request');
var moment = require('moment');

module.exports = function(newFile, currentFile) {
  return new Promise(function(resolve, reject){

    // I cant believe I have to do this Github adds new lines and this breaks comparison
    let currentFileBreaksRemoved = currentFile.content.replace(new RegExp('\n', 'g'), '')

    if(newFile != currentFileBreaksRemoved) {
      console.log("File is being updated with new info")

      let fileEndpoint = `https://api.github.com/repos/${process.env.GH_USERNAME}/${process.env.GH_REPO}/contents/${process.env.GH_DATA_FILE}`;


      let options = {
        uri: fileEndpoint,
        headers: {
          'User-Agent': process.env.GH_USERNAME
        },
        body: {
          branch: 'gh-pages',
          content: newFile,
          message: `Updating campaigns.json from Mailchimp api on ${moment().format('Do/MM/YYYY')}`,
          sha: currentFile.sha
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

    } else {
      console.log('Files are identical, stopping')
    } // End of if

  });
}
'use strict';
require('dotenv').load({silent: true});
var getCampaigns = require('./get_campaigns');
var fileExists = require('./check_file_exists');
var createFile = require('./create_file');
var updateOrLeave = require('./update_or_leave_file');


function encodeTo64(json) {
  let jsonString = JSON.stringify(json, null, 4)
  return new Buffer(jsonString).toString('base64')
}

Promise.all([getCampaigns(), fileExists()])
  .then(function(responseArray){
    let campaigns = responseArray[0];
    let fromGithub = responseArray[1];
    let newFileHash = encodeTo64(campaigns);
    let currentFileResponse = fromGithub.body;


    if(fromGithub.statusCode != 200) {
      console.log("File doesn't exist, creating now")
      createFile(newFileHash)
    } else {
      console.log("File exists, checking if an update is needed")
      updateOrLeave(newFileHash, currentFileResponse)
    }

  }, function(reason) {
    console.log(reason)
  });
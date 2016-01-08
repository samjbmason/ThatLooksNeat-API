'use strict';
var req = require('request');

module.exports = function() {
  return new Promise(function(resolve, reject){

    let campaignEndpoint = `https://${process.env.MC_DC}.api.mailchimp.com/3.0/campaigns`

    let options = {
      url: campaignEndpoint,
      qs: {
        type: 'regular',
        status: 'sent',
        fields: 'campaigns.archive_url,campaigns.send_time',
        count: 2000
      },
      json: true,
      auth: {
        user: 'anything',
        pass: process.env.MC_API_KEY
      }
    }

    req.get(options, function(err, response, body) {
      if(err) {
        reject(err)
      } else {
        resolve(body)
      }
    });
  });
}

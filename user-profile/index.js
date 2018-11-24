/**
 * Created by Peter Sbarski
 * Serverless Architectures on AWS
 * http://book.acloud.guru/
 * Last Updated: Feb 11, 2017
 */

'use strict';

var jwt = require('jsonwebtoken');
var request = require('request');

exports.handler = function (event, context, callback) {
  if (!event.authToken) {
    callback('Could not find authToken');
    return;
  }

  if (!event.accessToken) {
    callback('Could not find accessToken');
  }

  var token = event.authToken.split(' ')[1];

  var secretBuffer = new Buffer(process.env.AUTH0_SECRET);
  jwt.verify(token, secretBuffer, function (err, decoded) {
    if (err) {
      console.log('Failed jwt verification: ', err, 'auth: ', event.authToken);
      callback('Authorization Failed');
    } else {

      var options = {
        url: 'https://' + process.env.DOMAIN + '/userinfo',
        method: 'GET',
        headers: {
          'Authorization': event.accessToken,
        },
      };

      request(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          callback(null, body);
        } else {
          callback(error);
        }
      });
    }
  })
};

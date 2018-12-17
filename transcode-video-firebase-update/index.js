/**
 * Created by Peter Sbarski
 * Serverless Architectures on AWS
 * http://book.acloud.guru/
 * Last Updated: Feb 12, 2017
 */

'use strict';

var admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(process.env.SERVICE_ACCOUNT),
  databaseURL: process.env.DATABASE_URL
});

exports.handler = function(event, context, callback){
  context.callbackWaitsForEmptyEventLoop = false;

  var message = JSON.parse(event.Records[0].Sns.Message);

  var key = message.Records[0].s3.object.key;
  var bucket = message.Records[0].s3.bucket.name;

  var sourceKey = decodeURIComponent(key.replace(/\+/g, ' '));

  var uniqueVideoKey = sourceKey.split('/')[0];

  var database = admin.database().ref();

  database.child('videos').child(uniqueVideoKey).set({
    transcoding: false,
    key: key,
    bucket: process.env.S3
  }).then(function () {
    console.log('Video record saved to firebase');
    callback(null, 'Video record saved to firebase');
  }).catch(function(err) {
    callback(err);
  });
};

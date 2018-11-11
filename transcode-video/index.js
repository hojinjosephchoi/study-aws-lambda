/**
 * Created by Peter Sbarski
 * Serverless Architectures on AWS
 * http://book.acloud.guru/
 * Last Updated: Feb 11, 2017
 */

'use strict';
var AWS = require('aws-sdk');
var s3 = new AWS.S3({
  region: 'ap-northeast-1',
});

var elasticTranscoder = new AWS.ElasticTranscoder({
  region: 'ap-northeast-1'
});

exports.handler = function (event, context, callback) {
  console.log('Welcome');

  var key = event.Records[0].s3.object.key;

  //the input file may have spaces so replace them with '+'
  var sourceKey = decodeURIComponent(key.replace(/\+/g, ' '));

  //remove the extension
  const lastInx = sourceKey.lastIndexOf('.');
  let outputKey = '';
  let extension = '';
  if (lastInx >= 0) {
    outputKey = sourceKey.substring(0, lastInx);
    extension = sourceKey.substring(lastInx + 1);
  }

  if (extension !== 'avi' && extension !== 'mp4' && extension !== 'mov') {
    console.log('delete unsupported extension file');
    var params = { Bucket: 'serverless-video-upload-hojin', Key: sourceKey };
    s3.deleteObject(params, function (error, data) {
      if (error) {
        callback(error);
      }
    });
  } else {
    console.log('start transcoding file');
    var params = {
      PipelineId: '1541906639483-s56cjr',
      Input: {
        Key: sourceKey
      },
      Outputs: [
        {
          Key: outputKey + '-1080p' + '.mp4',
          PresetId: '1351620000001-000001' //Generic 1080p
        },
        {
          Key: outputKey + '-720p' + '.mp4',
          PresetId: '1351620000001-000010' //Generic 720p
        },
        {
          Key: outputKey + '-web-720p' + '.mp4',
          PresetId: '1351620000001-100070' //Web Friendly 720p
        }
      ]
    };

    elasticTranscoder.createJob(params, function (error, data) {
      if (error) {
        callback(error);
      }
    });
  }
};

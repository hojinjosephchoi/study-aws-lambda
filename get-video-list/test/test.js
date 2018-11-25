/**
 * Created by Peter Sbarski
 * Serverless Architectures on AWS
 * http://book.acloud.guru/
 * Last Updated: Feb 12, 2017
 */

const chai = require('chai');
const sinon = require('sinon');
const rewire = require('rewire');
const expect = chai.expect;
const assert = chai.assert;

const sampleData = {
  Contents: [
    {
      Key: 'file1.mp4',
      bucket: 'my-bucket'
    },
    {
      Key: 'file2.mp4',
      bucket: 'my-bucket'
    }
  ]
};

describe('LambdaFunction', () => {
  let listObjectsStub, callbackSpy, module;

  describe('#execute', () => {
    before((done) => {
      listObjectsStub = sinon.stub().yields(null, sampleData);
      callbackSpy = sinon.spy();

      const callback = function (error, result) {
        callbackSpy.apply(null, arguments);
        done();
      }

      module = getModule(listObjectsStub);
      module.handler(null, null, callback);
    });

    it('should run our function once', () => {
      expect(callbackSpy.callCount).to.eql(1);
    });

    it('should have correct results', () => {
      const result = {
        "baseUrl": "https://s3.amazonaws.com",
        "bucket": "serverless-video-transcoded-hojin",
        "urls": [
          {
            "Key": sampleData.Contents[0].Key,
            "bucket": "my-bucket"
          },
          {
            "Key": sampleData.Contents[1].Key,
            "bucket": "my-bucket"
          }
        ]
      }

      assert.deepEqual(callbackSpy.args, [[null, result]]);
    });
  })
})

function getModule(listObjects) {
  const rewired = rewire('../index.js');

  rewired.__set__({
    's3': { listObjects: listObjects }
  });

  return rewired;
}


var targz = require('../');
var fs = require('fs');
var expect = require('chai').expect;
var temp = require('temp');
var utils = require('./fixtures/utils.js');
var dir = temp.mkdirSync();

describe('General compression test', function() {
  describe('Streaming interface testing', function() {
    it('Should compress without errors', function(done) {
      var read = targz().createReadStream(__dirname + '/fixtures/uncompressed');
      var write = fs.createWriteStream(dir + '/compressed.tar.gz');

      write.on('finish', function() {
        done();
      });

      read.pipe(write);
    });

    it('Should decompress without errors', function(done) {
      var read = fs.createReadStream(dir + '/compressed.tar.gz');
      var write = targz().createWriteStream(dir);

      write.on('close', function() {
        setTimeout(function() {
          expect(utils.equalFiles(
            __dirname + '/fixtures/uncompressed/lorem.txt',
            dir + '/uncompressed/lorem.txt')).to.be.equal(true);
          done();
        }, 100);
      });

      read.pipe(write);
    });
  });
});

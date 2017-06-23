const fs = require('fs');
const { Transform,Writable } = require("stream");
const { nodeParser } = require('./parser');
const saxstream = require('./sax-stream');
function streams(config){
  let dbcon = config.dbcon;

  const transformStream = new Transform({
    objectMode:true,
    transform(node,encoding,done){
      let newnode = nodeParser.createNode(node);
      this.push(newnode);
      done();
    }
  });

  class BatchStream extends Transform{
    constructor(...args){
      super(...args);
      this.batchBuffer = [];
      this.batchSize = config.batchSize;
    }
    _transform(node,encoding,done){
      this.batchBuffer.push(node);
      if(this.batchBuffer.length >= this.batchSize){
        this.push(this.batchBuffer);
        this.batchBuffer=[];
      }
      done();
    }
    _flush(done){
      if(this.batchBuffer.length){
        this.push(this.batchBuffer);
        this.batchBuffer=[];
      }
      done();
    }
  }

  const batchStream = new BatchStream({
    objectMode:true,
  });

  const groupStream = new Transform({
      objectMode:true,
      transform(batch,encoding,done){
        let grouped = {};
        batch.forEach(function(node){
          grouped[node.nodetype] = (grouped[node.nodetype] || [])
          grouped[node.nodetype].push(node);
        });
        this.push(grouped);
        done();
      }
  });

  const progressStream = new Transform({
    objectMode:true,
    transform(node,encoding,done){
      this.push('.');
      done();
    }
  });

  const dbStream = new Writable({
    objectMode:true,
    write(groupnodes,encoding,callback){
      let promises = [];
      for(let dbname in groupnodes){
        promises.push(dbcon.writeToMongo(dbname,groupnodes[dbname])); 
      }
      Promise.all(promises)
      .then(function(res){
        //debug(res);
        callback(null,res);
      })
      .catch(function(err){
        console.log(err);
        callback();
      });
    },
  });

  const saxStream = saxstream({
    strict:true,
    tag:['node','way','relation'],
    //highWaterMark:2
  });
  const inputStream = fs.createReadStream(
      config.inputfile,{
        //highWaterMark:10
      }
  );
  return {
    inputStream,
    saxStream,
    dbStream,
    progressStream,
    groupStream,
    batchStream,
    transformStream
  }
}
module.exports = function(config){
  return streams(config);
}

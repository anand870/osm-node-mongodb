"use strict";
const filename='./input/sample-100.osm';
const batchSize = 1000;
const connectionstr = 'mongodb://localhost:27017/testdb';

const { db } = require('./db');

const dbConfig={
  connectionstr
}
const dbcon = db(dbConfig)

const streamConfig = {
  dbcon,
  batchSize,
  inputfile:filename
}

const {
  inputStream,
  batchStream,
  transformStream,
  groupStream,
  dbStream,
  saxStream,
  progressStream
} = require('./streams')(streamConfig)

function parse(dbcon){
  batchStream.pipe(progressStream).pipe(process.stdout);
  return inputStream
    .pipe(saxStream)
    .pipe(transformStream)
    .pipe(batchStream)
    .pipe(groupStream)
    .pipe(dbStream)
}

dbcon.clearDB()
.then(()=>{
  console.log("parsing started\n");
  let stream = parse();
  stream
    .on('finish',function(){
      dbcon.close();
      for(let dbname in dbcon.counter){
        console.log(`\ninserted ${dbcon.counter[dbname]} in ${dbname}`);
      }
    })
    .on('error',function(err){
      console.log(err)
    });
})
.catch(function(err){
  console.error(err);
  dbcon.close();
});

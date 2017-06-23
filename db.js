const MongoClient = require("mongodb").MongoClient;
class DB{
  constructor(config){
    this.url = config.connectionstr || '';
    this.getConnection();
    this.initializeCounter();
  }
  _createConnection(){
    return new Promise((resolve,reject)=>{
      MongoClient.connect(this.url,function(err,db){
        if(err){
          reject(err);
          return;
        }
        resolve(db);
      });
    });
  }
  getConnection(){
    if(!this.db){
      this.db=this._createConnection()
      .catch((err)=>{
        console.log("error creating connection:Err=>",err);
      });
    }
    return this.db;
  }
  initializeCounter(){
    this.counter={
      node:0,
      way:0,
      relation:0
    };
  }
  writeToMongo(dbname,data){
    this.counter[dbname] += data.length;
    return this.getConnection().then((db)=>{
      return db.collection(dbname).insertMany(data);
    })
  }
  clearDB(){
    return this.getConnection().then((db)=>{
      return Promise.all([
        db.collection('node').drop(),
        db.collection('way').drop(),
        db.collection('relation').drop()
      ]);
    })
    .catch(()=>{
    
    });
  }
  close(){
    if(this.db){
      this.db.then((db)=>{
        console.log("closing connection");
        this.db=null;
        db.close();
      });
    }
  }
}
exports.db = function(config){
  return new DB(config);
}

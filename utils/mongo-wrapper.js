const MongoClient = require('mongodb');
const ObjectID = require('mongodb').ObjectID;

module.exports =  class MongoClientConnection{


     db_name = 'test-assessment';
     users_db_name = 'users';
     users_collection = null;

     constructor() {
    }
    
     connect(mongo_url){
        console.log("Connecting to Databse ... ", mongo_url);
        return new Promise((resolve, reject) => {
            MongoClient.connect(mongo_url, { useUnifiedTopology: true }, async (
                err,
                client
            ) => {
                // throw error
                if (err) { reject(err); throw err; };

                // log connected
                console.log('connecting...');
                this.users_collection = await client.db(this.db_name).collection(this.users_db_name);

                resolve(true)
            });
        });


     }
}
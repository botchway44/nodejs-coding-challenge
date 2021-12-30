const MongoClient = require('mongodb');

module.exports =  class MongoClientConnection{

     saltRounds = 10;

     db_name = 'test-assessment';
     users_db_name = 'users';
     users_collection = null;

     constructor() {
    }
    
     connect(mongo_url){
        console.log("Connecting to Databse ... ");
        return new Promise((resolve, reject) => {
            MongoClient.connect(mongo_url, async (
                err,
                client
            ) => {
                // throw error
                if (err) { reject(err); throw err; };

                // log connected
                console.log('connected to database');
                this.users_collection = await client.db(this.db_name).collection(this.users_db_name);

                resolve(true)
            });
        });
     }


    async addUser(email, password, name) {
        const user = {
            email: email,
            password: password,
            name: name
        };
        return await this.users_collection?.insertOne(user);
    }

    async findEmail(email) {
        return await this.users_collection?.findOne({email : email});
    }

    async findUser(email) {
        return await this.users_collection?.findOne({email : email}) ;
    }


}
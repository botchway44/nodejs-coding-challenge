
const MongoClientConnection  = require('./src/utils/mongo-wrapper.js');
const  makeApp  = require('./app.js');
require("dotenv").config();


const PORT = process.env.port || 8000;
let mongoClient = new MongoClientConnection();

mongoClient.connect(process.env.MONGODB_URL).then(() => {
    const app = makeApp(mongoClient);

    app.listen(PORT, ()=>{
        console.log("Listening on port ", PORT)
    });
}).catch(err => {
    throw err;
});


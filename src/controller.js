
module.exports =  class RouteController{

    mongoClient = null;
    constructor(client) {
        this.mongoClient = client;
        console.log(this.mongoClient);
    }

    registerUser = async (req, res)  => {
            const { email, password, name } = req.body;
            if (!email || !password || !name) {
                res.status(400).send({
                    error: 'Bad request'
                });
                return;
            }
                
            //verify if user already exists
            const user = await this.mongoClient.findEmail(email);
        
            // Create User and append to the users table
            // User created successfully, generate token
            if(!user){
                const saltPassword = await PasswordUtils.saltPassword(password);
                const new_user = await this.mongoClient.addUser(email, saltPassword, name);
        
                if(new_user){
                // Generate an access token
                const accessToken = jwt.sign({ name: name,  email: email }, accessTokenSecret);
        
                res.status(201).send({
                    token: accessToken
                });
                }else{
                    res.status(400).send('Failed creating user');
                }
            } 
            else {
                res.status(400).send('Email already exists');
            }
        
        }


}

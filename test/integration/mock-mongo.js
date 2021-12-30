module.exports =  class MockMongoClientConnection{

    users = [];
 
    constructor() {
    }
    
    async addUser(email, password, name) {
        const user = {
            email: email,
            password: password,
            name: name
        };
        this.users.push(user);
        return  user;
    }

    async findUser(email) {
        return this.users.find((user) => user.email === email);
    }

    async findEmail(email) {
        return this.users.find((user) => user.email === email);
    }
}
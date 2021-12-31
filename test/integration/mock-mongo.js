module.exports =  class MockMongoClientConnection{

    users = [];
    session = [];

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

    async addSession(email, token) {
        const data = {
            email: email,
            token: token,
        };
        return await this.session.push(data);
    }

    async findSession(email, token) {
        return this.session.find((data) => (data.email === email && data.token === token));
    }

    async removeToken(email, token) {
        // find token
        const index = this.session.findIndex((data) => (data.email === email && data.token === token));
        // remove token
        this.session.splice(index, 1);
    }
}
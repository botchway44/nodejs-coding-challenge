'use strict';

const express = require('express');
const app = express();
const path = require("path");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const MongoClientConnection  = require('./utils/mongo-wrapper.js');
require("dotenv").config();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "./public")));

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};


/**
 * email
 * password
 * name => res => 201
 */
app.post('/api/register', async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
        res.status(400).send({
            error: 'Bad request'
        });
        return;
    }

    // Filter user from the users array by username and password
    // const user = users.find(u => { return u.username === username && u.password === password });

    if (true) {
        // Generate an access token
        const accessToken = jwt.sign({ name: name,  email: email }, accessTokenSecret);

        res.status(201).send({
            token: accessToken
        });
    } 
    // else {
    //     res.send('Username or password incorrect');
    // }

    res.status(201).send({
        token: 'token'
    });
});


/**
 * email
 * passowrd
 */
app.post('/api/login', async (req, res) => {

});

const PORT = process.env.port || 8000;
let mongoClient = new MongoClientConnection();
const accessTokenSecret = 'youraccesstokensecret';
mongoClient.connect(process.env.MONGODB_URL).then(() => {
    app.listen(PORT, ()=>{
        console.log("Listening on port ", PORT)
    })
});


module.exports = app;

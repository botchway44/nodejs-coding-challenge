'use strict';

const express = require('express');
const path = require("path");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const PasswordUtils  = require('./src/utils/password.js');
const JWTUtils  = require('./src/utils/jwt.js');
require("dotenv").config();



module.exports =  function (mongoClient) {
    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(express.static(path.join(__dirname, "./public")));
    const accessTokenSecret = process.env.JWT_SECRET;
    

    /**Register a new User */
    app.post('/api/register', async (req, res) => {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            res.status(400).send({
                error: 'Bad request'
            });
            return;
        }


        //verify if user already exists
        const user = await mongoClient.findEmail(email);


        // User created successfully, generate token
        if(!user){
            const saltPassword = await PasswordUtils.saltPassword(password);
            
            // Create User and append to the users table
            const new_user = await mongoClient.addUser(email, saltPassword, name);

            if(new_user){
            // Generate an access token
            const accessToken = JWTUtils.JWTSign(email, name, accessTokenSecret);
            
            res.status(201).send({
                token: accessToken
            });
            }else res.status(400).send('Failed creating user');
            
        }else  res.status(400).send('Email already exists');
        

    });


    /**Login a user */
    app.post('/api/login', async (req, res) => {

        const { email, password } = req.body;

        if (!email || !password ) {
            res.status(400).send({
                error: 'Bad request'
            });
            return;
        }

        const user = await mongoClient.findUser(email);
        if (user && PasswordUtils.comparePassword(password ,user.password)) {
            // Generate an access token
            const accessToken = JWTUtils.JWTSign(user.email, user.name, accessTokenSecret);

            res.status(200).send({
                token: accessToken
            });
        }else res.status(400).send({error : "User not found"});
        

    });


    /**Get user profile */
    app.get('/api/profile', JWTUtils.authenticateJWT, async (req, res) => {

        const {email} = req.user;
        const user = await mongoClient.findEmail(email);
        if(user) res.status(200).send({email : email, name : user.name});

        else res.status(400).send({error : "User not found"});
    });

    return app
}



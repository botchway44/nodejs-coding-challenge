'use strict';

const express = require('express');
const path = require("path");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const PasswordUtils  = require('./src/utils/password.js');
const JWTUtils  = require('./src/utils/jwt.js');
var Validator = require("email-validator");

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

        if (!Validator.validate(email)) {
            res.status(400).send({
                error: 'Invalid email'
            });
            return;
        }

        //verify if user already exists
        const user = await mongoClient.findUser(email);


        // User created successfully, generate token
        if(!user){
            const saltPassword = await PasswordUtils.saltPassword(password);
            
            // Create User and append to the users table
            const new_user = await mongoClient.addUser(email, saltPassword, name);

            if(new_user){
            // Generate an access token
            const accessToken = JWTUtils.JWTSign(email, name, accessTokenSecret);
            
             // Add session to login_data table
             await mongoClient.addSession(email, accessToken);

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
            
            // Add session to login_data table
            await mongoClient.addSession(user.email, accessToken);

            res.status(200).send({
                token: accessToken
            });
        }else res.status(400).send({error : "User not found"});
        

    });


    /**Get user profile */
    app.get('/api/profile', JWTUtils.authenticateJWT, async (req, res) => {

        const {email,token} = req.user;

        const user = await mongoClient.findSession(email,token);
        //if a user is found in the sessions lit then the 
        if(user){ 
            const temp = await mongoClient.findUser(email);
            res.status(200).send({email : email, name : temp.name});
         }
        else res.status(400).send({error : "User not found or logged in"});
    });

    /**Get user profile */
    app.get('/api/logout', JWTUtils.authenticateJWT, async (req, res) => {
        
        const {email,token} = req.user;

        const user = await mongoClient.findSession(email, token);
        if(user) {
            await mongoClient.removeToken(email, token);
            res.status(200).send("Logout Successful");
        }

        else res.status(400).send({error : "User not found or logged in"});
    });

    return app
}



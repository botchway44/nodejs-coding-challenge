'use strict';

const express = require('express');
const app = express();
const path = require("path");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "./public")));


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
app.listen(PORT, ()=>{
    console.log("Listening on port ")
})

module.exports = app;

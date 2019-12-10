const express       = require('express');
const consign       = require('consign');
const bodyParser    = require('body-parser');
const path          = require('path');

//Set app
const app = express();

//Require .env and the database
require('dotenv').config();
require('./config/database');

//Middlware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//Autoload scripts
consign({cwd: 'src'})
    .include('Models')
    .include('Controllers')
    .then('Routes')
    .into(app);


//Set port
const port = process.env.PORT || 4000;

//Start application
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})

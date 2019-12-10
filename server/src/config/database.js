const mongoose = require('mongoose');
require('dotenv').config();

mongoose.Promisse = global.Promisse;

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('Connected to Server!')
})

mongoose.connection.on('error', err => {
    console.log(err)
})


mongoose.connection.on('disconnected', () => {
    console.log('Disconnected to Server!')
})

const express = require('express');
const { connect } = require('mongoose');

require('dotenv').config();

const app = express();

connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to Server successfully!'))

app.get('/', (req, res) => {
    res.json({ 
        ok: true
    });
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

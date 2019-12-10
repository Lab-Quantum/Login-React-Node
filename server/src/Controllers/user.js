const moongose = require('mongoose');
const modelUser = mongoose.model('User');

let userController = {};

userController.allUsers = (req, res) => {
    modelUser.find()
        .then(results => res.json(results))
        .catch(err => res.send(err))
}

userController.newUser = (req, res) => {
    let username    = req.body.username;
    let password    = req.body.password;
    let repeatPass  = req.body.repeatPass;

    if(!username || !password || !repeatPass) {
        return res.status(400).json({
            error: 'All fields are required'
        })
    }

    if(password !== repeatPass) {
        return res.status(400).json({
            error: 'The passwords does not match'
        })
    }

}

module.exports = userController;

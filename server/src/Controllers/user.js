const bcrypt    = require('bcrypt');
const mongoose  = require('mongoose');
const modelUser = mongoose.model('User');

let userController = {};

userController.allUsers = (req, res) => {
    modelUser.find()
        .then(results => res.json(results))
        .catch(err => res.send(err))
}

userController.newUser = (req, res) => {
    let username    = req.body.username;
    let email       = req.body.email;
    let password    = req.body.password;
    let repeatPass  = req.body.repeatPass;

    if(!username || !password || !repeatPass) {
        return res.status(400).json({
            success: false,
            error: 'All fields are required'
        })
    }

    if(password !== repeatPass) {
        return res.status(400).json({
            success: false,
            error: 'The passwords does not match'
        })
    }

    modelUser.findOne({$or: [ {username}, {email} ]})
    .then(user => {
        if(user) {
            if(user.username === username) {
                return res.status(400).json({
                    success: false,
                    error: 'This username is not available'
                })
            } else if(user.email === email) {
                return res.status(400).json({
                    success: false,
                    error: 'This email is not available'
                }) 
            }  
        } else {
            bcrypt.hash(password, 10, function(err, hash) {
                let newUser = new modelUser({
                    username: username,
                    password: hash,
                    email: email
                })

                newUser.save((err, user) => {
                    if(err) {
                        return res.status(400).json({
                            success: false,
                            error: err
                        })
                    }
                    user.password = undefined;
                    
                    return res.status(200).json({
                        success: true,
                        user: user
                    })
                })
            });
        }
    })
}

module.exports = userController;

const bcrypt    = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose  = require('mongoose');
const modelUser = mongoose.model('User');

let userController = {};

userController.allUsers = (req, res) => {
    modelUser.find()
        .then(results => res.json(results))
        .catch(err => res.send(err))

    modelUser.find({}, 'username email _id admin', function(err, results){
        if(err) {
            return res.status(400).json({
                success: false,
                error: err
            })
        } else {
            return res.status(200).json({
                success: true,
                users: results
            })
        }
    });
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

userController.login = (req, res) => {
    let username    = req.body.username;
    let password    = req.body.password;

    if(!username || !password) {
        return res.status(400).json({
            success: false,
            error: 'All fields are required'
        })
    }

    modelUser.findOne({username})
        .then(user => {
            if(!user) {
                return res.status(400).json({
                    success: false,
                    error: 'No user found'
                })
            }

            bcrypt.compare(password, user.password, function(err, hash) {
                if(err || !hash) {
                    return res.status(400).json({
                        success: false,
                        error: 'Password and user does not match'
                    })
                } else {
                    user.password = undefined;
                    const token = jwt.sign({ id: user._id }, process.env.SECRET);
                    res.cookie('token', token, {expire: new Date() + process.env.TOKENTIME});

                    return res.status(200).json({
                        success: true,
                        token,
                        user
                    })
                }
                
            });
        })
}

userController.userById = (req, res, next, id) => {
    modelUser.findById(id, function(err, user) {
        if(err || !user) {
            return res.status(400).json({
                success: false,
                error: "User not found"
            })
        }

        req.user = user;
        next();
    });
}

userController.updateUser = (req, res) => {
    return res.status(200).json(req.user);
}

module.exports = userController;

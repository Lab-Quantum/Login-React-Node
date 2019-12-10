const userController = require('../Controllers/user');

module.exports = (app) =>   {
    app.route('/users')
        .get(userController.allUsers)
        .post(userController.newUser)
    
    app.route('/user/login')
        .post(userController.login)

    app.route('/user/update/:userId')
        .put(userController.updateUser)

    app.param('userId', userController.userById);
}
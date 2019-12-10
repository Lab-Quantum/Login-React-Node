const userController = require('../Controllers/user');

module.exports = (app) =>   {
    app.route('/users')
        .get(userController.allUsers)
        .post(userController.newUser)
}
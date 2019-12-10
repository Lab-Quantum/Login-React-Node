require('dotenv').config();

jwtConfig ={
    'secret': process.env.SECRET
}

module.exports = jwtConfig;

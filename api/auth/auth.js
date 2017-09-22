const bcrypt = require('bcryptjs');

var {User} = require('./../../models/user.js');

var authenticate = (req, res, next) => {
    //var token = req.header('x-auth');
    var token = req.body.apiKey;
    User.findByToken(token).then((user)=>{
        if(!user){
            return Promise.reject();
        }
        req.user = user;
        req.token = token;
        next();
    }).catch((e)=>{
        res.status(401).send({code:0, message:'unauthorized'});
    });
}

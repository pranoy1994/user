const express = require('express');
const bcrypt = require('bcryptjs');

const {User} = require('./../models/user.js');
const {authenticate} = require('./auth/auth.js'); //to make private route put this middleware

const router = express.Router();

router.post('/login', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    User.findOne({username}).then((user) => {
      if(!user) {
        res.send({code: 0, message: "invalid username"});
      }else{
        bcrypt.compare(password, user.password, (err, result) => {
          if(result){
            user.generateAuthToken().then((token) => {
              res.send({code: 1, message: "You have successfully logged in", apiKey: token});
            });
          }else {
            res.send({code: 0, message: "invalid password"});
          }
        });
      }
    }).catch((err) => {
      console.log(err);
      res.send({code: 0, message:"error"});
    });
});

router.post('/add-account', (req, res) => {
  var username = req.body.username;
  var password = req.body.password;

  var newUser = new User({username, password});
  newUser.save().then((user) => {
    res.send({code: 1, message: "account created, now login !"});
  }).catch((err) => {
    if(err.code){
    if(err.code = 11000){
      res.send({code: 0, message: "username already exist"});
    }
  }

  if(err.errors){
    if(err.errors.username){
      res.send({code:0, message: err.errors.username.message});
    } else if(err.errors.password) {
      res.send({code: 0, message: err.errors.password.message});
    }
  }
  });
});

module.exports = router;

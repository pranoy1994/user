const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true,
        unique: true
    },
    password: {
      type: String,
      required: true,
    },
    tokens:[{
        access :{
            type:String,
            required:true
        },
        token:{
            type:String,
            required:true
        }
    }]
});

// UserSchema.methods.toJSON = function(){
//     var user = this;
//     var userObject = user.toObject();
//
//     return _.pick(userObject, ['_id','image', 'name', 'email', 'phone','city', 'favSubCategoryId']);
// }
UserSchema.methods.generateAuthToken = function(){
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access},'pro123pro').toString();
    user.tokens.push({access, token});
    return user.save().then(() => {
        return token;
    });
}

UserSchema.statics.findByToken = function (token){
    var User = this;
    var decoded;
    try{
        decoded = jwt.verify(token, 'pro123pro');
    } catch(e) {
        return Promise.reject();
    }
    return User.findOne({
        '_id': decoded._id,
        'tokens.token':token,
        'tokens.access':'auth'
    });
}

UserSchema.pre('save', function(next){
    var user = this;
    if(user.isModified('password')){
        bcrypt.genSalt(5, (err, salt)=>{
            bcrypt.hash(user.password, salt, (err, hash)=>{
                user.password = hash;
                next();
            })
        });
    }else{
        next();
    }
});

var User = mongoose.model('Users', UserSchema);

module.exports = {User}

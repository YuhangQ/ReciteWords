const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Account = require('./../models/account');
const config = require('./config');
const crypto = require('crypto');

module.exports.serializeUser = function (user, done) {
    done(null, user.id);
};

module.exports.deserializeUser = function (id, done) {
    Account.findById(id, function (err, user) {
        done(err, user);
    });
};

function encrypt(password) {
    for(let i=1; i<=500; i++) {
        let md5 = crypto.createHash('md5');
        md5.update(password + config.PASSWORD_SALT);
        password = md5.digest('hex');
    }
    return password;
}

module.exports.LocalStrategy = new LocalStrategy(
    function (username, password, done) {
        Account.findOne({ username: username }, function (err, user) {
            if (err) {return done(err);}
            if (!user) {return done(null, false, { message: "用户名或密码错误"});}
            if (user.password != encrypt(password)) {
                return done(null, false, { message: "用户名或密码错误" });
            }
            return done(null, user);
        });
    }
);
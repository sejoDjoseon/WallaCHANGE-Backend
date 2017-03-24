var mongoose = require("mongoose")
var usuari = mongoose.model('usuari')
'use strict'
var crypto = require('crypto')

var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
        .toString('hex')
        .slice(0,length);
};

var sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

function saltHashPassword(userpassword) {
    var salt = genRandomString(16);
    var passwordData = sha512(userpassword, salt);
    return {
        salt: salt,
        passwordData: passwordData.passwordHash
    }
}

exports.createUser = function (req) {
    var pwdHash = saltHashPassword(req.body.password)
    var user = new usuari({
        nom: req.body.nom,
        nom_user: req.body.nom_user,
        password_hash: pwdHash.passwordData.toString(),
        salt: pwdHash.salt.toString(),
        path: req.body.path,
        localitat: req.body.localitat,
        preferencies: req.body.preferencies,
        productes: req.body.productes,
        intercanvis: req.body.intercanvis,
        reputacio: req.body.reputacio
    })
    return user;
}

exports.saveUser = function (user, res) {
    user.save(function (err, user) {
        if (err) return res.status(500).send(err.message)
        res.status(200).json(user)
    })
}

exports.deleteUser = function (req, res) {
    usuari.findOne({nom_user: req.params.nom_user}, function(err, user) {
        user.remove(function (err) {
            if (err) return res.status(500).send(err.message)
            res.status(200).send()
        })
    })
}

exports.login = function (password, salt) {
    return sha512(password, salt)
}
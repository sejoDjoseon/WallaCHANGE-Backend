var authSvc = require('../services/authSvc')

exports.login = function (req, res) {
    authSvc.login(req, res)
}

exports.checkToken = function (req, res, next) {
    authSvc.checkToken(req, res, next)
}
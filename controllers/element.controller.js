/**
 * Created by annamasc on 24/03/2017.
 */

/*var mongoose = require('mongoose');
var element = mongoose.model('element');
'use strict'*/

var elementSvc = require('../services/element.service');

exports.addElement = function (req, res) {
    var element = elementSvc.createElement(req);
    var stat = elementSvc.saveElement(element, function (err, nErr) {
        if (err) {
            console.log("no s'ha guardat l'element");
            res.status(500).send(err.message);
        }
        else res.status(200).json(element);
    });
}

exports.deleteElement = function (req, res) {
    elementSvc.deleteElement(req, res);

}

exports.updateElement = function (req, res) {
    elementSvc.updateElement(req, res);
}

exports.getOneElement = function (req, res) {

}

exports.getAllElements = function (req, res) {

}
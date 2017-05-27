/**
 * Created by annamasc on 24/03/2017.
 */
var mongoose = require('mongoose')
var element = mongoose.model('element')
var mongo = require('mongodb')
'use strict'
var multer = require('multer')
var path = require('path')
var assert = require('assert')
var fs = require('fs')
const uuid = require('uuid/v4')

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads/elements')
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + '_' + file.originalname)
  }
})

var upload = multer({ storage: storage }).array('photo')

unlinkImage = function (elem, img, callback) {
  element.aggregate([
        {'$unwind': '$imatges'},
        {'$match': {'element_id': {'$eq': elem}, 'imatges.image_id': {'$eq': img}}},
    {'$group': {
        '_id': {'id': '$imatges.image_id', 'path': '$imatges.path'}
      }}
  ], function (err, imgs) {
    fs.unlink(path.join(__dirname, '/../', imgs[0]._id.path), function (err) {
        callback(err)
      })
  })
}


exports.createElement = function (req, callback) {
    var elem = new element({
        titol: req.body.titol,
        element_id: uuid(),
        descripcio: req.body.descripcio,
        imatges: [],
        user_id: req.body.user_id,
        data_publicacio: req.body.data_publicacio,
        tipus_element: req.body.tipus_element,
        es_temporal: req.body.es_temporal,
        tags: req.body.tags,
        comentaris: [],
        coordenades: req.body.coordenades
    })
    
    callback(elem)
}

exports.saveElement = function(element, callback) {
    element.save(function (err) {
        callback(err)
    })
}

exports.deleteElement = function (req, callback) {
  var id = req.params.id
  element.findOne({element_id: id}, function (err, element) {
    element.remove(function (err) {
      callback(err)
    })
  })
}

exports.findElementByTitolFiltre = function (filter, callback) {
  element.find({titol: {'$regex': filter.titol}},
  null,
  // { coordenades: { $near: [ filter.longitud, filter.latitud ], $maxDistance: 30 } },
  // {skip: 0, limit: 20, sort: {data_publicacio: -1}},
  {sort: {data_publicacio: -1}},
  function (err, elem) { callback(err, elem) })
}

exports.findElementById = function (req, callback) {
    var id = req.params.id
    element.findOne({element_id: id}, function (err, element) {
        callback(err, element)
    })
}

exports.findElementsByUserId = function(req, callback) {
  var usr = req.params.user_id
  element.find({user_id: usr}, function(err, elems) {
    callback(err, elems)
  })
}

exports.updateElement = function (req, callback) {
  var id = req.params.id
  element.findOne({element_id: id}, function (err, element) {
    if (req.body.titol) element.titol = req.body.titol
    if (req.body.descripcio) element.descripcio = req.body.descripcio
    if (req.body.tipus_element) element.tipus_element = req.body.tipus_element
    if (req.body.es_temporal) element.es_temporal = req.body.es_temporal
    if (req.body.tags) element.tags = req.body.tags
    if (req.body.coordenades) element.coordenades = req.body.coordenades

    callback(element)
  })
}

exports.addComment = function (req, callback) {
  var id = req.params.id
  element.findOne({element_id: id}, function (err, element) {
    var comentari = {text: req.body.text, user_id: req.body.user_id, data: req.body.data, comment_id: uuid()}
    element.comentaris.push(comentari)
    element.save()
    callback(err, element)
  })
}

exports.deleteComment = function (req, callback) {
  var id = req.params.id
  var o_id = req.params.c_id
  element.update(
        {element_id: id},
        { $pull: {'comentaris': {'comment_id': o_id}}}, function (err) {
          callback(err)
        })
}

exports.addImage = function (req, res, callback) {
  upload(req, res, function (err) {
    var id = req.params.id
    element.findOne({element_id: id}, function (err, element) {
        for (var i in req.files) {
            var image = { path: req.files[i].path, image_id: uuid()}
            element.imatges.push(image)
          }
        element.save()
        callback(err, element)
      })
  })
}

exports.deleteImage = function (req, callback) {
  var id = req.params.id
  var i_id = req.params.i_id
  unlinkImage(id, i_id, function (err) {
    if (err) callback(err)
    else {
        element.update(
                {element_id: id},
                { $pull: {imatges: {image_id: i_id}}}, function (err) {
                  callback(err)
                })
      }
  })
}

exports.getImage = function (req, callback) {
  var id = req.params.id
  var img = req.params.i_id
  element.aggregate([
        {'$unwind': '$imatges'},
        {'$match': {'element_id': {'$eq': id}, 'imatges.image_id': {'$eq': img}}},
    {'$group': {
        '_id': {'id': '$imatges.image_id', 'path': '$imatges.path'}
      }}
  ], function (err, imgs) {
    callback(err, path.join(__dirname, '/../', imgs[0]._id.path))
  })
}
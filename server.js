var express = require("express"),
    app = express(),
    bodyParser  = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose = require('mongoose');

var config = require('./config')
var jwt = require('jsonwebtoken')

var users = require('./routes/user');
var elems = require('./routes/elements.route');

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(methodOverride())
//var router = express.Router()

app.use('/', users);
app.use('/api', elems);
/*app.use('/', require('./routes/elements.route'))

router.route('/updateUser/:nom_user').put(usrCtrl.updateUser)*/


//app.use(router)

if (process.argv[2]== 'docker') Mongodb = 'mongodb://192.168.99.100:27017/pesDB'
else Mongodb = 'mongodb://192.168.99.100:27017/pesDB'

mongoose.connect(Mongodb, function (err, res) {
    if (err) {
        console.log("Error connecting to the DB")
    }
    app.listen(3000, function() {
        console.log("Node server running on http://localhost:3000");
    });
})

module.exports = app;

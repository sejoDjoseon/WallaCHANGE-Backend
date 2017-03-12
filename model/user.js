mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    nom: String,
    nom_user: {
        type: String,
        unique: true,
        required: true
    },
    password: String,
    path: String,
    localitat: String,
    preferencies: [String],
    productes: [String],
    intercanvis: [String],
    reputacio: String

})

module.exports = mongoose.model('usuari', userSchema)
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var movie_schema = new Schema({
    title: String
});

module.exports = mongoose.model('movie', movie_schema);
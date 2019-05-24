const express = require('express');
const http = require('http');
const path = require('path');
const app = express();
const logger = require('morgan');

const bodyParser = require('body-parser')
    , cookieParser = require('cookie-parser')
    , static = require('serve-static')
    , errorHandler = require('errorhandler');

// 에러 핸들러 모듈 사용
const expressErrorHandler = require('express-error-handler');

// Session 미들웨어 불러오기
const expressSession = require('express-session');

// mongoose 모듈 사용
const mongoose = require('mongoose');


var port = process.env.PORT || 8000;
var cors = require('cors');

const apiRouter = express.Router();

app.use(logger('dev', {}));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());


app.use('/static', express.static( 'public'));

app.use('api',apiRouter);
app.use(cors());

var db = mongoose.connection;

db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});

var Schema = mongoose.Schema;


mongoose.connect('mongodb://localhost:27017/movie_list');

var movie_schema = new Schema({
    "title": String,
    "year": Number,
    "urlPoster" : String,
    "idIMDB" : String,
    "rating" : Number,
    "ranking" : Number

});


var top250_movies = mongoose.model('top250',movie_schema);

var mojo_top100_movies = mongoose.model('mojo100',movie_schema);

var whole_movies = mongoose.model('collect',movie_schema,'collect');

app.get('/api/gettop250',function(req,res){
    top250_movies.find(function(err,movies){
        if(err) return res.status(500).send({error: 'database failure'});
        res.json(movies);
    })
})

app.get('/api/get_mojo_top_100',function(req,res){
    mojo_top100_movies.find(function(err,movies){
        if(err) return res.status(500).send({error: 'database failure'});
        res.json(movies);

    })
})

app.post('/api/search',function(req,res){

    whole_movies.find({"title":{$regex: `.*${req.body.query_string}.*`,$options:'i'}},function(err,movies){
        if(err) return res.status(500).send({error: 'database failure'});

        res.json(movies)

    })

})



var server = app.listen(port, function(){
    console.log("Express server has started on port " + port)
});






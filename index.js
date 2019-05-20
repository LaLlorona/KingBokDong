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


app.use('/public', static(path.join(__dirname, 'public')));

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

app.get('/api/gettop250',function(req,res){
    top250_movies.find(function(err,movies){
        if(err) return res.status(500).send({error: 'database failure'});
        res.json(movies);
    })
})



// var movie = new top250_movies(
//     {
//         title:"asdf"
//     }
// )

// movie.save(function(err, book){
//     if(err) return console.error(err);
//     console.dir(book);
// });


var server = app.listen(port, function(){
    console.log("Express server has started on port " + port)
});






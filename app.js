var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/automathon2k20', {useNewUrlParser: true});
var Schema = mongoose.Schema;
var npsData = new Schema({
  date : Date,
  tags : String,
  platforms : Array,
  npsScore : Number,
  passive : Number,
  promoters : Number,
  detectors : Number
},{collection:'npsData'});
var npsDataModel = mongoose.model('npsDataModel',npsData);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000);
console.log("App Listening on port 3000");

app.get('/',function(req,res) {
	res.render('index',{
		tags:"Purchase",
		categories:['01/03/2020', '02/03/2020', '03/03/2020', '04/03/2020', '05/03/2020'],
		npsScore:[5, 3, 4, 7, 2],
		promoters:[5, 3, 4, 7, 2],
		detectors:[5, 3, 4, 7, 2],
		passiveness:[5, 3, 4, 7, 2]
	});
});

app.post('/saveNPS',function(req, res, next) {
	var data = {
	  date : new Date(req.body.date),
	  tags : JSON.parse(JSON.stringify(req.body.tags))[0],
	  platforms : JSON.parse(JSON.stringify(req.body.platforms)),
	  npsScore : req.body.summary.data.npsScore,
	  passive : req.body.summary.data.passives,
	  promoters : req.body.summary.data.promoters,
	  detectors : req.body.summary.data.detectors
	}
	npsDataModel(data).save();
	res.end("Data Added Successfully");
});

app.get('/NPS',function(req,res,next) {
	var tags = req.query.tags;
	var platforms = req.query.platforms.split(',');
	npsDataModel.find({"tags":tags,"platforms" : { $all: platforms}},function(err,data) {
		res.json(data);
	});
});

app.get('/allPlatforms',function(req,res,next) {
	npsDataModel.find().distinct('platforms', function(error, platforms) {
    	res.json(platforms)
	});
});
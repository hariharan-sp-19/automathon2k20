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

var filterConst = {
	"all" : ["Brand Website","Mobile Web","Contact Center","Email","Others","Android App","Mobile Lite","IOS App"],
	"allApp" : ["Android App","IOS App"],
	"android" : ["Android App"],
	"ios" : ["IOS App"],
	"msite" : ["Mobile Web","Mobile Lite"],
	"web" : ["Brand Website"]
}

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
	npsDataModel.find().distinct('tags', function(error, tags) {
		res.render('index',{
			showGraph : false,
			tags : tags
		});
	});
});

app.post('/fetchData',function(req,res) {
	console.log(req.body);
	npsDataModel.find().distinct('tags', function(error, tags) {
		npsDataModel.find({
			"date": {"$gte": new Date(req.body.fromDate), "$lt": new Date(req.body.toDate)},
			"platforms" : { $all: filterConst[req.body.platforms]},
			"tags" : req.body.tag,

		}).sort([['date', -1]]).exec(function(err,data) {
			var categories = [];
			var npsScore = [];
			var promoters = [];
			var detectors = [];
			var passiveness = [];
			data.forEach(npsData => {
				categories.push(new Date(npsData['date']).toLocaleDateString());
				npsScore.push(npsData['npsScore']);	
				promoters.push(npsData['promoters']);	
				detectors.push(npsData['detectors']);	
				passiveness.push(npsData['passive']);	
			});
			res.render('index',{
				tag : req.body.tag,
				showGraph : true,
				categories:categories,
				npsScore:npsScore,
				promoters:promoters,
				detectors:detectors,
				passiveness:passiveness,
				tags : tags,
				fromDate : req.body.fromDate,
				toDate : req.body.toDate,
				platforms : req.body.platforms
			});
		});
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
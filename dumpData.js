var mongoose  = require('mongoose');
mongoose.connect('mongodb://localhost:27017/automathon2k20',{ useNewUrlParser: true });
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

var data = [
    {
        "platforms" : [ 
            "Android App"
        ],
        "date" : new Date("2020-03-10T18:25:58.500Z"),
        "tags" : "Purchase",
        "npsScore" : 32,
        "passive" : 21,
        "promoters" : 56,
        "detectors" : 24,
    },
    {
        "platforms" : [ 
            "Android App"
        ],
        "date" : new Date("2020-03-09T18:25:58.500Z"),
        "tags" : "Purchase",
        "npsScore" : 11,
        "passive" : 31,
        "promoters" : 40,
        "detectors" : 29,
    },
    {
        "platforms" : [ 
            "Android App"
        ],
        "date" : new Date("2020-03-08T18:25:58.500Z"),
        "tags" : "Purchase",
        "npsScore" : 46,
        "passive" : 29,
        "promoters" : 59,
        "detectors" : 13,
    },
    {
        "platforms" : [ 
            "Android App"
        ],
        "date" : new Date("2020-03-07T18:25:58.500Z"),
        "tags" : "Purchase",
        "npsScore" : 27,
        "passive" : 31,
        "promoters" : 48,
        "detectors" : 21,
    },
    {
        "platforms" : [ 
            "Android App"
        ],
        "date" : new Date("2020-03-06T18:25:58.500Z"),
        "tags" : "Purchase",
        "npsScore" : 25,
        "passive" : 28,
        "promoters" : 48,
        "detectors" : 23,
    },
    {
        "platforms" : [ 
            "Android App"
        ],
        "date" : new Date("2020-03-05T18:25:58.500Z"),
        "tags" : "Purchase",
        "npsScore" : 37,
        "passive" : 19,
        "promoters" : 59,
        "detectors" : 22,
    },
    {
        "platforms" : [ 
            "Android App"
        ],
        "date" : new Date("2020-03-04T18:25:58.500Z"),
        "tags" : "Purchase",
        "npsScore" : 51,
        "passive" : 22,
        "promoters" : 65,
        "detectors" : 14,
    },
    {
        "platforms" : [ 
            "Android App"
        ],
        "date" : new Date("2020-03-03T18:25:58.500Z"),
        "tags" : "Purchase",
        "npsScore" : 50,
        "passive" : 18,
        "promoters" : 66,
        "detectors" : 16,
    }
]

data.forEach(npsData => {
    npsDataModel(npsData).save();
});


setTimeout(() => {
    mongoose.connection.close();
},5000);

var express = require('express'),   
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require("mongoose"),
    Campground = require('./models/campground'),
    Comment = require('./models/comment'),
    Comment = require('./models/users'),
    seedDB  = require('./seeds');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);   
    
seedDB();
mongoose.connect("mongodb://localhost:27017/yelp_camp_v3", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('landing');     
});

//INDEX ROUTE - show all campgrounds
app.get('/campgrounds', function (req, res) {
    //get all campgrounds from db
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render('index', {campgrounds: allCampgrounds});
        }
    });
});

//CREATE ROUTE - add a new campground
app.post('/campgrounds', function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc};
    //create a new campground and save to db
    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/campgrounds');
        }
    });
   
});

//NEW ROUTE - show form to create a new campground
app.get('/campgrounds/new', function(req, res) {
    res.render('new');
});

//SHOW ROUTE - shows more info about a particular campground
app.get('/campgrounds/:id', function (req, res) {
    //find the camoground with provided id
    Campground.findById(req.params.id).populate('comments').exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            //render show template with that campground
            res.render("show", {campground: foundCampground});
        }           
    }); 
    
});

app.listen(8081, function () {
    console.log('YelpCamp Server has started...');
});
var express = require('express'),   
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require("mongoose");

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);   
    
mongoose.connect("mongodb://localhost:27017/yelp_camp_v2", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//     {
//         name: 'Granite Hill', 
//         image: 'https://s3.amazonaws.com/getbeyondlimits/Campsites/Coorg+Camping+%7C+Kabbe+Hills+%7C+Backwaters/Campsite+Details/11th+Dec+18/IMG_20181124_173836240_HDR-01.jpg',
//         description: "This is a huge granite hill, no bathrooms. No water. Beautiful granite!"
//     }, function (err, campground) {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log('NEWLY CREATED CAMPGROUND');
//             console.log(campground);
//         }
//     }
// );

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
    Campground.findById(req.params.id, function (err, foundCampground) {
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
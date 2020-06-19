const campground = require('./models/campground');

var express     = require('express'),   
    app         = express(),
    bodyParser  = require('body-parser'),
    mongoose    = require("mongoose"),
    Campground  = require('./models/campground'),
    Comment     = require('./models/comment'),
    User        = require('./models/users'),
    seedDB      = require('./seeds');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);   
    
seedDB();
mongoose.connect("mongodb://localhost:27017/yelp_camp_v4", {useNewUrlParser: true});
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
            res.render('campgrounds/index', {campgrounds: allCampgrounds});
        }
    });
});

//NEW ROUTE - show form to create a new campground
app.get('/campgrounds/new', function(req, res) {
    res.render('campgrounds/new');
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

//SHOW ROUTE - shows more info about a particular campground
app.get('/campgrounds/:id', function (req, res) {
    //find the camoground with provided id
    Campground.findById(req.params.id).populate('comments').exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }           
    }); 
    
});

// =======================
// COMMENTS ROUTES
// =======================

// NEW COMMENTS ROUTES
app.get('/campgrounds/:id/comments/new', function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', {campground: campground});
        }
    });
});

//
app.post('/campgrounds/:id/comments', function (req, res) {
    //lookup campground using ID
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
    //create new comment
    //connect new comment to campground
    //redirect campground show page 
});

app.listen(8081, function () {
    console.log('YelpCamp Server has started...');
});

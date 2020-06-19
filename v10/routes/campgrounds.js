var express = require('express');
var router  = express.Router();
var Campground = require('../models/campground');
var middleware = require('../middleware');

//INDEX ROUTE - show all campgrounds
router.get('/', function (req, res) {
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
router.get('/new', middleware.isLoggedIn, function(req, res) {
    res.render('campgrounds/new');
});

//CREATE ROUTE - add a new campground
router.post('/', middleware.isLoggedIn, function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image, description: desc, author: author};
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
router.get('/:id', function (req, res) {
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

//EDIT CAMPGROUNDS ROUTE
router.get('/:id/edit', middleware.checkOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        res.render('campgrounds/edit', {campground: foundCampground});
    });
});

//UPDATE CAMPGROUNDS ROUTE
router.put('/:id', middleware.checkOwnership, function (req,res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
        res.redirect('/campgrounds/' + req.params.id);
    });
});

//DESTROY CAMPGROUND ROUTE
router.delete('/:id', middleware.checkOwnership, function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function (err) {
        res.redirect('/campgrounds');
    });
});

module.exports = router;
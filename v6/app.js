var express     = require('express'),   
    app         = express(),
    bodyParser  = require('body-parser'),
    mongoose    = require("mongoose"),
    passport    = require('passport'),
    LocalStrategy = require('passport-local'),
    Campground  = require('./models/campground'),
    Comment     = require('./models/comment'),
    User        = require('./models/user'),
    seedDB      = require('./seeds');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);   

mongoose.connect("mongodb://localhost:27017/yelp_camp_v6", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));    
seedDB();

//PASSPORT CONFIGURATION
app.use(require('express-session')({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

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
app.get('/campgrounds/:id/comments/new', isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', {campground: campground});
        }
    });
});

//
app.post('/campgrounds/:id/comments', isLoggedIn, function (req, res) {
    //lookup campground using ID
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            //create new comment
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    //connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();

                    //redirect campground show page     
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});

//=============
//AUTH ROUTES
//=============

//SHOW REGISTER FORM
app.get('/register', function (req, res) {
    res.render('register');
});

//handle sign up logic
app.post('/register', function (req, res) {
    User.register(new User({username: req.body.username}), req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render('register');
        } 
        passport.authenticate('local')(req, res, function () {
            res.redirect('/campgrounds');
        });
    });
});

//show LOGIN form
app.get('/login', function (req, res) {
    res.render('login');
});

//handling log in logic
//app.post('/login', middleware_from_passport, callback)
app.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}), function (req, res) {

});

//LOGOUT
app.get('/logout', function (req, res) {
   req.logout();
   res.redirect('/campgrounds'); 
});

//check if a user is still logged in middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

app.listen(8081, function () {
    console.log('YelpCamp Server has started...');
});

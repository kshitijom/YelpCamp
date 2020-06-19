var express       = require('express'),   
    app           = express(),
    bodyParser    = require('body-parser'),
    mongoose      = require("mongoose"),
    passport      = require('passport'),
    LocalStrategy = require('passport-local'),
    Campground    = require('./models/campground'),
    Comment       = require('./models/comment'),
    User          = require('./models/user'),
    seedDB        = require('./seeds');

//requiring routes
var commentRoutes    = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds'),
    indexRoutes      = require('./routes/index');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);   

mongoose.connect("mongodb://localhost:27017/yelp_camp_v9", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));    
// seedDB(); //seed the database

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

app.use('/', indexRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds', campgroundRoutes);

app.listen(8081, function () {
    console.log('YelpCamp Server has started...');
});
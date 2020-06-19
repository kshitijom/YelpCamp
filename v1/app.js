var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var campgrounds = [
    {name: 'Salmon Creek', image: 'https://dmgupcwbwy0wl.cloudfront.net/system/images/000/187/447/e145d8afa55bb57e248c422c7cd1a57d/x600gt/Tents_Exterior.JPG?1548410782'},
    {name: 'Granite Hill', image: 'https://s3.amazonaws.com/getbeyondlimits/Campsites/Coorg+Camping+%7C+Kabbe+Hills+%7C+Backwaters/Campsite+Details/11th+Dec+18/IMG_20181124_173836240_HDR-01.jpg'},
    {name: 'Kheerganga Top', image: 'https://i0.wp.com/travelshoebum.com/wp-content/uploads/2017/04/dsc_5767.jpg?resize=1000%2C662&ssl=1'},
    {name: 'Salmon Creek', image: 'https://dmgupcwbwy0wl.cloudfront.net/system/images/000/187/447/e145d8afa55bb57e248c422c7cd1a57d/x600gt/Tents_Exterior.JPG?1548410782'},
    {name: 'Granite Hill', image: 'https://s3.amazonaws.com/getbeyondlimits/Campsites/Coorg+Camping+%7C+Kabbe+Hills+%7C+Backwaters/Campsite+Details/11th+Dec+18/IMG_20181124_173836240_HDR-01.jpg'},
    {name: 'Kheerganga Top', image: 'https://i0.wp.com/travelshoebum.com/wp-content/uploads/2017/04/dsc_5767.jpg?resize=1000%2C662&ssl=1'},
    {name: 'Salmon Creek', image: 'https://dmgupcwbwy0wl.cloudfront.net/system/images/000/187/447/e145d8afa55bb57e248c422c7cd1a57d/x600gt/Tents_Exterior.JPG?1548410782'},
    {name: 'Granite Hill', image: 'https://s3.amazonaws.com/getbeyondlimits/Campsites/Coorg+Camping+%7C+Kabbe+Hills+%7C+Backwaters/Campsite+Details/11th+Dec+18/IMG_20181124_173836240_HDR-01.jpg'}
];

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs')

app.get('/', function (req, res) {
    res.render('landing');     
});

app.get('/campgrounds', function (req, res) {
    res.render('campgrounds', {campgrounds: campgrounds});
});

app.post('/campgrounds', function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    campgrounds.push({name: name, image: image}); 
    res.redirect('/campgrounds');   
});

app.get('/campgrounds/new', function(req, res) {
    res.render('new');
});

app.listen(8081, function () {
    console.log('YelpCamp Server has started...');
});
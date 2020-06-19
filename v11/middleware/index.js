var Campground = require('../models/campground');
var Comment = require('../models/comment')

//all the middlewares go here
var middlewareObj = {};

middlewareObj.checkOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, foundCampground) {
            if (err || !foundCampground) {
                req.flash('error', 'Campground not found')
                res.redirect('back');
            } else {
                //does the user own the campground?
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();

                } else {
                    req.flash('error', "You don't have the permission to do that");
                    res.redirect('back');
                }
            }
        });
    } else {
        req.flash('error', 'You need to be logged in to do that');
        res.redirect('back');
    }
}

middlewareObj.checkCommentOwnership = function (req, res, next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err || !foundComment) {
                req.flash('erorr', 'Comment not found');
                res.redirect('back');
            } else {
                //does the user own the comment?
                if (foundComment.author.id.equals(req.user._id)) {
                    next();

                } else {
                    req.flash('error', "You don't have permission to do that");
                    res.redirect('back');
                }
            }
        });
    } else {
        req.flash('error', 'You need to be logged in to do that');
        res.redirect('back');
    }
}

//check if a user is still logged in middleware
middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('/login');
}

module.exports = middlewareObj;
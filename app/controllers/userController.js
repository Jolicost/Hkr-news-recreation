'use strict';
/* Author: Joan Oliva
* Basic API rest for users model */
var mongoose = require('mongoose'),
// dependencies seprated by commas. Be aware
    User = mongoose.model('Users'),
    main = require('./mainController'),
    async = require("async");

exports.list = function(req,res) {
    User.find({}, function(err,users) {
        if (err)
            res.send(err);
        else
            res.json(users);
    });
};

exports.read = function(req,res) {
    User.findById(req.params.userId, function(err,user) {
        if (err)
            res.send(err);
        else
            res.json(user);
    });
};

exports.create = function(req,res) {
    var new_User = new User(req.body);
    new_User.save(function(err,user) {
        if (err)
            res.send(err);
        else
            res.json(user);
    });
};

exports.update = function(req,res) {
    User.findOneAndUpdate({_id: req.params.userId}, req.body, {new: true}, function(err,user){
        if (err)
            res.send(err);
        else
            res.json(user);
    });
};

exports.delete = function(req, res) {
    User.remove({
        _id: req.params.userId
    }, function(err, user){
        if (err)
            res.send(err);
        else
            res.json({message: 'User deleted'});
    });
};

exports.deleteAll = function(req, res) {
    User.deleteMany({} , function(err, user) {
        if (err)
            res.send(err);
        else
            res.json({message: 'All users deleted'});
    });
};

exports.view = function(req, res){
    let userId = req.query.id;
    if (userId == undefined){
        res.send('No such user.');
    }
    else{
        User.findById(userId, function(err,user) {
            if (err)
                res.send('No such user.');
            else{
                var logged = user.username == req.session.sessionUser || user._id == req.session.sessionUser;
                res.render('pages/users', {user: user, createdAt: main.getSince(user.createdAt), logged: logged});
            }            
        });
    }
};

exports.updateFromView = function(req, res){
    console.log(req.body);
    User.findOneAndUpdate({_id: req.params.userId}, req.body, {},function(err,user){
        if (err)
            res.send(err);
        else{
            res.redirect('/user?id='+req.params.userId);
        }
    });
}

exports.newest = function(req,res) {
    Contribution
    .find({
        $or:[ 
                {contributionType:"url"}, 
                {contributionType:"ask"}
            ]
    })
    .sort({ publishDate: -1 })
    .populate({
        path: 'user'
    })
    .exec((err,contributions) => {
        async.forEach(contributions, function(contribution, callback) {
            //do stuff
            Contribution.countDocuments({topParent: contribution._id}).exec(function(err,n) {
                contribution['nComments'] = n;
                contribution['since'] = module.exports.getSince(contribution.publishDate);

                if (contribution['contributionType'] == 'url')
                    contribution['shortUrl'] = getShortUrl(contribution.content);
                callback();
            });
            
        }, function (err) {
            res.render('pages/newest',{contributions: contributions});
        });
    });
}
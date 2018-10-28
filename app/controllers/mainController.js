'use strict';

var mongoose = require('mongoose'),
Contribution = mongoose.model('Contributions'),
User = mongoose.model('Users');

exports.main = function(req,res) {
    Contribution
        /* Finds all contributions */
        .find({})
        /* 
        Populate creates the JOIN path of the document
        on this specific case we are interested in joining user to the contribution */
        .populate({
            path: 'user'
        })
        /* Executes the queyr object and renders the appropiate page */
        .exec(function(err,ctrs) {
            res.render('pages/testModel',{contributions: ctrs});
        });
    
};
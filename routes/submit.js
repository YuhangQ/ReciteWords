const express = require('express');
const router = express.Router();
const Submission = require('./../models/submission');
const moment = require('moment');

router.get('/', (req, res) => {
    let page = req.query.p;
    if(!page) {res.redirect('/');return;}
    Submission.find({}).sort({'_id': -1}).skip((page - 1) * 8).limit(8).exec((err, result) => {
        for(let i=0; i<result.length; i++) {
            result[i].time = moment(result[i].createdAt).format('YYYY-MM-DD HH:MM');
        }
        Submission.find({}, (err, all) => {
            let len = parseInt(all.length / 8) + (all.length % 8 != 0);
            res.render('submit', {
                user: req.user,
                submits: result,
                len: len,
                now: page
            });
        });
    });
});

module.exports = router;
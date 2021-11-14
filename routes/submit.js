const express = require('express');
const router = express.Router();
const Submission = require('./../models/submission');
const moment = require('moment');

router.get('/', (req, res) => {
    let page = req.query.p;
    if(!page) {res.redirect('/');return;}

    let all = Submission.find({});
    let len = parseInt(all.length / 8) + (all.length % 8 != 0);

    let result = all.sort((a, b)=>{
        return a.time - b.time;
    }).slice((page - 1) * 8, all.length).slice(0, 8)

    for(let i=0; i<result.length; i++) {
        result[i].time = moment(result[i].createdAt).format('YYYY-MM-DD HH:MM');
    }

    res.render('submit', {
        user: req.user,
        submits: result,
        len: len,
        now: page
    });
});

module.exports = router;
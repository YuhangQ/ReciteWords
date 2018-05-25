const express = require('express');
const router = express.Router();
const data = require('./../config/testdata');

router.get('/', (req, res) => {
    res.render('home', {
        user: req.user,
        data: data,
        success: req.flash('success')
    });
});

module.exports = router;
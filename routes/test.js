const express = require('express');
const router = express.Router();
const datas = require('./../config/testdata');
const Submission = require('./../models/submission');
const Account = require('./../models/account');

router.get('/', (req, res) => {
    if(!req.user) {
        req.flash('success', '请登录后再开始测试。');
        res.redirect('/user/login');
        return;
    }
    if(req.query.unit) {
        if (!datas[req.query.unit]) res.redirect('/');
        let queue = [];
        if(req.query.ignore == "ok") {
            for(let i=0; i<datas[req.query.unit].length; i++) {
                if(datas[req.query.unit][i].Chinese.indexOf("△") != -1) continue;
                queue.push(datas[req.query.unit][i]);
            }
        } else {
            for(let i=0; i<datas[req.query.unit].length; i++) {
                queue.push(datas[req.query.unit][i]);
            }
        }
        if(req.query.random == "ok") {
            for(let i=0; i<100000; i++) {
                let x = Math.floor(Math.random() * 10000) % queue.length;
                let y = Math.floor(Math.random() * 10000) % queue.length;
                let t = queue[x];
                queue[x] = queue[y];
                queue[y] = t;
            }
        }
        req.session.queue = queue;
        req.session.unit = req.query.unit;
        res.redirect('/test');
    } else {
        if (!req.session.queue) { res.redirect('/'); return; }
        let queue = req.session.queue;
        res.render('test', {
            user: req.user,
            meaning: queue[0].Chinese,
            tot: queue.length,
            success: req.flash('success'),
            error: req.flash('error')
        });
    }
});

router.post('/', (req, res) => {
    if(!req.user) {
        req.flash('success', '请登录后再开始测试。');
        res.redirect('/user/login');
        return;
    }
    let ans = req.body.ans;
    let queue = req.session.queue;
    if (ans != queue[0].English) {
        req.flash('error', `回答错误：${queue[0].Chinese} 正确: ${queue[0].English} 你的: ${ans} 将在最后重考！`);
        req.session.queue = queue.slice(1);
        req.session.queue.push(queue[0]);
        res.redirect('/test');
        return;
    }
    req.session.queue = queue.slice(1);
    if (req.session.queue.length == 0) {
        let contains = false;
        for (let i = 0; i < req.user.passed.length; i++) {
            let v = req.user.passed[i];
            if (v == req.session.unit) {
                contains = true;
                continue;
            }
        }
        if (!contains) {
            req.user.passed.push(req.session.unit);
            req.user.passed.sort();
            Account.insert(req.user);
        }

        Submission.insert({
            username: req.user.username,
            unit: req.session.unit,
            time: new Date().getTime()
        })

        req.flash('success', '你已经完成了测试。');
        res.redirect('/');
        return;
    }
    req.flash('success', `${queue[0].Chinese} - ${queue[0].English} 答案正确，请继续下一题。`);
    res.redirect('/test');

});

module.exports = router;
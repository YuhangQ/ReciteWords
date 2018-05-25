const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const passportConfig = require('./config/passport');
const flash = require('express-flash');
const mongoose = require('mongoose');
const Account = require('./models/account');
const config = require('./config/config');

const app = express();


// 配置渲染引擎
app.set('views', './views');
app.set('view engine', 'ejs');

// 加载静态文件
app.use(express.static('./public/'));

// 加载常用中间件
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: config.SESSION_SECRET, resave: true, saveUninitialized: true }));
app.use(flash());

// 加载数据库

mongoose.connect(config.MONGODB_URI).then(() => {
    console.log("数据库连接成功！")
}).catch(err => {
    console.log("无法连接到 Mongodb, 请检查 MONGODB_URI.");
    process.exit(0);
});

// 加载 passport 登录认证模块
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(passportConfig.serializeUser);
passport.deserializeUser(passportConfig.deserializeUser);
passport.use(passportConfig.LocalStrategy);

// 加载路由

const userRouter = require('./routes/users');
const homeRouter = require('./routes/home');
const testRouter = require('./routes/test');
const submitRouter = require('./routes/submit');

app.use('/', homeRouter);
app.use('/user', userRouter);
app.use('/test', testRouter);
app.use('/submissions', submitRouter);

app.listen(8080);


const createError = require('http-errors');
const mongoose = require('mongoose')
const express = require('express');
const path = require('path');
const session = require('express-session')
const cookieParser = require('cookie-parser')
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const app = express()

mongoose.connect('mongodb+srv://KR_CHAT:KR_chats@kr-cluster.fjfouot.mongodb.net/KR_DataBase?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true}).then((d) => {console.log(`CONNECTED TO DB!`)}).catch(err => console.log(err))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
      resave: true,
      saveUninitialized: true,
      secret: 'secret'
    }))
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', userRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
  // render the error page
  res.status(err.status || 500);
  res.render('error', {resource: {title: 'ERROR', message: err.message, error: req.app.get('env') === 'development' ? err : {}}});
});

module.exports = app

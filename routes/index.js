const express = require('express');
const router = express.Router();
const {addUser, getDATA, getDataJson} = require('../controls/controls')

/* GET home page. */
router.get('/', function(req, res, next) {
  if(getDataJson(req) === 'True') {
    res.render('layout', {resource: {title: 'HOME', logged: 'True'}})
  }
  else {
    res.render('layout', {resource: {title: 'HOME', logged: 'False'}})
  }
});

router.get('/settings', function (req, res){
  res.render('index', {resource: { title: 'SETTINGS'}})
})

router.get('/signin', function (req, res){
  res.render('signInUp', {resource: { title: 'SIGN IN'}})
})

router.post('/signin', function (req, res) {
  getDATA(req, res, req.body.username, req.body.password)
})

router.post('/signup', function (req, res) {
  addUser(req, res)
})

module.exports = router;

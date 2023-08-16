const express = require('express');
const router = express.Router();
const {getUsername, showProfile, getMsg, getUsers, getDataJson, getAllUsers, getGrpMsg} = require('../controls/controls')


/* GET users listing. */
router.get('/profile', function (req, res) {
    showProfile(req, res)
})

router.get('/chat', function (req, res) {
    getUsers(req, res)
})

router.get('/chat/*', function (req, res) {
    getMsg(req, getUsername(req).username, req.params['0'], res)
})

router.get('/search', function (req, res){
    if(getDataJson(req) ==='True') {
        getAllUsers(req, res)
    }
    else {
        res.send('log in first')
    }
})

router.get('/group/*', function(req, res) {
    getGrpMsg(req, req.params['0'], res)
})

router.get('/signout', function(req, res) {
    req.session.destroy()
    res.redirect('/')
})

module.exports = router;

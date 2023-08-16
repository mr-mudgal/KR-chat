const {acc_det_obj, msg_det_obj, grp_det_obj, grp_msg_det_obj} = require('../models/models')
const fs = require('fs')
let connectedUsers = []
let connectedSockets = []

function getDataJson(req) {
    if(typeof req.session.user === 'undefined'){
        return 'False'
    }
    else {
        return 'True'
    }
}
function getUsername(req) {
    return req.session.user
}
function getUsers(req, res) {
    if(getDataJson(req) === 'True') {
        let users = []
        let groups = []
        acc_det_obj.find({username: getUsername(req).conTo}).then((data    ) => {
            data.forEach((d) => {
                users.push({username: d.username, full_name: d.full_name})
            })

            grp_det_obj.find({grp_name: getUsername(req).groupJoin}).then((result) => {
                result.forEach((g) => {
                    groups.push({grp_name: g.grp_name, members: g.members})
                })
                res.render('chat', {resource: {title: 'CHAT', users: users, groups: groups, logged: 'True'}})
            })
        })
    }
    else {
        res.render('error', {resource: {title: 'ERROR', message: 'Not Found', error: 'NotFoundError: Not Found'}})
    }
}
function showProfile(req, res) {
    res.render('profile', {resource: {title: 'PROFILE', logged: getDataJson(req), data: getUsername(req)}})
}
function just_write(req, user_id, password, res) {
  acc_det_obj.findOne({"username": user_id, "password": password}).then( (doc) => {
      if(doc !== null){
        req.session.user = doc
        req.session.save()
        res.redirect('/')
      }
    else {
        res.render('error', {resource: {title: 'ERROR', message: "NO ACCOUNT", error: "NO ACCOUNT WITH SUCH USER-CREDENTIALS FOUND"}})
    }
  })
    .catch((err) => {console.log(err)})
}
function getDATA(req, res, user_id, password) {
    just_write(req, user_id, password, res)
}
function recieveMsg(socket, socketIO) {
    socket.on('setUser', function (userid) {
        if(connectedUsers.includes(userid)) {
            connectedSockets[connectedUsers.indexOf(userid)] = socket.id
        }
        else {
            connectedUsers.push(userid)
            connectedSockets.push(socket.id)
        }
    })
    socket.on('msg', function (data) {
        msg_det_obj.create({from: data.from, message: data.message, to: data.to, messageID: `${data.from}-${data.to}`}).then((doc) => {
            let result = {from: doc.from, to: doc.to, message: doc.message, hour: doc.createdAt.getHours(), minute: doc.createdAt.getMinutes()}
            socketIO.sockets.to(connectedSockets[connectedUsers.indexOf(data.to)]).emit('newmsg', result)
        })
    })
    socket.on('grpmsg', function(data) {
        grp_msg_det_obj.create({from: data.from, message: data.message, grp_name: data.grp_name}).then((doc) => {
            let result = {from: doc.from, message: doc.message, hour: doc.createdAt.getHours(), minute: doc.createdAt.getMinutes()}
            for(let i=0; i<connectedUsers.length; i++){
                if(data.members.includes(connectedUsers[i])) {
                    if(data.from !== connectedUsers[i]) {
                        socketIO.sockets.to([connectedSockets[connectedUsers.indexOf(connectedUsers[i])]]).emit('newgrpmsg', result)
                    }
                }
            }
        })
    })
}
function getMsg(req, from, to, res) {
    msg_det_obj.find({$or : [{messageID: `${from}-${to}`}, {messageID: `${to}-${from}`}]}).sort({createdAt: 1})
        .then((doc) => {
            acc_det_obj.find({username: to}).then((det) => {
                let result = []
                for(let i=0; i<doc.length; i++){
                    result.push({from: doc[i].from, to: doc[i].to, message: doc[i].message, hour: doc[i].createdAt.getHours(), minute: doc[i].createdAt.getMinutes()})
                }
                res.render('userchat', {resource: {title: 'Msgs', sender: getUsername(req).username, data: result, username: det[0].username, name: det[0].full_name, logged: 'True'}})
            })
        })
}
function getGrpMsg(req, groupName, res) {
    grp_msg_det_obj.find({grp_name: groupName}).sort({createdAt: 1}).then((doc) => {
        grp_det_obj.find({grp_name: groupName}, {members: 1}).then((result) => {
            let result1 = []
            for(let i=0; i<doc.length; i++) {
                result1.push({from: doc[i].from, message: doc[i].message, hour: doc[i].createdAt.getHours(), minutes: doc[i].createdAt.getMinutes(), members: result[0].members})
            }
            res.render('grpchat', {resource: {title: 'Msgs', sender: getUsername(req).username, data: result1, grpName: groupName, logged: 'True'}})
        })
    })
}
function getAllUsers (req, res) {
    acc_det_obj.find({}).then((result) => {
        // res.send(result)
        res.render('search', {resource: {title: 'SEARCH', logged: 'True', users: result, connected: getUsername(req).conTo, blocked: getUsername(req).blockTo}})
    })
}

// not modified
function addUser(req, res) {
    acc_det_obj.create({
        username: req.body.username,
        password: req.body.password,
        full_name: req.body.full_name,
        email: req.body.user_email,
        phone: req.body.phone,
        theme: 'DARK'
    }).then(() => {
        getDATA(res, req.body.username)
    }).catch((error) => {
        if(error.code === 11000) {
            res.locals.message = `${req.body.username} :  Already Exists`
            res.locals.error = 'The entered USERNAME has already been claimed by someone!'
            res.render('error', {resource: {title: 'ERROR'}})
        }
        else {
            res.send(String(error.code))
        }
    })
}

module.exports = {addUser, getDATA, getDataJson, recieveMsg, getUsers, getMsg, getUsername, showProfile, getAllUsers, getGrpMsg}
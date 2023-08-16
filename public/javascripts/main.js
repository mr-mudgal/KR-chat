let socket = io("https://kr-chat.glitch.me")

socket.on('newmsg', function (msg) {
    if (msg.from === document.getElementById('chat_title').innerText && msg.from !== msg.to) {
        let node = document.createElement('li')
        node.setAttribute('id', 'to')
        node.appendChild(document.createTextNode(msg.message))
        document.getElementById('msgs').appendChild(node)

        let p = document.createElement('p')
        p.setAttribute('id', 'to')
        p.appendChild(document.createTextNode(`${msg.hour}:${msg.minute}`))
        document.getElementById('msgs').appendChild(p)

        document.getElementById('chats').scrollTop = document.getElementById('chats').scrollHeight
    }
})

socket.on('newgrpmsg', function (msg) {
    let node = document.createElement('li')
    node.setAttribute('id', 'to')
    node.appendChild(document.createTextNode(`${msg.from}: ${msg.message}`))
    // node.appendChild(document.createElement('hr'))
    // node.appendChild(`)
    document.getElementById('grpmsgs').appendChild(node)

    let p = document.createElement('p')
    p.setAttribute('id', 'to')
    p.appendChild(document.createTextNode(`${msg.hour}:${msg.minute}`))
    document.getElementById('grpmsgs').appendChild(p)

    document.getElementById('chats-grp').scrollTop = document.getElementById('chats-grp').scrollHeight
})

function connectsocket(sender) {
    try {
        document.getElementById('chats').scrollTop = document.getElementById('chats').scrollHeight
    }
    catch (e){
        document.getElementById('chats-grp').scrollTop = document.getElementById('chats-grp').scrollHeight
    }
    finally {
        socket.emit('setUser', sender)
    }
}
function show_settings() {
    if(document.getElementById('settings').style.display === 'block'){
        document.getElementById('settings').style.display = 'none';
    }
    else{
        document.getElementById('settings').style.display = 'block';
    }
}
function rere(th) {
    if(th === 'LIGHT') {
        document.getElementById('logo').setAttribute('src', '/images/KR_noBG.gif');
        document.getElementById('style_theme').setAttribute('href', '/stylesheets/lightTheme.css');
        document.getElementById('theme').innerHTML = 'Dark theme'
    }
    else {
        document.getElementById('logo').setAttribute('src', '/images/KR.gif');
        document.getElementById('style_theme').setAttribute('href', '/stylesheets/darkTheme.css');
        document.getElementById('theme').innerHTML = 'Light theme'
    }
}
function change_theme() {
    if(document.getElementById('style_theme').getAttribute('href') === '/stylesheets/darkTheme.css') {

        acc_det_obj.updateOne({username: 'Mr_Mudgal'}, {theme: 'LIGHT'})
        // getDATA(null, 'Mr_Mudgal')
        // document.getElementById('style_theme').setAttribute('href', '/stylesheets/lightTheme.css')
        document.getElementById('theme').innerHTML = 'Dark theme'
    }
    else {
        document.getElementById('style_theme').setAttribute('href', '/stylesheets/darkTheme.css');
        document.getElementById('theme').innerHTML = 'Light theme'
    }
}
function submit_btn(id) {
    document.getElementById(id).submit()
}
function showOption(idshow, idhide, btn1, btn2) {
    if(document.getElementById('style_theme').getAttribute('href') === 'stylesheet/darkTheme.css') {
        document.getElementById(idshow).style.display = 'block'
        document.getElementById(btn1).style.background = '#333333'
        document.getElementById(btn1).style.fontWeight = 'bold'
        document.getElementById(btn1).style.color = 'white'

        document.getElementById(idhide).style.display = 'none'
        document.getElementById(btn2).style.background = 'none'
        document.getElementById(btn2).style.fontWeight = 'normal'
        document.getElementById(btn2).style.color = '#aaaaaa'
    }
    else{
        document.getElementById(idshow).style.display = 'block'
        document.getElementById(btn1).style.background = '#eeeeee'
        document.getElementById(btn1).style.fontWeight = 'bold'
        document.getElementById(btn1).style.color = 'black'

        document.getElementById(idhide).style.display = 'none'
        document.getElementById(btn2).style.background = 'none'
        document.getElementById(btn2).style.fontWeight = 'normal'
        document.getElementById(btn2).style.color = '#666666'
    }
}
function checkrepass() {
    let pass1 = document.getElementById('pass').value
    let pass2 = document.getElementById('reps').value
    console.log(pass1, pass2)
    if(pass1 !== pass2){
        document.getElementById('result').innerHTML = 'Passwords Do Not Match!'
    }
    else{
        document.getElementById('result').innerHTML = null
    }
}
function send(sender, user) {
    if((document.getElementById('chat_msg').value).trim().length !== 0) {
        socket.emit('msg', {message: document.getElementById('chat_msg').value, from: sender, to: user})
        let date = new Date()

        let node = document.createElement('li')
        node.setAttribute('id', 'from')
        node.appendChild(document.createTextNode(document.getElementById('chat_msg').value))
        document.getElementById('chat_msg').value = ''
        document.getElementById('msgs').appendChild(node)
        document.getElementById('chats').scrollTop = document.getElementById('chats').scrollHeight

        let p = document.createElement('p')
        p.setAttribute('id', 'from')
        p.appendChild(document.createTextNode(`${date.getHours()}:${date.getMinutes()}`))
        document.getElementById('msgs').appendChild(p)
    }
}
function send_grp_msg(sender, grp_name, mem) {
    if((document.getElementById('chat_msg').value).trim().length !== 0) {
        socket.emit('grpmsg', {message: document.getElementById('chat_msg').value, from: sender, grp_name: grp_name, members: mem})
        let date = new Date()

        let node = document.createElement('li')
        node.setAttribute('id', 'from')
        node.appendChild(document.createTextNode(document.getElementById('chat_msg').value))
        document.getElementById('chat_msg').value = ''
        document.getElementById('grpmsgs').appendChild(node)
        document.getElementById('chats-grp').scrollTop = document.getElementById('chats-grp').scrollHeight

        let p = document.createElement('p')
        p.setAttribute('id', 'from')
        p.appendChild(document.createTextNode(`${date.getHours()}:${date.getMinutes()}`))
        document.getElementById('grpmsgs').appendChild(p)
    }
}
function showCHH(username) {
    window.open(`/user/chat/${username}`, '_self')
}
function go_back() {
    window.open('/user/chat', "_self")
}
function connectDis(user_id, role) {
    if(role === 'connect') {
        connection.send(JSON.stringify({task: 'connect', connect: user_id}))
    }
    else if(role === 'disconnect') {
        connection.send(JSON.stringify({task: 'disconnect', connect: user_id}))
    }
}
function showGRP(grpNAME) {
    window.open(`/user/group/${grpNAME}`, '_self')
}

// function showSigninPhone(show, cls, dis, dis1) {
//     let eles = document.getElementsByClassName(show)
//     for (let i=0; i<eles.length; i++) {
//         console.log(eles[i])
//         eles[i].style.display = "block"
//     }
//     document.getElementById(dis).style.display = 'block'
//
//     eles = document.getElementsByClassName(cls)
//     for (let i=0; i<eles.length; i++) {
//         console.log(eles[i])
//         eles[i].style.display = "none"
//     }
//     document.getElementById(dis1).style.display = 'none'
// }
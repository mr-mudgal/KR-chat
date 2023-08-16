const {Schema, model} = require('mongoose')

const acc_det = new Schema({
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        full_name: {
            type: String,
            required: true
        },
        email: String,
        phone: Number,
        profile_img: String,
        theme: String,
        conTo: Array,
        blocked: Array,
        groupJoin: Array
})

const msg_det = new Schema({
    from: {
        required: true,
        type: String
    },
    to: {
        required: true,
        type: String
    },
    message: {
        required: true,
        type: String
    },
    messageID: {
        required: true,
        type: String
    }
},{
    timestamps: true
})

const grp_det = new Schema({
    grp_name: {
        type: String,
        required: true,
        unique: true
    },
    members: {
        type: Array,
        required: true
    }
})

const grp_msg_det = new Schema({
    grp_name: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    }
},
    {timestamps: true})

const acc_det_obj = model('accounts', acc_det)
const msg_det_obj = model('messages', msg_det)
const grp_det_obj = model('groups', grp_det)
const grp_msg_det_obj = model('grp_msgs', grp_msg_det)

module.exports = {acc_det_obj, msg_det_obj, grp_det_obj, grp_msg_det_obj}
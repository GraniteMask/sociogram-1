const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: String,   //these two are for reset password code
    expireToken:Date,
    pic:{
        type: String,
        default:"https://res.cloudinary.com/rd1/image/upload/v1598291153/profiledefault_qkxys8.jpg"

    },
    followers:[{
        type: ObjectId,
        ref:"User"
    }],
    following:[{
        type: ObjectId,
        ref:"User"
    }]
})

mongoose.model("User", userSchema)
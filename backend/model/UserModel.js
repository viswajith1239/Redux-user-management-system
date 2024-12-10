const { Timestamp } = require('bson')
const mongoose=require('mongoose')

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        required:true
    },
    isBlocked:{
        type:Boolean
    },
    profileImg:{
        type:String
    }

},

{
    timestamps:true
})

module.exports=mongoose.model('users',userSchema)
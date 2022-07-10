import mongoose from "mongoose";
import validator from 'validator'
import { IUser } from '../../utils/interface'


const userSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required:[true, "Please enter full name"],
    },
    email:{
        type:String,
        required:[true, "Please enter email"],
        validate: [ validator.isEmail, 'invalid email'],
        unique:true
    },
    password:{
        type:String,
        required:[true, "Please enter password"],
    },
    role:{
        type:String,
        default:"user",
        enum:['user', 'admin']
    },
    avatar:{
        type:String,
        default:"https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
    },
    isActive:{
        type:Boolean,
        default:false
    }
}, {
    timestamps:true
})

export default mongoose.model<IUser>("User", userSchema);
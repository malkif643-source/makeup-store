import { object, string } from "joi";
import { model, Schema } from "mongoose";

 const userSchema=new Schema({
  fullname:String,
  email:String,
  password:String,
   phone:Object,
    address:String,
    role:String,
    creatAt:Date
});

const User=model('users',userSchema);
export default User;
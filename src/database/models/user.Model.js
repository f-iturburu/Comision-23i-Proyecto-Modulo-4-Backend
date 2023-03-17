import {Schema, model} from 'mongoose';

const user = new Schema({
  username: {type:String, lowercase:true, trim:true},
  email: {type:String, lowercase:true, trim:true},
  password: String,
  role: Number
},{
    timestamps:true
});

// User rol  0:Admin, 1:User normal

export default model('User', user);


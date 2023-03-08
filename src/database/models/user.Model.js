import {Schema, model} from 'mongoose';

const user = new Schema({
  nombre: String,
  email: String,
  password: String,
  rol: Number
},{
    timestamps:false
});

// User rol  0:Admin, 1:User normal

export default model('User', user);


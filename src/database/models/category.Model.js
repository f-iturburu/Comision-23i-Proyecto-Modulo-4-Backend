import {Schema, model} from 'mongoose';

const category = new Schema({
  nombre: String,
  estado: Boolean
},{
    timestamps:false
});

export default model('Category', category);
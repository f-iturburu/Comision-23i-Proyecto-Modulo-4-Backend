import {Schema, model} from 'mongoose';

const answer = new Schema({
    emailUser: String,
    idQuestion: String,
    response: String,
},{
    timestamps:false
});

export default model('Answer', answer);c
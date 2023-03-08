import {Schema, model} from 'mongoose';

const question = new Schema({
    idSurvey: String,
    titulo: String,
    tipo: String,
    answers: Array
},{
    timestamps:false
});

export default model('Question', question);
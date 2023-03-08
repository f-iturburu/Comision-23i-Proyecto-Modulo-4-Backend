import {Schema, model} from 'mongoose';

const survey = new Schema({
  nombre: String,
  estado: Boolean,
  preguntas: [{
                titulo: String,
                tipo: String,
                answers: [{
                            idUser: String,
                            userAnswer: String,
                          }]
              }],
  categoria: String,
  idAuthor : String
},{
    timestamps:false
});

export default model('Survey', survey);
import {Schema, model} from 'mongoose';

const answer = new Schema({
  userId: String,
  userAnswer: Array,
  isAnonymous: Boolean,
  answerDate: String
})

const question = new Schema({
    question: {type:String, lowercase:true, trim:true},
    type: String,
    possibleAnswers: Array,
    userAnswers: [answer]
})

const survey = new Schema({
  name: {type:String, lowercase:true, trim:true},
  description: String,
  published: Boolean,
  surveyQuestions:[question],
  categories: Array,
  idAuthor : String,
  endDate: Date,
},{
    timestamps:true
});

export default model('Survey', survey);
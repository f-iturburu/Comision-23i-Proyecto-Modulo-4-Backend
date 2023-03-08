import Survey from '../database/models/survey.Model.js'


export const createAnswer = async (req,res) => {
    
    let {userAnswer} = req.body;
    let {userId} = req.userToken;
    let {idQuestion} = req.params;

    let answer = {
        idUser : userId,
        userAnswer : userAnswer,
    }

   try
   {
    let surveyUpdated =  await Survey.findOne(
        {
        preguntas: {
            $elemMatch : {
                _id : idQuestion
            }
        }
    }
    )
    
    let questionUpdated = surveyUpdated.preguntas.find(question => question._id == idQuestion)

    // !CORROBORAR QUE NO TENGA UNA RESPUESTA EN CUYO CASO HABRA QUE HACER UN UPDATE. (IMPLEMENTAR)

    questionUpdated.answers.push(answer);

    let answerCreated = questionUpdated.answers[questionUpdated.answers.length-1];

    await surveyUpdated.save();

    res.json(answerCreated);
   }
   catch(error)
   {
    return res.status(500).json({message:error.message})
   }
}
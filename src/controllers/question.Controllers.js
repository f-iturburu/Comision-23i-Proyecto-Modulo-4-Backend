import Survey from '../database/models/survey.Model.js'


export const updateQuestion = async (req,res) => {

    let {question, type, possibleAnswers} = req.body;
    let {userId} = req.userToken
    let {idSurvey,idQuestion} = req.params;

    let newQuestion = {
        question : question,
        type : type,
        possibleAnswers : possibleAnswers,
        userAnswers : []
    }

   try
   {
    let surveyUpdated =  await Survey.findById(idSurvey);

    console.log(surveyUpdated);

    if(!surveyUpdated)
    {
        return res.status(400).json({message:'no existe una encuesta con ese id'})
    }

    if(surveyUpdated.idAuthor != userId)
    {
        return res.status(403).json({message:'permission denied'})
    }

    
    let questionUpdate = await surveyUpdated.surveyQuestions.find( question => question._id == idQuestion);

    if(!questionUpdate)
    {
        return res.status(400).json({message:'no existe una pregunta con ese id'})
    }

    if(questionUpdate.userAnswers.length > 0)
    {   
        return res.status(403).json({message:'no se puede actualizar una pregunta que ya tiene respuestas'});
    }

    questionUpdate.question = newQuestion.question;
    questionUpdate.type = newQuestion.type;
    questionUpdate.possibleAnswers = newQuestion.possibleAnswers;

    await surveyUpdated.save();
    

    res.json(questionUpdate);

   }
   catch(error)
   {
    return res.status(500).json({message:error.message})
   }
}
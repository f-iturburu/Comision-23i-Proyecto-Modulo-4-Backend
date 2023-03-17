import Survey from '../database/models/survey.Model.js'


export const createAnswer = async (req,res) => {

    let {userAnswer, isAnonymous} = req.body;
    let {userId} = req.userToken;
    let {idQuestion} = req.params;

    let answerActual = {
        userId : userId,
        userAnswer : userAnswer,
        isAnonymous : isAnonymous
    }

   try
   {
    let surveyUpdated =  await Survey.findOne(
        {
            surveyQuestions: {
                $elemMatch : {
                    _id : idQuestion
                }
        }
    }
    )
    
    let questionUpdated = surveyUpdated.surveyQuestions.find(question => question._id == idQuestion)
    if(questionUpdated.type == 'singleOption' || questionUpdated.type == 'multpleOption')
    {
        userAnswer.forEach(answer => {
            if(!questionUpdated.possibleAnswers.includes(answer))
            {
                return res.status(400).json({message:`{answer} no es una respuesta valida`});
            }   
        });
    }

    // Si ya tiene una respuesta a la pregunta la actualizo
    console.log(questionUpdated.userAnswers.length);
    for (let i = 0; i < questionUpdated.userAnswers.length; i++) {
        if(questionUpdated.userAnswers[i].userId === answerActual.userId)
        {   
            questionUpdated.userAnswers[i].userAnswer = answerActual.userAnswer;

            await surveyUpdated.save();

            return res.json(questionUpdated.userAnswers[i]);
        }  
        
    }

    // Caso contrario la creo

    questionUpdated.userAnswers.push(answerActual);

    let answerCreated = questionUpdated.userAnswers[questionUpdated.userAnswers.length-1];

    await surveyUpdated.save();

    res.json(answerCreated);
   }
   catch(error)
   {
    return res.status(500).json({message:error.message})
   }
}

export const createAllAnswers = async (req,res) => {
    let {userAnswers,isAnonymous} = req.body;
    let {userId} = req.userToken;
    let {idSurvey} = req.params;

    let answersResponse = [];

    try
    {
        let surveyUpdated =  await Survey.findById(idSurvey);
    
        if(!surveyUpdated)
        {
            return res.status(400).json({message:'no existe una encuesta con ese id'});
        }

        if(surveyUpdated.surveyQuestions.length > userAnswers.length)
        {
            return res.status(400).json({message:'faltan respuestas'});
        }

        for (let j = 0; j < userAnswers.length; j++) {
            
        
            let questionFind = surveyUpdated.surveyQuestions.find(question  => question._id == userAnswers[j].idQuestion);

            if(!questionFind)
            {
                return res.status(400).json({message:'no existe una pregunta con ese id'});
            }

            if(questionFind.type == 'singleOption' || questionFind.type == 'multpleOption')
            {
                userAnswers[j].answers.forEach(answer => {
                    if(!questionFind.posibleAnswers.includes(answer))
                    {
                        return res.status(400).json({message:`{answer} no es una respuesta valida`});
                    }   
                });
            }

            let answerCreated = {
                userAnswer : userAnswers[j],
                userId : userId,
                isAnonymous: isAnonymous
            }

            // Si ya tiene una respuesta a la pregunta la actualizo

            for (let i = 0; i < questionFind.userAnswers.length; i++) {
                if(questionFind.userAnswers[i].userId === answerCreated.userId)
                {
                    questionFind.userAnswers[i].userAnswer = answerCreated.userAnswer;

                    await surveyUpdated.save();

                    return res.json(questionUpdated.answers[i]);
                }  
            }

            // Si no la creo

            questionFind.userAnswers.push(answerCreated);
            
            await surveyUpdated.save();

            answersResponse.push(questionFind.answers[questionFind.userAnswers.length-1]);
        }

        res.json(answersResponse)
    }
    catch(error)
    {
        return res.status(500).json({message:error.message})
    }
}
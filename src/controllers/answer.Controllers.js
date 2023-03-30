import Survey from '../database/models/survey.Model.js'




export const createAllAnswers = async (req,res) => {
    let {userAnswers,isAnonymous} = req.body;
    let {userId} = req.userToken;
    let {idSurvey} = req.params;

    let answersResponse = [];

    try{
        let surveyUpdated =  await Survey.findById(idSurvey);

        if(!surveyUpdated){
            return res.status(400).json({message:'no existe una encuesta con ese id'});
        }

        if(surveyUpdated.surveyQuestions.length > userAnswers.length) {
            return res.status(400).json({message:'faltan respuestas'});
        }

        for (let j = 0; j < userAnswers.length; j++) {
            let questionFind = surveyUpdated.surveyQuestions.find(question  => question._id == userAnswers[j].idQuestion);
    
            if(!questionFind){
                return res.status(400).json({message:'no existe una pregunta con ese id'});
            }
             
            if(questionFind.type == 'singleOption' || questionFind.type == 'multipleOption'){
                userAnswers[j].answers.forEach(answer => {
                    if(!questionFind.possibleAnswers.includes(answer)){
                        return res.status(400).json({message:`{answer} no es una respuesta valida`});
                    }
                });
            }

            const date = () =>{
                let today = new Date();
                let dd = today.getDate();
                let mm = today.getMonth() + 1;
                let yyyy = today.getFullYear();
              
                if (dd < 10) {
                  dd = "0" + dd;
                }
              
                if (mm < 10) {
                  mm = "0" + mm;
                }
              return yyyy+'-'+mm+'-'+dd
            }
            let answerCreated = {
                userAnswer : userAnswers[j],
                userId : userId,
                isAnonymous: isAnonymous,
                answerDate: date()
            }

            questionFind.userAnswers.push(answerCreated);         
            await surveyUpdated.save();
            answersResponse.push(questionFind.userAnswers[questionFind.userAnswers.length-1]);
        }

        res.json(answersResponse)
    }
    catch(error){
        return res.status(500).json({message:error.message})
    }
}
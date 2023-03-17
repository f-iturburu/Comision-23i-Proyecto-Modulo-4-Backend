import Survey from '../database/models/survey.Model.js'


export const createQuestion = async (req,res) => {
    
    let {titulo, tipo} = req.body;

    let {idSurvey} = req.params;

    let question = {
        titulo : titulo,
        tipo : tipo,
        answers : []
    }

   try
   {
    let surveyUpdated =  await Survey.findById(idSurvey)

    surveyUpdated.preguntas.push(question);
    
    let questionCreated = surveyUpdated.preguntas[surveyUpdated.preguntas.length-1];

    await surveyUpdated.save();

    res.json(questionCreated);
   }
   catch(error)
   {
    return res.status(500).json({message:error.message})
   }
}

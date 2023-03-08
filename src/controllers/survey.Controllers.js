import Survey from '../database/models/survey.Model.js';

export const createSurvey = async (req,res) => {
    
    let {nombre} = req.body;
    let {userId} = req.userToken;

    const survey = await Survey.create({nombre:nombre, idAuthor:userId});

    res.json(survey);

}

export const getSurveyById = async (req,res) =>{

    // !Este endpoint solo lo deben usar el admin y el que creo la encuesta. (IMPLEMENTAR)
    // !Hay que crear otro para ver solamente las respuestas de un usuario determinado (IMPLEMENTAR)


    let {id} = req.params;

    try
    {
        const surveyById = await Survey.findById(id);
        
        res.json(surveyById);
    }
    catch(error)
    {
        return res.status(500).json({message:error.message});    
    }


}

export const getAllSurveys = async (req,res) => {


    // !Este endpoint solo lo deben usar el admin y el que creo la encuesta. (IMPLEMENTAR)
    // !Hay que crear otro para ver solamente las respuestas de un usuario determinado (IMPLEMENTAR)

    try
    {
        const surveys = await Survey.find();
        
        res.json(surveys);
    }
    catch(error)
    {
        return res.status(500).json({message:error.message});    
    }
}


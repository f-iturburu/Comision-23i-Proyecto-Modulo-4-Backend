import Survey from '../database/models/survey.Model.js';
import User from '../database/models/user.Model.js';


export const createSurveyWithQuestions = async (req,res) => {

    let {name, endDate, categories, questions, description} = req.body;
    let {userId} = req.userToken;

    try{
        const survey = await Survey.create({
            name: name,
            description: description, 
            published: true, 
            idAuthor: userId,
            endDate: endDate,
            categories: categories,
            surveyQuestions:  questions.map( question => {return {
                question : question.question,
                type : question.type,
                possibleAnswers: question.possibleAnswers,
                userAnswers : []
            }})
        });
        res.json(survey);
    }
    catch(error){
        return res.status(500).json({message:error.message});
    }
}

export const getSurveyById = async (req,res) =>{

    let {userId, userRole} = req.userToken;
    let {id} = req.params;

    try{
        const surveyById = await Survey.findById(id);

        if(!surveyById){
            return res.status(400).json({message:'no existe'}); 
        }

        if(userId != surveyById.idAuthor && userRole !== 0) {
            return res.status(403).json({message:'permission denied'}); 
        }

        let answerResponse = [];
        let questionsResponse = [];
        let question;

        for (let i = 0; i < surveyById.surveyQuestions.length; i++) {
            answerResponse = []
            question = surveyById.surveyQuestions[i]

            for (let j = 0; j < question.userAnswers.length; j++) {
                const currentAnswer = question.userAnswers[j];
                let user = await User.findById(currentAnswer.userId);
                let answerRes;
                if (currentAnswer.isAnonymous) {
                    answerRes = {
                        userAnswer: currentAnswer.userAnswer,
                        _id: currentAnswer._id,
                        user: 'Anonymous',
                        answerDate: currentAnswer.createdAt
                    };
                } else {
                    answerRes = {
                        userAnswer: currentAnswer.userAnswer,
                        _id: currentAnswer._id,
                        user: { username: user.username, email: user.email, _id: user._id },
                        answerDate: currentAnswer.createdAt
                    };
                }
                answerResponse.push(answerRes);
            }
            questionsResponse.push({
                question:  question.question,
                type : question.type,
                possibleAnswers :  question.possibleAnswers,
                userAnswers : answerResponse,
                _id:  question._id
            })
        }

        res.json({
            _id : surveyById._id,
            name : surveyById.name,
            description: surveyById.description, 
            published : surveyById.published,
            categories : surveyById.categories,
            idAuthor : surveyById.idAuthor,
            createDate: surveyById.createdAt,
            endDate : surveyById.endDate,
            surveyQuestions : questionsResponse
        });
    }
    catch(error)
    {
        return res.status(500).json({message:error.message});    
    }
}
// !EXCLUSIVA DEL USER ADMIN
export const getAllSurveys = async (req,res) => {

    let {userRole} = req.userToken;

    try{
        const surveys = await Survey.find();

        if(userRole !== 0){
            return res.status(403).json({message:'permission denied'}); 
        }
        
        res.json(surveys);
    }
    catch(error)
    {
        return res.status(500).json({message:error.message});    
    }
}

export const getAllSurveysActive = async (req, res) =>{
    let {categories,name} = req.body;

    try{  
        let query = {
            name : { $regex: new RegExp(name.toLowerCase().trim()) },
            published: true,
            $or: [
                { endDate: { $exists: false } },
                { endDate: { $gt: Date.now() } },
                { endDate: null}
            ]
        };
        
        if (categories.length > 0) {
            query.categories = { $in: categories };
        } 

        let surveysActives = await Survey.find(query);

        res.json(surveysActives.map(survey => {
            return {
                _id: survey._id,
                name: survey.name,
                description: survey.description, 
                endDate: survey.endDate,
                categories: survey.categories,
            }
        }));
    }
    catch(error) {
        return res.status(500).json({message:error.message});    
    }
} 

export const getAllMySurveys = async (req, res) =>{
    let {userId} = req.userToken;
    try{
        const surveys = await Survey.find({idAuthor : userId});
        
        let surveysResponse =  surveys.map(survey => {
            return { _id: survey._id,
                     name: survey.name,
                     description : survey.description,
                     published: survey.published,
                     categories: survey.categories,
                     createDate: survey.createdAt,
                     endDate: survey.endDate,
                   }
        });

        res.json(surveysResponse);
    }
    catch(error){
        return res.status(500).json({message:error.message});    
    }
}

export const getSurveyByIdWithMyAnswers = async (req, res) => {
    let {userId} = req.userToken;
    let {id} = req.params;

    try {
        const surveyById = await Survey.findById(id);

        if(!surveyById){
            return res.status(404).json({message:'no existe'}); 
        }

        let myAnswer;
        surveyById.surveyQuestions.forEach(question => {
            if(question.userAnswers.length <= 0) {
                question.userAnswers = [];
            }
            else{
                myAnswer = (question.userAnswers.filter(answer => answer.userId == userId)).pop();
                if(!myAnswer){
                    question.userAnswers = []
                }else{
                    question.userAnswers = [myAnswer];
                }
               
            }
        })

        res.json(surveyById);
    }
    catch(error)
    {
        return res.status(500).json({message:error.message});    
    }
}

export const updateSurveyPublished = async (req,res) => {
    let {id} = req.params;
    let {userId, userRole} = req.userToken;
    let {published} = req.body;

    try{
        const surveyById = await Survey.findById(id);

        if(!surveyById){
            return res.status(400).json({message:'no existe'});
        }

        if(userId != surveyById.idAuthor && userRole !== 0){
            return res.status(403).json({message:'permission denied'}); 
        }

        surveyById.published = published;

        await surveyById.save();

        res.json({
            _id : surveyById._id,
            published : surveyById.published
        })
    }
    catch(error){
        return res.status(500).json({message:error.message});
    }
}

export const deleteSurvey = async (req,res) =>{
 let {userId,userRole} = req.userToken
 let {id} = req.params;

 try{
       let surveyFound = await Survey.findById(id)
       if(!surveyFound){
        return res.status(404).json({message:'no encontrado'})
       }

       if(surveyFound.idAuthor !== userId && userRole !== 0){
        return res.status(403).json({message:'Forbidden'})
       }

       await Survey.findByIdAndDelete(id)
       res.status(200).json({})
    
 }catch(error){
    return res.status(500).json({message:error.message});
 }
}



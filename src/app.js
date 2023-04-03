import express from 'express'
import cors from 'cors';

import UserRoutes from './routes/user.Routes.js';
import SurveyRoutes from './routes/survey.Routes.js';
import AnswerRoutes from './routes/answer.Routes.js';

const app = express();

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(UserRoutes);
app.use(SurveyRoutes);
app.use(AnswerRoutes);

export default app;

import express from 'express'
import cors from 'cors';

// Export las diferentes rutas
import UserRoutes from './routes/user.Routes.js';
import SurveyRoutes from './routes/survey.Routes.js';
import AnswerRoutes from './routes/answer.Routes.js';

const app = express();

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 
}

app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// Uso de las rutas exportadas
app.use(UserRoutes);
app.use(SurveyRoutes);
app.use(AnswerRoutes);

export default app;

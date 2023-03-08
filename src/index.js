import app from './app.js';
import './database/db.js';
import {PORT} from './config.js';
import bcrypt from 'bcrypt'

//export Models
import Category from './database/models/category.Model.js';
import User from './database/models/user.Model.js';
import Survey from './database/models/survey.Model.js';


app.listen(PORT, async () => {
    console.log(`La app esta escuchando en el puerto: ${PORT}`);
    
    if((await User.find()).length === 0)
    {

        // !TODOS ESTOS DATOS PASARLOS A VARIABLES DE ENTORNO.

        const salt = await bcrypt.genSalt(10);
        const passwordHashed = await bcrypt.hash('admin1234.', salt);
        console.log("--> Seeding User Admin");
        User.create(
            {
             nombre:'admin',
             email: 'admin@admin.com',
             password: passwordHashed,
             rol:0
        })
    }
});


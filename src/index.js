import app from './app.js';
import './database/db.js';
import {ADMIN_EMAIL, ADMIN_PASS, ADMIN_USER, PORT} from './config.js';
import bcrypt from 'bcrypt'
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './database/models/user.Model.js';
import Survey from './database/models/survey.Model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.listen(PORT, async () => {
    console.log(`La app esta escuchando en el puerto: ${PORT}`);
    try
    {
        if((await User.find()).length === 0)
        {
            const salt = await bcrypt.genSalt(10);
            const passwordHashed = await bcrypt.hash(ADMIN_PASS, salt);
            User.create(
                {
                 username:ADMIN_USER,
                 email: ADMIN_EMAIL,
                 password: passwordHashed,
                 role:0
            })
        }
    }
    catch (error) {
        console.log(error);
    }
});


app.use(express.static(path.join(__dirname, '../public')));


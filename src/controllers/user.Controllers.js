
import User from '../database/models/user.Model.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';
import {validateCreateUser,
        validateUpdateUser,
        validateUpdatePassword} 
from '../helpers/userValidations.js';

export const getAllUsers = async (req,res) => {

    let {userRole} = req.userToken;

    try
    {
        const users = await User.find();
        
        if(userRole !== 0)
        {
            return res.status(401).json({message:'permission denied'});
        }

        res.json(users);
    }
    catch(error)
    {
        return res.status(500).json({message:error.message});
    }
}

export const createUser = async (req,res) =>{
    const {username,password,email}  = req.body;

    let error = validateCreateUser({
            username:username,
            password:password,
            email:email
        });
    if(error) {
        return res.status(400).json({message:error.details[0].message});
    }

        try{
            const emailFound = await User.findOne({ email: email});
            if (emailFound){
                return res.status(400).json({error: 'Email ya registrado'})
            } 
            const usernameFound = await User.findOne({ username: username });
                if (usernameFound){
                    return res.status(400).json({error: 'Username ya registrado'})
                } 
    
            const salt = await bcrypt.genSalt(10);
            const passwordHashed = await bcrypt.hash(password, salt);
            const newUser = await User.create({username:username,password:passwordHashed,email:email,role:1});

            res.status(201).json({_id: newUser._id})

        }catch(error){
            return res.status(500).json({message:error.message});    
        }

    

}
 
export const getMyUser = async (req,res) =>{
    let {userId} = req.userToken
    try{
        let user = await User.findById(userId);
        res.json(user);
    }
    catch(error){
        return res.status(500).json({message:error.message});
    }
}

export const login = async (req,res) => {
    let {user,password} = req.body;
    let userLogin = await User.findOne({$or:[{username:user},{email:user}]});

    if(!userLogin){   
        return res.status(404).json({message:'Nombre de usuario o email incorrectos'}); 
    }
                
    const validPassword = await bcrypt.compare(password, userLogin.password);

    if (!validPassword){
        return res.status(400).json({ message: 'Contraseña inválida' })
    } 

    const token = jwt.sign({
            userId: userLogin._id,
            userRole: userLogin.role,
            userEmail: userLogin.email
        }, TOKEN_SECRET)
        
    res.json({token:token})

}

export const updateUsername = async (req,res) => {
    let {username} = req.body;
    let {userId} = req.userToken;
    let error = validateUpdateUser({
        username:username,
    });

    if(error){
        return res.status(400).json({message:error.details[0].message});
    }

   try{
    let usernameExists = await User.findOne({
        $and: [
            {username: username},
            {_id: {$ne:userId}}
        ] 
    });

    if(usernameExists){
        return res.status(400).json({ error: 'El username ya esta en uso' })
    }

    let userUpdated = await User.findById(userId);
    userUpdated.username = username;
    await userUpdated.save();
    res.json(userUpdated);

   }catch(error) {
    return res.status(500).json({ error: error.message })
   }
}

export const updateUserPassword = async (req,res) => {
    let {oldPassword, newPassword} = req.body;
    let {userId} = req.userToken;
    
   try{
    let userUpdated = await User.findById(userId);
    const validPassword = await bcrypt.compare(oldPassword, userUpdated.password);

    if (!validPassword){
        return res.status(400).json({ error: 'Contraseña antigua incorrecta' })
    } 

    let error = validateUpdatePassword({
        password:password
    });

    if(error) {
        return res.status(400).json({message:error.details[0].message});
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(newPassword, salt);
    userUpdated.password = passwordHashed;
    await userUpdated.save();
    res.json({_id:userUpdated._id});

   }catch(error){
    return res.status(500).json({ error: error.message })
   }
}





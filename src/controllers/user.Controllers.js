
import User from '../database/models/user.Model.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';

export const getAllUsers = async (req,res) => {

    // !Solo el admin puede usar este endpoint (IMPLEMENTAR)
    
    try
    {
        const users = await User.find();
    
        res.json(users);
    }
    catch(error)
    {
        return res.status(500).json({message:error.message});
    }
}

export const createUser = async (req,res) =>{

    // !CREAR VALIDACIONES PARA NOMBRE, PASSWORD Y EMAIL.

    const {nombre,password,email}  = req.body;

    try{
        
        const isEmailExist = await User.findOne({ email: email});
        if (isEmailExist) 
            return res.status(400).json({error: 'Email ya registrado'})

        const isUsernameExist = await User.findOne({ nombre: nombre });
            if (isUsernameExist) 
                return res.status(400).json({error: 'Username ya registrado'})

        const salt = await bcrypt.genSalt(10);
        const passwordHashed = await bcrypt.hash(password, salt);

        const newUser = await User.create({nombre:nombre,password:passwordHashed,email:email,rol:1});

        res.json(newUser);

    }catch(error){

        return res.status(500).json({message:error.message});    
    }
};

export const getUserById = async (req,res) => {

    let {id} = req.params;

    try
    {
        const users = await User.findById(id);
    
        res.json(users);
    }
    catch(error)
    {
        return res.status(500).json({message:error.message});
    }
}

export const login = async (req,res) => {

    let {user,password} = req.body;


    let userLogin = await User.findOne({$or:[{nombre:user},{email:user}]});

    if(!userLogin)
    {   
        return res.status(404).json({message:'nombre de usuario o email incorrectos'}); 
    }
                
    const validPassword = await bcrypt.compare(password, userLogin.password);
    if (!validPassword) 
        return res.status(400).json({ error: 'Contraseña inválida!!!' })

    const token = jwt.sign({
            userId: userLogin._id,
            userRole: userLogin.rol
        }, TOKEN_SECRET)
        
    
    res.json({token:token})

}

export const updateUser = async (req,res) => {

    let {nombre, email} = req.body;

    let tokenUser = req.userToken;
    
   try
   {
    let usernameExists = await User.findOne({
        $and: [
            {nombre: nombre},
            {_id: {$ne:tokenUser.userId}}
        ] 


    });

    if(usernameExists)
    {
        return res.status(400).json({ error: 'El username ya esta en uso' })
    }

    let emailExists = await User.findOne({  
        email: email,
        _id: {$ne:tokenUser.userId}
    });

    if(emailExists)
    {
        return res.status(400).json({ error: 'El email ya esta en uso' })
    }

    let userUpdated = await User.findById(tokenUser.userId);

    userUpdated.nombre = nombre;
    userUpdated.email = email;

    await userUpdated.save();
    res.json(userUpdated);
   }
   catch(error)
   {
    return res.status(500).json({ error: error.message })
   }
}

export const updateUserPassword = async (req,res) => {
    let {oldPassword, newPassword} = req.body;

    let tokenUser = req.userToken;
    
   try
   {
    let userUpdated = await User.findById(tokenUser.userId);

    const validPassword = await bcrypt.compare(oldPassword, userUpdated.password);
    if (!validPassword) 
        return res.status(400).json({ error: 'Contraseña antigua incorrecta' })

    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(newPassword, salt);

    userUpdated.password = passwordHashed;

    await userUpdated.save();

    res.json(userUpdated);
   }
   catch(error)
   {
    return res.status(500).json({ error: error.message })
   }
}
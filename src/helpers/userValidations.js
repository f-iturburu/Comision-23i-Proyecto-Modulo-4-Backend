import Joi from '@hapi/joi';

const schemaCreateUser = Joi.object({
    username: Joi.string().min(6).max(15).required().regex(/^[A-Za-z]+$/),
    email: Joi.string().min(1).max(30).required().email(),
    password: Joi.string().min(8).max(30).required().regex(/"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"/)
    .message("formato incorrecto")
})

const schemaValidateUsername = Joi.object({
    username: Joi.string().min(6).max(15).required().regex(/^[A-Za-z]+$/)
    .message("El nombre de usuario ingresado es invalido.")
})

const schemaValidateEmail = Joi.object({
    email: Joi.string().min(1).max(30).required().email()
    .message("El email ingresado es invalido.")
})

const schemaValidatePassword = Joi.object({
    password: Joi.string().min(8).max(30).required().regex(/"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"/)
    .message("La contraseña ingresada es invalida.")
})
const schemaUpdateUser = Joi.object({
    username: Joi.string().min(6).max(25).required(),
})

const schemaUpdatePassword = Joi.object({ 
    password: Joi.string().min(6).max(30).required().regex(/"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"/)
})

export const validateUsername = (username) =>{
const { error } = schemaValidateUsername.validate(username)
return error;
}

export const validateEmail = (email) =>{
    const { error } = schemaValidateEmail.validate(email)
    return error;
}

export const validatePassword = (password) =>{
    const { error } = schemaValidatePassword.validate(password)
    return error;
}
export const validateCreateUser = (userBody) =>{
    const { error } = schemaCreateUser.validate(userBody);
    return error;
}

export const validateUpdateUser = (userBody) =>{ 
    const { error } = schemaUpdateUser.validate(userBody);
    return error;
}

export const validateUpdatePassword = (userBody) =>{   
    const { error } = schemaUpdatePassword.validate(userBody);
    return error;
}


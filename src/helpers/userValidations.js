import Joi from '@hapi/joi';

const schemaCreateUser = Joi.object({
    username: Joi.string().min(6).max(25).required(),
    email: Joi.string().min(6).max(25).required().email(),
    password: Joi.string().min(6).max(30).required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[.!@#$%^&*])(?=.{8,})/)
    .message("formato incorrecto")
})

const schemaUpdateUser = Joi.object({
    username: Joi.string().min(6).max(25).required(),
    email: Joi.string().min(6).max(25).required().email(),
})

const schemaUpdatePassword = Joi.object({ 
    password: Joi.string().min(6).max(30).required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[.!@#$%^&*-_])(?=.{8,})/)
})

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


import Joi from "@hapi/joi";

const schemaValidateUsername = Joi.object({
  username: Joi.string()
    .min(6)
    .max(15)
    .required()
    .pattern(/^[A-Za-z0-9]+$/)
    .messages({'string.min': "El nombre de usuario ingresado es demasiado corto",
               'string.max': "El nombre de usuario ingresado es demasiado largo",
               'string.pattern.base':"El nombre de usuario ingresado es invalido",
               'string.empty': "Debes ingresar un nombre de usuario"
}),
});

const schemaValidateEmail = Joi.object({
  email: Joi.string()
    .min(1)
    .max(30)
    .required()
    .email()
    .message({'string.email': "El email ingresado es invalido.",
    'string.max': "El email ingresado es demasiado largo",
    'string.empty': "Debes ingresar un email"
}),
});

const schemaValidatePassword = Joi.object({
  password: Joi.string()
    .min(8)
    .max(30)
    .required()
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    .messages({
      "string.required": "La contraseña ingresada es invalida.",
      "string.min": "La contraseña debe ser de al menos 8 digitos",
      "string.max": "La contraseña debe ser de maximo 30 digitos",
      "string.pattern.base": "La contraseña ingresada es invalida",
      'string.empty': "Debes ingresar una contraseña"
    }),
});

export const validateUsername = (username) => {
  const { error } = schemaValidateUsername.validate(username);
  return error;
};

export const validateEmail = (email) => {
  const { error } = schemaValidateEmail.validate(email);
  return error;
};

export const validatePassword = (password) => {
  const { error } = schemaValidatePassword.validate(password);
  return error;
};


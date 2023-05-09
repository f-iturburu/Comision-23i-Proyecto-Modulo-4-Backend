import User from "../database/models/user.Model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";
import { LOGIN_ADMIN_TOKEN } from "../config.js";
import { LOGIN_USER_TOKEN } from "../config.js";
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "../helpers/userValidations.js";

export const getAllUsers = async (req, res) => {
  let { userRole } = req.userToken;

  try {
    const users = await User.find();

    if (userRole !== 0) {
      return res.status(401).json({ message: "permission denied" });
    }

    res.json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  const { username, password, email } = req.body;

  let errorUsername = validateUsername({ username: username });
  let errorEmail = validateEmail({ email: email });
  let errorPassword = validatePassword({ password: password });

  if (errorUsername || errorPassword || errorEmail) {
    return res
      .status(401)
      .json({ message: errorUsername ?? errorEmail ?? errorPassword });
  }
  try {
    const emailFound = await User.findOne({ email: email });
    if (emailFound) {
      return res
        .status(400)
        .json({ message: "El email ingresado ya esta registrado." });
    }
    const usernameFound = await User.findOne({ username: username });
    if (usernameFound) {
      return res.status(400).json({
        message: "El nombre de usuario ingresado ya esta registrado.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      username: username,
      password: passwordHashed,
      email: email,
      role: 1,
    });

    let roleToken;

    if (newUser.role == 0) {
      roleToken = LOGIN_ADMIN_TOKEN;
    } else {
      roleToken = LOGIN_USER_TOKEN;
    }
    const token = jwt.sign(
      {
        userId: newUser._id,
        userRole: newUser.role,
        userEmail: newUser.email,
      },
      TOKEN_SECRET
    );

    res.status(201).json({ token: token, role: roleToken, username: newUser.username});
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMyUser = async (req, res) => {
  let { userId } = req.userToken;
  try {
    let user = await User.findById(userId);
    res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  let { user, password } = req.body;
  let userLogin = await User.findOne({
    $or: [{ username: user }, { email: user }],
  });

  if (!userLogin) {
    return res
      .status(418)
      .json({ message: "Nombre de usuario o email incorrectos" });
  }

  const validPassword = await bcrypt.compare(password, userLogin.password);

  if (!validPassword) {
    return res.status(400).json({ message: "Contraseña inválida" });
  }

  let roleToken;

  if (userLogin.role == 0) {
    roleToken = LOGIN_ADMIN_TOKEN;
  } else {
    roleToken = LOGIN_USER_TOKEN;
  }
  const token = jwt.sign(
    {
      userId: userLogin._id,
      userRole: userLogin.role,
      userEmail: userLogin.email,
    },
    TOKEN_SECRET
  );

  res.json({ token: token, role: roleToken,username: userLogin.username });
};

export const updateUsername = async (req, res) => {
  let { currentUsername, username, password } = req.body;
  let { userId } = req.userToken;
  
  let error = validateUsername({
    username: username,
  });

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    let userUsername = await User.findById(userId);

    if (currentUsername.toLowerCase() !== userUsername.username) {
      return res.status(401).json({
        error: "El nombre de usuario actual no coincide con el ingresado",
      });
    } else if (userUsername.username == username) {
      return res
        .status(401)
        .json({ error: "Has ingresado tu mismo nombre de usuario" });
    }

    let usernameExists = await User.findOne({
      $and: [{ username: username }, { _id: { $ne: userId } }],
    });

    if (usernameExists) {
      return res
        .status(401)
        .json({ error: "El nombre de usuario ingresado ya esta registrado" });
    }

    let userUpdated = await User.findById(userId);
    const validPassword = await bcrypt.compare(password, userUpdated.password);

    if (!validPassword) {
      return res
        .status(401)
        .json({ error: "La contraseña ingresada es incorrecta" });
    }

    userUpdated.username = username;
    await userUpdated.save();
    res.json(userUpdated);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateUserPassword = async (req, res) => {
  let { oldPassword, newPassword } = req.body;
  let { userId } = req.userToken;

  try {
    let userUpdated = await User.findById(userId);
    const validPassword = await bcrypt.compare(
      oldPassword,
      userUpdated.password
    );

    if (!validPassword) {
      return res
        .status(401)
        .json({ error: "La contraseña actual ingresada es incorrecta." });
    }

    if (oldPassword == newPassword) {
      return res.status(401).json({
        error: "Su nueva contraseña coincide con la contraseña actual.",
      });
    }
    let error = validatePassword({
      password: newPassword,
    });

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(newPassword, salt);
    userUpdated.password = passwordHashed;
    await userUpdated.save();
    res.json({ _id: userUpdated._id });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

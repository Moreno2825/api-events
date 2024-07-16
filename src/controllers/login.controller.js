import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const SignUp = async (req, res) => {
  try {
    const { name, lastname, email, password } = req.body;

    // Verificar si el email ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ Error: "El correo electrónico ya existe" });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear el nuevo usuario con la contraseña encriptada
    const newUser = new User({
      name,
      lastname,
      email,
      password: hashedPassword,
    });
    
    const responseData = await newUser.save();
    res.status(201).send({ data: responseData });
  } catch (error) {
    console.error("Error interno del servidor", error);
    return res.status(500).json({ Error: error });
  }
};

export const SignIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "the field is empty" });

    const userFound = await User.findOne({ email: req.body.email });

    if (!userFound)
      return res
        .status(400)
        .json({ message: "email or password is incorrect" });

    const isPasswordValid = await bcrypt.compare(password, userFound.password);

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: "Correo electrónico o contraseña incorrectos" });
    }

    const token = jwt.sign(
      { id: userFound._id, name: userFound.name },
      "process.env.SECRET_KEY",
      {
        expiresIn: 3600, // 1 hora
      }
    );

    return res.status(200).json({
      _id: userFound._id,
      name: userFound.name,
      email: userFound.email,
      token,
    });
  } catch (error) {
    console.error("Error interno del servidor", error);
    return res.status(500).json({ Error: error });
  }
};

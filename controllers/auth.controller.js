const bcrypt = require('bcryptjs'); // Importa el módulo bcryptjs para encriptar contraseñas
const jwt = require('jsonwebtoken'); // Importa el módulo jsonwebtoken para manejar tokens JWT
const { User } = require('../models'); // Importa el modelo User desde la carpeta models
const secret = 'your_jwt_secret'; // Define la clave secreta para firmar el token

// Función para registrar un nuevo usuario
exports.signup = async (req, res) => {
    try {
        const hashedPassword = bcrypt.hashSync(req.body.password, 8); // Encripta la contraseña del usuario
        const user = await User.create({
            firstName: req.body.firstName, // Guarda el primer nombre del usuario
            lastName: req.body.lastName, // Guarda el apellido del usuario
            email: req.body.email, // Guarda el correo electrónico del usuario
            password: hashedPassword // Guarda la contraseña encriptada del usuario
        });
        res.status(201).send({ message: 'Usuario registrado exitosamente!' }); // Responde con un mensaje de éxito
    } catch (error) {
        res.status(500).send({ message: error.message }); // Responde con un mensaje de error en caso de fallo
    }
};

// Función para iniciar sesión de un usuario
exports.signin = async (req, res) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } }); // Busca al usuario por su correo electrónico
        if (!user) {
            return res.status(404).send({ message: 'Usuario no encontrado.' }); // Si no encuentra al usuario, responde con un error 404
        }
        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password); // Compara la contraseña ingresada con la almacenada
        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: 'Password Invalido!' // Si la contraseña no es válida, responde con un error 401
            });
        }
        const token = jwt.sign({ id: user.id }, secret, { expiresIn: 86400 }); // Genera un token JWT válido por 24 horas
        res.status(200).send({
            id: user.id,
            email: user.email,
            accessToken: token // Responde con el token de acceso y los datos del usuario
        });
    } catch (error) {
        res.status(500).send({ message: error.message }); // Responde con un mensaje de error en caso de fallo
    }
};

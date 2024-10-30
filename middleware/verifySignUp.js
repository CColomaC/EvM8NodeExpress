// Importa el modelo User desde la carpeta models
const { User } = require('../models');

// Función para verificar si el correo electrónico ya está en uso
const checkDuplicateEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } }); // Busca al usuario por su correo electrónico
    if (user) {
      return res.status(400).send({ message: 'Error! Email ya existe!' }); // Si el correo ya está en uso, responde con un error 400
    }
    next(); // Si el correo no está en uso, llama a la siguiente función middleware
  } catch (error) {
    res.status(500).send({ message: error.message }); // Responde con un mensaje de error en caso de fallo
  }
};

module.exports = checkDuplicateEmail; // Exporta la función checkDuplicateEmail

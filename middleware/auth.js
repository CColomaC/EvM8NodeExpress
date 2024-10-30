const jwt = require('jsonwebtoken'); // Importa el módulo jsonwebtoken
const secret = 'your_jwt_secret'; // Define la clave secreta para firmar el token

const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token']; // Obtiene el token del encabezado de la solicitud
    if (!token) {
        return res.status(403).send({ message: 'No se ha proveido token!' }); // Si no hay token, responde con un error 403
    }
    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'No autorizado!' }); // Si el token no es válido, responde con un error 401
        }
        req.userId = decoded.id; // Si el token es válido, guarda el id del usuario en la solicitud
        next(); // Llama a la siguiente función middleware
    });
};

module.exports = verifyToken; // Exporta la función verifyToken

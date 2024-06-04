const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
    try {
        const token =req.headers.authorization ? req.headers.authorization.replace('Bearer ', ''): null;
        if (!token) {
            return res.status(401).send({ error: 'No se proporcionó un token. Por favor, autentíquese.' });
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findOne({ _id: decoded.userId, isActive: true });
        
        if (!user){
            console.log("Usuario no encontrado o inactivo");
            throw new Error('Usuario no encontrado o inactivo.');
        }
        req.user = user;
        next();
        console.log("Token recibido:", req.headers.authorization);
    } catch (error) {
        console.error("Error de autenticación:", error);
        let errorMessage = "Por favor, autentíquese.";
        if (error instanceof jwt.JsonWebTokenError) {
            errorMessage = "Token inválido. Por favor, vuelva a iniciar sesión.";
        } else if (error instanceof jwt.TokenExpiredError) {
            errorMessage = "Token expirado. Por favor, vuelva a iniciar sesión.";
        }
        res.status(401).send({ error: errorMessage });
        
    }
};
const adminAuth = (req, res, next) =>{
    console.log("Verificación de rol admin para:", req.user.username);
    if(req.user.role !== 'admin'){
        return res.status(403).send('Acceso restringido solo para administradores.');
    }
    next();
};

module.exports = {auth, adminAuth};
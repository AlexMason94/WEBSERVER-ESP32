const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcryptjs')
//const { auth, adminAuth } = require('../middleware/auth');
//const rateLimit = require('express-rate-limit');//Limitaciones de tasas de solicitudes
// Validaciones
const usernameRegex = /^[a-zA-Z0-9]+$/; // Asegura que solo caracteres alfanuméricos sean permitidos
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // Requiere mayúsculas, minúsculas, números y caracteres especiales
const {auth, adminAuth} = require('../middleware/auth');



// Registro de usuarios
router.post('/register', async (req, res) => {
    try {
        const { username, password, role} = req.body;
          // Asigna el rol de admin por defecto
         // Validar username y password
         if (!usernameRegex.test(username)) {
            return res.status(400).send('El nombre de usuario debe contener sólo caracteres alfanuméricos.');
        }
        if (!passwordRegex.test(password)) {
            return res.status(400).send('La contraseña debe tener al menos 8 caracteres e incluir como mínimo una letra mayúscula, una letra minúscula, un número y un carácter especial.');
        }

        const user = new User({ username, password, role });
        await user.save();
        res.status(201).json('Usuario registrado');
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            res.status(400).send('El usuario ya existe');
        } else {
            res.status(400).send(error.message);
        }
    }
});


//listar usuario por id
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }
        res.json(user);
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        res.status(500).send('Error del servidor');
    }
});

//Listar listas de usuarios
router.get('/', async (req, res) => {
    try {
        // Usamos select para especificar que no queremos devolver la contraseña
        const users = await User.find({}, 'username role isActivate createdAt loggedOutAt' ).exec();
        console.log("Usuarios enviados:", users);
        res.json(users);
    } catch (error) {
        console.error("Error al recuperar los usuarios", error);
        res.status(500).json({ message: "Error al recuperar los usuarios", error: error });
    }
});


/*const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 10, // Límite cada IP a 100 solicitudes por `window` por defecto
    message: 'Demasiados intentos de login desde esta IP, por favor intente de nuevo después de 15 minutos'
});*/


//Inicio de Sesion de usuarios
router.post('/login', /*loginLimiter,*/ async  (req, res) => {
    try{
        const { username, password, role } = req.body;
        console.log(req.body);  // Esto te ayudará a ver qué estás recibiendo exactamente en el servidor

        //Buscar el usuario en la base de datos
        const user = await User.findOne({ username });
        if(!user){
            return res.status(401).send('Usuario no encontrado');
        }
        //Comparar el password ingresado con el password almancenado en la base de datos
        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(401).send('Password incorrecto');
        }

        //Generar un token JWT si las credenciales son correctas
        const token = jwt.sign(
            { userId: user._id, role: user.role}, 
            process.env.SECRET_KEY, //
            { expiresIn: '1h' }
        );

        //Enviar el token al cliente
        res.json({  token: token, role: user.role });
    
    }catch (error) {
        console.error('Login Error', error);
        res.status(500).send('Error del servidor'); 
    }
});

// eliminar usuarios de forma logica

router.put('/inhabilitar/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isActivate: false, loggedOutAt: new Date() }, { new:true });
        if(!user){
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario desactivado con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', details: error.toString() });
    }
});

//activar usuarios de forma logica
router.put('/reactivar/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isActivate: true, loggedOutAt: null }, { new: true });
        if(!user){
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        
        res.json({ message: 'Usuario reactivado con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error de servidor', details: error.toString() });
    }
});

router.post('/test', (req, res) => {
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    res.status(200).json({ message: "Datos recibidos", headers: req.headers, data: req.body });
});

//Actualizar usuario

router.put('/update/:id', async (req, res) =>{
    const { username, password, role } = req.body;

    try{

        // Encuentra el usuario por ID y actualiza
        const user = await User.findById(req.params.id);
        if(!user){
            return res.status(404).send('Usuario no encontrado');
        }

        // Actualizar el username si se proporciona
        if (username && /^[a-zA-Z0-9]+$/.test(username)) {
            user.username = username;
        } else if (username) { // Si el username es inválido
            return res.status(400).send('El nombre de usuario debe contener solo caracteres alfanuméricos.');
        }

        // Actualizar el password solo si se ha proporcionado uno nuevo
        if (password && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
            user.password = await bcrypt.hash(password, 8);
        } else if (password) { // Si el password es inválido
            return res.status(400).send('La contraseña debe tener al menos 8 caracteres e incluir como mínimo una letra mayúscula, una letra minúscula, un número y un carácter especial.');
        }

        // Actualizar el rol si se proporciona y es válido
        if (role && ['admin', 'operator'].includes(role)) {
            user.role = role;
        } else if (role) {
            return res.status(400).send('Rol proporcionado no es válido');
        }
         // Guarda el usuario actualizado
         await user.save();
         res.json({ message: "Usuario actualizado", user: user });
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
            res.status(500).send(error.message);
        }
    });

module.exports = router;
